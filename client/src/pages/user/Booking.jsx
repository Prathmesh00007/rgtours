import React, { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";

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
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/package/get-package-data/${params?.packageId}`
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
    } catch (error) {
      console.log(error);
    }
  };

  //get paymentgateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(`/api/package/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [currentUser]);

  //handle payment & book package
  const handleBookPackage = async () => {
    if (
      bookingData.packageDetails === "" ||
      bookingData.buyer === "" ||
      bookingData.totalPrice <= 0 ||
      bookingData.persons <= 0 ||
      bookingData.date === ""
    ) {
      alert("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/book-package/${params?.packageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        navigate(`/profile/${currentUser?.user_role === 1 ? "admin" : "user"}`);
      } else {
        setLoading(false);
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.packageId) {
      getPackageData();
    }
    let date = new Date().toISOString().substring(0, 10);
    let d = date.substring(0, 8) + (parseInt(date.substring(8)) + 1);
    setCurrentDate(d);
  }, [params?.packageId]);

  useEffect(() => {
    if (packageData && params?.packageId) {
      setBookingData({
        ...bookingData,
        packageDetails: params?.packageId,
        buyer: currentUser?._id,
        totalPrice: packageData?.packageDiscountPrice
          ? packageData?.packageDiscountPrice * bookingData?.persons
          : packageData?.packagePrice * bookingData?.persons,
      });
    }
  }, [packageData, params]);

  const fieldRead =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600";
  const label = "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500";

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
              Confirm traveler details and secure your spot
            </p>
          </div>
          
          <div className="p-6 md:p-10">
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

              {/* Package Info Section */}
              <div className="space-y-6">
                <h2 className="font-display border-b border-slate-100 pb-3 text-xl font-bold text-travel-ink">
                  Trip summary
                </h2>
                <div className="mb-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex gap-4 mb-4">
                    <img
                      className="w-24 h-24 rounded-lg object-cover"
                      src={packageData.packageImages?.[0]}
                      alt="Package"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-lg capitalize text-travel-dark mb-1">
                        {packageData.packageName}
                      </p>
                      <p className="flex items-center gap-2 text-travel-secondary font-semibold capitalize mb-2">
                        <FaMapMarkerAlt /> {packageData.packageDestination}
                      </p>
                      {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
                        <p className="flex items-center gap-2 text-gray-600 text-sm">
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
                    <label className={label}>
                      Travel date
                    </label>
                    <input
                      type="date"
                      min={currentDate || ""}
                      id="date"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-travel-primary/50 focus:ring-4 focus:ring-sky-500/15"
                      onChange={(e) => {
                        setBookingData({ ...bookingData, date: e.target.value });
                      }}
                    />
                  </div>

                  <div>
                    <label className={label}>
                      Travelers
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="h-11 w-11 rounded-xl border-2 border-slate-200 text-lg font-bold text-travel-ink transition hover:border-travel-primary hover:bg-travel-primary hover:text-white disabled:opacity-50"
                        onClick={() => {
                          if (bookingData.persons > 1) {
                            setBookingData({
                              ...bookingData,
                              persons: bookingData.persons - 1,
                              totalPrice: packageData.packageDiscountPrice
                                ? packageData.packageDiscountPrice * (bookingData.persons - 1)
                                : packageData.packagePrice * (bookingData.persons - 1),
                            });
                          }
                        }}
                        disabled={bookingData.persons <= 1}
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold w-12 text-center">{bookingData.persons}</span>
                      <button
                        type="button"
                        className="h-11 w-11 rounded-xl border-2 border-slate-200 text-lg font-bold text-travel-ink transition hover:border-travel-primary hover:bg-travel-primary hover:text-white disabled:opacity-50"
                        onClick={() => {
                          if (bookingData.persons < 10) {
                            setBookingData({
                              ...bookingData,
                              persons: bookingData.persons + 1,
                              totalPrice: packageData.packageDiscountPrice
                                ? packageData.packageDiscountPrice * (bookingData.persons + 1)
                                : packageData.packagePrice * (bookingData.persons + 1),
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
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Price per person:</span>
                      {packageData.packageOffer ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through text-gray-500">
                            ${packageData.packagePrice}
                          </span>
                          <span className="font-bold text-travel-success">
                            ${packageData.packageDiscountPrice}
                          </span>
                          <span className="bg-travel-accent text-white px-2 py-1 rounded text-xs font-bold">
                            {Math.floor(
                              ((+packageData.packagePrice - +packageData.packageDiscountPrice) /
                                +packageData.packagePrice) *
                                100
                            )}
                            % OFF
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-travel-success">
                          ${packageData.packagePrice}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-lg font-bold text-travel-dark">Total Price:</span>
                      <span className="text-2xl font-bold text-travel-success">
                        $
                        {packageData.packageDiscountPrice
                          ? packageData.packageDiscountPrice * bookingData.persons
                          : packageData.packagePrice * bookingData.persons}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <label className={`${label} mb-3`}>
                      Payment
                    </label>
                    {!instance && (
                      <div className="text-center py-4 text-gray-600">
                        Loading payment gateway...
                      </div>
                    )}
                    {instance && (
                      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <p className="text-sm font-semibold text-amber-900">
                          Demo only — do not use real card details.
                        </p>
                      </div>
                    )}
                    {clientToken && (
                      <div className="space-y-4">
                        <DropIn
                          options={{
                            authorization: clientToken,
                            paypal: {
                              flow: "vault",
                            },
                          }}
                          onInstance={(instance) => setInstance(instance)}
                        />
                        <button
                          type="button"
                          className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 font-display text-lg font-bold text-white shadow-glow transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={handleBookPackage}
                          disabled={loading || !instance || !currentUser?.address}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            "Complete Booking"
                          )}
                        </button>
                      </div>
                    )}
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
