"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import teacherStudentsService from "@/services/apis/teacher-students.service";
import { toast } from "sonner";

export interface StudentRow {
  id: string;
  name: string;
  email: string;
  progress: number;
  currentModule: string;
  courseName: string;
  /** Label hiển thị dạng "x/y" */
  assignments: string;
  /** Số bài tập đã hoàn thành (nếu backend trả về) */
  completedAssignments?: number;
  /** Tổng số bài tập trong khóa học (nếu backend trả về) */
  totalAssignments?: number;
}

export interface Assignment {
  id: string;
  title: string;
  module: string;
  courseName: string;
  totalSubmitted: number;
  pendingGrading: number;
}

export interface Stats {
  totalStudents: number;
  completionRate: number;
  pendingGrading: number;
}

export type CompletionStatus = 'all' | 'completed' | 'in-progress' | 'not-started';
export type SortOrder = 'high-to-low' | 'low-to-high';

export function useTeacherStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "vi";

  const [activeTab, setActiveTab] = useState<"students" | "assignments">("students");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    completionRate: 0,
    pendingGrading: 0,
  });
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  
  const [searchQuery, setSearchQuery] = useState("");
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("high-to-low");

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await teacherStudentsService.getTeacherStudents({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        completionStatus: completionStatus !== "all" ? completionStatus : "all",
      });

      if (response.success && response.data) {
        const arr = Array.isArray(response.data) ? response.data : [];

        const mappedStudents: StudentRow[] = arr.map(
          (enrollment: Record<string, any>) => {
            const overallProgressRaw = enrollment.overallProgress ?? 0;
            const currentSection = enrollment.currentSection as Record<string, any> | undefined;
            const completedAssignments =
              Number(
                enrollment.completedAssignments ??
                enrollment.completedAssignmentsCount ??
                0
              ) || 0;

            const totalAssignments =
              Number(
                enrollment.totalAssignments ??
                enrollment.assignments ??
                enrollment.totalAssignmentsCount ??
                (enrollment.enrolledCourse?.assignments as number | undefined) ??
                0
              ) || 0;

            const assignmentsLabel =
              totalAssignments > 0
                ? `${completedAssignments}/${totalAssignments}`
                : `${completedAssignments}/0`;

            return {
              id: String(enrollment.userId || ""),
              name: String(enrollment.fullName || "Unknown"),
              email: String(enrollment.email || ""),
              progress: parseInt(String(overallProgressRaw || 0)) || 0,
              currentModule: currentSection
                ? String(currentSection.sectionTitle || "Module 1")
                : "Module 1",
              courseName: String(enrollment.courseTitle || "Khóa học"),
              assignments: assignmentsLabel,
              completedAssignments,
              totalAssignments,
            };
          }
        );

        // Stack: trang 1 = thay thế, trang 2+ = append (gấp thêm vào danh sách)
        setStudents((prev) =>
          currentPage === 1 ? mappedStudents : [...prev, ...mappedStudents]
        );

        // Lấy total từ API (service trả về meta ở top-level) để tính totalPages và hiển thị "Xem thêm" đúng
        const limit = 10;
        const meta = (response as { meta?: { total?: number } }).meta;
        const totalFromApi = meta?.total != null ? Number(meta.total) : undefined;
        if (typeof totalFromApi === 'number' && !Number.isNaN(totalFromApi)) {
          setTotalStudents(totalFromApi);
          setTotalPages(Math.ceil(totalFromApi / limit));
        }
      }
    } catch (error) {
      toast.error("Không thể tải danh sách học viên");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, completionStatus]);

  // Apply sorting to students whenever data or sortOrder changes
  const sortedStudents = [...students].sort((a, b) => {
    if (sortOrder === "high-to-low") {
      return b.progress - a.progress;
    } else {
      return a.progress - b.progress;
    }
  });

  const fetchStats = useCallback(async () => {
    try {
      const response = await teacherStudentsService.getTeacherStats();
      if (response.success && response.data) {
        setStats(response.data);
        const studentsPerPage = 10;
        const calculatedPages = Math.ceil(
          (response.data.totalStudents || 0) / studentsPerPage
        );
        // Only set totalPages from stats if we don't have filter active
        if (!searchQuery && completionStatus === "all") {
          setTotalPages(calculatedPages);
          setTotalStudents(response.data.totalStudents || 0);
        }
      }
    } catch (error) {
      toast.error("Không thể tải thống kê");
    }
  }, [searchQuery, completionStatus]);

  const fetchAssignments = useCallback(async () => {
    try {
      const response = await teacherStudentsService.getTeacherAssignments({
        page: currentPage,
        limit: 10,
      });

      if (response.success && response.data) {
        const data = response.data.data || [];
        setAssignments(Array.isArray(data) ? data : []);

        if (response.data.pagination) {
          setTotalPages(Math.ceil(response.data.pagination.total / 10));
        }
      }
    } catch (error) {
      toast.error("Không thể tải danh sách bài tập");
      setAssignments([]);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    }
  }, [activeTab, fetchStudents]);

  useEffect(() => {
    if (activeTab === "assignments") {
      fetchAssignments();
    }
  }, [activeTab, fetchAssignments]);

  const handleTabChange = useCallback((tab: "students" | "assignments") => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handleViewStudent = useCallback((studentId: string) => {
    setSelectedStudentId(studentId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedStudentId(null);
  }, []);

  const handleGradeAssignment = useCallback((assignmentId: string) => {
    router.push(`/${locale}/teacher/students/assignments/${assignmentId}/grade`);
  }, [router, locale]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  const handleCompletionStatusChange = useCallback((status: CompletionStatus) => {
    setCompletionStatus(status);
    setCurrentPage(1);
  }, []);

  const handleSortOrderChange = useCallback((order: SortOrder) => {
    setSortOrder(order);
  }, []);

  return {
    activeTab,
    currentPage,
    selectedStudentId,
    isModalOpen,
    students: sortedStudents,
    loading,
    stats,
    assignments,
    totalPages,
    totalStudents,
    locale,
    searchQuery,
    completionStatus,
    sortOrder,

    handleTabChange,
    handleViewStudent,
    handleCloseModal,
    handleGradeAssignment,
    handlePageChange,
    handleSearchChange,
    handleCompletionStatusChange,
    handleSortOrderChange,
  };
}
