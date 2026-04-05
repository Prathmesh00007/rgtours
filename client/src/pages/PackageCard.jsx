import { Rating } from "@mui/material";
import React from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const PackageCard = ({ packageData }) => {
  return (
    <Link to={`/package/${packageData._id}`} className="group block h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 shadow-card transition duration-300 hover:-translate-y-1 hover:border-travel-primary/25 hover:shadow-card-lg">
        <div className="relative h-52 overflow-hidden">
          <img
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            src={packageData.packageImages[0]}
            alt={packageData.packageName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-travel-ink/70 via-travel-ink/10 to-transparent opacity-80 transition group-hover:opacity-90" />
          {packageData.offer && packageData.packageDiscountPrice && (
            <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
              {Math.floor(
                ((+packageData.packagePrice - +packageData.packageDiscountPrice) /
                  +packageData.packagePrice) *
                  100
              )}
              % off
            </span>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <span className="line-clamp-2 font-display text-lg font-semibold text-white drop-shadow">
              {packageData.packageName}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-travel-secondary">
            <FaMapMarkerAlt className="shrink-0 text-travel-primary" />
            <span className="capitalize line-clamp-1">
              {packageData.packageDestination}
            </span>
          </div>

          {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-600">
              <FaClock className="shrink-0 text-slate-400" />
              <span>
                {+packageData.packageDays > 0 &&
                  (+packageData.packageDays > 1
                    ? packageData.packageDays + " days"
                    : packageData.packageDays + " day")}
                {+packageData.packageDays > 0 &&
                  +packageData.packageNights > 0 &&
                  " · "}
                {+packageData.packageNights > 0 &&
                  (+packageData.packageNights > 1
                    ? packageData.packageNights + " nights"
                    : packageData.packageNights + " night")}
              </span>
            </div>
          )}

          {packageData.packageTotalRatings > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <Rating
                value={packageData.packageRating}
                size="small"
                readOnly
                precision={0.1}
              />
              <span className="text-xs font-medium text-slate-500">
                ({packageData.packageTotalRatings})
              </span>
            </div>
          )}

          <div className="mt-auto border-t border-slate-100 pt-4">
            {packageData.offer && packageData.packageDiscountPrice ? (
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-emerald-600">
                  ${packageData.packageDiscountPrice}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  ${packageData.packagePrice}
                </span>
                <span className="ml-auto text-xs font-semibold uppercase tracking-wide text-travel-primary">
                  per person
                </span>
              </div>
            ) : (
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-2xl font-bold text-emerald-600">
                  ${packageData.packagePrice}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  per person
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PackageCard;
