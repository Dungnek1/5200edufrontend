"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { studentCourseService } from "@/services/apis";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getAvatarUrl } from "@/utils/media";

import { useTranslations } from "next-intl";
import { LoadingOverlay } from "@/components/shared/loading-overlay";

import { logger } from '@/lib/logger';
import { EnrolledCourse } from "@/types/enrollment";
export default function MyCoursesPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "vi";
  const { user } = useAuth();
  const t = useTranslations();

  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "all" | "in-progress" | "completed"
  >("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await studentCourseService.getMyCourses();
        const coursesData = Array.isArray(response.data) ? response.data : [];
        setCourses(coursesData);
      } catch (error) {
        logger.error("Failed to fetch enrolled courses:", error);
        toast.error(t("page.student.courses.cannotLoadCourses"));
        setCourses([]); // Ensure empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const displayCourses = courses || [];

  return (
    <LoadingOverlay loading={loading} fullScreen>

      <section className="w-full bg-[#eceffd] pb-0 pt-0">
        <div className="px-4 md:px-6 lg:px-16">
          <div className="overflow-hidden rounded-t-2xl bg-white">

            <div className="relative h-40 md:h-44 lg:h-48 w-full bg-[#eceffd]">
            </div>


            <div className="relative z-10 -mt-6 bg-[#FFFFFF] px-6 pb-4 pt-3 md:-mt-8 md:px-8 md:pb-5 md:pt-4">

              <div className="absolute left-6 -top-10 sm:-top-12 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#ffefe7] shadow-sm ring-4 ring-white">
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


              <div className="pl-24 sm:pl-32">
                <h1
                  className="text-lg font-medium text-[#3b3d48]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {user?.fullName || user?.email || t("page.student.courses.user")}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-[#FFFFFF] pb-12 pt-4">
        <div className="">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)]">

            <section className="space-y-4">
              <Card className="border-none shadow-none">
                <CardHeader className="pb-2 pt-0">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#0a0a0a]">
                      {t("page.student.courses.myCourses")}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">

                  <div className="w-full">
                    <div className="border-b border-[#dbdde5]">
                      <div className="flex gap-6">
                        {(["all", "in-progress", "completed"] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`relative -mb-px border-b-2 px-0 pb-3 pt-0 text-sm font-normal rounded-none transition-all duration-300 ease-out ${
                              activeTab === tab
                                ? "border-[#4162e7] text-[#1b2961]"
                                : "border-transparent text-[#3b3d48]"
                            }`}
                          >
                            {tab === "all" && t("page.student.courses.allCourses")}
                            {tab === "in-progress" && t("page.student.courses.inProgress")}
                            {tab === "completed" && t("page.student.courses.completed")}
                          </button>
                        ))}
                      </div>
                    </div>

                    {activeTab === "all" && (
                      <div className="mt-4">
                        {displayCourses.length > 0 ? (
                          <CoursesGrid
                            courses={displayCourses}
                            locale={locale}
                          />
                        ) : (
                          <p className="text-center text-sm text-[#7f859d]">
                            {t("page.student.courses.noCourses")}
                          </p>
                        )}
                      </div>
                    )}
                    {activeTab === "in-progress" && (
                      <div className="mt-4">
                        {displayCourses.filter(
                          (c: any) => c.progress > 0 && c.progress < 100
                        ).length > 0 ? (
                          <CoursesGrid
                            courses={displayCourses.filter(
                              (c: any) => c.progress > 0 && c.progress < 100
                            )}
                            locale={locale}
                          />
                        ) : (
                          <p className="text-center text-sm text-[#7f859d]">
                            {t("page.student.courses.noInProgress")}
                          </p>
                        )}
                      </div>
                    )}
                    {activeTab === "completed" && (
                      <div className="mt-4">
                        {displayCourses.filter((c: any) => c.progress === 100)
                          .length > 0 ? (
                          <CoursesGrid
                            courses={displayCourses.filter(
                              (c: any) => c.progress === 100
                            )}
                            locale={locale}
                          />
                        ) : (
                          <p className="text-center text-sm text-[#7f859d]">
                            {t("page.student.courses.noCompleted")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>


            <aside className="space-y-4">

              <div className="pt-[40px]">
                <div className="mb-3">
                  <h3 className="text-base font-medium text-[#0a0a0a]">
                    {t("page.student.profile.assignments")}
                  </h3>
                </div>
                <p className="text-xs text-[#7f859d]">
                  {t("page.student.profile.noAssignments")}{" "}
                  {t("page.student.profile.noAssignmentsContinue")}
                </p>
              </div>


              <div>
                <div className="mb-3">
                  <h3 className="text-base font-medium text-[#0a0a0a]">
                    {t("page.student.profile.recentActivity")}
                  </h3>
                </div>
                <p className="text-xs text-[#7f859d]">
                  {t("page.student.profile.noRecentActivity")}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </LoadingOverlay>
  );
}

type Course = EnrolledCourse;

function CoursesGrid({
  courses,
  locale,
}: {
  courses: Course[];
  locale: string;
}) {
  const t = useTranslations();
  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
      {courses.map((course) => (
        <Card
          key={course.id}
          className="flex h-full flex-col overflow-hidden border border-[#dbdde5] bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)]"
        >
          <div className="relative h-32 w-full bg-[#dbdde5]" />
          <CardContent className="flex flex-1 flex-col gap-2 p-3">
            <Badge
              variant="outline"
              className="w-fit border-[#4162e7] bg-[#eceffd] px-2 py-0.5 text-[10px] font-medium text-[#4162e7]"
            >
              {(course as any).status || t("page.student.courses.status")}
            </Badge>
            <h3 className="line-clamp-2 text-sm font-semibold text-[#1b1c21]">
              {(course as any).title ||
                (course as any).name ||
                t("page.student.courses.course")}
            </h3>
            <p className="text-[11px] text-[#7f859d]">
              {(course as any).teacher || ""}
            </p>

            <div className="mt-1 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#7f859d]">
                <span>
                  {(course as any).lessonsDone || 0}/
                  {(course as any).lessonsTotal || 0}{" "}
                  {t("page.student.courses.lessons")}
                </span>
                <span className="font-medium text-[#4162e7]">
                  {(course as any).progress || 0}%
                </span>
              </div>
              <Progress
                value={(course as any).progress || 0}
                className="h-2 overflow-hidden rounded-full bg-[#e2e7ff]"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <Button
                asChild
                size="sm"
                className="h-8 flex-1 gap-1 text-xs"
                variant="default"
              >
                <Link href={`/${locale}/student/courses/${course.id}/modules/first`}>
                  <PlayCircle className="h-3.5 w-3.5" />
                  {t("page.student.courses.continueLearning")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
