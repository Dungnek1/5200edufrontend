"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FeedbackModal } from '@/components/modals/feedback-modal';
import { Review } from '@/types/course';
import { StarRating } from '@/components/courses/star-rating';
import { getAvatarUrl } from '@/utils/media';



interface CourseDetailReviewsProps {
  reviews: Review[];
  courseName?: string;
}

export function CourseDetailReviews({ reviews, courseName }: CourseDetailReviewsProps) {
  const t = useTranslations('course');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 4.7;

  const transformedReviews = reviews.map((review) => ({
    ...review,
    courseName: courseName || t('defaultCourseName'),
    studentName: review.student?.fullName || t('defaultStudentName'),
    studentAvatar: review.student?.avatarUrl || "",
  }));

  return (
    <>

      <div className="flex flex-col gap-[20px]">
        <p
          className="text-[#3B3D48] text-[24px]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t('studentReviews')}
        </p>

        {transformedReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {transformedReviews.map((review) => (
              <div
                key={review.id}
                onClick={() => {
                  setSelectedReview(review.id);
                  setIsModalOpen(true);
                }}
                className="relative flex-1 bg-white p-3 rounded-xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[10px] cursor-pointer hover:shadow-lg transition-shadow"
              >

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


                <p
                  className="text-xs font-normal text-[#4162e7] leading-[16px] whitespace-pre-wrap"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {review.courseName}
                </p>

                <StarRating rating={review.rating} size="sm" />


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
                      setSelectedReview(review.id);
                      setIsModalOpen(true);
                    }}
                  >
                    {t('readMore')}
                  </button>
                </div>


                <div className="border-t border-[#f4f4f7] pt-3 flex gap-[5px] items-center">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <img
                      src={getAvatarUrl(review.studentAvatar)}
                      alt={review.studentName}
                      className="w-8 h-8 object-cover rounded-full"
                      loading="lazy"
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
        ) : (
          <div className="flex items-center justify-center py-8 sm:py-12 bg-[#f9f9fb] rounded-xl">
            <p className="text-sm sm:text-base text-[#8c92ac]">
              {t('noReviews')}
            </p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReview(null);
        }}
        reviews={transformedReviews}
        averageRating={averageRating}
      />
    </>
  );
}
