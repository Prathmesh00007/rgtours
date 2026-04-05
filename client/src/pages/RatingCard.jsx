import { Rating } from "@mui/material";
import React, { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import defaultProfileImg from "../assets/images/profile.png";

const RatingCard = ({ packageRatings }) => {
  const [expandedCard, setExpandedCard] = useState(null);

  if (!packageRatings || !Array.isArray(packageRatings)) {
    return null;
  }

  return (
    <>
      {packageRatings.map((rating, i) => {
        const isExpanded = expandedCard === i;
        const reviewLong = rating.review && rating.review.length > 90;
        const displayReview =
          reviewLong && !isExpanded
            ? rating.review.substring(0, 90) + "..."
            : rating.review || (rating.rating < 3 ? "Not bad" : "Good");

        return (
          <div
            key={i}
            className="group relative flex w-full flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-card transition hover:border-travel-primary/20 hover:shadow-card-lg"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-travel-primary via-travel-secondary to-amber-400 opacity-0 transition group-hover:opacity-100" />
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={rating.userProfileImg || defaultProfileImg}
                  alt={rating.username?.[0] || "U"}
                  className="h-12 w-12 rounded-2xl border-2 border-white object-cover shadow-md ring-2 ring-sky-100"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-travel-ink">
                  {rating.username}
                </p>
                <Rating
                  value={rating.rating || 0}
                  readOnly
                  size="small"
                  precision={0.1}
                />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 break-words">
              {displayReview}
              {reviewLong && (
                <button
                  type="button"
                  onClick={() => setExpandedCard(isExpanded ? null : i)}
                  className="ml-2 inline-flex items-center gap-1 font-semibold text-travel-primary hover:text-travel-secondary"
                >
                  {isExpanded ? (
                    <>
                      Less <FaArrowUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      More <FaArrowDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </p>
          </div>
        );
      })}
    </>
  );
};

export default RatingCard;
