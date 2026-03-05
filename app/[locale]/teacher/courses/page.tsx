"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  BookOpen,
  Users,
  DollarSign,
  Star,
  Search,
  Edit,
  FileText,
  ClipboardList,
  MoreVertical,
  ArrowRight,
  Sparkles,
  Coins,
  Presentation,
} from "lucide-react";
import teacherCourseService from "@/services/apis/teacher-course.service";
import type { Course } from "@/types/course";
import { EditCourseForm } from "@/components/teacher/edit-course-form";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ConsultationModal } from "@/components/modals/consultation-modal";

export default function InstructorCoursesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const t = useTranslations("teacher.courses");

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "PUBLISHED" | "DRAFT" | "hidden"
  >("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showConsultation, setShowConsultation] = useState(false);

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, [statusFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const statusParam = statusFilter === "all" ? undefined : statusFilter;
      const response = await teacherCourseService.listCourses(statusParam);

      if (response.success && response.data) {
        setCourses(response.data);
        calculateStats(response.data);
      }
    } catch (error) {
      toast.error(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (coursesData: Course[]) => {
    const totalCourses = coursesData.length;
    const totalStudents = coursesData.reduce(
      (sum, course) => sum + (course.enrolledCount || 0),
      0,
    );
    const totalRevenue = coursesData.reduce((sum, course) => {
      const revenue = (course.price || 0) * (course.enrolledCount || 0);
      return sum + revenue;
    }, 0);
    const averageRating =
      coursesData.length > 0
        ? coursesData.reduce((sum, course) => sum + (course.averageRating || 0), 0) /
        coursesData.length
        : 0;

    setStats({
      totalCourses,
      totalStudents,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      !searchQuery ||
      (course.title?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleCreateCourse = () => {
    router.push(`/${locale}/teacher/courses/create`);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditMode(true);
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      await teacherCourseService.publishCourse(courseId);
      toast.success(t("actions.publishSuccess"));
      setCourses((prev) => {
        const updated = prev.map((c) =>
          c.id === courseId ? { ...c, status: "PUBLISHED" as const } : c,
        );
        calculateStats(updated);
        return updated;
      });
      fetchCourses();
    } catch {
      toast.error(t("actions.publishFailed"));
    }
  };

  const handleUnpublishCourse = async (courseId: string) => {
    try {
      await teacherCourseService.unpublishCourse(courseId);
      toast.success(t("actions.unpublishSuccess"));
      setCourses((prev) => {
        const updated = prev.map((c) =>
          c.id === courseId ? { ...c, status: "DRAFT" as const } : c,
        );
        calculateStats(updated);
        return updated;
      });
      fetchCourses();
    } catch {
      toast.error(t("actions.unpublishFailed"));
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm(t("actions.deleteConfirm"))) return;
    try {
      await teacherCourseService.deleteCourse(courseId);
      toast.success(t("actions.deleteSuccess"));
      fetchCourses();
    } catch {
      toast.error(t("actions.deleteFailed"));
    }
  };

  const handleHideCourse = async (courseId: string) => {
    try {
      await teacherCourseService.unpublishCourse(courseId);
      toast.success(t("actions.hideSuccess"));
      setCourses((prev) => {
        const updated = prev.map((c) =>
          c.id === courseId ? { ...c, status: "DRAFT" as const } : c,
        );
        calculateStats(updated);
        return updated;
      });
      fetchCourses();
    } catch {
      toast.error(t("actions.hideFailed"));
    }
  };

  return (
    <>
      {isEditMode && editingCourse ? (
        <EditCourseForm
          courseId={editingCourse.id}
          course={editingCourse}
          onCancel={() => {
            setIsEditMode(false);
            setEditingCourse(null);
          }}
          onSuccess={() => {
            fetchCourses();
            setIsEditMode(false);
            setEditingCourse(null);
          }}
        />
      ) : (
        <main className="min-h-screen bg-white">
          <div className="bg-white mx-auto max-w-[1990px] w-full px-4 sm:px-6 md:px-8 lg:px-[64px] py-4 sm:py-5 md:py-[20px] pb-6 sm:pb-8 md:pb-[40px] flex flex-col gap-4 sm:gap-6 lg:gap-[28px]">
            {/* Banner */}
            <section className="relative w-full overflow-hidden rounded-lg sm:rounded-[12px] bg-[#3b59d2] h-auto min-h-[160px] sm:h-[180px] md:h-[200px] flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-[44px] py-4 sm:py-6 md:py-8 gap-4 sm:gap-6">
              <div className="flex flex-col gap-[12px] max-w-[589px]">
                <div className="flex flex-col gap-[4px] text-[#f4f4f7]">
                  <h1
                    className="text-xl sm:text-2xl md:text-[30px] leading-tight sm:leading-[32px] md:leading-[38px] font-medium text-white"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    {t("banner.title")}
                  </h1>
                  <p
                    className="text-sm sm:text-base md:text-[16px] leading-5 sm:leading-6 md:leading-[24px] not-italic"
                    style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                  >
                    {t("banner.description")}
                  </p>
                </div>
                <Button
                  className="h-[40px] sm:h-[44px] bg-white text-[#1b2961] hover:bg-white/90 px-3 sm:px-[16px] py-2 sm:py-[8px] font-medium rounded-full sm:rounded-[999px] transition-all shadow-sm w-full sm:w-auto min-w-[180px] sm:min-w-[226px] cursor-pointer"
                  onClick={() => setShowConsultation(true)}
                >
                  <div className="flex gap-2 sm:gap-[8px] items-center justify-center">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] font-medium">
                      {t("banner.designConsultation")}
                    </span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </Button>
              </div>
              <div className="hidden lg:block h-[285px] w-[211px] relative">
                <Image
                  src="/images/ui/Frame 2147227539.png"
                  alt="Banner graphic"
                  fill
                  className="object-contain"
                />
              </div>
            </section>

            {/* Main Content Area */}
            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-[28px]">
              <h2
                className="text-xl sm:text-2xl lg:text-[30px] leading-tight sm:leading-8 lg:leading-[38px] font-medium text-[#0f172a]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {t("title")}
              </h2>


              <section className="flex flex-col gap-4 sm:gap-6 lg:gap-[28px]">
                <h3
                  className="text-xl sm:text-2xl lg:text-[30px] leading-tight sm:leading-8 lg:leading-[38px] font-medium text-[#0f172a]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  {t("overview")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-[20px]">

                  <Card className="bg-white border border-[#c4cef8] rounded-lg sm:rounded-[8px] p-4 sm:p-5 lg:p-[20px] flex flex-col gap-2 sm:gap-3 lg:gap-[12px]">
                    <div className="bg-[#eceffd] rounded-full size-8 sm:size-[32px] flex items-center justify-center shrink-0">
                      <ClipboardList className="h-4 w-4 text-[#8c92ac]" />
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-[4px]">
                      <p
                        className="text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] text-[#7f859d]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("stats.totalCourses")}
                      </p>
                      <p
                        className="text-xl sm:text-2xl lg:text-[24px] leading-6 sm:leading-7 lg:leading-[32px] font-medium text-[#3b3d48]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {loading ? "..." : stats.totalCourses.toLocaleString()}
                      </p>
                    </div>
                  </Card>


                  <Card className="bg-white border border-[#c4cef8] rounded-lg sm:rounded-[8px] p-4 sm:p-5 lg:p-[20px] flex flex-col gap-2 sm:gap-3 lg:gap-[12px]">
                    <div className="bg-[#eceffd] rounded-full size-8 sm:size-[32px] flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-[#8c92ac]" />
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-[4px]">
                      <p
                        className="text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] text-[#7f859d]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("stats.totalStudents")}
                      </p>
                      <p
                        className="text-xl sm:text-2xl lg:text-[24px] leading-6 sm:leading-7 lg:leading-[32px] font-medium text-[#3b3d48]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {loading ? "..." : stats.totalStudents.toLocaleString()}
                      </p>
                    </div>
                  </Card>


                  <Card className="relative bg-white border border-[#c4cef8] rounded-lg sm:rounded-[8px] p-4 sm:p-5 lg:p-[20px] flex flex-col gap-2 sm:gap-3 lg:gap-[12px]">
                    <div className="absolute top-2 right-2">
                      <span className="bg-[#f59e0b] text-white text-[10px] px-2 py-1 rounded-full font-medium">{t("comingSoon")}</span>
                    </div>
                    <div className="bg-[#eceffd] rounded-full size-8 sm:size-[32px] flex items-center justify-center shrink-0">
                      <Image
                        src="/images/coins-stacked-01.png"
                        alt="Revenue"
                        width={16}
                        height={16}
                      />
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-[4px]">
                      <p
                        className="text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] text-[#7f859d]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("stats.revenueThisMonth")}
                      </p>
                      <p
                        className="text-xl sm:text-2xl lg:text-[24px] leading-6 sm:leading-7 lg:leading-[32px] font-medium text-[#3b3d48]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        0
                      </p>
                    </div>
                  </Card>



                  <Card className="bg-white border border-[#c4cef8] rounded-lg sm:rounded-[8px] p-4 sm:p-5 lg:p-[20px] flex flex-col gap-2 sm:gap-3 lg:gap-[12px]">
                    <div className="bg-[#eceffd] rounded-full size-8 sm:size-[32px] flex items-center justify-center shrink-0">
                      <Star className="h-4 w-4 text-[#8c92ac]" />
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-[4px]">
                      <p
                        className="text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] text-[#7f859d]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("stats.averageRating")}
                      </p>
                      <p
                        className="text-xl sm:text-2xl lg:text-[24px] leading-6 sm:leading-7 lg:leading-[32px] font-medium text-[#3b3d48]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {loading ? "..." : `${stats.averageRating}/5`}
                      </p>
                    </div>
                  </Card>
                </div>
              </section>


              <section className="flex flex-col gap-4 sm:gap-6 lg:gap-[28px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <h3
                    className="text-lg sm:text-xl lg:text-[24px] leading-6 sm:leading-7 lg:leading-[32px] font-medium text-[#0f172a]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    {t("yourCourses")}
                  </h3>
                  <Button
                    onClick={handleCreateCourse}
                    className="bg-[#4162e7] text-white hover:bg-[#3554d4] font-medium px-3 sm:px-4 lg:px-[16px] py-2 sm:py-[8px] h-[40px] sm:h-[44px] rounded-lg sm:rounded-[6px] w-full sm:w-auto cursor-pointer"
                  >
                    <div className="flex gap-2 sm:gap-[4px] items-center justify-center">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] font-medium">
                        {t("createNew")}
                      </span>
                    </div>
                  </Button>
                </div>

                <div className="flex flex-col gap-3 sm:gap-[12px]">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-[8px] items-stretch sm:items-center justify-end">
                    <div className="relative w-full sm:w-[280px] md:w-[320px] lg:w-[380px]">
                      <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 h-6 w-6 text-[#7f859d]" />
                      <Input
                        placeholder={t("searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-[44px] h-[40px] border-0 bg-[#fafafa] rounded-[8px] focus-visible:ring-offset-0 focus-visible:ring-[#4162e7] text-[14px] leading-[20px] cursor-pointer"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-[12px] items-center">
                      <button
                        onClick={() => setStatusFilter("all")}
                        className={cn(
                          "flex-1 sm:flex-none min-w-[80px] sm:min-w-[100px] px-3 sm:px-[12px] py-2 sm:py-[10px] rounded-lg sm:rounded-[8px] text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] transition-colors cursor-pointer",
                          statusFilter === "all"
                            ? "bg-[#eceffd] text-[#1b2961]"
                            : "bg-[#fafafa] border border-[#f4f4f7] text-[#3b3d48] hover:bg-[#eceffd] hover:border-[#4162e7]/30",
                        )}
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("filters.all")}
                      </button>
                      <button
                        onClick={() => setStatusFilter("PUBLISHED")}
                        className={cn(
                          "flex-1 sm:flex-none min-w-[80px] sm:min-w-[100px] px-3 sm:px-[12px] py-2 sm:py-[10px] rounded-lg sm:rounded-[8px] text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] transition-colors cursor-pointer",
                          statusFilter === "PUBLISHED"
                            ? "bg-[#eceffd] text-[#1b2961]"
                            : "bg-[#fafafa] border border-[#f4f4f7] text-[#3b3d48] hover:bg-[#eceffd] hover:border-[#4162e7]/30",
                        )}
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("filters.published")}
                      </button>
                      <button
                        onClick={() => setStatusFilter("DRAFT")}
                        className={cn(
                          "flex-1 sm:flex-none min-w-[80px] sm:min-w-[100px] px-3 sm:px-[12px] py-2 sm:py-[10px] rounded-lg sm:rounded-[8px] text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] transition-colors cursor-pointer",
                          statusFilter === "DRAFT"
                            ? "bg-[#eceffd] text-[#1b2961]"
                            : "bg-[#fafafa] border border-[#f4f4f7] text-[#3b3d48] hover:bg-[#eceffd] hover:border-[#4162e7]/30",
                        )}
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("filters.draft")}
                      </button>
                      <button
                        onClick={() => setStatusFilter("hidden")}
                        className={cn(
                          "flex-1 sm:flex-none min-w-[80px] sm:min-w-[100px] px-3 sm:px-[12px] py-2 sm:py-[10px] rounded-lg sm:rounded-[8px] text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] transition-colors cursor-pointer",
                          statusFilter === "hidden"
                            ? "bg-[#eceffd] text-[#1b2961]"
                            : "bg-[#fafafa] border border-[#f4f4f7] text-[#3b3d48] hover:bg-[#eceffd] hover:border-[#4162e7]/30",
                        )}
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("filters.hidden")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid */}
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4162e7]"></div>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <BookOpen className="h-8 w-8 text-[#94a3b8]" />
                    </div>
                    <p className="text-lg font-medium text-[#334155] mb-1">
                      {t("empty.title")}
                    </p>
                    <p className="text-sm text-[#64748b]">
                      {searchQuery || statusFilter !== "all"
                        ? t("empty.noResults")
                        : t("empty.getStarted")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-[20px]">
                    {filteredCourses.map((course) => (
                      <Card
                        key={course.id}
                        className="group bg-white rounded-[12px] overflow-hidden border-[0.5px] border-[#f4f4f7] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] hover:shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col w-full max-w-[400px] mx-auto sm:mx-0"
                      >

                        <Link
                          href={`/${locale}/teacher/courses/${course.id}?averageRating=${course.averageRating}&reviewCount=${course.reviewCount}`}
                        >
                          <div className="relative h-[200px] bg-[#dbdde5] overflow-hidden">
                            <img
                              src={`${process.env.NEXT_PUBLIC_MINIO}/${course.thumbnailUrl || "/images/placeholder.svg"}`}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {course.status === 'PUBLISHED' && (
                              <div className="absolute left-[12.5px] top-[12.5px] bg-[#eceffd] px-[12px] py-[2px] rounded-[8px]">
                                <p
                                  className="text-[14px] leading-[20px] text-[#2e46a4]"
                                  style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 400,
                                  }}
                                >
                                  {t("card.published")}
                                </p>
                              </div>
                            )}
                          </div>
                        </Link>


                        <div className="px-[16px] py-[16px] flex flex-col gap-[16px] flex-1">
                          {/* Title and Description */}
                          <div className="flex flex-col gap-[8px] min-h-[80px] sm:min-h-[100px]">
                            <h3
                              className="text-base sm:text-[18px] leading-5 sm:leading-[24px] font-medium text-[#3b3d48] line-clamp-2 min-h-[40px] sm:min-h-[48px]"
                              style={{
                                fontFamily: "Roboto, sans-serif",
                                fontWeight: 500,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                              title={course.title}
                            >
                              {course.title}
                            </h3>
                            <p
                              className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#8c92ac] line-clamp-2 min-h-[32px] sm:min-h-[40px]"
                              style={{
                                fontFamily: "Roboto, sans-serif",
                                fontWeight: 400,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {course.description || "Khóa học này sẽ giúp bạn nâng cao kỹ năng và kiến thức trong lĩnh vực này."}
                            </p>
                          </div>

                          {/* Metrics */}
                          <div className="flex flex-col gap-[8px]">
                            {/* Price and Rating Row */}
                            <div className="flex items-center justify-between gap-[8px]">
                              <div className="flex gap-[6px] items-center flex-1">
                                <DollarSign className="h-4 w-4 text-[#16a34a] flex-shrink-0" />
                                <p
                                  className="text-[12px] leading-[16px] font-medium text-[#3b3d48] truncate"
                                  style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500,
                                  }}
                                >
                                  {course.price === 0
                                    ? t("card.free")
                                    : `${(course.price || 0) / 1000000} ${t("card.million")}`}
                                </p>
                              </div>
                              <div className="flex gap-[6px] items-center flex-1">
                                <Star className="h-4 w-4 text-[#ff9500] fill-[#ff9500] flex-shrink-0" />
                                <p
                                  className="text-[12px] leading-[16px] font-medium text-[#3b3d48]"
                                  style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500,
                                  }}
                                >
                                  {course.averageRating?.toFixed(1) || "0.0"}/5
                                </p>
                              </div>
                            </div>

                            {/* Students and Completion Row */}
                            <div className="flex items-center justify-between gap-[8px]">
                              <div className="flex gap-[6px] items-center flex-1">
                                <Users className="h-4 w-4 text-[#2b7fff] flex-shrink-0" />
                                <p
                                  className="text-[12px] leading-[16px] font-medium text-[#3b3d48]"
                                  style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500,
                                  }}
                                >
                                  {course.reviewCount || 0}
                                </p>
                              </div>
                              {/* <div className="flex gap-[6px] items-center flex-1">
                                <Presentation className="h-4 w-4 text-[#3b3d48] flex-shrink-0" />
                                <p
                                  className="text-[12px] leading-[16px] font-medium text-[#3b3d48] truncate"
                                  style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500,
                                  }}
                                >
                                  {course.completionRate || 0}% {t("card.completion")}
                                </p>
                              </div> */}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mt-auto">
                            <Button
                              variant="outline"
                              className="flex-1 h-10 sm:h-[44px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white hover:border-[#4162e7] rounded-[6px] px-3 sm:px-[16px] py-2 sm:py-[8px] transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCourse(course);
                              }}
                            >
                              <div className="flex gap-1 sm:gap-[8px] items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 shrink-0 stroke-current">
                                  <path d="M11.1916 3.3004L4.00585 11.1529C3.73452 11.4511 3.47195 12.0385 3.41944 12.4451L3.0956 15.3729C2.98182 16.4301 3.71702 17.153 4.73229 16.9723L7.55056 16.4753C7.94442 16.403 8.49582 16.1048 8.76714 15.7976L15.9529 7.94505C17.1957 6.5896 17.7558 5.0444 15.8216 3.15582C13.896 1.28531 12.4344 1.94495 11.1916 3.3004Z" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <span
                                  className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] font-medium"
                                  style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500,
                                  }}
                                >
                                  {t("card.edit")}
                                </span>
                              </div>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-10 sm:h-[44px] w-10 sm:w-[44px] p-2 sm:p-[8px] rounded-[6px] hover:bg-[#eceffd] transition-colors cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-[#4162e7]" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px] rounded-[12px] shadow-lg border border-[#f4f4f7] p-1">
                                {course.status === "PUBLISHED" ? (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnpublishCourse(course.id);
                                    }}
                                    className="cursor-pointer text-[14px] font-medium rounded-[8px] px-3 py-2"
                                  >
                                    {t("actions.unpublish")}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePublishCourse(course.id);
                                    }}
                                    className="cursor-pointer text-[14px] font-medium rounded-[8px] px-3 py-2"
                                  >
                                    {t("actions.publish")}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleHideCourse(course.id);
                                  }}
                                  className="cursor-pointer text-[14px] font-medium rounded-[8px] px-3 py-2"
                                >
                                  {t("actions.hide")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCourse(course.id);
                                  }}
                                  className="cursor-pointer text-[14px] font-medium text-red-500 focus:text-red-500 rounded-[8px] px-3 py-2"
                                >
                                  {t("actions.delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      )}

      <ConsultationModal
        open={showConsultation}
        onClose={() => setShowConsultation(false)}
      />
    </>
  );
}
