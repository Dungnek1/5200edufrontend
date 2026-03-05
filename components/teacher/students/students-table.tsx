"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  currentModule: string;
  courseName: string;
  assignments: string;
}

export type StudentsTableVariant = "default" | "courseDetail";

interface StudentsTableProps {
  students: Student[];
  loading?: boolean;
  onViewStudent: (studentId: string) => void;
  variant?: StudentsTableVariant;
  /** Chỉ dùng khi variant="courseDetail": tiêu đề section (vd. "Danh sách học viên") */
  sectionTitle?: string;
  /** Chỉ dùng khi variant="courseDetail": callback khi bấm nút Chấm bài */
  onGradeClick?: () => void;
  /** Chỉ dùng khi variant="courseDetail": label link "Xem thêm" (phân trang: sang trang sau) */
  viewMoreLabel?: string;
  /** Chỉ dùng khi variant="courseDetail": callback khi bấm "Xem thêm" (thường gọi handlePageChange(currentPage + 1)) */
  onViewMore?: () => void;
  /** Chỉ dùng khi variant="courseDetail": có trang sau thì mới hiện "Xem thêm" */
  hasNextPage?: boolean;
  /** Chỉ dùng khi variant="courseDetail": đang ở trang > 1 thì hiện "Về trang đầu" */
  currentPage?: number;
  totalPages?: number;
  /** Chỉ dùng khi variant="courseDetail": callback khi bấm "Về trang đầu" */
  onGoToFirstPage?: () => void;
}

export function StudentsTable({
  students,
  loading = false,
  onViewStudent,
  variant = "default",
  sectionTitle,
  onGradeClick,
  viewMoreLabel,
  onViewMore,
  hasNextPage = true,
  currentPage,
  totalPages,
  onGoToFirstPage,
}: StudentsTableProps) {
  const tDetail = useTranslations("teacherCourseDetail");
  const viewIconOnly = variant === "courseDetail";
  const compactColumns = variant === "courseDetail";
  const showCardHeader = compactColumns && (sectionTitle != null || onGradeClick != null);
  const showViewMore = compactColumns && hasNextPage && viewMoreLabel != null && onViewMore != null;
  const showBackToFirst = compactColumns && currentPage != null && currentPage > 1 && onGoToFirstPage != null;
  const showPaginationFooter = showViewMore || showBackToFirst;
  return (
    <div className="bg-white border border-[#f4f4f7] rounded-[8px] sm:rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] overflow-hidden w-full flex flex-col">
      {showCardHeader && (
        <div className="flex items-center justify-between gap-4 px-3 sm:px-[16px] py-3 sm:py-4 border-b border-[#f4f4f7]">
          {sectionTitle ? (
            <h3
              className="text-lg sm:text-xl font-medium text-[#0f172a]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
            >
              {sectionTitle}
            </h3>
          ) : <span />}
          {onGradeClick && (
            <Button
              type="button"
              onClick={onGradeClick}
              className="h-8 sm:h-[36px] px-3 sm:px-[12px] bg-[#4162e7] hover:bg-[#4162e7]/90 text-white text-xs sm:text-[14px] font-medium rounded-[6px] cursor-pointer shrink-0"
            >
              {tDetail("gradeAssignments")}
            </Button>
          )}
        </div>
      )}
      <div className={`flex flex-col overflow-x-auto ${compactColumns ? "min-w-0 w-full" : "min-w-[800px]"}`}>
        <TableHeader compact={compactColumns} />
        <TableBody
          students={students}
          loading={loading}
          onViewStudent={onViewStudent}
          viewIconOnly={viewIconOnly}
          compactColumns={compactColumns}
        />
      </div>
      {showPaginationFooter && (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 sm:pt-4 pb-3 sm:pb-4 border-t border-[#f4f4f7]">
          {showBackToFirst && (
            <button
              type="button"
              onClick={onGoToFirstPage}
              className="text-[14px] sm:text-[16px] font-medium text-[#4162e7] hover:underline cursor-pointer"
            >
              {tDetail("backToFirstPage")}
            </button>
          )}
          {currentPage != null && totalPages != null && totalPages > 1 && (
            <span className="text-[14px] text-[#7f859d]">
              {tDetail("pageOf", { current: currentPage, total: totalPages })}
            </span>
          )}
          {showViewMore && (
            <button
              type="button"
              onClick={onViewMore}
              className="text-[14px] sm:text-[16px] font-medium text-[#4162e7] hover:underline cursor-pointer"
            >
              {viewMoreLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface TableHeaderProps {
  compact?: boolean;
}

function TableHeader({ compact = false }: TableHeaderProps) {
  const t = useTranslations("teacher.students.table");
  if (compact) {
    return (
      <div className="border-b border-[#f4f4f7] min-h-[48px] sm:min-h-[56px] flex items-center px-3 sm:px-[16px] py-2 sm:py-[12px]">
        <HeaderCell width="min-w-[180px] flex-1">{t("student")}</HeaderCell>
        <HeaderCell width="w-[160px] sm:w-[200px]" align="center">{t("progress")}</HeaderCell>
        <HeaderCell width="w-[100px] sm:w-[120px]" align="center">{t("assignment")}</HeaderCell>
        <div className="w-[60px] sm:w-[72px] px-2 sm:px-[12px] flex-shrink-0" />
      </div>
    );
  }
  return (
    <div className="border-b border-[#f4f4f7] min-h-[48px] sm:min-h-[56px] flex items-center px-3 sm:px-[16px] py-2 sm:py-[12px]">
      <HeaderCell width="w-[200px]">{t("student")}</HeaderCell>
      <HeaderCell width="w-[140px]" align="center">{t("progress")}</HeaderCell>
      <HeaderCell width="flex-1" align="center">{t("studying")}</HeaderCell>
      <HeaderCell width="flex-1" align="center">{t("courseName")}</HeaderCell>
      <HeaderCell width="flex-1" align="center">{t("assignment")}</HeaderCell>
      <div className="w-[100px] sm:w-[120px] px-2 sm:px-[12px]" />
    </div>
  );
}

interface HeaderCellProps {
  children: React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

function HeaderCell({ children, width = "flex-1", align = "left" }: HeaderCellProps) {
  const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "";

  return (
    <div className={`${width} px-2 sm:px-[12px]`}>
      <p className={`text-sm sm:text-[16px] leading-5 sm:leading-[24px] text-[#7f859d] ${alignClass}`}>
        {children}
      </p>
    </div>
  );
}

interface TableBodyProps {
  students: Student[];
  loading: boolean;
  onViewStudent: (studentId: string) => void;
  viewIconOnly?: boolean;
  compactColumns?: boolean;
}

function TableBody({ students, loading, onViewStudent, viewIconOnly = false, compactColumns = false }: TableBodyProps) {
  const t = useTranslations("teacher.students");
  if (loading) {
    return (
      <div className="h-[64px] flex items-center justify-center">
        <p className="text-[#7f859d]">{t("loading")}</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="h-[64px] flex items-center justify-center">
        <p className="text-[#7f859d]">{t("noStudents")}</p>
      </div>
    );
  }

  return (
    <>
      {students.map((student, index) => (
        <StudentRow
          key={index}
          student={student}
          onViewStudent={onViewStudent}
          viewIconOnly={viewIconOnly}
          compactColumns={compactColumns}
        />
      ))}
    </>
  );
}

interface StudentRowProps {
  student: Student;
  onViewStudent: (studentId: string) => void;
  viewIconOnly?: boolean;
  compactColumns?: boolean;
}

function StudentRow({ student, onViewStudent, viewIconOnly = false, compactColumns = false }: StudentRowProps) {
  if (compactColumns) {
    return (
      <div className="border-b border-[#f4f4f7] min-h-[56px] sm:min-h-[64px] flex items-center px-3 sm:px-[16px] py-2 sm:py-[12px] hover:bg-[#eceffd] transition-colors">
        <StudentInfoCell name={student.name} email={student.email} compact />
        <ProgressCell progress={student.progress} compact />
        <TextCell text={student.assignments} compact />
        <ActionCell
          studentId={student.id}
          onViewStudent={onViewStudent}
          viewIconOnly={viewIconOnly}
        />
      </div>
    );
  }
  return (
    <div className="border-b border-[#f4f4f7] min-h-[56px] sm:min-h-[64px] flex items-center px-3 sm:px-[16px] py-2 sm:py-[12px] hover:bg-[#eceffd] transition-colors">
      <StudentInfoCell name={student.name} email={student.email} />
      <ProgressCell progress={student.progress} />
      <ModuleCell moduleName={student.currentModule} />
      <TextCell text={student.courseName} />
      <TextCell text={student.assignments} />
      <ActionCell
        studentId={student.id}
        onViewStudent={onViewStudent}
        viewIconOnly={viewIconOnly}
      />
    </div>
  );
}

interface StudentInfoCellProps {
  name: string;
  email: string;
  compact?: boolean;
}

function StudentInfoCell({ name, email, compact = false }: StudentInfoCellProps) {
  return (
    <div className={`px-2 sm:px-[12px] ${compact ? "min-w-[180px] flex-1" : "w-[200px]"}`}>
      <p className="text-xs sm:text-[14px] font-medium leading-4 sm:leading-[20px] text-[#3b3d48] mb-[2px]">
        {name}
      </p>
      <p className="text-[11px] sm:text-[12px] leading-[14px] sm:leading-[16px] text-[#7f859d]">
        {email}
      </p>
    </div>
  );
}

interface ProgressCellProps {
  progress: number;
  compact?: boolean;
}

function ProgressCell({ progress, compact = false }: ProgressCellProps) {
  const widthClass = compact ? "w-[160px] sm:w-[200px] flex-shrink-0" : "w-[140px]";
  return (
    <div className={`${widthClass} px-2 sm:px-[12px]`}>
      <div className="flex gap-1 sm:gap-[8px] items-center justify-center">
        <div className="bg-[#dbdde5] h-[6px] sm:h-[8px] rounded-full w-[40px] sm:w-[60px] flex-1 max-w-[80px] relative overflow-hidden">
          <div
            className="bg-[#4162e7] h-[6px] sm:h-[8px] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm sm:text-[16px] leading-5 sm:leading-[24px] text-[#3b3d48] w-[30px] sm:w-[34px] flex-shrink-0">
          {progress}%
        </span>
      </div>
    </div>
  );
}

interface ModuleCellProps {
  moduleName: string;
}

function ModuleCell({ moduleName }: ModuleCellProps) {
  return (
    <div className="flex-1 px-2 sm:px-[12px]">
      <div className="flex justify-center">
        <span className="bg-[#eceffd] text-[#2e46a4] px-2 sm:px-[12px] py-[2px] rounded-[6px] sm:rounded-[8px] text-xs sm:text-[14px] leading-4 sm:leading-[20px]">
          {moduleName}
        </span>
      </div>
    </div>
  );
}

interface TextCellProps {
  text: string;
  compact?: boolean;
}

function TextCell({ text, compact = false }: TextCellProps) {
  return (
    <div className={`px-2 sm:px-[12px] ${compact ? "w-[100px] sm:w-[120px] flex-shrink-0" : "flex-1"}`}>
      <p className="text-sm sm:text-[16px] leading-5 sm:leading-[24px] text-[#3b3d48] text-center">
        {text}
      </p>
    </div>
  );
}

interface ActionCellProps {
  studentId: string;
  onViewStudent: (studentId: string) => void;
  viewIconOnly?: boolean;
}

function ActionCell({ studentId, onViewStudent, viewIconOnly = false }: ActionCellProps) {
  const widthClass = viewIconOnly ? "w-[60px] sm:w-[72px]" : "w-[100px] sm:w-[120px]";
  return (
    <div className={`${widthClass} flex-shrink-0 px-2 sm:px-[12px]`}>
      <div className="flex justify-end">
        {viewIconOnly ? (
          <button
            type="button"
            onClick={() => onViewStudent(studentId)}
            className="p-1.5 sm:p-2 rounded-[6px] text-[#4162e7] hover:bg-[#eceffd] transition-colors cursor-pointer"
            aria-label="Xem"
          >
            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        ) : (
          <Button
            onClick={() => onViewStudent(studentId)}
            className="bg-[#4162e7] hover:bg-[#4162e7]/90 h-8 sm:h-[32px] px-3 sm:px-[16px] py-1 sm:py-[8px] rounded-[6px] cursor-pointer"
          >
            <div className="flex gap-1 sm:gap-[4px] items-center">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              <span className="text-xs sm:text-[14px] font-medium leading-4 sm:leading-[20px] text-white">
                Xem
              </span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
