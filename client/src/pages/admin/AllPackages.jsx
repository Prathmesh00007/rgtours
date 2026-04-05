import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllPackages = () => {
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
        filter === "offer" //offer
          ? `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&offer=true`
          : filter === "latest" //latest
          ? `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&sort=createdAt`
          : filter === "top" //top rated
          ? `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&sort=packageRating`
          : `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}`; //all
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

  const onShowMoreSClick = async () => {
    const numberOfPackages = packages.length;
    const startIndex = numberOfPackages;
    let url =
      filter === "offer" //offer
        ? `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&offer=true&startIndex=${startIndex}`
        : filter === "latest" //latest
        ? `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&sort=createdAt&startIndex=${startIndex}`
        : filter === "top" //top rated
        ? `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`
        : `https://rgtours.onrender.com/api/package/get-packages?searchTerm=${search}&startIndex=${startIndex}`; //all
    const res = await fetch(url);
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setPackages([...packages, ...data?.packages]);
  };

  useEffect(() => {
    getPackages();
  }, [filter, search]);

  const handleDelete = async (packageId) => {
    try {
      setLoading(true);
      const res = await fetch(`https://rgtours.onrender.com/api/package/delete-package/${packageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data?.message);
      getPackages();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-travel-secondary">
          Catalog
        </p>
        <h2 className="font-display text-2xl font-bold text-travel-ink md:text-3xl">
          All packages
        </h2>
        <p className="mt-1 text-sm text-travel-muted">
          Search, filter, and manage live listings
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
          {["all", "offer", "latest", "top"].map((filterType) => (
            <button
              key={filterType}
              type="button"
              onClick={() => setFilter(filterType)}
              className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                filter === filterType
                  ? "bg-travel-ink text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filterType === "all" ? "All packages" : filterType}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-travel-primary border-t-transparent" />
        </div>
      )}

      {!loading && packages && packages.length === 0 && (
        <div className="text-center py-20">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Packages Found</h3>
          <p className="text-gray-600">No packages match your search criteria</p>
        </div>
      )}

      {!loading && packages && packages.length > 0 && (
        <>
          <div className="space-y-4 mb-6">
            {packages.map((pack, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm transition hover:border-travel-primary/25 hover:shadow-card"
              >
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <Link to={`/package/${pack._id}`} className="flex-shrink-0">
                    <img
                      src={pack?.packageImages[0]}
                      alt="Package"
                      className="w-24 h-24 rounded-lg object-cover hover:scale-105 transition-transform"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link to={`/package/${pack._id}`}>
                      <h3 className="text-xl font-bold text-travel-dark hover:text-travel-primary transition-colors mb-2">
                        {pack?.packageName}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-2">
                      {pack?.packageDestination}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold text-travel-success">
                        ₹
                        {Number(pack?.packagePrice).toLocaleString("en-IN")}
                      </span>
                      {pack?.packageOffer && (
                        <span className="px-2 py-1 bg-travel-accent text-white rounded text-xs font-bold">
                          Special Offer
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link to={`/profile/admin/update-package/${pack._id}`}>
                      <button
                        type="button"
                        disabled={loading}
                        className="rounded-xl bg-travel-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                      >
                        Edit
                      </button>
                    </Link>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this package?")) {
                          handleDelete(pack?._id);
                        }
                      }}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showMoreBtn && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onShowMoreSClick}
                className="rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-travel-ink shadow-sm transition hover:border-travel-primary/40"
              >
                Show more packages
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllPackages;
