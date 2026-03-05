"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Star,
  BookOpen,
  Coins,
} from "lucide-react";
import teacherCourseService from "@/services/apis/teacher-course.service";
import type { Course } from "@/types/course";
import { EditCourseDialog } from "@/components/teacher/edit-course-dialog";

import { toast } from "sonner";
import { LoadingOverlay } from "@/components/shared/loading-overlay";
import CourseDetailCard from "@/components/teacher/courses/form-info-hero-course";
import { CourseDetailModules } from "@/components/courses/course-detail-modules";
import { StudentsTable } from "@/components/teacher/students/students-table";
import { useTeacherStudentsPage } from "@/hooks/use-teacher-students-page";
import CourseReviews from "@/components/teacher/courses/student-cmt-course";
import { EditCourseForm } from "@/components/teacher/edit-course-form";
import StudentEngagement from "@/components/teacher/courses/student-engagement";
import { TeacherStudentDetailModal } from "@/components/teacher/profile/teacher-student-detail-modal";

export default function InstructorCourseDetailPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const searchParams = useSearchParams();

  const courseId = String(params.id);
  const averageRating = Number(searchParams.get("averageRating"));
  const reviewCount = Number(searchParams.get("reviewCount"));

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditMode, setIsEditMode] = useState(false);

  const [stats, setStats] = useState({
    revenue: 0,
    gradedAssignments: 0,
    totalStudents: -1,
    averageCompletion: 0,
  }); const [statsLoading, setStatsLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  /** True khi mở form chỉnh sửa từ trang Review (Cancel sẽ quay lại review) */
  const [cameFromReview, setCameFromReview] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
      fetchCourseStats();
    }
  }, [courseId]);

  // Mở form chỉnh sửa khi vào URL có ?edit=info (từ Review → Chỉnh sửa thông tin)
  useEffect(() => {
    if (searchParams.get("edit") === "info" && course && !isEditMode) {
      setEditingCourse(course);
      setIsEditMode(true);
      setCameFromReview(true);
      router.replace(`/${locale}/teacher/courses/${courseId}`, { scroll: false });
    }
  }, [searchParams, course, isEditMode, locale, courseId, router]);

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditMode(true);
  };

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const response = await teacherCourseService.getCourse(courseId);
      //@ts-ignore
      if (response.data.status == 'success') {
        //@ts-ignore
        setCourse(response.data.data);
      }
    } catch (error: any) {
      toast.error(t("errors.loadCourseFailed"));
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseStats = async () => {
    try {
      setStatsLoading(true);
      const response = await teacherCourseService.getCourseStats(courseId);
      //@ts-ignore
      if (response.data.status == 'success') {
        //@ts-ignore
        setStats(response.data.data);
      }
    } catch (error) {
      // Silent fail
    } finally {
      setStatsLoading(false);
    }
  };

  const {
    activeTab,
    currentPage,
    selectedStudentId,
    isModalOpen,
    students,
    assignments,
    totalPages,
    handleTabChange,
    handleViewStudent,
    handleCloseModal,
    handleGradeAssignment,
    handlePageChange,
  } = useTeacherStudentsPage();

  const handleBack = () => {
    router.push(`/${locale}/teacher/courses`);
  };


  if (!course && !loading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <BookOpen className="h-16 w-16 text-[#8c92ac] mb-4" />
          <p className="text-lg text-[#3b3d48] mb-2">{t("teacherCourseDetail.notFound")}</p>
          <Button onClick={handleBack} variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t("teacherCourseDetail.back")}
          </Button>
        </div>
      </>
    );
  }


  return (
    <>
      {isEditMode && editingCourse ? (
        <EditCourseForm
          courseId={editingCourse.id}
          course={editingCourse}
          onCancel={() => {
            if (cameFromReview) {
              router.push(`/${locale}/teacher/courses/${courseId}/review`);
              setCameFromReview(false);
            }
            setIsEditMode(false);
            setEditingCourse(null);
          }}
          onSuccess={() => {
            setIsEditMode(false);
            setEditingCourse(null);
            setCameFromReview(false);
            router.push(`/${locale}/teacher/courses`);
          }}
        />
      ) : (
        <LoadingOverlay loading={loading} fullScreen>
          <main className="bg-white flex flex-col gap-[32px]">
            {/* Breadcrumb */}
            <div className="bg-white px-4 sm:px-6 lg:px-16 py-4">
              <div className="">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm text-[#8c92ac] hover:text-[#4162e7] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{t("teacherCourseDetail.breadcrumb.management")}</span>
                  <span>/</span>
                  <span className="text-[#3b3d48] font-medium">{t("teacherCourseDetail.breadcrumb.detail")}</span>
                </button>
              </div>
            </div>

            {/* Top Stats Bar */}
            <section className="bg-white px-4 sm:px-6 lg:px-16">
              <div className="">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-[20px]">

                  <Card className="bg-white border border-[#c4cef8] rounded-lg sm:rounded-[8px] p-4 sm:p-5 lg:p-[20px] flex flex-col gap-2 sm:gap-3 lg:gap-[12px] relative">
                    <div className="absolute top-2 right-2">
                      <span className="bg-[#f59e0b] text-white text-[10px] px-2 py-1 rounded-full font-medium">{t("teacherCourseDetail.comingSoon")}</span>
                    </div>
                    <div className="bg-[#eceffd] rounded-full size-8 sm:size-[32px] flex items-center justify-center shrink-0">
                      <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 9.83333C0.5 11.3061 1.69391 12.5 3.16667 12.5H5.83333C7.30609 12.5 8.5 11.3061 8.5 9.83333C8.5 8.36057 7.30609 7.16667 5.83333 7.16667H3.16667C1.69391 7.16667 0.5 5.97276 0.5 4.5C0.5 3.02724 1.69391 1.83333 3.16667 1.83333H5.83333C7.30609 1.83333 8.5 3.02724 8.5 4.5M4.5 0.5V13.8333" stroke="#8C92AC" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                    </div>
                    <div className="flex flex-col gap-1 sm:gap-[4px]">
                      <p
                        className="text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] text-[#7f859d]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("teacherCourseDetail.stats.revenue")}
                      </p>
                      <p
                        className="text-xl sm:text-2xl lg:text-[24px] leading-6 sm:leading-7 lg:leading-[32px] font-medium text-[#8c92ac]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        ---
                      </p>
                    </div>
                  </Card>


                  <Card className="bg-white border border-[#c4cef8] rounded-lg sm:rounded-[8px] p-4 sm:p-5 lg:p-[20px] flex flex-col gap-2 sm:gap-3 lg:gap-[12px]">
                    <div className="bg-[#eceffd] rounded-full size-8 sm:size-[32px] flex items-center justify-center shrink-0">
                      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.79572 2.1441e-07H7.20428C8.42945 -1.03555e-05 9.39987 -1.87755e-05 10.1593 0.10209C10.941 0.207176 11.5736 0.428587 12.0725 0.927496C12.2678 1.12276 12.2678 1.43934 12.0725 1.6346C11.8772 1.82986 11.5607 1.82986 11.3654 1.6346C11.0833 1.35246 10.6968 1.18335 10.0261 1.09317C9.34099 1.00106 8.43788 1 7.16667 1H5.83333C4.56212 1 3.65901 1.00106 2.9739 1.09317C2.30317 1.18335 1.91674 1.35246 1.6346 1.6346C1.35246 1.91674 1.18335 2.30317 1.09317 2.9739C1.00106 3.65901 1 4.56212 1 5.83333V8.5C1 9.77121 1.00106 10.6743 1.09317 11.3594C1.18335 12.0302 1.35246 12.4166 1.6346 12.6987C1.91674 12.9809 2.30317 13.15 2.9739 13.2402C3.65901 13.3323 4.56212 13.3333 5.83333 13.3333H7.16667C8.43788 13.3333 9.34099 13.3323 10.0261 13.2402C10.6968 13.15 11.0833 12.9809 11.3654 12.6987C11.8294 12.2348 11.9698 11.5139 11.9943 9.8261C11.9983 9.54999 12.2253 9.32939 12.5014 9.33339C12.7776 9.33738 12.9981 9.56445 12.9942 9.84057C12.9707 11.4589 12.866 12.6124 12.0725 13.4058C11.5736 13.9047 10.941 14.1262 10.1593 14.2312C9.39987 14.3334 8.42945 14.3333 7.20427 14.3333H5.79573C4.57055 14.3333 3.60013 14.3334 2.84065 14.2312C2.05904 14.1262 1.4264 13.9047 0.927496 13.4058C0.428587 12.9069 0.207176 12.2743 0.10209 11.4927C-1.87755e-05 10.7332 -1.03555e-05 9.76279 2.1441e-07 8.53761V5.79572C-1.03555e-05 4.57055 -1.87755e-05 3.60013 0.10209 2.84065C0.207176 2.05904 0.428587 1.4264 0.927496 0.927496C1.4264 0.428587 2.05904 0.207176 2.84065 0.10209C3.60013 -1.87755e-05 4.57055 -1.03555e-05 5.79572 2.1441e-07ZM10.5754 3.86371C11.2826 3.15654 12.4291 3.15654 13.1363 3.86371C13.8435 4.57087 13.8435 5.71741 13.1363 6.42457L9.96609 9.59478C9.79361 9.7673 9.67693 9.88402 9.54623 9.98596C9.39248 10.1059 9.22612 10.2087 9.0501 10.2926C8.90048 10.3639 8.74391 10.4161 8.51248 10.4932L7.12339 10.9562C6.81671 11.0584 6.47858 10.9786 6.24999 10.75C6.0214 10.5214 5.94158 10.1833 6.04381 9.87661L6.49751 8.51549C6.50066 8.50606 6.50376 8.49674 6.50683 8.48755C6.58394 8.2561 6.63611 8.09953 6.70742 7.9499C6.79131 7.77388 6.89412 7.60752 7.01404 7.45377C7.11598 7.32308 7.23269 7.2064 7.40519 7.03394C7.41206 7.02708 7.41901 7.02013 7.42606 7.01308L10.5754 3.86371ZM12.4292 4.57081C12.1125 4.25417 11.5992 4.25417 11.2825 4.57081L11.1613 4.692C11.1679 4.71432 11.1755 4.73807 11.1841 4.76302C11.2468 4.94377 11.3658 5.18285 11.5915 5.40851C11.8172 5.63417 12.0562 5.75317 12.237 5.81588C12.2619 5.82453 12.2857 5.83208 12.308 5.83866L12.4292 5.71747C12.7458 5.40083 12.7458 4.88745 12.4292 4.57081ZM11.5443 6.60237C11.3324 6.49105 11.1035 6.33476 10.8844 6.11561C10.6652 5.89646 10.509 5.66764 10.3976 5.45572L8.13316 7.72019C7.93244 7.92091 7.86202 7.99255 7.80256 8.06879C7.7273 8.16527 7.66278 8.26966 7.61014 8.38012C7.56855 8.4674 7.53596 8.56243 7.4462 8.83172L7.17933 9.63232L7.36769 9.82067L8.16828 9.5538C8.43758 9.46404 8.5326 9.43145 8.61988 9.38986C8.73034 9.33722 8.83473 9.2727 8.93121 9.19745C9.00745 9.13798 9.07909 9.06756 9.27982 8.86684L11.5443 6.60237ZM3.33333 5.16667C3.33333 4.89052 3.55719 4.66667 3.83333 4.66667H8.16667C8.44281 4.66667 8.66667 4.89052 8.66667 5.16667C8.66667 5.44281 8.44281 5.66667 8.16667 5.66667H3.83333C3.55719 5.66667 3.33333 5.44281 3.33333 5.16667ZM3.33333 7.83333C3.33333 7.55719 3.55719 7.33333 3.83333 7.33333H5.5C5.77614 7.33333 6 7.55719 6 7.83333C6 8.10948 5.77614 8.33333 5.5 8.33333H3.83333C3.55719 8.33333 3.33333 8.10948 3.33333 7.83333ZM3.33333 10.5C3.33333 10.2239 3.55719 10 3.83333 10H4.83333C5.10948 10 5.33333 10.2239 5.33333 10.5C5.33333 10.7761 5.10948 11 4.83333 11H3.83333C3.55719 11 3.33333 10.7761 3.33333 10.5Z" fill="#8C92AC" />
                      </svg>



                    </div>
                    <div className="flex flex-col gap-1 sm:gap-[4px]">
                      <p
                        className="text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] text-[#7f859d]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("teacherCourseDetail.stats.gradedAssignments")}
                      </p>
                      <p
                        className="text-xl sm:text-2xl lg:text-[24px] leading-6 sm:leading-7 lg:leading-[32px] font-medium text-[#3b3d48]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {statsLoading ? '...' : stats.gradedAssignments}
                      </p>
                    </div>
                  </Card>


                  <Card className="bg-white border border-[#c4cef8] rounded-lg sm:rounded-[8px] p-4 sm:p-5 lg:p-[20px] flex flex-col gap-2 sm:gap-3 lg:gap-[12px]">
                    <div className="bg-[#eceffd] rounded-full size-8 sm:size-[32px] flex items-center justify-center shrink-0">
                      <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.1308 9.05792C12.1014 9.5455 12.9335 10.328 13.5409 11.3064C13.6612 11.5002 13.7213 11.5971 13.7421 11.7312C13.7844 12.0038 13.598 12.339 13.344 12.4469C13.2191 12.5 13.0785 12.5 12.7974 12.5M9.79742 6.18816C10.7852 5.69726 11.4641 4.67791 11.4641 3.5C11.4641 2.32209 10.7852 1.30274 9.79742 0.81184M8.46408 3.5C8.46408 5.15685 7.12094 6.5 5.46408 6.5C3.80723 6.5 2.46408 5.15685 2.46408 3.5C2.46408 1.84315 3.80723 0.5 5.46408 0.5C7.12094 0.5 8.46408 1.84315 8.46408 3.5ZM0.836904 11.1256C1.89978 9.5297 3.577 8.5 5.46408 8.5C7.35117 8.5 9.02839 9.5297 10.0913 11.1256C10.3241 11.4752 10.4405 11.65 10.4271 11.8733C10.4167 12.0471 10.3027 12.26 10.1638 12.3651C9.98537 12.5 9.73997 12.5 9.24918 12.5H1.67899C1.1882 12.5 0.942803 12.5 0.764377 12.3651C0.625449 12.26 0.511476 12.0471 0.50104 11.8733C0.487636 11.65 0.604059 11.4752 0.836904 11.1256Z" stroke="#8C92AC" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                    </div>
                    <div className="flex flex-col gap-1 sm:gap-[4px]">
                      <p
                        className="text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] text-[#7f859d]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("teacherCourseDetail.stats.totalStudents")}
                      </p>
                      <p
                        className="text-xl sm:text-2xl lg:text-[24px] leading-6 sm:leading-7 lg:leading-[32px] font-medium text-[#3b3d48]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {statsLoading ? '...' : stats.totalStudents}
                      </p>
                    </div>
                  </Card>


                  <Card className="bg-white border border-[#c4cef8] rounded-lg sm:rounded-[8px] p-4 sm:p-5 lg:p-[20px] flex flex-col gap-2 sm:gap-3 lg:gap-[12px]">
                    <div className="bg-[#eceffd] rounded-full size-8 sm:size-[32px] flex items-center justify-center shrink-0">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.16667 7.16667L6.16667 9.16667L10.1667 5.16667M13.8333 7.16667C13.8333 10.8486 10.8486 13.8333 7.16667 13.8333C3.48477 13.8333 0.5 10.8486 0.5 7.16667C0.5 3.48477 3.48477 0.5 7.16667 0.5C10.8486 0.5 13.8333 3.48477 13.8333 7.16667Z" stroke="#8C92AC" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>


                    </div>
                    <div className="flex flex-col gap-1 sm:gap-[4px]">
                      <p
                        className="text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] text-[#7f859d]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("teacherCourseDetail.stats.avgCompletion")}
                      </p>
                      <p
                        className="text-xl sm:text-2xl lg:text-[24px] leading-6 sm:leading-7 lg:leading-[32px] font-medium text-[#3b3d48]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {statsLoading ? '...' : `${stats.averageCompletion}%`}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </section>


            {course ? (
              <section className="px-4 sm:px-6 lg:px-16">
                <div className="">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">

                    <div className="lg:col-span-2 flex flex-col gap-[12px]">
                      {stats.totalStudents >= 0 && (
                        <CourseDetailCard
                          course={course}
                          onEdit={() => handleEditCourse(course)}
                          totalStudents={stats.totalStudents}
                          avarageRating={averageRating as number}
                          reviewCount={reviewCount as number}

                        />
                      )}

                      <CourseDetailModules
                        modules={course.sections || []}
                        courseId={course.id}

                      />
                      <StudentsTable
                        students={students}
                        loading={loading}
                        onViewStudent={handleViewStudent}
                        variant="courseDetail"
                        sectionTitle={t("teacherCourseDetail.studentListTitle")}
                        onGradeClick={() => router.push(`/${locale}/teacher/students`)}
                        viewMoreLabel={t("teacherCourseDetail.viewMoreStudents")}
                        onViewMore={() => handlePageChange(currentPage + 1)}
                        hasNextPage={currentPage < totalPages}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onGoToFirstPage={() => handlePageChange(1)}
                      />
                    </div>


                    <div className="space-y-4 sm:space-y-6">
                      <StudentEngagement courseId={courseId} />

                      <CourseReviews courseId={courseId}
                        avarageRating={averageRating as number}
                        reviewCount={reviewCount as number}
                      />
                    </div>
                  </div>
                </div>
              </section>
            ) : null}
          </main>
        </LoadingOverlay>
      )}

      {selectedStudentId && isModalOpen && (() => {
        const selectedStudent = students.find((s) => s.id === selectedStudentId);
        return (
          <TeacherStudentDetailModal
            open={isModalOpen}
            onClose={handleCloseModal}
            student={{
              id: selectedStudentId,
              name: selectedStudent?.name ?? t("teacher.students.fallbackStudentName"),
              email: selectedStudent?.email ?? "",
              phone: "",
              avatar: "/images/avatars/Ellipse 29.png",
              course: {
                title: selectedStudent?.courseName ?? course?.title ?? t("teacher.students.fallbackCourseTitle"),
                duration: t("teacher.students.filters.inProgress"),
                modules: 0,
                assignments: selectedStudent?.totalAssignments ?? 0,
              },
              overallProgress: selectedStudent?.progress ?? 0,
              completedAssignments: selectedStudent?.completedAssignments ?? 0,
              totalAssignments: selectedStudent?.totalAssignments ?? 0,
              modules: [],
            }}
          />
        );
      })()}
    </>
  );
}
