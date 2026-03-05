import { Star } from "lucide-react";
import { getAvatarUrl } from "@/utils/media";


interface Review {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  courseName: string;
}

interface TeachersPageReviewsSectionProps {
  reviews: Review[];
  title: string;
  onReviewClick: (reviewId: string) => void;
  viewMoreLabel: string;
}

export function TeachersPageReviewsSection({
  reviews,
  title,
  onReviewClick,
  viewMoreLabel,
}: TeachersPageReviewsSectionProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-12 sm:py-16 md:py-20 lg:py-20 xl:py-[40px] px-4 sm:px-6 lg:px-16">
      <div className="flex flex-col gap-4 sm:gap-5">
        <p
          className="text-xl sm:text-2xl font-medium text-[#3b3d48] leading-[28px] sm:leading-[32px] text-center"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {title}
        </p>

        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              onClick={() => onReviewClick(review.id)}
              className="relative flex-1 bg-white p-3 rounded-xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[10px] cursor-pointer hover:shadow-lg transition-shadow"
            >
              {/* Quote Icon */}
              <div className="absolute right-0 top-[38px] w-[61px] h-[61px] pointer-events-none">
                <img
                  src="/images/figma/Icon.svg"
                  alt=""
                  className="w-full h-full object-contain opacity-20"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(30%) sepia(95%) saturate(2000%) hue-rotate(220deg) brightness(0.9) contrast(1.2)",
                  }}
                />
              </div>

              {/* Course Name Badge */}
              <p
                className="text-xs font-normal text-[#4162e7] leading-[16px] whitespace-pre-wrap"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {review.courseName}
              </p>

              {/* Stars */}
              <div className="flex gap-[4px] items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < review.rating
                      ? "fill-[#FF9500] text-[#FF9500]"
                      : "fill-none text-[#8c92ac] stroke-[#8c92ac]"
                      }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <div className="flex flex-col gap-1 items-start">
                <p
                  className="text-sm font-normal text-[#3b3d48] leading-[20px] h-[60px] overflow-hidden"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {review.comment}
                </p>
                <button
                  className="text-sm font-normal text-[#4162e7] leading-[20px] text-left hover:underline shrink-0"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReviewClick(review.id);
                  }}
                >
                  {viewMoreLabel}
                </button>
              </div>

              {/* Student Info */}
              <div className="border-t border-[#f4f4f7] pt-3 flex gap-[5px] items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <img
                    src={getAvatarUrl(review.studentAvatar)}
                    alt={review.studentName}

                    className="object-cover"
                    sizes="32px"

                  />
                </div>
                <p
                  className="flex-1 text-sm font-normal text-[#3b3d48] leading-[20px]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {review.studentName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
