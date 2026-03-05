"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { getAvatarUrl } from "@/utils/media";

import { Review } from "@/types/course";



interface RatingReviewsProps {
  reviews: Review[];
  averageRating?: number;
  showCloseButton?: boolean;
  onClose?: () => void;
  className?: string;
}

export function RatingReviews({
  reviews,
  averageRating,
  showCloseButton = false,
  onClose,
  className = "",
}: RatingReviewsProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);


  const calculatedAverageRating =
    averageRating !== undefined
      ? averageRating
      : reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;


  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const starSize =
      size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) {
        return (
          <Star
            key={i}
            className={`${starSize} fill-[#FF9500] text-[#FF9500]`}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        return (
          <div key={i} className={`relative ${starSize}`}>
            <Star className={`${starSize} fill-none text-[#8c92ac]`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${starSize} fill-[#FF9500] text-[#FF9500]`} />
            </div>
          </div>
        );
      } else {
        return (
          <Star
            key={i}
            className={`${starSize} fill-none text-[#8c92ac]`}
          />
        );
      }
    });
  };


  const getRatingCount = (rating: number) => {
    return reviews.filter((review) => Math.floor(review.rating) === rating)
      .length;
  };


  const filteredReviews =
    selectedRating !== null
      ? reviews.filter((review) => Math.floor(review.rating) === selectedRating)
      : reviews;



  return (
    <div className={`flex flex-col gap-4 sm:gap-5 ${className}`}>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className="text-2xl sm:text-3xl font-bold text-[#3b3d48]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {calculatedAverageRating.toFixed(1)}
          </span>
          <div className="flex gap-0.5 items-center">
            {renderStars(calculatedAverageRating, "md")}
          </div>
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center hover:opacity-70 transition-opacity flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#3b3d48]" />
          </button>
        )}
      </div>


      <div className="flex flex-wrap gap-2 sm:gap-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = getRatingCount(rating);
          const isSelected = selectedRating === rating;

          return (
            <button
              key={rating}
              onClick={() =>
                setSelectedRating(selectedRating === rating ? null : rating)
              }
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg border transition-all ${isSelected
                ? "bg-white border-[#FF9500] text-[#FF9500]"
                : "bg-white border-[#dbdde5] text-[#3b3d48] hover:border-[#FF9500] hover:text-[#FF9500]"
                }`}
            >
              <span
                className="text-sm sm:text-base font-medium"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {rating}
              </span>
              <Star className="w-4 h-4 fill-[#FF9500] text-[#FF9500]" />
              {count > 0 && (
                <span
                  className="text-xs sm:text-sm text-[#8c92ac]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>


      <div className="flex flex-col gap-4 sm:gap-5">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review, index) => (
            <div
              key={review.id || index}
              className={`flex flex-col gap-2 sm:gap-3 ${index > 0 ? "border-t border-[#dbdde5] pt-4 sm:pt-5" : ""
                }`}
            >

              <div className="flex gap-3 items-start">

                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={getAvatarUrl(review.student.avatarUrl)}
                    alt={review.student?.fullName || "User"}

                    className="object-cover h-full w-full"


                  />
                </div>


                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <p
                    className="text-sm sm:text-base font-semibold text-[#3b3d48] leading-5 sm:leading-6"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 600 }}
                  >
                    {review.student?.fullName || "Anonymous"}
                  </p>
                  <div className="flex gap-0.5 items-center">
                    {renderStars(review.rating, "sm")}
                  </div>
                </div>
              </div>

              <p
                className="text-sm sm:text-base font-normal text-[#3b3d48] leading-5 sm:leading-6 whitespace-pre-wrap break-words"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <p
              className="text-sm sm:text-base font-normal text-[#8c92ac]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Không có đánh giá nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
