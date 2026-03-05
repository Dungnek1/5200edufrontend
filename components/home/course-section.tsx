"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CourseCard } from "@/components/home/course-card";
import { publicCourseService, categoryService } from "@/services/apis";
import type { Course, Review } from "@/types/course";
import type { Category } from "@/services/apis/category.service";
import { useTranslations } from "next-intl";
import { CourseDetailReviews } from "../courses/course-detail-reviews";


export function CourseSection() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoryService.getCategories();

      if (
        response.success &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setCategories(response.data);
        setActiveCategory(response.data[0].slug);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);


  const fetchCourses = useCallback(async (categorySlug?: string) => {
    try {
      setLoading(true);

      const response = await publicCourseService.getCourses({
        page: 1,
        categorySlug: categorySlug || undefined,
      });

      const allCourses = Array.isArray(response?.data) ? response.data : [];

      if (allCourses.length > 0) {
        setCourses(allCourses.slice(0, 8));
      } else {
        setCourses([]);
      }
    } catch (error) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  useEffect(() => {
    if (!courses[0]?.slug) return;
    const handleLoadReview = async () => {
      const reviewsResponse = await publicCourseService.getReviews(courses[0].slug, 1, 4);
      if (reviewsResponse) {
        setReviews(reviewsResponse.data.data);
      }
    };
    handleLoadReview();
  }, [courses]);


  useEffect(() => {
    if (activeCategory) {
      fetchCourses(activeCategory);
    } else if (!categoriesLoading) {

      fetchCourses();
    }
  }, [activeCategory, categoriesLoading, fetchCourses]);

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug);
  };

  return (
    <section className="bg-[#FAFAFA]">


      <div className="bg-[#FAFAFA] mb-4 sm:mb-5 md:mb-[20px]">
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 md:mb-[20px]">
          <h2
            className="text-xl sm:text-2xl md:text-[24px] font-semibold text-[#3b3d48] text-left"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 600,
              lineHeight: "32px",
            }}
          >
            {t("page.courses.title")}
          </h2>

        </div>


        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-[20px]">
          {categoriesLoading ? (

            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 sm:h-9 sm:w-28 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`px-[12px] py-[10px] border border-[#F4F4F7] font-medium transition-all rounded-[8px] cursor-pointer ${
                  activeCategory === category.slug
                    ? "bg-[#ECEFFD] text-[#04055B]"
                    : "bg-[#FAFAFA] text-[#3B3D48] hover:bg-[#f1f1f5]"
                }`}
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                }}
              >
                {category.name}
              </button>
            ))
          ) : (
            <p className="text-[#8c92ac] text-sm py-[10px]">
              {t("common.noData")}
            </p>
          )}
        </div>
      </div>


      {loading ? (
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-[20px]">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#FAFAFA] rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              <div className="aspect-[271/162] bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="bg-[#FAFAFA] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-[20px]">
          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              cardIndex={index}
              showOverlay={false}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 bg-[#f9f9fb] rounded-xl">
          <p
            className="text-base text-[#8c92ac]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {t("page.courses.noCourses")}
          </p>
        </div>
      )}


      {courses.length > 0 && reviews.length > 0 &&

        <div className='pt-[64px]'>

          <CourseDetailReviews
            reviews={reviews}
            courseName={courses[0]?.title}
          />
        </div>
      }

    </section>
  );
}
