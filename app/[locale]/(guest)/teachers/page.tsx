"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";
import { useTeachersPage } from "@/hooks/use-teachers-page";
import { TeachersPageTeacherCard } from "@/components/teacher/listing/teachers-page-teacher-card";
import { TeachersPageSharedContent } from "@/components/teacher/listing/teachers-page-shared-content";
import { TeachersPageSkeleton } from "@/components/teacher/listing/teachers-page-skeleton";
import { TeachersPageCoursesSection } from "@/components/teacher/listing/teachers-page-courses-section";
import { TeachersPageReviewsSection } from "@/components/teacher/listing/teachers-page-reviews-section";
import { TeachersPageModals } from "@/components/teacher/listing/teachers-page-modals";
import { CourseDetailReviews } from "@/components/courses/course-detail-reviews";
import { Review } from "@/types/course";
import { publicCourseService } from "@/services/apis";


export default function TeachersPage() {
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const t = useTranslations();
  const router = useRouter();


  const [showCertificate, setShowCertificate] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const {
    teachers,
    selectedTeacherId,
    setSelectedTeacherId,
    courses,
    loading,
    coursesLoading,
    currentPage,
    totalPages,
    switchingTeacher,
    selectedTeacher,
    setCurrentPage,
    setSwitchingTeacher,
  } = useTeachersPage();


  const handleTeacherSelect = (teacherId: string) => {
    if (teacherId !== selectedTeacherId) {
      setSwitchingTeacher(true);
      setSelectedTeacherId(teacherId);
    }
  };

  const handleReviewClick = (reviewId: string) => {
    setSelectedReview(reviewId);
    setShowFeedback(true);
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    setSelectedReview(null);
  };


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

  return (
    <div className="w-full sm:py-6 md:py-8 md:pb-16 lg:py-8 lg:pb-20 px-4 sm:px-6 lg:px-16 flex flex-col gap-[20px]">

      <Breadcrumb
        items={[{ label: t("page.teachers.title") || "Danh sách GV" }]}
        locale={locale}
      />


      <h1 className="text-[30px] font-bold text-[#3B3D48]">
        {t("page.teachers.title")}
      </h1>



      <div className="flex flex-col md:grid md:grid-flow-col md:grid-cols-[347px_auto] md:gap-[24px]">

        <div className="hidden md:block w-[347px] flex-shrink-0 h-full px-[20px] py-[12px]  border-r border-[#E1E1E1]  flex flex-col
          cusors-pointer
        "
          onClick={() => {
            router.push(`/teachers/${selectedTeacherId}`)
          }}
        >
          <TeachersPageTeacherCard
            teacher={selectedTeacher}
            locale={locale}
            viewProfileLabel={t("page.teachers.viewProfile")}
            noTeachersLabel={t("page.teachers.noTeachersFound")}
          />

        </div>


        <div className="flex-1 flex flex-col gap-6">
          <TeachersPageSharedContent
            teachers={teachers}
            loading={loading}
            selectedTeacherId={selectedTeacherId}
            currentPage={currentPage}
            totalPages={totalPages}
            noTeachersLabel={t("page.teachers.noTeachersFound")}
            onTeacherSelect={handleTeacherSelect}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>


      <TeachersPageCoursesSection
        courses={courses}
        loading={coursesLoading}
        title={t("page.teachers.courses")}
        noCoursesLabel={t("page.courses.noCourses")}
      />


      <TeachersPageReviewsSection
        reviews={[]}
        title={t("page.home.studentReviews")}
        onReviewClick={handleReviewClick}
        viewMoreLabel="Xem thêm"
      />


      <TeachersPageModals
        showCertificate={showCertificate}
        showFeedback={showFeedback}
        selectedReview={selectedReview}
        reviews={[]}
        onCertificateClose={() => setShowCertificate(false)}
        onFeedbackClose={handleFeedbackClose}
      />
      <CourseDetailReviews
        reviews={reviews}
        courseName={courses[0]?.title}
      />
    </div>
  );
}
