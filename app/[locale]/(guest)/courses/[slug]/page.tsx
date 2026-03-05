
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseDetailBanner } from "@/components/courses/course-detail-banner";
import { CourseDetailDescription } from "@/components/courses/course-detail-description";
import { CourseDetailModules } from "@/components/courses/course-detail-modules";
import { CourseDetailReviews } from "@/components/courses/course-detail-reviews";
import publicCourseService from "@/services/apis/public-course.service";
import studentCourseService from "@/services/apis/student-course.service";
import type { Course, Review } from "@/types/course";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks";
import { LoadingOverlay } from "@/components/shared/loading-overlay";
import { CourseCard } from "@/components/home/course-card";
export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.slug as string;
  const t = useTranslations();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<{
    progress: number;
    completedLessons: number;
    totalLessons: number;
    lastAccessed: string;
  } | null>(null);



  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await publicCourseService.getCourseBySlug(courseSlug);
        if (response.success && response.data) {
          setCourse(response.data);


          const reviewsResponse = await publicCourseService.getReviews(courseSlug, 1, 4);
          if (reviewsResponse) {
            setReviews(reviewsResponse.data.data);
          }


          const relatedResponse = await publicCourseService.getCourses({
            categoryIds: response.data.categoryIds,
            limit: 4
          });

          if (relatedResponse.success && relatedResponse.data) {
            setRelatedCourses(relatedResponse.data);
          }

        } else {
          setCourse(null);
          toast.error(t("errors.courseNotFound"));
        }
      } catch (err) {
        setCourse(null);
        toast.error(t("errors.somethingWentWrong"));
      } finally {
        setLoading(false);
      }
    };

    if (courseSlug) {
      fetchCourse();
    }
  }, [courseSlug, t]);



  if (!course && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{t("errors.notFound")}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700"
          >
            {t("common.back")}
          </button>
        </div>
      </div>
    );
  }


  const handlePurchaseOrAccess = () => {
    if (!isAuthenticated) {
      toast.warning(t("course.loginToPurchase"));
      router.push(`/${params.locale}/login`);
      return;
    }

    if (!user || user.role !== "STUDENT") {
      toast.warning(t("course.studentOnly"));
      return;
    }

    if (!course) {
      toast.error(t("errors.loadCourseFailed"));
      return;
    }

    if (isEnrolled) {
      router.push(`/${params.locale}/student/courses/${course.slug}/modules/first`);
    } else {
      router.push(`/${params.locale}/student/courses/${course.slug}/payment`);
    }
  };

  const handleTrial = () => {
    if (!course) return;
    router.push(`/${params.locale}/courses/${course.slug}/trial`);
  };

  return (
    <LoadingOverlay loading={loading} fullScreen>
      {course ? (
        <>

          <CourseDetailBanner
            course={course}
            isEnrolled={isEnrolled}
            enrollmentData={enrollmentData}
            onPurchase={handlePurchaseOrAccess}
            onTrial={handleTrial}
          />

          <div id="course-content" className='bg-[#FAFAFA] w-full'>
            <div className="w-full py-6 px-4 sm:py-8 sm:px-8 md:py-10 md:px-12 lg:py-[32px] lg:px-[64px] max-w-full lg:max-w-[70%]">

              <div className="flex-1 min-w-0 order-2 lg:order-1 space-y-6 sm:space-y-8 md:space-y-10">

                <CourseDetailDescription
                  description={course.description || ""}
                  title={course.title || ""}
                  learningPoints={course.learningOutcomes || []}
                  requirements={[]}
                />

                <CourseDetailModules
                  modules={course.sections || []}
                  courseId={course.id}
                />
              </div>

            </div>
          </div>
          <div className="w-full bg-[#FAFAFA] py-6 px-4 sm:py-8 sm:px-8 md:py-10 md:px-12 lg:py-[32px] lg:px-[64px] flex flex-col gap-4 sm:gap-5 md:gap-[20px]">


            <CourseDetailReviews
              reviews={reviews}
              courseName={course?.title}
            />


            <div className="flex flex-col gap-4 sm:gap-5 md:gap-[20px] py-4 sm:py-5 md:py-[20px]">
              <p className="text-[#3B3D48] text-lg sm:text-xl md:text-[24px] font-semibold">{t("course.relatedCourses")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-[20px]">

                {relatedCourses.map((course, index) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    cardIndex={index}
                    showOverlay={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </LoadingOverlay>
  );
}