"use client";

import { useState } from 'react';
import { FeedbackModal } from '@/components/modals/feedback-modal';
import { RatingReviews, type Review } from '@/components/shared/rating-reviews';

interface TeacherReviewsSectionProps {
  reviews: Review[];
}

export function TeacherReviewsSection({ reviews }: TeacherReviewsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 4.7;

  return (
    <section className="bg-white px-4 sm:px-6 md:px-8 lg:px-16 py-4 sm:py-6 md:py-8 overflow-x-hidden">
      <div className="max-w-[1520px] mx-auto">
        <h2
          className="text-xl sm:text-2xl lg:text-2xl font-medium text-[#3b3d48] mb-4 sm:mb-5 text-center lg:text-center leading-tight sm:leading-8 lg:leading-8"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          Đánh giá của học viên
        </h2>

        {/* Desktop: Original Grid Design */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-5">
          {reviews.slice(0, 4).map((review) => (
            <div
              key={review.id}
              onClick={() => setIsModalOpen(true)}
              className="bg-white rounded-xl p-3 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow relative flex flex-col gap-[10px] items-start cursor-pointer"
            >
              {/* Quote Icon */}
              <div className="absolute right-4 top-[38px] w-[61px] h-[61px] opacity-10">
                <svg viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="10" y="45" fontSize="48" fill="#4162e7">"</text>
                </svg>
              </div>

              {/* Course Name */}
              {review.courseName && (
                <p
                  className="text-xs font-normal text-[#4162e7] leading-4 mb-2"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  📚 {review.courseName}
                </p>
              )}

              {/* Star Rating */}
              <div className="flex gap-1 items-center mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'fill-[#FF9500] text-[#FF9500]'
                        : 'fill-none text-[#8c92ac]'
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <div className="flex flex-col gap-1 items-start">
                <p
                  className="text-sm font-normal text-[#3b3d48] leading-5 line-clamp-3 overflow-ellipsis overflow-hidden h-[60px]"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {review.comment}
                </p>
                <p
                  className="text-sm font-normal text-[#4162e7] leading-5 cursor-pointer hover:underline"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Xem thêm
                </p>
              </div>

              {/* Student Info */}
              <div className="border-t border-[#f4f4f7] pt-3 flex gap-[5px] items-center w-full">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={review.studentAvatar || review.avatar || '/images/figma/Frame 2147227180.png'}
                    alt={review.studentName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="flex-1 text-sm font-normal text-[#3b3d48] leading-5"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {review.studentName}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: View All Button */}
        {reviews.length > 4 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden lg:block text-sm sm:text-base font-medium text-[#4162e7] hover:text-[#3652d3] transition-colors text-center mt-4 sm:mt-5"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Xem tất cả đánh giá ({reviews.length})
          </button>
        )}

        {/* Mobile/Tablet: New RatingReviews Design */}
        <div className="lg:hidden">
          <RatingReviews
            reviews={reviews}
            averageRating={averageRating}
          />
        </div>
      </div>

      {/* Feedback Modal with new RatingReviews component */}
      <FeedbackModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reviews={reviews}
        averageRating={averageRating}
      />
    </section>
  );
}
