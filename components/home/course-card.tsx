"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Course } from "@/types/course";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/utils/formatPrice";
import { calculateTotalDiscount } from "@/utils/calculateTotalDiscount";
import { StarRating } from "@/components/courses/star-rating";

interface CourseCardProps {
  course: Course;
  cardIndex?: number;
  showOverlay?: boolean;
}

export function CourseCard({
  course,
  cardIndex = 0,
  showOverlay = true,
}: CourseCardProps) {
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const t = useTranslations("course");

  const freeText = t("free");

  const totalDiscount = calculateTotalDiscount(course.coupons);




  return (
    <Link href={`/${locale}/courses/${course.slug}`}>
      <div className="bg-white rounded-[16px] overflow-hidden shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">

        <div className="relative aspect-[271/162] w-full overflow-hidden rounded-[16px]">
          <img
            src={`${process.env.NEXT_PUBLIC_MINIO}/${course.thumbnailUrl}`}
            alt={`${course.title} course thumbnail`}
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />


          {totalDiscount > 0 && (
            <div className="absolute bg-[#4162e7] left-[12px] px-[12px] py-[2px] rounded-full top-[12px] z-10">
              <p
                className="text-white font-normal text-sm"
                style={{ fontFamily: "Roboto, sans-serif", lineHeight: "20px" }}
              >
                {totalDiscount}%
              </p>
            </div>
          )}
        </div>


        <div className="px-[12px] pt-[12px] pb-[16px] flex-1 flex flex-col gap-[4px] rounded-b-[16px]">

          <div className="flex flex-col gap-[4px] min-h-[84px]">
            <h3
              className="text-lg font-medium text-[#3b3d48] min-h-[56px] flex items-start overflow-hidden line-clamp-2"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "28px",
              }}
            >
              {course.title}
            </h3>


            <p
              className="text-base font-normal text-[#63687a] h-[24px] flex items-center overflow-hidden line-clamp-1"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "16px",
                lineHeight: "24px",
              }}
            >
              {course.ownerTeacher.fullName}
            </p>
          </div>

          <div className="flex items-center gap-[8px] p-[4px]">
            <span
              className="text-base font-normal text-[#3b3d48]"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "16px",
                lineHeight: "24px",
              }}
            >
              {course.averageRating}
            </span>
            <StarRating rating={course.averageRating} size="md" />
            <span
              className="text-xs font-normal text-[#8c92ac]"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "12px",
                lineHeight: "16px",
              }}
            >
              ({course.reviewCount})
            </span>
          </div>


          <div className="flex items-center gap-[10px]">
            <span
              className="text-base font-bold text-[#4162e7]"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "24px",
              }}
            >
              {formatPrice(course.price * Number(1 - (totalDiscount / 100)), 'vi-VN', freeText)}
            </span>
            {totalDiscount > 0 && (
              <span
                className="text-sm font-medium text-[#8c92ac] line-through"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                {formatPrice(course.price, 'vi-VN')}
              </span>
            )}
          </div>


          <div className="flex justify-start mt-2">
            <button
              className="bg-[#4162e7] hover:bg-[#3556d4] text-white px-4 py-2 rounded-[4px] font-medium transition-colors"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
              }}
              onClick={(e) => {
                e.preventDefault();
                if (!course.slug) return;

                if (!isAuthenticated) {
                  toast.warning(t("loginToPurchase"));
                  router.push(`/${locale}/login`);
                  return;
                }

                if (!user || user.role !== "STUDENT") {
                  toast.warning(t("studentOnly"));
                  return;
                }

                router.push(`/${locale}/student/courses/${course.slug}/payment`);
              }}
            >
              {t("buyNow")}
            </button>
          </div>
          {course.tags && course.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {course.tags.slice(0, 3).map((tag: any, idx: any) => (
                <div
                  key={idx}
                  className="bg-[#8C92AC] px-[8px] py-[2px] rounded-full"
                >
                  <p
                    className="text-white text-[12px] leading-4 font-normal"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {tag}
                  </p>
                </div>
              ))}
            </div>
          )}


          {/* <div className="flex gap-[4px] flex-wrap mt-2">
            {course.level && (
              <span
                className="px-[8px] py-[2px] bg-[#8c92ac] text-white rounded-full text-xs"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                }}
              >
                {course.level}
              </span>
            )}
            {course.language && (
              <span
                className="px-[8px] py-[2px] bg-[#8c92ac] text-white rounded-full text-xs"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                }}
              >
                {course.language}
              </span>
            )}
          </div> */}
        </div>
      </div>
    </Link>
  );
}