"use client";

import { useState } from "react";
import { Play, Settings, Clock, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { Course, CourseSection } from "@/types/course";
import { CourseDetailModules } from "@/components/courses/course-detail-modules";

interface TeacherFeaturedCourseProps {
    course: Course;
}

export function TeacherFeaturedCourse({ course }: TeacherFeaturedCourseProps) {
    const t = useTranslations("teacherCourseReview");
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
        course.sections?.[0]?.id || null
    );

    const currentModule = course.sections?.find(
        (section) => section.id === selectedModuleId
    );

    return (
        <div className="max-w-full ">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Khóa học nổi bật
                </h2>
                <p className="text-gray-600">
                    Khóa học được đánh giá cao nhất của giáo viên
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-[20px]">
                {/* Left: Video + Overview */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white overflow-hidden">
                        {/* Video Player */}
                        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 aspect-video">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    {/* Background decoration */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-64 h-64 bg-blue-100 opacity-30 rotate-45 rounded-3xl"></div>
                                    </div>

                                    {/* Play button */}
                                    <div className="relative w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center transform rotate-45 shadow-xl">
                                        <div className="transform -rotate-45">
                                            <Play className="w-10 h-10 text-white fill-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Video controls */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 to-transparent p-4">
                                <div className="flex items-center justify-between text-white text-sm">
                                    <span>{t("title")}</span>
                                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                        <Settings className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {course.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.totalDuration || "12 giờ"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{course.sections?.length || 0} phần</span>
                                </div>
                                {course.level && (
                                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                                        {course.level}
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        Mô tả khóa học
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        {course.description || currentModule?.description}
                                    </p>
                                </div>

                                {currentModule?.targetSection &&
                                    currentModule.targetSection.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Mục tiêu học tập
                                            </h4>
                                            <ul className="space-y-2">
                                                {currentModule.targetSection.map((target, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-2 text-gray-700"
                                                    >
                                                        <span className="text-blue-600 mt-1">•</span>
                                                        <span>{target}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                {course.requirements && course.requirements.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            Yêu cầu
                                        </h4>
                                        <ul className="space-y-2">
                                            {course.requirements.map((req, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2 text-gray-700"
                                                >
                                                    <span className="text-blue-600 mt-1">•</span>
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Modules List - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:block lg:w-[370px] lg:flex-shrink-0">
                    <CourseDetailModules
                        modules={course.sections || []}
                        courseId={course.id}
                        selectedModuleId={selectedModuleId}
                        onModuleSelect={setSelectedModuleId}
                    />
                </div>
            </div>

            {/* Mobile Modules List */}
            <div className="lg:hidden mt-4">
                <CourseDetailModules
                    modules={course.sections || []}
                    courseId={course.id}
                    selectedModuleId={selectedModuleId}
                    onModuleSelect={setSelectedModuleId}
                />
            </div>
        </div>
    );
}
