import React, { useEffect, useState, useCallback } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

const API = "/api";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const Booking = () => {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageRating: 0,
    packageTotalRatings: 0,
    packageImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [bookingData, setBookingData] = useState({
    totalPrice: 0,
    packageDetails: null,
    buyer: null,
    persons: 1,
    date: null,
  });
  const [currentDate, setCurrentDate] = useState("");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://rgtours.onrender.com/api/package/get-package-data/${params?.packageId}`
      );
      const data = await res.json();
      if (data?.success) {
        setPackageData({
          packageName: data?.packageData?.packageName,
          packageDescription: data?.packageData?.packageDescription,
          packageDestination: data?.packageData?.packageDestination,
          packageDays: data?.packageData?.packageDays,
          packageNights: data?.packageData?.packageNights,
          packageAccommodation: data?.packageData?.packageAccommodation,
          packageTransportation: data?.packageData?.packageTransportation,
          packageMeals: data?.packageData?.packageMeals,
          packageActivities: data?.packageData?.packageActivities,
          packagePrice: data?.packageData?.packagePrice,
          packageDiscountPrice: data?.packageData?.packageDiscountPrice,
          packageOffer: data?.packageData?.packageOffer,
          packageRating: data?.packageData?.packageRating,
          packageTotalRatings: data?.packageData?.packageTotalRatings,
          packageImages: data?.packageData?.packageImages,
        });
        setLoading(false);
      } else {
        setError(data?.message || "Something went wrong!");
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookPackage = useCallback(async () => {
    if (
      !bookingData.packageDetails ||
      !bookingData.buyer ||
      bookingData.totalPrice <= 0 ||
      bookingData.persons <= 0 ||
      !bookingData.date
    ) {
      alert("All fields are required!");
      return;
    }

    const scriptOk = await loadRazorpayScript();
    if (!scriptOk || !window.Razorpay) {
      alert("Could not load payment gateway. Check your connection and try again.");
      return;
    }

    try {
      setLoading(true);
      const orderRes = await fetch(`https://rgtours.onrender.com/api/booking/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          packageId: params?.packageId,
          persons: bookingData.persons,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData?.success || !orderData.orderId || !orderData.keyId) {
        setLoading(false);
        alert(orderData?.message || "Could not start payment.");
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Travel & Tourism",
        description: packageData.packageName || "Package booking",
        order_id: orderData.orderId,
        prefill: {
          name: currentUser?.username || "",
          email: currentUser?.email || "",
          contact: currentUser?.phone || "",
        },
        theme: { color: "#0ea5e9" },
        handler: async function (response) {
          try {
            const res = await fetch(
              `https://rgtours.onrender.com/api/booking/book-package/${params?.packageId}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  packageDetails: bookingData.packageDetails,
                  buyer: bookingData.buyer,
                  persons: bookingData.persons,
                  date: bookingData.date,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );
            const data = await res.json();
            if (data?.success) {
              alert(data?.message);
              navigate(
                `/profile/${currentUser?.user_role === 1 ? "admin" : "user"}`
              );
            } else {
              alert(data?.message || "Booking failed.");
            }
          } catch (e) {
            console.log(e);
            alert("Booking failed after payment. Contact support with your payment ID.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setLoading(false);
        alert("Payment failed. You can try again.");
      });
      rzp.open();
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Something went wrong. Try again.");
    }
  }, [
    bookingData,
    params?.packageId,
    packageData.packageName,
    currentUser,
    navigate,
  ]);

  useEffect(() => {
    if (params?.packageId) {
      getPackageData();
    }
    const date = new Date().toISOString().substring(0, 10);
    const d = date.substring(0, 8) + (parseInt(date.substring(8), 10) + 1);
    setCurrentDate(d);
  }, [params?.packageId]);

  useEffect(() => {
    if (packageData && params?.packageId) {
      setBookingData((prev) => ({
        ...prev,
        packageDetails: params?.packageId,
        buyer: currentUser?._id,
        totalPrice: packageData?.packageOffer && packageData?.packageDiscountPrice
          ? packageData.packageDiscountPrice * prev.persons
          : packageData.packagePrice * prev.persons,
      }));
    }
  }, [packageData, params?.packageId, currentUser?._id]);

  const unitPrice =
    packageData.packageOffer && packageData.packageDiscountPrice != null
      ? Number(packageData.packageDiscountPrice)
      : Number(packageData.packagePrice);

  const fieldRead =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600";
  const label =
    "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500";

  return (
    <div className="min-h-screen bg-mesh-light px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-card-lg">
          <div className="bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-800 px-6 py-10 text-center md:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
              Checkout
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">
              Book your package
            </h1>
            <p className="mt-2 text-sm text-white/85">
              Pay securely with Razorpay (INR)
            </p>
          </div>

          <div className="p-6 md:p-10">
            {error && (
              <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {error}
              </p>
            )}
            <div className="grid gap-10 md:grid-cols-2 md:gap-12">
              <div className="space-y-6">
                <h2 className="font-display border-b border-slate-100 pb-3 text-xl font-bold text-travel-ink">
                  Your information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className={label}>
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className={fieldRead}
                      value={currentUser.username}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={label}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={fieldRead}
                      value={currentUser.email}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className={label}>
                      Address
                    </label>
                    <textarea
                      maxLength={200}
                      id="address"
                      rows="3"
                      className={`${fieldRead} resize-none`}
                      value={currentUser.address}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={label}>
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      className={fieldRead}
                      value={currentUser.phone}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-display border-b border-slate-100 pb-3 text-xl font-bold text-travel-ink">
                  Trip summary
                </h2>
                <div className="mb-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="mb-4 flex gap-4">
                    <img
                      className="h-24 w-24 rounded-lg object-cover"
                      src={packageData.packageImages?.[0]}
                      alt="Package"
                    />
                    <div className="flex-1">
                      <p className="mb-1 text-lg font-bold capitalize text-travel-dark">
                        {packageData.packageName}
                      </p>
                      <p className="mb-2 flex items-center gap-2 font-semibold capitalize text-travel-secondary">
                        <FaMapMarkerAlt /> {packageData.packageDestination}
                      </p>
                      {(+packageData.packageDays > 0 ||
                        +packageData.packageNights > 0) && (
                        <p className="flex items-center gap-2 text-sm text-gray-600">
                          <FaClock />
                          {+packageData.packageDays > 0 &&
                            (+packageData.packageDays > 1
                              ? packageData.packageDays + " Days"
                              : packageData.packageDays + " Day")}
                          {+packageData.packageDays > 0 &&
                            +packageData.packageNights > 0 &&
                            " - "}
                          {+packageData.packageNights > 0 &&
                            (+packageData.packageNights > 1
                              ? packageData.packageNights + " Nights"
                              : packageData.packageNights + " Night")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={label}>Travel date</label>
                    <input
                      type="date"
                      min={currentDate || ""}
                      id="date"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-travel-primary/50 focus:ring-4 focus:ring-sky-500/15"
                      onChange={(e) => {
                        setBookingData({
                          ...bookingData,
                          date: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className={label}>Travelers</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="h-11 w-11 rounded-xl border-2 border-slate-200 text-lg font-bold text-travel-ink transition hover:border-travel-primary hover:bg-travel-primary hover:text-white disabled:opacity-50"
                        onClick={() => {
                          if (bookingData.persons > 1) {
                            const next = bookingData.persons - 1;
                            setBookingData({
                              ...bookingData,
                              persons: next,
                              totalPrice: unitPrice * next,
                            });
                          }
                        }}
                        disabled={bookingData.persons <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-2xl font-bold">
                        {bookingData.persons}
                      </span>
                      <button
                        type="button"
                        className="h-11 w-11 rounded-xl border-2 border-slate-200 text-lg font-bold text-travel-ink transition hover:border-travel-primary hover:bg-travel-primary hover:text-white disabled:opacity-50"
                        onClick={() => {
                          if (bookingData.persons < 10) {
                            const next = bookingData.persons + 1;
                            setBookingData({
                              ...bookingData,
                              persons: next,
                              totalPrice: unitPrice * next,
                            });
                          }
                        }}
                        disabled={bookingData.persons >= 10}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-gray-600">Price per person:</span>
                      {packageData.packageOffer ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 line-through">
                            ₹
                            {Number(packageData.packagePrice).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                          <span className="font-bold text-travel-success">
                            ₹
                            {Number(
                              packageData.packageDiscountPrice
                            ).toLocaleString("en-IN")}
                          </span>
                          <span className="rounded bg-travel-accent px-2 py-1 text-xs font-bold text-white">
                            {Math.floor(
                              ((+packageData.packagePrice -
                                +packageData.packageDiscountPrice) /
                                +packageData.packagePrice) *
                                100
                            )}
                            % OFF
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-travel-success">
                          ₹
                          {Number(packageData.packagePrice).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                      <span className="text-lg font-bold text-travel-dark">
                        Total (INR):
                      </span>
                      <span className="text-2xl font-bold text-travel-success">
                        ₹
                        {Number(bookingData.totalPrice).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <label className={`${label} mb-3`}>Payment</label>
                    <p className="mb-4 text-sm text-slate-600">
                      You will complete payment on Razorpay’s secure checkout
                      (cards, UPI, netbanking, wallets — per your Razorpay
                      dashboard).
                    </p>
                    <button
                      type="button"
                      className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 py-4 font-display text-lg font-bold text-white shadow-glow transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handleBookPackage}
                      disabled={loading || !currentUser?.address}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Pay with Razorpay"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
