import React, { useCallback, useEffect, useState } from "react";
import "./styles/Home.css";
import { FaCalendar, FaSearch, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const [topPackages, setTopPackages] = useState([]);
  const [latestPackages, setLatestPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getTopPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://rgtours.onrender.com/api/package/get-packages?sort=packageRating&limit=8"
      );
      const data = await res.json();
      if (data?.success) {
        setTopPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [topPackages]);

  const getLatestPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://rgtours.onrender.com/api/package/get-packages?sort=createdAt&limit=8"
      );
      const data = await res.json();
      if (data?.success) {
        setLatestPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [latestPackages]);

  const getOfferPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://rgtours.onrender.com/api/package/get-packages?sort=createdAt&offer=true&limit=6"
      );
      const data = await res.json();
      if (data?.success) {
        setOfferPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [offerPackages]);

  useEffect(() => {
    getTopPackages();
    getLatestPackages();
    getOfferPackages();
  }, []);

  const SectionTitle = ({ icon: Icon, title, gradient }) => (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
      <div className="flex items-center gap-4">
        <span
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-glow`}
        >
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-travel-secondary">
            Curated for you
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-travel-ink tracking-tight">
            {title}
          </h2>
        </div>
      </div>
      <div className="hidden sm:block h-px flex-1 max-w-md bg-gradient-to-r from-travel-primary/40 to-transparent ml-8" />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-mesh-light">
      <div className="relative w-full min-h-[520px] md:min-h-[600px] overflow-hidden">
        <div className="backaground_image absolute inset-0 scale-105" />
        <div className="absolute inset-0 bg-hero-shine" />
        <div className="absolute inset-0 bg-gradient-to-t from-travel-surface via-transparent to-transparent" />

        <div className="relative z-10 flex min-h-[520px] md:min-h-[600px] flex-col items-center justify-center px-4 py-16 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-md">
            Explore · Book · Go
          </p>
          <h1 className="font-display max-w-4xl text-4xl font-extrabold leading-tight text-white drop-shadow-sm md:text-6xl md:leading-[1.05]">
            Discover your next
            <span className="block bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">
              unforgettable journey
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
            Hand-picked destinations, transparent pricing, and journeys designed
            to feel effortless from search to checkout.
          </p>

          <div className="mt-10 w-full max-w-2xl flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="relative flex-1">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full rounded-2xl border border-white/20 bg-white/95 py-4 pl-12 pr-4 text-travel-ink shadow-card placeholder:text-slate-400 outline-none ring-0 transition focus:border-travel-primary/60 focus:ring-4 focus:ring-sky-500/20"
                placeholder="Search destinations, packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/search?searchTerm=${search}`);
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => navigate(`/search?searchTerm=${search}`)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 font-semibold text-white shadow-glow transition hover:brightness-105 active:scale-[0.98]"
            >
              <FaSearch className="h-4 w-4" />
              Search
            </button>
          </div>

          <div className="mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
            {[
              {
                label: "Best offers",
                short: "Offers",
                icon: LuBadgePercent,
                onClick: () => navigate("/search?offer=true"),
              },
              {
                label: "Top rated",
                short: "Top",
                icon: FaStar,
                onClick: () => navigate("/search?sort=packageRating"),
              },
              {
                label: "Latest",
                short: "New",
                icon: FaCalendar,
                onClick: () => navigate("/search?sort=createdAt"),
              },
              {
                label: "Most reviewed",
                short: "Popular",
                icon: FaRankingStar,
                onClick: () => navigate("/search?sort=packageTotalRatings"),
              },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.onClick}
                className="group flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-travel-ink"
              >
                <chip.icon className="text-lg text-amber-300 transition group-hover:text-travel-primary" />
                <span className="hidden sm:inline">{chip.label}</span>
                <span className="sm:hidden">{chip.short}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20">
        {loading && (
          <div className="flex justify-center py-24">
            <div className="h-14 w-14 animate-spin rounded-full border-2 border-travel-primary border-t-transparent" />
          </div>
        )}

        {!loading &&
          topPackages.length === 0 &&
          latestPackages.length === 0 &&
          offerPackages.length === 0 && (
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 px-8 py-16 text-center shadow-card">
              <h2 className="font-display text-2xl font-bold text-travel-ink">
                No packages yet
              </h2>
              <p className="mt-2 text-travel-muted">
                New adventures are on the way. Check back soon.
              </p>
            </div>
          )}

        {!loading && topPackages.length > 0 && (
          <section className="mb-20 md:mb-28">
            <SectionTitle
              icon={FaStar}
              title="Top rated packages"
              gradient="from-amber-400 to-orange-500"
            />
            <div className="grid gap-6 2xl:grid-cols-5 xlplus:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
              {topPackages.map((packageData, i) => (
                <PackageCard key={i} packageData={packageData} />
              ))}
            </div>
          </section>
        )}

        {!loading && latestPackages.length > 0 && (
          <section className="mb-20 md:mb-28">
            <SectionTitle
              icon={FaCalendar}
              title="Fresh arrivals"
              gradient="from-sky-500 to-cyan-500"
            />
            <div className="grid gap-6 2xl:grid-cols-5 xlplus:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
              {latestPackages.map((packageData, i) => (
                <PackageCard key={i} packageData={packageData} />
              ))}
            </div>
          </section>
        )}

        {!loading && offerPackages.length > 0 && (
          <section className="mb-8">
            <div className="relative mb-12 overflow-hidden rounded-3xl shadow-card-lg">
              <div className="offers_img min-h-[220px]" />
              <div className="absolute inset-0 bg-gradient-to-r from-sky-600/90 via-cyan-600/75 to-amber-500/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/90">
                  Limited time
                </p>
                <h2 className="font-display mt-2 text-4xl font-bold text-white md:text-5xl">
                  Special offers
                </h2>
                <p className="mt-2 max-w-lg text-sm text-white/90">
                  Save more on select itineraries — curated by our team for peak
                  value.
                </p>
              </div>
            </div>
            <div className="grid gap-6 2xl:grid-cols-5 xlplus:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
              {offerPackages.map((packageData, i) => (
                <PackageCard key={i} packageData={packageData} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
