"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseDetailModules } from "@/components/courses/course-detail-modules";

import studentCourseService from "@/services/apis/student-course.service";
import { progressService, ModuleProgress } from "@/services/apis/progress.service";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { LoadingOverlay } from "@/components/shared/loading-overlay";
import { CourseVideoPlayer } from "@/components/courses/course-video-player";
import { CourseReviewSection } from "@/components/courses/course-review-section";
import { Course } from "@/types/course";
import { ChevronRight, Home } from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignment'>('overview');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<Record<string, ModuleProgress>>({});
  const [loadingProgress, setLoadingProgress] = useState(false);


  // Load progress data for all documents in current section
  const loadProgressData = async (courseData: Course) => {
    if (!courseData?.sections || courseData.sections.length === 0) return;

    setLoadingProgress(true);
    try {
      const allDocumentIds: string[] = [];
      const sectionMap: Record<string, string> = {}; // documentId -> sectionId

      // Collect all document IDs and their section IDs
      courseData.sections.forEach((section) => {
        section.documents?.forEach((doc) => {
          allDocumentIds.push(doc.documentId);
          sectionMap[doc.documentId] = section.id;
        });
      });

      // Fetch progress for all documents in parallel
      const progressPromises = allDocumentIds.map(async (docId) => {
        const sectionId = sectionMap[docId];
        const result = await progressService.getModuleProgress(
          courseData.id,
          sectionId,
          docId
        );
        return { docId, progress: result.data };
      });

      const results = await Promise.all(progressPromises);

      // Build progress map
      const progressMap: Record<string, ModuleProgress> = {};
      results.forEach(({ docId, progress }) => {
        if (progress) {
          progressMap[docId] = progress;
        }
      });

      setProgressData(progressMap);
    } catch (error) {
      console.error('[Progress] Failed to load progress data:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await studentCourseService.getCourseDetailStudentBySlug(slug);
        if (response.data) {
          const courseData = response.data;
          setCourse(courseData);


          if (courseData.sections && courseData.sections.length > 0) {
            setSelectedModuleId(courseData.sections[0].id);
          }

          // Load progress data
          await loadProgressData(courseData);
        } else {
          setCourse(null);
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

  const handleProgressUpdate = () => {
    if (course) {
      loadProgressData(course);
    }
  };

  if (!course && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{t("errors.notFound")}</p>
        </div>
      </div>
    );
  }

  const currentModule = course?.sections?.find(m => m.id === selectedModuleId);

  return (
    <LoadingOverlay loading={loading} fullScreen>
      {course && (
        <div className="min-h-screen  py-6 px-4 sm:py-8 sm:px-8 md:py-10 md:px-12 lg:py-[32px] lg:px-[64px]">

          <nav className="flex items-center text-xs sm:text-sm text-gray-500 space-x-2 overflow-x-auto whitespace-nowrap mb-4 sm:mb-6">
            <a href="#" className="hover:text-indigo-600 flex items-center">
              <Home size={14} className="mr-1" />
            </a>
            <ChevronRight size={12} />
            <a href="/teachers" className="hover:text-indigo-600">
              GV: {course.ownerTeacher.fullName}
            </a>
            <ChevronRight size={12} />
            <span className="text-gray-900 truncate max-w-[200px] sm:max-w-md">
              {currentModule?.title}
            </span>
          </nav>



          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-[20px]">

            <div className="flex-1 min-w-0">
              <CourseVideoPlayer
                course={course}
                currentModule={currentModule}
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
                progressData={progressData}
                onProgressUpdate={handleProgressUpdate}
              />
            </div>
          </div>

          {/* Review Section */}
          <div className="mt-8 lg:mt-12">
            <CourseReviewSection courseId={course.id} />
          </div>

        </div>
      )}
    </LoadingOverlay>
  );
}