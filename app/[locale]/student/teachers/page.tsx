"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";
import { useTeachersPage } from "@/hooks/use-teachers-page";
import { TeachersPageTeacherCard } from "@/components/teacher/listing/teachers-page-teacher-card";
import { TeachersPageSharedContent } from "@/components/teacher/listing/teachers-page-shared-content";
import { TeachersPageSkeleton } from "@/components/teacher/listing/teachers-page-skeleton";
import { TeachersPageCoursesSection } from "@/components/teacher/listing/teachers-page-courses-section";
import { TeachersPageReviewsSection } from "@/components/teacher/listing/teachers-page-reviews-section";
import { TeachersPageModals } from "@/components/teacher/listing/teachers-page-modals";

export default function TeachersPage() {
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const t = useTranslations();

  const [showCertificate, setShowCertificate] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const {
    teachers,
    courses,
    loading,
    coursesLoading,
    selectedTeacherId,
    currentPage,
    totalPages,
    switchingTeacher,
    selectedTeacher,
    setSelectedTeacherId,
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

  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full max-w-[1990px] mx-auto px-4 md:px-6 lg:px-16 pt-4 sm:pt-6 md:pt-8">
        <Breadcrumb
          items={[{ label: t("page.teachers.title") || "Danh sách GV" }]}
          locale={locale}
        />
      </div>

      {/* Header - Full width banner */}
      <section
        className="relative overflow-hidden bg-[#eceffd] py-5 sm:py-6 md:py-6 lg:py-5"
        style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
      >
        <div className="flex items-center md:justify-between w-full max-w-[1990px] mx-auto px-4 md:px-6 lg:px-16">
          <h1
            className="text-2xl sm:text-2xl md:text-[30px] font-medium text-[#3b3d48] text-left block"
            style={{
              fontFamily: "Roboto, sans-serif",
              lineHeight: "32px sm:leading-[32px] md:leading-[38px]",
            }}
          >
            {t("page.teachers.title")}
          </h1>
          <div className="hidden md:flex items-center justify-center w-[100px] h-[100px] lg:w-[110px] lg:h-[110px]">
            <img
              src="/logo/Logo.svg"
              alt="5200Edu Logo"
              width={110}
              height={110}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white px-4 md:px-6 lg:px-16 py-4 md:py-6 lg:py-8">
        <div className="flex flex-col md:grid md:grid-flow-col md:grid-cols-[343px_auto] md:gap-[24px] md:max-w-[1080px] md:mx-auto">
          {/* Left: Featured Teacher Card - Hidden on mobile */}
          <div className="hidden lg:hidden md:block w-[343px] flex-shrink-0">
            {loading || switchingTeacher ? (
              <TeachersPageSkeleton type="featured" />
            ) : (
              <TeachersPageTeacherCard
                teacher={selectedTeacher}
                locale={locale}
                viewProfileLabel={t("page.teachers.viewProfile")}
                noTeachersLabel={t("page.teachers.noTeachersFound")}
              />
            )}
          </div>

          {/* Right: Teacher Grid */}
          <div className="flex-1 flex flex-col md:grid md:grid-rows-[468px_32px] md:gap-[24px] md:justify-items-center">
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
      </div>

      {/* Courses Section */}
      <TeachersPageCoursesSection
        courses={courses}
        loading={coursesLoading}
        title={t("page.teachers.courses")}
        noCoursesLabel={t("page.courses.noCourses")}
      />

      {/* Student Reviews Section */}
      <TeachersPageReviewsSection
        reviews={[]}
        title={t("page.home.studentReviews")}
        onReviewClick={handleReviewClick}
        viewMoreLabel="Xem thêm"
      />

      {/* Modals */}
      <TeachersPageModals
        showCertificate={showCertificate}
        showFeedback={showFeedback}
        selectedReview={selectedReview}
        reviews={[]}
        onCertificateClose={() => setShowCertificate(false)}
        onFeedbackClose={handleFeedbackClose}
      />
    </>
  );
}
