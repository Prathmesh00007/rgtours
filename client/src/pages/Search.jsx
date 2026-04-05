import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PackageCard from "./PackageCard";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sideBarSearchData, setSideBarSearchData] = useState({
    searchTerm: "",
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (searchTermFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSideBarSearchData({
        searchTerm: searchTermFromUrl || "",
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchAllPackages = async () => {
      setLoading(true);
      setShowMoreBtn(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/package/get-packages?${searchQuery}`);
        const data = await res.json();
        setLoading(false);
        setAllPackages(data?.packages);
        if (data?.packages?.length > 8) {
          setShowMoreBtn(true);
        } else {
          setShowMoreBtn(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPackages();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBarSearchData({
        ...sideBarSearchData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "offer") {
      setSideBarSearchData({
        ...sideBarSearchData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarSearchData({ ...sideBarSearchData, sort, order });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarSearchData.searchTerm);
    urlParams.set("offer", sideBarSearchData.offer);
    urlParams.set("sort", sideBarSearchData.sort);
    urlParams.set("order", sideBarSearchData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreSClick = async () => {
    const numberOfPackages = allPackages.length;
    const startIndex = numberOfPackages;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/package/get-packages?${searchQuery}`);
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setAllPackages([...allPackages, ...data?.packages]);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-travel-ink shadow-sm outline-none transition focus:border-travel-primary/50 focus:ring-4 focus:ring-sky-500/15";

  return (
    <div className="min-h-screen bg-mesh-light">
      <div className="flex flex-col lg:flex-row lg:items-start">
        <aside className="border-b border-slate-200/80 bg-white/90 px-6 py-8 shadow-sm backdrop-blur-md lg:sticky lg:top-20 lg:min-h-screen lg:w-[340px] lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-travel-primary to-travel-secondary text-white shadow-glow">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-travel-ink">
                Refine results
              </h2>
              <p className="text-xs text-travel-muted">
                Tune search, offers, and sort order
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="searchTerm"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Search
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Destinations, keywords..."
                className={inputClass}
                value={sideBarSearchData.searchTerm}
                onChange={handleChange}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 transition hover:border-travel-primary/30">
              <input
                type="checkbox"
                id="offer"
                className="h-4 w-4 rounded border-slate-300 text-travel-primary focus:ring-travel-primary"
                checked={sideBarSearchData.offer}
                onChange={handleChange}
              />
              <span className="text-sm font-semibold text-travel-ink">
                Special offers only
              </span>
            </label>

            <div>
              <label
                htmlFor="sort_order"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Sort by
              </label>
              <select
                onChange={handleChange}
                defaultValue={"createdAt_desc"}
                id="sort_order"
                className={inputClass}
              >
                <option value="packagePrice_desc">Price: high to low</option>
                <option value="packagePrice_asc">Price: low to high</option>
                <option value="packageRating_desc">Top rated</option>
                <option value="packageTotalRatings_desc">Most reviewed</option>
                <option value="createdAt_desc">Latest first</option>
                <option value="createdAt_asc">Oldest first</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-travel-primary to-travel-secondary py-3.5 font-semibold text-white shadow-glow transition hover:brightness-105 active:scale-[0.99]"
            >
              Apply filters
            </button>
          </form>
        </aside>

        <main className="flex-1 px-6 py-10 lg:px-10 lg:py-12">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-travel-secondary">
                Packages
              </p>
              <h1 className="font-display text-3xl font-bold text-travel-ink md:text-4xl">
                Discover trips
              </h1>
            </div>
            <p className="text-sm text-travel-muted">
              {loading
                ? "Searching…"
                : `${allPackages.length} package${
                    allPackages.length === 1 ? "" : "s"
                  } found`}
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-24">
              <div className="h-14 w-14 animate-spin rounded-full border-2 border-travel-primary border-t-transparent" />
            </div>
          )}

          {!loading && allPackages.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 px-8 py-20 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-travel-ink">
                No packages match
              </h3>
              <p className="mt-2 text-travel-muted">
                Try broadening your search or toggling filters.
              </p>
            </div>
          )}

          {!loading && allPackages.length > 0 && (
            <>
              <div className="grid gap-6 2xl:grid-cols-4 xlplus:grid-cols-3 lg:grid-cols-2">
                {allPackages.map((packageData, i) => (
                  <PackageCard key={i} packageData={packageData} />
                ))}
              </div>

              {showMoreBtn && (
                <div className="mt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={onShowMoreSClick}
                    className="rounded-full border border-slate-200 bg-white px-10 py-3 font-semibold text-travel-ink shadow-sm transition hover:border-travel-primary/40 hover:text-travel-primary"
                  >
                    Load more packages
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
