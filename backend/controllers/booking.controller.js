import crypto from "crypto";
import Booking from "../models/booking.model.js";
import Package from "../models/package.model.js";
import { ObjectId } from "mongodb";
import Razorpay from "razorpay";

function computeBookingTotalInr(validPackage, persons) {
  const p = Number(persons);
  const useDiscount =
    validPackage.packageOffer &&
    validPackage.packageDiscountPrice != null &&
    Number(validPackage.packageDiscountPrice) >= 0;
  const unit = useDiscount
    ? Number(validPackage.packageDiscountPrice)
    : Number(validPackage.packagePrice);
  return unit * p;
}

// Create Razorpay order (amount in INR, stored as paise by Razorpay)
export const createRazorpayOrder = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Please login to book a package!",
      });
    }

    const { packageId, persons } = req.body;
    const p = Number(persons);

    if (!packageId || !Number.isFinite(p) || p < 1 || p > 10) {
      return res.status(400).send({
        success: false,
        message: "Invalid package or traveler count.",
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).send({
        success: false,
        message: "Payment is not configured on the server.",
      });
    }

    const validPackage = await Package.findById(packageId);
    if (!validPackage) {
      return res.status(404).send({
        success: false,
        message: "Package Not Found!",
      });
    }

    const totalRupee = computeBookingTotalInr(validPackage, p);
    if (!Number.isFinite(totalRupee) || totalRupee <= 0) {
      return res.status(400).send({
        success: false,
        message: "Invalid package price.",
      });
    }

    const amountPaise = Math.round(totalRupee * 100);
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `bk_${Date.now()}`,
      notes: {
        packageId: String(packageId),
        buyerId: String(req.user.id),
        persons: String(p),
      },
    });

    return res.status(200).send({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Could not start payment. Try again later.",
    });
  }
};

//book package (after Razorpay payment verified)
export const bookPackage = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Please login to book a package!",
      });
    }

    const {
      packageDetails,
      buyer,
      persons,
      date,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (String(req.user.id) !== String(buyer)) {
      return res.status(401).send({
        success: false,
        message: "You can only buy on your account!",
      });
    }

    if (
      !packageDetails ||
      !buyer ||
      !persons ||
      !date ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required!",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).send({
        success: false,
        message: "Payment is not configured on the server.",
      });
    }

    const validPackage = await Package.findById(packageDetails);
    if (!validPackage) {
      return res.status(404).send({
        success: false,
        message: "Package Not Found!",
      });
    }

    const totalPrice = computeBookingTotalInr(validPackage, persons);
    const expectedPaise = Math.round(totalPrice * 100);

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return res.status(400).send({
        success: false,
        message: "Payment verification failed.",
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.fetch(razorpay_order_id);
    if (Number(order.amount) !== expectedPaise) {
      return res.status(400).send({
        success: false,
        message: "Payment amount mismatch.",
      });
    }

    const newBooking = await Booking.create({
      packageDetails,
      buyer,
      totalPrice,
      persons,
      date,
      status: "Booked",
    });

    if (newBooking) {
      return res.status(201).send({
        success: true,
        message: "Package Booked!",
      });
    }

    return res.status(500).send({
      success: false,
      message: "Something went wrong!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong!",
    });
  }
};

//get current bookings for admin
export const getCurrentBookings = async (req, res) => {
  try {
    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({
      date: { $gt: new Date().toISOString() },
      status: "Booked",
    })
      .populate("packageDetails")
      // .populate("buyer", "username email")
      .populate({
        path: "buyer",
        match: {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      })
      .sort({ createdAt: "asc" });
    let bookingsFilterd = [];
    bookings.map((booking) => {
      if (booking.buyer !== null) {
        bookingsFilterd.push(booking);
      }
    });
    if (bookingsFilterd.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFilterd,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//get all bookings admin
export const getAllBookings = async (req, res) => {
  try {
    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({})
      .populate("packageDetails")
      // .populate("buyer", "username email")
      .populate({
        path: "buyer",
        match: {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      })
      .sort({ createdAt: "asc" });
    let bookingsFilterd = [];
    bookings.map((booking) => {
      if (booking.buyer !== null) {
        bookingsFilterd.push(booking);
      }
    });
    if (bookingsFilterd.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFilterd,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//get current bookings for user by id
export const getUserCurrentBookings = async (req, res) => {
  try {
    if (req?.user?.id !== req?.params?.id) {
      return res.status(401).send({
        success: false,
        message: "You can only get your own bookings!!",
      });
    }
    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({
      buyer: new ObjectId(req?.params?.id),
      date: { $gt: new Date().toISOString() },
      status: "Booked",
    })
      // .populate("packageDetails")
      .populate({
        path: "packageDetails",
        match: {
          packageName: { $regex: searchTerm, $options: "i" },
        },
      })
      .populate("buyer", "username email")
      .sort({ createdAt: "asc" });
    let bookingsFilterd = [];
    bookings.map((booking) => {
      if (booking.packageDetails !== null) {
        bookingsFilterd.push(booking);
      }
    });
    if (bookingsFilterd.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFilterd,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//get all bookings by user id
export const getAllUserBookings = async (req, res) => {
  try {
    if (req?.user?.id !== req?.params?.id) {
      return res.status(401).send({
        success: false,
        message: "You can only get your own bookings!!",
      });
    }
    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({
      buyer: new ObjectId(req?.params?.id),
    })
      // .populate("packageDetails")
      .populate({
        path: "packageDetails",
        match: {
          packageName: { $regex: searchTerm, $options: "i" },
        },
      })
      .populate("buyer", "username email")
      .sort({ createdAt: "asc" });
    let bookingsFilterd = [];
    bookings.map((booking) => {
      if (booking.packageDetails !== null) {
        bookingsFilterd.push(booking);
      }
    });
    if (bookingsFilterd.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFilterd,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//delete booking history
export const deleteBookingHistory = async (req, res) => {
  try {
    if (req?.user?.id !== req?.params?.userId) {
      return res.status(401).send({
        success: false,
        message: "You can only delete your booking history!",
      });
    }
    const deleteHistory = await Booking.findByIdAndDelete(req?.params?.id);
    if (deleteHistory) {
      return res.status(200).send({
        success: true,
        message: "Booking History Deleted!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong while deleting booking history!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//cancel booking
export const cancelBooking = async (req, res) => {
  try {
    if (req.user.id !== req?.params?.userId) {
      return res.status(401).send({
        success: false,
        message: "You can only cancel your bookings!",
      });
    }
    const cancBooking = await Booking.findByIdAndUpdate(
      req?.params?.id,
      {
        status: "Cancelled",
      },
      { new: true }
    );
    if (cancBooking) {
      return res.status(200).send({
        success: true,
        message: "Booking Cancelled!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong while cancelling booking!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
