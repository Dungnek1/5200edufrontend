"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Clock,
  PlayCircle,
  FileText,
  CheckCircle2,
  Eye,

} from "lucide-react";
import { studentCourseService } from "@/services/apis";
import { useAuth } from "@/hooks/useAuth";
import { getAvatarUrl } from "@/utils/media";

import { useTranslations } from "next-intl";
import type { EnrolledCourse } from "@/types/enrollment";

export default function MyCoursesPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "vi";
  const { user } = useAuth();
  const t = useTranslations();
  const tc = useTranslations("page.student.courses");

  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "all" | "in-progress" | "completed"
  >("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await studentCourseService.getMyCourses();

        setCourses(response.data || []);
      } catch (error) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const displayCourses = courses || [];
  const coursesCount = displayCourses.length;

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      <div className="lg:hidden pb-8">
        <div className="px-4 sm:px-6 space-y-4 sm:space-y-6">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-[#ffefe7] flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user.fullName || ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl sm:text-3xl">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "👤"}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1
                className="text-base sm:text-lg font-bold text-[#3b3d48] truncate"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {user?.fullName ||
                  user?.email ||
                  t("page.student.courses.user")}
              </h1>
              <p
                className="text-xs sm:text-sm text-[#8c92ac]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("page.student.courses.studentRole")},{" "}
                {t("page.student.courses.hasCourses", {
                  count: coursesCount,
                })}
              </p>
            </div>
          </div>


          <div className="flex items-center justify-between">
            <h2
              className="text-lg sm:text-xl font-bold text-[#3b3d48]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.courses.myCourses")}
            </h2>
            <button className="text-sm sm:text-base text-[#4162e7] font-medium">
              {t("page.student.courses.filter")}
            </button>
          </div>


          {recentActivities && recentActivities.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <h3
                className="text-base sm:text-lg font-medium text-[#3b3d48]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("page.student.courses.recentActivity")}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 sm:gap-4"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color === "red"
                        ? "bg-red-100"
                        : activity.color === "green"
                          ? "bg-green-100"
                          : activity.color === "orange"
                            ? "bg-orange-100"
                            : "bg-blue-100"
                        }`}
                    >
                      {activity.icon === "play" && (
                        <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      )}
                      {activity.icon === "check" && (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      )}
                      {activity.icon === "file" && (
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm sm:text-base font-normal text-[#3b3d48]"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {activity.text}
                      </p>
                      <p
                        className="text-xs sm:text-sm text-[#8c92ac] mt-0.5"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-sm sm:text-base text-[#4162e7] font-medium">
                {t("page.student.courses.seeMore")}
              </button>
            </div>
          )}


          <div className="flex gap-4 sm:gap-6 border-b border-[#dbdde5]">
            <button
              onClick={() => setActiveTab("all")}
              className={`relative pb-3 text-sm sm:text-base transition-colors cursor-pointer ${activeTab === "all"
                ? "font-medium text-[#4162e7] border-b-2 border-[#4162e7]"
                : "font-normal text-[#3b3d48]"
                }`}
            >
              {t("page.student.courses.allCourses")}
            </button>
            <button
              onClick={() => setActiveTab("in-progress")}
              className={`relative pb-3 text-sm sm:text-base transition-colors cursor-pointer ${activeTab === "in-progress"
                ? "font-medium text-[#4162e7] border-b-2 border-[#4162e7]"
                : "font-normal text-[#3b3d48]"
                }`}
            >
              {t("page.student.courses.inProgress")}
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`relative pb-3 text-sm sm:text-base transition-colors cursor-pointer ${activeTab === "completed"
                ? "font-medium text-[#4162e7] border-b-2 border-[#4162e7]"
                : "font-normal text-[#3b3d48]"
                }`}
            >
              {t("page.student.courses.completed")}
            </button>
          </div>


          {(() => {
            const filteredCourses = displayCourses.filter((c: any) => {
              const progress = c.progress ?? 0;
              if (activeTab === "in-progress") {
                return progress > 0 && progress < 100;
              } else if (activeTab === "completed") {
                return progress === 100;
              }
              return true;
            });

            return filteredCourses.length > 0 ? (
              <div className="space-y-4 sm:space-y-5">
                {filteredCourses.map((course) => (
                  <MobileCourseCard
                    key={course.id}
                    course={course}
                    locale={locale}
                    t={t}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p
                  className="text-sm sm:text-base text-[#8c92ac]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {activeTab === "in-progress"
                    ? t("page.student.courses.noInProgressCourses")
                    : activeTab === "completed"
                      ? t("page.student.courses.noCompletedCourses")
                      : t("page.student.courses.noCoursesMessage")}
                </p>
              </div>
            );
          })()}
        </div>
      </div>


      <div className="hidden lg:block overflow-x-hidden">

        <section className="w-full bg-[#eceffd] pb-0 pt-0">
          <div className="px-4 sm:px-6 md:px-6 lg:px-16">
            <div className="overflow-hidden rounded-t-2xl bg-white">

              <div className="relative h-40 w-full bg-[#eceffd] sm:h-44 md:h-48" />
            </div>


            <div className="relative z-10 -mt-6 bg-[#FFFFFF] px-6 pb-4 pt-3 md:-mt-8 md:px-8 md:pb-5 md:pt-4">

              <div className="absolute left-6 -top-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#ffefe7] shadow-sm ring-4 ring-white md:-top-12 md:h-24 md:w-24">
                {user?.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={user.fullName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl md:text-4xl">👤</span>
                )}
              </div>


              <div className="pl-24 sm:pl-24 md:pl-32">
                <h1
                  className="text-base sm:text-lg font-medium text-[#3b3d48]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {user?.fullName ||
                    user?.email ||
                    t("page.student.courses.user")}
                </h1>
                <p
                  className="text-xs sm:text-sm text-[#8c92ac]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#FFFFFF] pb-12 pt-4">
          <div className="px-4 sm:px-6 lg:px-16">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)]">

              <section className="space-y-4">
                <Card className="border-none shadow-none">
                  <CardHeader className="pb-2 pt-0">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#0a0a0a]">
                        {t("page.courses.myCourses")}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Tabs defaultValue="all" className="w-full">
                      <div className="border-b border-[#dbdde5]">
                        <TabsList className="h-auto gap-6 rounded-none bg-transparent p-0">
                          <TabsTrigger
                            value="all"
                            className="relative -mb-px border-b-2 border-transparent px-0 pb-3 pt-0 text-sm font-normal rounded-none text-[#3b3d48] transition-all duration-200 ease-out cursor-pointer data-[state=active]:border-[#4162e7] data-[state=active]:text-[#1b2961] data-[state=active]:shadow-none"
                          >
                            {t("page.courses.allCourses")}
                          </TabsTrigger>
                          <TabsTrigger
                            value="in-progress"
                            className="relative -mb-px border-b-2 border-transparent px-0 pb-3 pt-0 text-sm font-normal rounded-none text-[#3b3d48] transition-all duration-200 ease-out cursor-pointer data-[state=active]:border-[#4162e7] data-[state=active]:text-[#1b2961] data-[state=active]:shadow-none"
                          >
                            {t("page.courses.continueLearning")}
                          </TabsTrigger>
                          <TabsTrigger
                            value="completed"
                            className="relative -mb-px border-b-2 border-transparent px-0 pb-3 pt-0 text-sm font-normal rounded-none text-[#3b3d48] transition-all duration-200 ease-out cursor-pointer data-[state=active]:border-[#4162e7] data-[state=active]:text-[#1b2961] data-[state=active]:shadow-none"
                          >
                            {t("common.completed")}
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="all" className="mt-4">
                        {displayCourses.length > 0 ? (
                          <CoursesGrid
                            courses={displayCourses}
                            locale={locale}
                          />
                        ) : (
                          <p className="text-center text-sm text-[#7f859d]">
                            {t("page.courses.noCourses")}
                          </p>
                        )}
                      </TabsContent>
                      <TabsContent value="in-progress" className="mt-4">
                        {displayCourses.filter(
                          (c: any) =>
                            (c.progress ?? 0) > 0 && (c.progress ?? 0) < 100
                        ).length > 0 ? (
                          <CoursesGrid
                            courses={displayCourses.filter(
                              (c: any) =>
                                (c.progress ?? 0) > 0 &&
                                (c.progress ?? 0) < 100
                            )}
                            locale={locale}
                          />
                        ) : (
                          <p className="text-center text-sm text-[#7f859d]">
                            {t("page.courses.noInProgress")}
                          </p>
                        )}
                      </TabsContent>
                      <TabsContent value="completed" className="mt-4">
                        {displayCourses.filter(
                          (c: any) => (c.progress ?? 0) === 100
                        ).length > 0 ? (
                          <CoursesGrid
                            courses={displayCourses.filter(
                              (c: any) => (c.progress ?? 0) === 100
                            )}
                            locale={locale}
                          />
                        ) : (
                          <p className="text-center text-sm text-[#7f859d]">
                            {t("page.courses.noCompleted")}
                          </p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </section>


              <aside className="space-y-4 lg:pt-[40px]">
                {/* Assignments - align với tabs, đẩy xuống để line align với tabs */}
                <div>
                  <div className="mb-3">
                    <h3 className="text-base font-medium text-[#0a0a0a]">
                      {t("page.student.courses.assignments")}
                    </h3>
                  </div>
                  <p className="text-xs text-[#7f859d]">
                    {t("page.student.courses.noAssignments")}
                  </p>
                </div>

                {/* Recent activity - align với Bài tập, bỏ panel */}
                <div>
                  <div className="mb-3">
                    <h3 className="text-base font-medium text-[#0a0a0a]">
                      {t("page.student.courses.recentActivity")}
                    </h3>
                  </div>
                  <p className="text-xs text-[#7f859d]">
                    {t("page.student.courses.noRecentActivity")}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


function MobileCourseCard({
  course,
  locale,
  t,
}: {
  course: EnrolledCourse;
  locale: string;
  t: any;
}) {
  const progress = course.progress ?? 0;
  const hasProgress = progress > 0;
  const lessonsDone = course.lessonsDone || 0;
  const lessonsTotal = course.lessonsTotal || 0;

  return (
    <Link href={`/${locale}/student/courses/${course.slug}`}
      key={course.id}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.05)]">

        <div className="relative w-full h-[170px] bg-[#dbdde5]">

          <img src={`${process.env.NEXT_PUBLIC_MINIO}/${course.thumbnailUrl}`} alt={course.title} className="w-full h-full" />

          {course.categoryIds && course.categoryIds.length > 0 && (
            <div className="absolute top-3 left-3">
              <span
                className="bg-[#0A0BD9] text-white text-xs sm:text-sm rounded-full shadow-sm tracking-wide flex items-center justify-center px-3 py-1"
              >
                {course.categoryIds[0] || t("course.defaultCategory")}
              </span>
            </div>
          )}
          {hasProgress && (
            <div className="absolute top-3 left-3 bg-[#4162e7] text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              Đang học
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-[4px] p-[12px]">

          <h3 className="line-clamp-2 text-[18px] font-semibold text-[#3B3D48]">
            {course.title || t("page.student.courses.course")}
          </h3>
          <p className="text-[16px] text-[#63687A]">
            {course.ownerTeacher?.fullName || ""}
          </p>


          <div className="flex items-center justify-start text-[11px] gap-[4px] text-[#7f859d]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_2898_2623)">
                <path d="M8.00001 10.0002C5.79087 10.0002 4.00001 8.2093 4.00001 6.00016V2.29646C4.00001 2.02056 4.00001 1.88261 4.04022 1.77215C4.10761 1.58697 4.25349 1.4411 4.43866 1.3737C4.54913 1.3335 4.68707 1.3335 4.96297 1.3335H11.037C11.3129 1.3335 11.4509 1.3335 11.5614 1.3737C11.7465 1.4411 11.8924 1.58697 11.9598 1.77215C12 1.88261 12 2.02056 12 2.29646V6.00016C12 8.2093 10.2091 10.0002 8.00001 10.0002ZM8.00001 10.0002V12.0002M12 2.66683H13.6667C13.9773 2.66683 14.1326 2.66683 14.2551 2.71758C14.4185 2.78524 14.5483 2.91502 14.6159 3.07837C14.6667 3.20089 14.6667 3.3562 14.6667 3.66683V4.00016C14.6667 4.62014 14.6667 4.93013 14.5985 5.18447C14.4136 5.87465 13.8745 6.41375 13.1843 6.59868C12.93 6.66683 12.62 6.66683 12 6.66683M4.00001 2.66683H2.33334C2.02272 2.66683 1.8674 2.66683 1.74489 2.71758C1.58154 2.78524 1.45175 2.91502 1.38409 3.07837C1.33334 3.20089 1.33334 3.3562 1.33334 3.66683V4.00016C1.33334 4.62014 1.33334 4.93013 1.40149 5.18447C1.58643 5.87465 2.12552 6.41375 2.81571 6.59868C3.07004 6.66683 3.38003 6.66683 4.00001 6.66683M4.96297 14.6668H11.037C11.2007 14.6668 11.3333 14.5342 11.3333 14.3705C11.3333 13.0614 10.2721 12.0002 8.96297 12.0002H7.03705C5.72793 12.0002 4.66668 13.0614 4.66668 14.3705C4.66668 14.5342 4.79933 14.6668 4.96297 14.6668Z" stroke="#8C92AC" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_2898_2623">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span>
              {course.lessonsDone || 0}/
              {course.lessonsTotal || 0}{" "}
              {t("page.student.courses.lessons")}
            </span>
            {/* <span className="font-medium text-[#4162e7]">
                  {course.progress || 0}%
                </span> */}
          </div>
          <Progress
            value={course.progress || 0}
          // className="h-2 overflow-hidden rounded-full bg-[#e2e7ff]"
          />


          {/* <div className="mt-3 flex items-center justify-between">
              <Button
                asChild
                size="sm"
                className="h-8 flex-1 gap-1 text-xs"
                variant="default"
              >
               
                  <PlayCircle className="h-3.5 w-3.5" />
                  {t("page.student.courses.continueLearning")}
                </Link>
              </Button>
            </div> */}
        </CardContent>
      </div>
    </Link>
  );
}

function CoursesGrid({
  courses,
  locale,
}: {
  courses: EnrolledCourse[];
  locale: string;
}) {
  const t = useTranslations();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Link href={`/${locale}/student/courses/${course.slug}`}
          key={course.id}
        >
          <Card

            className="flex h-full flex-col gap-[8px] overflow-hidden border border-[#dbdde5] bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)]"
          >




            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
              <img src={`${process.env.NEXT_PUBLIC_MINIO}/${course.thumbnailUrl}`} alt={course.title} className="w-full h-[162px] object-cover" />

              {course.categoryIds && course.categoryIds.length > 0 && (
                <div className="absolute top-3 left-3">
                  <span
                    className="bg-[#0A0BD9] text-white text-xs sm:text-sm rounded-full shadow-sm tracking-wide flex items-center justify-center px-3 py-1"
                  >
                    {course.categoryIds[0] || t("course.defaultCategory")}
                  </span>
                </div>
              )}

            </div>

            <CardContent className="flex flex-1 flex-col gap-[4px] px-[12px]">

              <h3 className="line-clamp-2 text-[18px] font-semibold text-[#3B3D48] h-[54px]">
                {course.title || t("page.student.courses.course")}
              </h3>
              <p className="text-[16px] text-[#63687A]">
                {course.ownerTeacher?.fullName || ""}
              </p>


              <div className="flex items-center justify-start text-[11px] gap-[4px] text-[#7f859d]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_2898_2623)">
                    <path d="M8.00001 10.0002C5.79087 10.0002 4.00001 8.2093 4.00001 6.00016V2.29646C4.00001 2.02056 4.00001 1.88261 4.04022 1.77215C4.10761 1.58697 4.25349 1.4411 4.43866 1.3737C4.54913 1.3335 4.68707 1.3335 4.96297 1.3335H11.037C11.3129 1.3335 11.4509 1.3335 11.5614 1.3737C11.7465 1.4411 11.8924 1.58697 11.9598 1.77215C12 1.88261 12 2.02056 12 2.29646V6.00016C12 8.2093 10.2091 10.0002 8.00001 10.0002ZM8.00001 10.0002V12.0002M12 2.66683H13.6667C13.9773 2.66683 14.1326 2.66683 14.2551 2.71758C14.4185 2.78524 14.5483 2.91502 14.6159 3.07837C14.6667 3.20089 14.6667 3.3562 14.6667 3.66683V4.00016C14.6667 4.62014 14.6667 4.93013 14.5985 5.18447C14.4136 5.87465 13.8745 6.41375 13.1843 6.59868C12.93 6.66683 12.62 6.66683 12 6.66683M4.00001 2.66683H2.33334C2.02272 2.66683 1.8674 2.66683 1.74489 2.71758C1.58154 2.78524 1.45175 2.91502 1.38409 3.07837C1.33334 3.20089 1.33334 3.3562 1.33334 3.66683V4.00016C1.33334 4.62014 1.33334 4.93013 1.40149 5.18447C1.58643 5.87465 2.12552 6.41375 2.81571 6.59868C3.07004 6.66683 3.38003 6.66683 4.00001 6.66683M4.96297 14.6668H11.037C11.2007 14.6668 11.3333 14.5342 11.3333 14.3705C11.3333 13.0614 10.2721 12.0002 8.96297 12.0002H7.03705C5.72793 12.0002 4.66668 13.0614 4.66668 14.3705C4.66668 14.5342 4.79933 14.6668 4.96297 14.6668Z" stroke="#8C92AC" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2898_2623">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <span>
                  {course.lessonsDone || 0}/
                  {course.lessonsTotal || 0}{" "}
                  {t("page.student.courses.lessons")}
                </span>
                {/* <span className="font-medium text-[#4162e7]">
                  {course.progress || 0}%
                </span> */}
              </div>
              <Progress
                value={course.progress || 0}
              // className="h-2 overflow-hidden rounded-full bg-[#e2e7ff]"
              />


              {/* <div className="mt-3 flex items-center justify-between">
              <Button
                asChild
                size="sm"
                className="h-8 flex-1 gap-1 text-xs"
                variant="default"
              >
               
                  <PlayCircle className="h-3.5 w-3.5" />
                  {t("page.student.courses.continueLearning")}
                </Link>
              </Button>
            </div> */}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
