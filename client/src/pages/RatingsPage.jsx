import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RatingCard from "./RatingCard";

const RatingsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [packageRatings, setPackageRatings] = useState([]);
  const [showRatingStars, setShowRatingStars] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);

  const getRatings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://rgtours.onrender.com/api/rating/get-ratings/${params.id}/999999999999`
      );
      const res2 = await fetch(`https://rgtours.onrender.com/api/rating/average-rating/${params.id}`);
      const data = await res.json();
      const data2 = await res2.json();
      if (data && data2) {
        setPackageRatings(data);
        setShowRatingStars(data2.rating);
        setTotalRatings(data2.totalRatings);
        setLoading(false);
      } else {
        setPackageRatings("No ratings yet!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) getRatings();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-mesh-light">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <button
          type="button"
          onClick={() => navigate(`/package/${params?.id}`)}
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-4 py-2 text-sm font-semibold text-travel-ink shadow-sm transition hover:border-travel-primary/40 hover:text-travel-primary"
        >
          <svg
            className="h-4 w-4 transition group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to package
        </button>

        {loading && (
          <div className="flex justify-center py-24">
            <div className="h-14 w-14 animate-spin rounded-full border-2 border-travel-primary border-t-transparent" />
          </div>
        )}

        {!loading &&
          (!packageRatings ||
            (Array.isArray(packageRatings) && packageRatings.length === 0)) && (
            <div className="rounded-3xl border border-slate-200/80 bg-white/95 px-8 py-20 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-travel-ink">
                No ratings yet
              </h2>
              <p className="mt-2 text-travel-muted">
                Be the first to share your experience with this package.
              </p>
            </div>
          )}

        {!loading &&
          packageRatings &&
          Array.isArray(packageRatings) &&
          packageRatings.length > 0 && (
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-card-lg">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-8 md:px-10 md:py-10">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-travel-secondary">
                  Community voice
                </p>
                <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="font-display text-3xl font-bold text-travel-ink md:text-4xl">
                      All reviews
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <Rating
                        size="large"
                        value={showRatingStars || 0}
                        readOnly
                        precision={0.1}
                      />
                      <span className="font-display text-3xl font-bold text-travel-ink">
                        {showRatingStars?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-slate-500">
                        {totalRatings}{" "}
                        {totalRatings === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-10">
                <div className="grid gap-5 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2">
                  <RatingCard packageRatings={packageRatings} />
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default RatingsPage;
