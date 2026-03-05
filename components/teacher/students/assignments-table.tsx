import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ClipboardCheck } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  module: string;
  courseName: string;
  totalSubmitted: number;
  pendingGrading: number;
}

interface AssignmentsTableProps {
  assignments: Assignment[];
  onGradeAssignment: (assignmentId: string) => void;
}

export function AssignmentsTable({
  assignments,
  onGradeAssignment,
}: AssignmentsTableProps) {
  return (
    <div className="bg-white border border-[#f4f4f7] rounded-[8px] sm:rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] overflow-x-auto px-3 sm:px-[16px] py-2 sm:py-[12px]">
      <div className="flex flex-col min-w-[700px]">
        <AssignmentsTableHeader />
        {assignments.map((assignment) => (
          <AssignmentRow
            key={assignment.id}
            assignment={assignment}
            onGrade={onGradeAssignment}
          />
        ))}
      </div>
    </div>
  );
}

function AssignmentsTableHeader() {
  const t = useTranslations("teacher");
  return (
    <div className="border-b-[0.5px] border-[#f4f4f7] min-h-[44px] sm:min-h-[52px] flex items-center justify-between">
      <HeaderCell width="w-[200px]">{t("assignments.table.assignmentTitle")}</HeaderCell>
      <HeaderCell width="flex-1" align="center">{t("assignments.table.module")}</HeaderCell>
      <HeaderCell width="flex-1" align="center">{t("assignments.table.courseName")}</HeaderCell>
      <HeaderCell width="w-[120px]" align="right">{t("assignments.table.totalSubmitted")}</HeaderCell>
      <HeaderCell width="w-[130px]" align="right">{t("assignments.table.pendingGrading")}</HeaderCell>
      <div className="w-[120px] p-1 sm:p-[4px]" />
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
    <div className={`${width} p-1 sm:p-[4px]`}>
      <p className={`text-sm sm:text-[16px] leading-5 sm:leading-[24px] text-[#7f859d] ${alignClass}`}>
        {children}
      </p>
    </div>
  );
}

interface AssignmentRowProps {
  assignment: Assignment;
  onGrade: (assignmentId: string) => void;
}

function AssignmentRow({ assignment, onGrade }: AssignmentRowProps) {
  return (
    <div className="border-b-[0.5px] border-[#f4f4f7] min-h-[44px] sm:min-h-[52px] flex items-center justify-between pl-0 pr-1 sm:pr-[4px] py-1 sm:py-[4px] hover:bg-[#eceffd] transition-colors">
      <AssignmentTitleCell title={assignment.title} />
      <ModuleCell moduleName={assignment.module} />
      <TextCell text={assignment.courseName} />
      <NumberCell number={assignment.totalSubmitted} align="right" />
      <PendingGradingCell pending={assignment.pendingGrading} />
      <GradeActionCell onGrade={() => onGrade(assignment.id)} />
    </div>
  );
}

function AssignmentTitleCell({ title }: { title: string }) {
  return (
    <div className="w-[200px] p-1 sm:p-[4px]">
      <p className="text-xs sm:text-[14px] font-medium leading-4 sm:leading-[20px] text-[#3b3d48]">
        {title}
      </p>
    </div>
  );
}

function ModuleCell({ moduleName }: { moduleName: string }) {
  return (
    <div className="flex-1 p-1 sm:p-[4px]">
      <div className="flex justify-center h-[20px] sm:h-[24px] items-center">
        <span className="bg-[#eceffd] text-[#2e46a4] px-2 sm:px-[12px] py-[2px] rounded-[6px] sm:rounded-[8px] text-xs sm:text-[14px] leading-4 sm:leading-[20px]">
          {moduleName}
        </span>
      </div>
    </div>
  );
}

function TextCell({ text }: { text: string }) {
  return (
    <div className="flex-1 p-1 sm:p-[4px]">
      <p className="text-sm sm:text-[16px] leading-5 sm:leading-[24px] text-[#3b3d48] text-center">
        {text}
      </p>
    </div>
  );
}

interface NumberCellProps {
  number: number;
  align: "left" | "center" | "right";
}

function NumberCell({ number, align }: NumberCellProps) {
  return (
    <div className="w-[120px] p-1 sm:p-[4px]">
      <p className={`text-sm sm:text-[16px] leading-5 sm:leading-[24px] text-[#3b3d48] ${align === "right" ? "text-right" : ""}`}>
        {number}
      </p>
    </div>
  );
}

function PendingGradingCell({ pending }: { pending: number }) {
  return (
    <div className="w-[130px] p-1 sm:p-[4px]">
      <p className="text-sm sm:text-[16px] leading-5 sm:leading-[24px] text-[#dc2626] text-right font-medium">
        {pending}
      </p>
    </div>
  );
}

function GradeActionCell({ onGrade }: { onGrade: () => void }) {
  const t = useTranslations("teacher");
  return (
    <div className="w-[120px] p-1 sm:p-[4px] flex items-center justify-end">
      <Button
        onClick={onGrade}
        className="bg-[#4162e7] hover:bg-[#4162e7]/90 h-[32px] px-[16px] py-[8px] rounded-[6px] w-[100px] shrink-0 cursor-pointer"
      >
        <div className="flex gap-[4px] items-center justify-center w-full">
          <ClipboardCheck className="h-4 w-4 text-white shrink-0" />
          <span className="text-[14px] font-medium leading-[20px] text-white whitespace-nowrap">
            {t("assignments.table.gradeAction")}
          </span>
        </div>
      </Button>
    </div>
  );
}
