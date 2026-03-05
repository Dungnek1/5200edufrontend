"use client";

import { useTranslations } from "next-intl";
import { useTeacherStudentsPage } from "@/hooks/use-teacher-students-page";
import type { CompletionStatus, SortOrder } from "@/hooks/use-teacher-students-page";
import { StudentsStatsCards } from "@/components/teacher/students/students-stats-cards";
import { StudentsTable } from "@/components/teacher/students/students-table";
import { StudentsSearchFilters } from "@/components/teacher/students/students-search-filters";
import { AssignmentsTable } from "@/components/teacher/students/assignments-table";
import { Pagination } from "@/lib/Pagination";
import { StudentsPageTabs } from "@/components/teacher/students/students-page-tabs";
import { TeacherStudentDetailModal } from "@/components/teacher/profile/teacher-student-detail-modal";

export default function TeacherStudentsPage() {
  const t = useTranslations("teacher.students");

  const {
    activeTab,
    currentPage,
    selectedStudentId,
    isModalOpen,
    students,
    loading,
    stats,
    assignments,
    totalPages,
    handleTabChange,
    handleViewStudent,
    handleCloseModal,
    handleGradeAssignment,
    handlePageChange,
    searchQuery,
    completionStatus,
    sortOrder,
    handleSearchChange,
    handleCompletionStatusChange,
    handleSortOrderChange,
  } = useTeacherStudentsPage();

  return (
    <>
      <main className="bg-white min-h-screen">
        <div className="bg-white max-w-[1990px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[64px] py-4 sm:py-5 md:py-[20px] pb-6 sm:pb-8 md:pb-[40px] flex flex-col gap-4 sm:gap-6 md:gap-[32px]">
          <PageTitle title={t("title")} />
          <SectionTitle title={t("overview")} />
          <StudentsStatsCards stats={stats} />
          <StudentsPageTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {activeTab === "students" ? (
            <StudentsTabContent
              students={students}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onViewStudent={handleViewStudent}
              onPageChange={handlePageChange}
              searchQuery={searchQuery}
              completionStatus={completionStatus}
              sortOrder={sortOrder}
              onSearchChange={handleSearchChange}
              onCompletionStatusChange={handleCompletionStatusChange}
              onSortOrderChange={handleSortOrderChange}
            />
          ) : (
            <AssignmentsTabContent
              assignments={assignments}
              currentPage={currentPage}
              totalPages={totalPages}
              onGradeAssignment={handleGradeAssignment}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>

      {selectedStudentId && isModalOpen && (() => {
        const selectedStudent = students.find((s) => s.id === selectedStudentId);
        return (
          <TeacherStudentDetailModal
            open={isModalOpen}
            onClose={handleCloseModal}
            student={{
              id: selectedStudentId,
              name: selectedStudent?.name || t("fallbackStudentName"),
              email: selectedStudent?.email || "",
              phone: "",
              avatar: "/images/avatars/Ellipse 29.png",
              course: {
                title: selectedStudent?.courseName || t("fallbackCourseTitle"),
                duration: t("filters.inProgress"),
                modules: 0,
                assignments: selectedStudent?.totalAssignments || 0,
              },
              overallProgress: selectedStudent?.progress || 0,
              completedAssignments: selectedStudent?.completedAssignments || 0,
              totalAssignments: selectedStudent?.totalAssignments || 0,
              modules: [],
            }}
          />
        );
      })()}
    </>
  );
}

function PageTitle({ title }: { title: string }) {
  return (
    <h1 className="text-xl sm:text-2xl md:text-[30px] font-medium leading-6 sm:leading-8 md:leading-[38px] text-[#0f172a]">
      {title}
    </h1>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xl sm:text-2xl md:text-[30px] font-medium leading-6 sm:leading-8 md:leading-[38px] text-[#0f172a]">
      {title}
    </h2>
  );
}

interface StudentsTabContentProps {
  students: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onViewStudent: (studentId: string) => void;
  onPageChange: (page: number) => void;
  searchQuery: string;
  completionStatus: CompletionStatus;
  sortOrder: SortOrder;
  onSearchChange: (q: string) => void;
  onCompletionStatusChange: (status: CompletionStatus) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

function StudentsTabContent({
  students,
  loading,
  currentPage,
  totalPages,
  onViewStudent,
  onPageChange,
  searchQuery,
  completionStatus,
  sortOrder,
  onSearchChange,
  onCompletionStatusChange,
  onSortOrderChange,
}: StudentsTabContentProps) {

  const t = useTranslations("teacher.students");
  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-[28px]">
      <h2 className="text-lg sm:text-xl md:text-[24px] font-medium leading-6 sm:leading-7 md:leading-[32px] text-[#0f172a]">
        {t("listTitle")}
      </h2>
      <StudentsSearchFilters
        type="students"
        searchQuery={searchQuery}
        completionStatus={completionStatus}
        sortOrder={sortOrder}
        onSearchChange={onSearchChange}
        onCompletionStatusChange={onCompletionStatusChange}
        onSortOrderChange={onSortOrderChange}
      />
      <StudentsTable
        students={students}
        loading={loading}
        onViewStudent={onViewStudent}
      />
      {totalPages > 0 && students.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

interface AssignmentsTabContentProps {
  assignments: any[];
  currentPage: number;
  totalPages: number;
  onGradeAssignment: (assignmentId: string) => void;
  onPageChange: (page: number) => void;
}

function AssignmentsTabContent({
  assignments,
  currentPage,
  totalPages,
  onGradeAssignment,
  onPageChange,
}: AssignmentsTabContentProps) {

  const t = useTranslations("teacher.students");
  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-[28px]">
      <h2 className="text-lg sm:text-xl md:text-[24px] font-medium leading-6 sm:leading-7 md:leading-[32px] text-[#0f172a]">
        {t("assignmentsListTitle")}
      </h2>
      <StudentsSearchFilters type="assignments" />
      <AssignmentsTable
        assignments={assignments}
        onGradeAssignment={onGradeAssignment}
      />
      {totalPages > 0 && assignments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
