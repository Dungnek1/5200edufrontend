"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CourseDetailModules } from "@/components/courses/course-detail-modules";
import { CourseVideoPlayer } from "@/components/courses/course-video-player";
import {
  Home,
  ChevronRight,
  Check,
  Edit3,
  Save,
  Eye,
  LinkIcon,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import teacherCourseService from "@/services/apis/teacher-course.service";
import { toast } from "sonner";
import { CourseStatus } from "@/types/course";
import type { Course } from "@/types/course";

import { logger } from '@/lib/logger';

export default function CourseReviewPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();
  const locale = (params.locale as string) || "vi";
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [saveAction, setSaveAction] = useState<"draft" | "publish" | null>(
    null,
  );
  const [showStudentView, setShowStudentView] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "assignment">("overview");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);

      const courseResponse = await teacherCourseService.getCourse(courseId);
      if (courseResponse.success && courseResponse.data) {
        const data = courseResponse.data as any;
        const courseData = data?.data ?? data;
        setCourse(courseData);
      }
    } catch (error) {
      logger.error("Error fetching course data:", error);
      toast.error(t("teacherCourseDetail.loadError"));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);



  const handleSaveClick = async (action: "draft" | "publish") => {
    setSaveAction(action);
    setShowDropdown(false);

    try {
      if (action === "publish") {
        setPublishing(true);
        const response = await teacherCourseService.publishCourse(courseId);
        //@ts-ignore
        if (response.success) {
          setCourse((prev: any) =>
            prev ? { ...prev, status: CourseStatus.PUBLISHED } : null,
          );
          setShowPublishModal(true);
        } else {
          toast.error(t("teacherCourseDetail.publishError"));
        }
      } else {
        setSaving(true);
        if (course?.status == 'PUBLISHED') {
          const response = await teacherCourseService.unpublishCourse(courseId);
          if (response.success) {
            setCourse((prev: any) =>
              prev ? { ...prev, status: CourseStatus.DRAFT } : null,
            );
          }
        }
        setShowSaveModal(true);
      }
    } catch (error) {
      logger.error("Error saving/publishing course:", error);
      toast.error(t("teacherCourseDetail.saveError"));
    } finally {
      setPublishing(false);
      setSaving(false);
    }
  };

  const handleContinueEditing = () => {
    setShowSaveModal(false);
    router.push(`/${locale}/teacher/courses/${courseId}/create-content`);
  };

  const handleGoHome = () => {
    setShowSaveModal(false);
    setShowPublishModal(false);
    router.push(`/${locale}/teacher/courses`);
  };

  const handleUpdateMaterials = () => {
    setShowPublishModal(false);
    router.push(`/${locale}/teacher/courses/${courseId}/create-content`);
  };



  const handleViewAsStudent = () => {
    if (course?.sections?.length) {
      setSelectedModuleId(course.sections[0].id);
    }
    setActiveTab("overview");
    setShowStudentView(true);
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4162e7] mx-auto mb-4"></div>
            <p className="text-gray-600">{t("common.loadingInfo")}</p>
          </div>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-600">{t("teacherCourseDetail.notFound")}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <main className="bg-white min-h-screen">
        <div className="bg-white mx-auto max-w-[1990px] w-full px-4 sm:px-6 md:px-8 lg:px-[64px] py-4 sm:py-5 md:py-[20px] pb-20 sm:pb-24 md:pb-32 lg:pb-[120px] flex flex-col gap-4 sm:gap-6 lg:gap-[32px]">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 md:gap-[8px] flex-wrap">
            <Home className="h-4 w-4 md:h-5 md:w-5 text-[#8c92ac]" />
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-[#8c92ac]" />
            <span
              className="text-xs font-medium text-[#7f859d] cursor-pointer hover:text-[#4162e7]"
              onClick={() => router.push(`/${locale}/teacher/courses`)}
            >
              {t("nav.courseManagement")}
            </span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#8c92ac]" />
            <span className="text-xs font-medium text-[#4162e7]">{t("common.create")}</span>
          </div>

          {/* Title */}
          <div className="flex items-center justify-between w-full">
            <h1
              className="text-xl sm:text-2xl lg:text-[30px] font-medium leading-6 sm:leading-7 lg:leading-[38px] text-[#0f172a]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
            >
              {t("teacher.courses.createNew")}
            </h1>
          </div>

          {/* Stepper */}
          <div className="w-full flex flex-col gap-[12px] overflow-x-clip overflow-y-visible mt-4 md:mt-6 lg:mt-8 pt-2 md:pt-3">
            <div className="flex items-start justify-between max-w-[1008px] w-full lg:max-w-[800px] mx-auto relative px-4 md:px-0 gap-4 md:gap-6 lg:gap-8">
              {/* Connecting Line - Show on all screens, from step 1 to step 3 */}
              <div className="absolute top-[12px] h-0 z-0 left-[62.5px] md:left-[72.5px] lg:left-[94px] right-[62.5px] md:right-[72.5px] lg:right-[94px]">
                <div className="w-full h-[1px] bg-[#d2d2d2]" />
              </div>

              {/* Step 1: Info (Completed) */}
              <div className="flex flex-col items-center gap-[8px] md:gap-[12px] w-[100px] md:w-[120px] lg:w-[188px] relative z-10 flex-shrink-0">
                <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-[#4162e7] flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
                </div>
                <p className="text-xs leading-[18px] md:text-sm md:leading-[20px] lg:text-base lg:leading-[24px] font-medium text-[#63687a] text-center w-full">
                  {t("teacher.courses.createInfo.stepInfo")}
                </p>
              </div>

              {/* Step 2: Module & Bài tập (Completed) */}
              <div className="flex flex-col items-center gap-[8px] md:gap-[12px] w-[100px] md:w-[120px] lg:w-[188px] relative z-10 flex-shrink-0">
                <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-[#4162e7] flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
                </div>
                <p className="text-xs leading-[18px] md:text-sm md:leading-[20px] lg:text-base lg:leading-[24px] font-medium text-[#63687a] text-center w-full">
                  {t("teacher.courses.createInfo.stepContent")}
                </p>
              </div>

              {/* Step 3: Preview (Active) */}
              <div className="flex flex-col items-center gap-[8px] sm:gap-[12px] w-[100px] sm:w-[120px] md:w-[188px] relative z-10 flex-shrink-0">
                <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-[#4162e7] flex items-center justify-center shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#3b59d2]">
                  <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white" />
                </div>
                <p className="text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#2e46a4] text-center w-full">
                  {t("teacher.courses.createInfo.stepPreview")}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col items-end justify-center w-full">
            <div className="flex flex-1 items-end justify-end w-full">
              <div className="flex flex-1 flex-col gap-[20px] items-end justify-end w-full">
                {showStudentView ? (
                  /* Xem dưới dạng học viên: layout lớp học (video trái + danh sách module phải) */
                  <div className="flex flex-col gap-4 w-full overflow-x-clip px-4 sm:px-0">
                    <div className="flex items-center justify-between w-full flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowStudentView(false)}
                        className="h-[44px] px-4 border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium leading-[20px]">{t("teacherCourseReview.backToPreview")}</span>
                      </Button>
                      <h2
                        className="text-xl sm:text-2xl md:text-[24px] font-medium leading-[28px] sm:leading-[30px] md:leading-[32px] text-[#0f172a]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      >
                        {t("teacherCourseReview.viewAsStudent")}
                      </h2>
                      <div className="w-[120px] sm:w-[140px]" />
                    </div>
                    <nav className="flex items-center text-xs sm:text-sm text-gray-500 space-x-2 overflow-x-auto whitespace-nowrap">
                      <Home size={14} className="flex-shrink-0 text-[#8c92ac]" />
                      <ChevronRight size={12} className="flex-shrink-0" />
                      <span className="text-[#7f859d]">GV: {(course as any)?.ownerTeacher?.fullName ?? "—"}</span>
                      <ChevronRight size={12} className="flex-shrink-0" />
                      <span className="text-gray-900 truncate max-w-[200px] sm:max-w-md">
                        {course.sections?.find((m) => m.id === selectedModuleId)?.title ?? course.sections?.[0]?.title ?? "—"}
                      </span>
                    </nav>
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-[20px]">
                      <div className="flex-1 min-w-0">
                        <CourseVideoPlayer
                          course={course}
                          currentModule={course.sections?.find((m) => m.id === selectedModuleId) ?? course.sections?.[0]}
                          activeTab={activeTab}
                          onTabChange={setActiveTab}
                          courseId={course.id}
                        />
                      </div>
                      <div className="w-full lg:w-[370px] lg:flex-shrink-0">
                        <CourseDetailModules
                          modules={course.sections || []}
                          courseId={course.id}
                          selectedModuleId={selectedModuleId}
                          onModuleSelect={setSelectedModuleId}
                          progressData={{}}
                          onProgressUpdate={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                /* Preview Section (mặc định) */
                <div className="flex flex-col gap-[12px] items-start w-full overflow-x-clip px-4 sm:px-0">
                  <h2
                    className="text-xl sm:text-2xl md:text-[24px] font-medium leading-[28px] sm:leading-[30px] md:leading-[32px] text-[#0f172a] w-full"
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {t("teacherCourseReview.previewTitle")}
                  </h2>

                  {/* Course Card */}
                  <div className="relative bg-white border border-[#f4f4f7] rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] w-full p-4 flex flex-col overflow-x-clip">
                    {/* Status Badge */}
                    {course.status == 'DRAFT' && (
                      <div className="absolute bg-[#fff4e6] px-3 py-0.5 rounded-lg top-[23px] left-[19px] z-10">
                        <p className="text-sm font-normal text-[#b56a00] leading-[20px]">
                          {t("teacherCourseReview.unpublished")}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 items-start w-full">
                      {/* Thumbnail */}
                      <div className="relative aspect-square w-full sm:w-[200px] md:w-[288px] sm:h-[200px] md:h-[288px] rounded-[12px] bg-[#dbdde5] flex-shrink-0 overflow-hidden">
                        {course.thumbnailUrl && (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_MINIO}/${course.thumbnailUrl}`}
                            alt={course.title}
                            className="object-cover"
                            fill
                          />
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex flex-1 flex-col w-full items-between">
                        {/* CONTENT */}
                        <div className="flex flex-col gap-2 px-0 sm:px-3 w-full min-h-[244px]">
                          <h3
                            className="text-[18px] font-medium leading-[28px] text-[#3b3d48] max-h-[60px] overflow-hidden"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {course.title}
                          </h3>

                          <p
                            className="text-sm font-normal text-[#8c92ac] leading-[20px]"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {course.description}
                          </p>


                          {course.learningOutcomes?.length > 0 && (
                            <div className="flex flex-col gap-2 mt-2">
                              <p className="text-base font-medium text-[#3b3d48]">
                                {t("teacherCourseReview.teachingContent")}
                              </p>

                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                  {course.learningOutcomes
                                    .slice(0, 2)
                                    .map((outcome: string, idx: number) => (
                                      <div
                                        key={idx}
                                        className="flex flex-1 gap-1 items-center"
                                      >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <g clip-path="url(#clip0_1899_67665)">
                                            <path d="M4.99967 7.9987L6.99967 9.9987L10.9997 5.9987M14.6663 7.9987C14.6663 11.6806 11.6816 14.6654 7.99967 14.6654C4.31778 14.6654 1.33301 11.6806 1.33301 7.9987C1.33301 4.3168 4.31778 1.33203 7.99967 1.33203C11.6816 1.33203 14.6663 4.3168 14.6663 7.9987Z" stroke="#16A34A" strokeLinecap="round" strokeLinejoin="round" />
                                          </g>
                                          <defs>
                                            <clipPath id="clip0_1899_67665">
                                              <rect width="16" height="16" fill="white" />
                                            </clipPath>
                                          </defs>
                                        </svg>

                                        <p className="text-xs font-medium text-[#3b3d48]">
                                          {outcome}
                                        </p>
                                      </div>
                                    ))}
                                </div>

                                {course.learningOutcomes.length >
                                  2 && (
                                    <div className="flex justify-between">
                                      {course.learningOutcomes
                                        .slice(2, 4)
                                        .map((outcome: string, idx: number) => (
                                          <div
                                            key={idx}
                                            className="flex flex-1 gap-1 items-center"
                                          >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <g clip-path="url(#clip0_1899_67665)">
                                                <path d="M4.99967 7.9987L6.99967 9.9987L10.9997 5.9987M14.6663 7.9987C14.6663 11.6806 11.6816 14.6654 7.99967 14.6654C4.31778 14.6654 1.33301 11.6806 1.33301 7.9987C1.33301 4.3168 4.31778 1.33203 7.99967 1.33203C11.6816 1.33203 14.6663 4.3168 14.6663 7.9987Z" stroke="#16A34A" strokeLinecap="round" strokeLinejoin="round" />
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_1899_67665">
                                                  <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                              </defs>
                                            </svg>

                                            <p className="text-xs font-medium text-[#3b3d48]">
                                              {outcome}
                                            </p>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}


                        </div>

                        {/* FOOTER BUTTON */}
                        <div className="mt-auto  flex items-end justify-end h-full w-full">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/${locale}/teacher/courses/${courseId}?edit=info`,
                              )
                            }
                            className="h-[44px] px-4 border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] transition-colors cursor-pointer"
                          >
                            <Edit3 className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium leading-[20px]">
                              {t("teacherCourseReview.edit")}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Content Section */}
                  <div className="flex flex-col items-start w-full rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]">
                    {/* Header */}
                    <div className="bg-white border border-[#f4f4f7] border-b-0 rounded-tl-[12px] rounded-tr-[12px] flex flex-col sm:flex-row h-auto sm:h-[77px] items-start sm:items-center justify-between px-4 py-3 sm:py-[25px] w-full gap-3 sm:gap-0">
                      <h3
                        className="text-base sm:text-[18px] font-medium text-[#3b3d48] leading-[24px] sm:leading-[28px] flex-1"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {t("teacherCourseReview.courseContent")}
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/${locale}/teacher/courses/${courseId}/create-content`,
                          )
                        }
                        className="h-[44px] px-4 border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] w-full sm:w-auto transition-colors cursor-pointer"
                      >
                        <Edit3 className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium leading-[20px]">
                          {t("teacherCourseReview.edit")}
                        </span>
                      </Button>
                    </div>


                    <div className="bg-white border border-[#f4f4f7] border-t-0 rounded-bl-[12px] rounded-br-[12px] w-full p-3">
                      <CourseDetailModules
                        modules={course.sections || []}
                        courseId={course.id}
                        disable={true}
                        viewOnly={true}
                      />
                    </div>
                  </div>
                </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 items-stretch sm:items-center justify-end w-full">
                  {!showStudentView && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleViewAsStudent}
                      className="h-[44px] px-4 border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] w-full sm:w-auto transition-colors cursor-pointer"
                    >
                      <Eye className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium leading-[20px]">
                        {t("teacherCourseReview.viewAsStudent")}
                      </span>
                    </Button>
                  )}
                  <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                    <Button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      disabled={saving || publishing}
                      className="h-[44px] px-4 bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] rounded-[6px] flex items-center justify-center gap-1 w-full sm:w-auto cursor-pointer"
                    >
                      <LinkIcon className="h-5 w-5" />
                      <span className="text-sm font-medium leading-[20px]">
                        {saving
                          ? t("teacherCourseReview.saving")
                          : publishing
                            ? t("teacherCourseReview.publishing")
                            : t("teacherCourseReview.save")}
                      </span>
                      {!saving && !publishing && (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>

                    {/* Dropdown Menu */}
                    {showDropdown && !saving && !publishing && (
                      <div className="absolute right-0 mt-2 w-[280px] sm:w-[320px] bg-white rounded-[8px] border-[0.5px] border-[#f4f4f7] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] z-50 py-2">
                        <button
                          onClick={() => handleSaveClick("draft")}
                          className="w-full text-left px-3 py-2 hover:bg-[#eceffd] flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Save className="h-5 w-5 text-[#4162e7] flex-shrink-0" />
                          <span
                            className="text-sm font-medium text-[#3b3d48] leading-[20px]"
                            style={{
                              fontFamily: "Roboto, sans-serif",
                              fontWeight: 500,
                            }}
                          >
                            {t("teacherCourseReview.saveCourse")}
                          </span>
                        </button>
                        <button
                          onClick={() => handleSaveClick("publish")}
                          className="w-full text-left px-3 py-2 hover:bg-[#eceffd] flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Eye className="h-5 w-5 text-[#4162e7] flex-shrink-0" />
                          <span
                            className="text-sm font-medium text-[#3b3d48] leading-[20px]"
                            style={{
                              fontFamily: "Roboto, sans-serif",
                              fontWeight: 500,
                            }}
                          >
                            {t("teacherCourseReview.saveAndPublish")}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save Success Modal (Draft) */}
      <Dialog
        open={showSaveModal && saveAction === "draft"}
        onOpenChange={(open) => {
          if (!open) {
            setShowSaveModal(false);
            setSaveAction(null);
          }
        }}
      >
        <DialogContent className="bg-white rounded-[16px] p-4 sm:p-6 w-[95vw] sm:w-[400px] border-0">
          <DialogHeader className="text-center">
            <DialogTitle
              className="text-lg sm:text-[20px] font-bold text-[#3b3d48] leading-[26px] sm:leading-[28px] mb-3"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
            >
              {t("teacherCourseReview.createSuccessTitle")}
            </DialogTitle>
            <DialogDescription
              className="text-sm sm:text-base font-normal text-[#4d505f] leading-[20px] sm:leading-[24px]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("teacherCourseReview.createSuccessDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 items-stretch sm:items-center mt-6 sm:mt-7">
            <Button
              type="button"
              variant="outline"
              onClick={handleContinueEditing}
              className="flex-1 h-[44px] px-4 border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] w-full sm:w-auto transition-colors"
            >
              <span
                className="text-sm font-medium leading-[20px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {t("teacherCourseReview.continueEditing")}
              </span>
            </Button>
            <Button
              type="button"
              onClick={handleGoHome}
              className="flex-1 h-[44px] px-4 bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] rounded-[6px] w-full sm:w-auto"
            >
              <span
                className="text-sm font-medium leading-[20px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {t("teacherCourseReview.goToExplore")}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Success Modal */}
      <Dialog
        open={showPublishModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowPublishModal(false);
            setSaveAction(null);
          }
        }}
      >
        <DialogContent className="bg-white rounded-[16px] p-4 sm:p-6 w-[95vw] sm:w-[400px] border-0 [&>div:first-child]:bg-[rgba(59,61,72,0.8)]">
          <DialogHeader className="text-center">
            <DialogTitle
              className="text-lg sm:text-[20px] font-bold text-[#3b3d48] leading-[26px] sm:leading-[28px] mb-3"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
            >
              {t("teacherCourseReview.publishSuccessTitle")}
            </DialogTitle>
            <DialogDescription
              className="text-sm sm:text-base font-normal text-[#4d505f] leading-[20px] sm:leading-[24px]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("teacherCourseReview.publishSuccessDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 items-stretch sm:items-center mt-6 sm:mt-7">
            <Button
              type="button"
              variant="outline"
              onClick={handleUpdateMaterials}
              className="flex-1 h-[44px] px-4 border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] w-full sm:w-auto transition-colors"
            >
              <span
                className="text-sm font-medium leading-[20px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {t("teacherCourseReview.updateMaterials")}
              </span>
            </Button>
            <Button
              type="button"
              onClick={handleGoHome}
              className="flex-1 h-[44px] px-4 bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] rounded-[6px] w-full sm:w-auto"
            >
              <span
                className="text-sm font-medium leading-[20px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {t("teacherCourseReview.goToExplore")}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
