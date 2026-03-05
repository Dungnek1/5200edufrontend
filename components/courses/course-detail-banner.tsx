"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CourseDetailSidebar } from "./course-detail-sidebar";
import { Course } from "@/types/course";

interface CourseDetailBannerProps {
  course: Course,
  isEnrolled?: boolean;
  enrollmentData?: {
    progress: number;
    completedLessons: number;
    totalLessons: number;
    lastAccessed: string;
  } | null;
  onPurchase?: () => void;
  onTrial?: () => void;
}

export function CourseDetailBanner({
  course,
  isEnrolled,
  enrollmentData,
  onPurchase,
  onTrial,
}: CourseDetailBannerProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const t = useTranslations("common");
  const tCourse = useTranslations("course");

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) {
        return (
          <Star
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF9500] text-[#FF9500]"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        return (
          <div key={i} className="relative w-4 h-4 sm:w-5 sm:h-5">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-none text-[#8c92ac]" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF9500] text-[#FF9500]" />
            </div>
          </div>
        );
      } else {
        return (
          <Star
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 fill-none text-[#8c92ac]"
          />
        );
      }
    });
  };

  const formatReviewsCount = (count: number) => {
    return count.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US');
  };

  return (
    <section className="w-full bg-[#eceffd] py-6 sm:py-6 md:py-8 lg:py-8 px-4 sm:px-6 lg:px-16 ">

      <button
        onClick={() => router.back()}
        className="md:hidden mb-2 flex items-center text-[#4162e7] hover:text-[#3652d3] transition-colors"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span
          className="text-sm font-medium"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("back")}
        </span>
      </button>


      <div className="flex flex-col lg:flex-row lg:items-flex-start gap-6 lg:gap-10 relative overflow-visible">

        <div className="flex flex-col  items-start flex-1 relative overflow-visible">

          <h1
            className="text-xl sm:text-2xl lg:text-[30px] font-medium text-[#3B3D48] leading-tight sm:leading-[38px] lg:leading-[38px]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {course.title}
          </h1>


          <p
            className="text-[16px] sm:text-base font-medium text-[#0A0BD9] leading-6"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {course.ownerTeacher.fullName}
          </p>


          <div className="flex gap-2 items-center p-1 lg:w-[235px]">
            <p
              className="text-sm sm:text-base font-normal text-[#3b3d48] leading-6"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {course.averageRating.toFixed(1)}
            </p>
            <div className="flex gap-0.5 sm:gap-1 items-center">
              {renderStars(course.averageRating)}
            </div>
            <p
              className="text-xs font-normal text-[#8c92ac] leading-4"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              ({tCourse("reviewsCount", { count: formatReviewsCount(course.reviewCount) })})
            </p>
          </div>
        </div>

        <div className="hidden lg:block lg:absolute lg:top-0 lg:right-0  z-20">
          <CourseDetailSidebar
            price={course.price || 0}
            originalPrice={
              course.originPrice && course.originPrice > 0
                ? course.originPrice
                : undefined
            }
            lessonsCount={course.sections?.reduce((acc, section) => acc + (section.documents?.length || 0), 0) || 0}
            duration={`${course.sections?.reduce((acc, section) => acc + (section.minFinsish || 0), 0) || 0} ${t('minute')}`}
            isEnrolled={isEnrolled}
            thumbnail={course.thumbnailUrl}
            coupons={course.coupons}
            onPurchase={onPurchase}
            onTrial={onTrial}
            enrollmentData={enrollmentData}
          />
        </div>
      </div>

      {/* Mobile Sidebar - shown below banner content on mobile and tablet */}
      <div className="lg:hidden mt-6 sm:mt-8">
        <CourseDetailSidebar
          price={course.price || 0}
          originalPrice={
            course.originPrice && course.originPrice > 0
              ? course.originPrice
              : undefined
          }
          lessonsCount={course.sections?.reduce((acc, section) => acc + (section.documents?.length || 0), 0) || 0}
          duration={`${course.sections?.reduce((acc, section) => acc + (section.minFinsish || 0), 0) || 0}m`}
          isEnrolled={isEnrolled}
          thumbnail={course.thumbnailUrl}
          coupons={course.coupons}
          onPurchase={onPurchase}
          onTrial={onTrial}
          enrollmentData={enrollmentData}
        />
      </div>
    </section>
  );
}