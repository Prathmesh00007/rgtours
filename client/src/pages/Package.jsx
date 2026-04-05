import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaClock,
  FaMapMarkerAlt,
  FaShare,
} from "react-icons/fa";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";

const inputFocus =
  "w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-travel-ink outline-none transition focus:border-travel-primary/50 focus:ring-4 focus:ring-sky-500/15";

const cardClass =
  "rounded-3xl border border-slate-200/80 bg-white/95 p-6 md:p-8 shadow-card";

const Package = () => {
  SwiperCore.use([Navigation]);
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
    packageTravelStartDate: "",
    packageTravelEndDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: params?.id,
    userRef: currentUser?._id,
    username: currentUser?.username,
    userProfileImg: currentUser?.avatar,
  });
  const [packageRatings, setPackageRatings] = useState([]);
  const [ratingGiven, setRatingGiven] = useState(false);

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://rgtours.onrender.com/api/package/get-package-data/${params?.id}`);
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
          packageTravelStartDate: data?.packageData?.packageTravelStartDate || "",
          packageTravelEndDate: data?.packageData?.packageTravelEndDate || "",
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

  const giveRating = async () => {
    checkRatingGiven();
    if (ratingGiven) {
      alert("You already submittd your rating!");
      return;
    }
    if (ratingsData.rating === 0 && ratingsData.review === "") {
      alert("Atleast 1 field is required!");
      return;
    }
    if (
      ratingsData.rating === 0 &&
      ratingsData.review === "" &&
      !ratingsData.userRef
    ) {
      alert("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("https://rgtours.onrender.com/api/rating/give-rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingsData),
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getPackageData();
        getRatings();
        checkRatingGiven();
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRatings = async () => {
    try {
      const res = await fetch(`https://rgtours.onrender.com/api/rating/get-ratings/${params.id}/4`);
      const data = await res.json();
      if (data) {
        setPackageRatings(data);
      } else {
        setPackageRatings("No ratings yet!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkRatingGiven = async () => {
    try {
      const res = await fetch(
        `https://rgtours.onrender.com/api/rating/rating-given/${currentUser?._id}/${params?.id}`
      );
      const data = await res.json();
      setRatingGiven(data?.given);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getPackageData();
      getRatings();
    }
    if (currentUser) {
      checkRatingGiven();
    }
  }, [params.id, currentUser]);

  const [showFullDesc, setShowFullDesc] = useState(false);

  return (
    <div className="min-h-screen bg-mesh-light">
      {loading && (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-2 border-travel-primary border-t-transparent" />
        </div>
      )}
      {error && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
          <div className="max-w-md rounded-3xl border border-red-100 bg-red-50/90 p-8 text-center shadow-card">
            <p className="font-display text-lg font-semibold text-red-800">
              Something went wrong
            </p>
            <p className="mt-2 text-sm text-red-700/80">{String(error)}</p>
            <Link
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-travel-ink py-3 font-semibold text-white"
              to="/"
            >
              Back to home
            </Link>
          </div>
        </div>
      )}
      {packageData && !loading && !error && (
        <div className="w-full">
          <div className="relative h-[420px] md:h-[520px]">
            <Swiper navigation className="h-full">
              {packageData?.packageImages.map((imageUrl, i) => (
                <SwiperSlide key={i}>
                  <div
                    className="h-full w-full"
                    style={{
                      background: `url(${imageUrl}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-travel-ink/80 via-travel-ink/20 to-transparent" />

            <button
              type="button"
              onClick={() => navigate("/")}
              className="absolute left-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/90 text-travel-ink shadow-lg backdrop-blur transition hover:bg-white"
              aria-label="Back"
            >
              <FaArrowLeft className="text-lg" />
            </button>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/90 text-travel-ink shadow-lg backdrop-blur transition hover:bg-white"
              aria-label="Share"
            >
              <FaShare className="text-lg" />
            </button>

            {copied && (
              <div className="absolute right-5 top-20 z-10 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                Link copied
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 pt-16 md:px-12">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                Destination
              </p>
              <h1 className="font-display mt-2 max-w-4xl text-3xl font-bold capitalize text-white drop-shadow md:text-5xl">
                {packageData?.packageName}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium text-white/95">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                  <FaMapMarkerAlt className="text-cyan-200" />
                  <span className="capitalize">
                    {packageData?.packageDestination}
                  </span>
                </span>
                {(+packageData?.packageDays > 0 ||
                  +packageData?.packageNights > 0) && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                    <FaClock />
                    <span>
                      {+packageData?.packageDays > 0 &&
                        (+packageData?.packageDays > 1
                          ? packageData?.packageDays + " days"
                          : packageData?.packageDays + " day")}
                      {+packageData?.packageDays > 0 &&
                        +packageData?.packageNights > 0 &&
                        " · "}
                      {+packageData?.packageNights > 0 &&
                        (+packageData?.packageNights > 1
                          ? packageData?.packageNights + " nights"
                          : packageData?.packageNights + " night")}
                    </span>
                  </span>
                )}
                {packageData?.packageTotalRatings > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                    <Rating
                      value={packageData?.packageRating || 0}
                      readOnly
                      precision={0.1}
                      size="small"
                      sx={{ color: "#fbbf24" }}
                    />
                    <span className="text-white/90">
                      ({packageData?.packageTotalRatings} reviews)
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
              <div className="space-y-6 lg:col-span-2">
                <section className={cardClass}>
                  <h2 className="font-display text-xl font-bold text-travel-ink md:text-2xl">
                    Overview
                  </h2>
                  <p className="mt-4 leading-relaxed text-slate-600">
                    {showFullDesc ||
                    packageData?.packageDescription.length <= 280
                      ? packageData?.packageDescription
                      : packageData?.packageDescription.substring(0, 280) +
                        "…"}
                  </p>
                  {packageData?.packageDescription.length > 280 && (
                    <button
                      type="button"
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="mt-4 inline-flex items-center gap-2 font-semibold text-travel-primary hover:text-travel-secondary"
                    >
                      {showFullDesc ? (
                        <>
                          Show less <FaArrowUp />
                        </>
                      ) : (
                        <>
                          Read more <FaArrowDown />
                        </>
                      )}
                    </button>
                  )}
                </section>

                <section className={cardClass}>
                  <h2 className="font-display text-xl font-bold text-travel-ink md:text-2xl">
                    What&apos;s included
                  </h2>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {[
                      ["Accommodation", packageData?.packageAccommodation],
                      ["Activities", packageData?.packageActivities],
                      ["Meals", packageData?.packageMeals],
                      ["Transportation", packageData?.packageTransportation],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                      >
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                          {label}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className={cardClass}>
                  <h2 className="font-display text-xl font-bold text-travel-ink md:text-2xl">
                    Reviews
                  </h2>

                  {!currentUser && (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
                      <p className="text-sm text-slate-600">
                        Sign in to leave a review for this trip.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-4 rounded-xl bg-travel-ink px-6 py-2.5 text-sm font-semibold text-white"
                      >
                        Log in to review
                      </button>
                    </div>
                  )}

                  {currentUser && !ratingGiven && (
                    <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/50 p-5 md:p-6">
                      <h3 className="font-semibold text-travel-ink">
                        Share your experience
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            Rating
                          </label>
                          <Rating
                            name="simple-controlled"
                            value={ratingsData?.rating}
                            onChange={(e, newValue) => {
                              setRatingsData({
                                ...ratingsData,
                                rating: newValue,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            Review
                          </label>
                          <textarea
                            className={inputFocus}
                            rows={4}
                            placeholder="Tell others what stood out…"
                            value={ratingsData?.review}
                            onChange={(e) => {
                              setRatingsData({
                                ...ratingsData,
                                review: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <button
                          disabled={
                            (ratingsData.rating === 0 &&
                              ratingsData.review === "") ||
                            loading
                          }
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            giveRating();
                          }}
                          className="w-full rounded-xl bg-gradient-to-r from-travel-primary to-travel-secondary py-3.5 font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loading ? "Submitting…" : "Submit review"}
                        </button>
                      </div>
                    </div>
                  )}

                  {packageRatings &&
                    Array.isArray(packageRatings) &&
                    packageRatings.length > 0 && (
                      <>
                        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <RatingCard packageRatings={packageRatings} />
                        </div>
                        {packageData.packageTotalRatings > 4 && (
                          <div className="mt-8 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/package/ratings/${params?.id}`)
                              }
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-travel-ink shadow-sm transition hover:border-travel-primary/40 hover:text-travel-primary"
                            >
                              View all reviews <FaArrowRight />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                </section>
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card-lg">
                  <div className="bg-gradient-to-br from-sky-500 to-cyan-600 px-6 py-8 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                      From
                    </p>
                    {packageData?.packageOffer ? (
                      <div className="mt-2 space-y-2">
                        <div className="flex flex-wrap items-baseline gap-3">
                          <span className="font-display text-4xl font-bold">
                            ₹
                            {Number(
                              packageData?.packageDiscountPrice
                            ).toLocaleString("en-IN")}
                          </span>
                          <span className="text-lg text-white/70 line-through">
                            ₹
                            {Number(packageData?.packagePrice).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                        <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                          {Math.floor(
                            ((+packageData?.packagePrice -
                              +packageData?.packageDiscountPrice) /
                              +packageData?.packagePrice) *
                              100
                          )}
                          % off
                        </span>
                      </div>
                    ) : (
                      <p className="font-display mt-2 text-4xl font-bold">
                        ₹
                        {Number(packageData?.packagePrice).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-white/85">per person</p>
                    {packageData.packageTravelStartDate &&
                      packageData.packageTravelEndDate && (
                        <p className="mt-4 border-t border-white/20 pt-4 text-sm text-white/90">
                          <span className="font-bold uppercase tracking-wider text-white/70">
                            Trip dates
                          </span>
                          <br />
                          {packageData.packageTravelStartDate} →{" "}
                          {packageData.packageTravelEndDate}
                        </p>
                      )}
                  </div>

                  <div className="space-y-5 p-6">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentUser) {
                          navigate(`/booking/${params?.id}`);
                        } else {
                          navigate("/login");
                        }
                      }}
                      className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-center font-display text-lg font-bold text-white shadow-glow transition hover:brightness-105"
                    >
                      Book now
                    </button>

                    <ul className="space-y-3 text-sm text-slate-600">
                      {[
                        "Best price on comparable itineraries",
                        "Instant booking confirmation",
                        "Support when you need it",
                      ].map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="mt-0.5 text-emerald-500">✓</span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Package;
