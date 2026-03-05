"use client";

import { useTranslations } from "next-intl";
import { CourseAssignmentTab } from "./course-assignment-tab";
import { Course, CourseSection } from "@/types/course";
import { VideoHLSPlayer } from "@/components/video/video-hls-player";
import { useParams, useRouter } from "next/navigation";
import { Play, Settings } from "lucide-react";

interface CourseVideoPlayerProps {
  course: Course;
  currentModule?: CourseSection;
  activeTab: 'overview' | 'assignment';
  onTabChange: (tab: 'overview' | 'assignment') => void;
  courseId: string;
  /** Chế độ xem thử (guest) */
  isTrial?: boolean;
  /** Module hiện tại bị khoá (chỉ xem cho học viên đã đăng ký) */
  isLocked?: boolean;
  /** Callback đăng ký khóa học khi đang xem thử */
  onEnrollClick?: () => void;
}

export function CourseVideoPlayer({
  course,
  currentModule,
  activeTab,
  onTabChange,
  courseId,
  isTrial = false,
  isLocked = false,
  onEnrollClick,
}: CourseVideoPlayerProps) {

  const tCourse = useTranslations("course");
  const tLesson = useTranslations("lesson");
  /* Khung video cố định 16:9, cùng kích thước dù có video hay không */
  const videoContainerClass =
    "w-full aspect-video min-h-[320px] bg-[#0f0f0f] rounded-lg overflow-hidden relative";

  return (
    <div className="bg-white overflow-hidden flex flex-col gap-[20px]">
      <div className={videoContainerClass}>
        {isTrial && isLocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0f0f0f]">
            <p className="text-white text-sm sm:text-base md:text-lg font-medium text-center max-w-[480px] px-4">
              {tCourse("trialLockedMessage")}
            </p>
            <button
              type="button"
              onClick={onEnrollClick}
              className="px-6 py-2 rounded-md bg-[#4162e7] hover:bg-[#3554d4] text-white text-sm font-medium transition-colors"
            >
              {tCourse("enrollCta")}
            </button>
          </div>
        ) : currentModule?.documents && currentModule.documents.length > 0 ? (
          <div className="absolute inset-0">
            <VideoHLSPlayer
              videoId={currentModule.id}
              courseId={courseId}
              sectionId={currentModule.id}
              currentdocumentId={currentModule.documents[0].documentId}
              controls
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/90 text-base sm:text-lg text-center px-4">
              {tLesson("noVideo")}
            </p>
          </div>
        )}
      </div>


      <div className="border-b-[2px] border-[#DBDDE5]">
        <div className="flex gap-8 px-6">
          <button
            onClick={() => onTabChange("overview")}
            className={`py-4 text-[14px]  font-medium border-b-2 transition-colors ${activeTab === "overview"
              ? "border-[#0A0BD9]"
              : "border-transparent text-[#3B3D48] hover:text-gray-900"
              }`}
          >
            {tCourse("overview")}
          </button>
          <button
            onClick={() => onTabChange("assignment")}
            className={`py-4 text-[14px]  font-medium border-b-2 transition-colors ${activeTab === "assignment"
              ? "border-[#0A0BD9]"
              : "border-transparent text-[#3B3D48] hover:text-gray-900"
              }`}
          >
            {tCourse("assignment")}
          </button>
        </div>
      </div>



      {activeTab === "overview" ? (
        <div className="space-y-6 p-4">
          {/* Mô tả module / khóa học */}
          {(currentModule?.description || course.description) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {tCourse("overview")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {currentModule?.description || course.description}
              </p>
            </div>
          )}

          {/* Mục tiêu học tập (gồm cả cấp khóa học và cấp bài học) */}
          {(course.learningOutcomes?.length ||
            (currentModule?.targetSection &&
              currentModule.targetSection.length > 0)) && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {tCourse("lessonGoals")}
                </h3>
                <ul className="space-y-2">
                  {course.learningOutcomes?.map((outcome, index) => (
                    <li
                      key={`course-outcome-${index}`}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                  {currentModule?.targetSection?.map((target, index) => (
                    <li
                      key={`module-target-${index}`}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{target}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      ) : (
        <CourseAssignmentTab
          courseId={course.id}
          moduleId={currentModule?.id}
          enrollmentId={course.enrollmentId}
        />
      )}

    </div>
  );
}
