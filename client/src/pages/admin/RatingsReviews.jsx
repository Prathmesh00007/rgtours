import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RatingsReviews = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    setPackages([]);
    try {
      setLoading(true);
      let url =
        filter === "most" //most rated
          ? `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings`
          : `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&sort=packageRating`; //all
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
      if (data?.packages?.length > 8) {
        setShowMoreBtn(true);
      } else {
        setShowMoreBtn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPackages();
  }, [filter, search]);

  const onShowMoreSClick = async () => {
    const numberOfPackages = packages.length;
    const startIndex = numberOfPackages;
    let url =
      filter === "most" //most rated
        ? `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings&startIndex=${startIndex}`
        : `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`; //all
    const res = await fetch(url);
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setPackages([...packages, ...data?.packages]);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-travel-secondary">
          Reputation
        </p>
        <h2 className="font-display text-2xl font-bold text-travel-ink md:text-3xl">
          Ratings & reviews
        </h2>
        <p className="mt-1 text-sm text-travel-muted">
          Browse packages by rating performance
        </p>
      </div>

      <div className="mb-8">
        <div className="relative mb-4">
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm outline-none transition focus:border-travel-primary/50 focus:ring-4 focus:ring-sky-500/15"
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "most"].map((filterType) => (
            <button
              key={filterType}
              type="button"
              onClick={() => setFilter(filterType)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                filter === filterType
                  ? "bg-travel-ink text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filterType === "all" ? "Top rated" : "Most rated"}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-travel-primary"></div>
        </div>
      )}

      {!loading && packages && packages.length === 0 && (
        <div className="text-center py-20">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Ratings Available</h3>
          <p className="text-gray-600">No packages have ratings yet</p>
        </div>
      )}

      {!loading && packages && packages.length > 0 && (
        <>
          <div className="space-y-4 mb-6">
            {packages.map((pack, i) => (
              <Link
                key={i}
                to={`/package/ratings/${pack._id}`}
                className="block rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm transition hover:border-travel-primary/25 hover:shadow-card"
              >
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <img
                    src={pack?.packageImages[0]}
                    alt="Package"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-travel-dark hover:text-travel-primary transition-colors mb-2">
                      {pack?.packageName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Rating
                        value={pack?.packageRating || 0}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <span className="text-sm text-gray-600">
                        ({pack?.packageTotalRatings || 0} {pack?.packageTotalRatings === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                  </div>

                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {showMoreBtn && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onShowMoreSClick}
                className="rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-travel-ink shadow-sm transition hover:border-travel-primary/40"
              >
                Show more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RatingsReviews;
