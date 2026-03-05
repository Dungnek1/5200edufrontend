"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import publicCourseService from "@/services/apis/public-course.service";
import type { Course } from "@/types/course";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks";
import { LoadingOverlay } from "@/components/shared/loading-overlay";
import { CourseVideoPlayer } from "@/components/courses/course-video-player";
import { CourseDetailModules } from "@/components/courses/course-detail-modules";

export default function CourseTrialPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const t = useTranslations();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "assignment">("overview");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await publicCourseService.getCourseBySlug(slug);
        if (response.success && response.data) {
          const data = response.data;
          setCourse(data);

          if (data.sections && data.sections.length > 0) {
            setSelectedModuleId(data.sections[0].id);
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

    if (slug) {
      fetchCourse();
    }
  }, [slug, t]);

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

  const handleEnroll = () => {
    if (!course) return;

    if (!isAuthenticated) {
      toast.warning(t("course.loginToPurchase"));
      router.push(`/${params.locale}/login`);
      return;
    }

    if (!user || user.role !== "STUDENT") {
      toast.warning(t("course.studentOnly"));
      return;
    }

    router.push(`/${params.locale}/student/courses/${course.slug}/payment`);
  };

  const currentModule =
    course?.sections?.find((m) => m.id === selectedModuleId) ||
    course?.sections?.[0];

  const firstModuleId = course?.sections?.[0]?.id || null;

  const isTrial = true;
  const isLocked =
    isTrial &&
    !!currentModule &&
    !!firstModuleId &&
    currentModule.id !== firstModuleId;

  return (
    <LoadingOverlay loading={loading} fullScreen>
      {course && (
        <div className="min-h-screen py-6 px-4 sm:py-8 sm:px-8 md:py-10 md:px-12 lg:py-[32px] lg:px-[64px] bg-[#FAFAFA]">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-[20px]">
            <div className="flex-1 min-w-0">
              <CourseVideoPlayer
                course={course}
                currentModule={currentModule}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                courseId={course.id}
                isTrial={isTrial}
                isLocked={isLocked}
                onEnrollClick={handleEnroll}
              />
            </div>

            <div className="w-full lg:w-[370px] lg:flex-shrink-0">
              <CourseDetailModules
                modules={course.sections || []}
                courseId={course.id}
                selectedModuleId={selectedModuleId}
                onModuleSelect={setSelectedModuleId}
                trialMode={isTrial}
                trialUnlockedModuleId={firstModuleId}
              />
            </div>
          </div>
        </div>
      )}
    </LoadingOverlay>
  );
}

