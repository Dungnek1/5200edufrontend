"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";
import type { CompletionStatus, SortOrder } from "@/hooks/use-teacher-students-page";

interface StudentsSearchFiltersProps {
  type: "students" | "assignments";
  // students filters
  searchQuery?: string;
  completionStatus?: CompletionStatus;
  sortOrder?: SortOrder;
  onSearchChange?: (q: string) => void;
  onCompletionStatusChange?: (status: CompletionStatus) => void;
  onSortOrderChange?: (order: SortOrder) => void;
}

export function StudentsSearchFilters({
  type,
  searchQuery = "",
  completionStatus = "all",
  sortOrder = "high-to-low",
  onSearchChange,
  onCompletionStatusChange,
  onSortOrderChange,
}: StudentsSearchFiltersProps) {
  const t = useTranslations("teacher.students");
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    onSearchChange?.(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-[8px] items-stretch sm:items-center sm:justify-end w-full">
      <SearchBar value={localSearch} onChange={setLocalSearch} placeholder={type === "students" ? t("searchPlaceholder") : t("searchPlaceholderAssignments")} />
      {type === "students" ? (
        <StudentFilters
          completionStatus={completionStatus}
          sortOrder={sortOrder}
          onCompletionStatusChange={onCompletionStatusChange}
          onSortOrderChange={onSortOrderChange}
        />
      ) : (
        <AssignmentFilters />
      )}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="w-full sm:w-[280px] md:w-[380px] cursor-pointer">
      <div className="bg-[#fafafa] h-10 sm:h-[40px] rounded-[6px] sm:rounded-[8px] px-3 sm:px-[12px] py-1 sm:py-[4px] flex gap-2 sm:gap-[8px] items-center">
        <Search className="h-5 w-5 sm:h-6 sm:w-6 text-[#7f859d] shrink-0" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-auto p-0 text-xs sm:text-[14px] text-[#7f859d] placeholder:text-[#7f859d] focus-visible:ring-0 bg-transparent border-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

interface StudentFiltersProps {
  completionStatus: CompletionStatus;
  sortOrder: SortOrder;
  onCompletionStatusChange?: (status: CompletionStatus) => void;
  onSortOrderChange?: (order: SortOrder) => void;
}

function StudentFilters({ completionStatus, sortOrder, onCompletionStatusChange, onSortOrderChange }: StudentFiltersProps) {
  const t = useTranslations("teacher.students.filters");
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-[12px] w-full sm:w-auto">
      <Select
        value={completionStatus}
        onValueChange={(v) => onCompletionStatusChange?.(v as CompletionStatus)}
      >
        <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-10 sm:h-[40px] bg-[#fafafa] border-0 rounded-[6px] sm:rounded-[8px] text-xs sm:text-sm cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="cursor-pointer">{t("all")}</SelectItem>
          <SelectItem value="completed" className="cursor-pointer">{t("completed")}</SelectItem>
          <SelectItem value="in-progress" className="cursor-pointer">{t("inProgress")}</SelectItem>
          <SelectItem value="not-started" className="cursor-pointer">{t("notStarted")}</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={sortOrder}
        onValueChange={(v) => onSortOrderChange?.(v as SortOrder)}
      >
        <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-10 sm:h-[40px] bg-[#fafafa] border-0 rounded-[6px] sm:rounded-[8px] text-xs sm:text-sm cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high-to-low" className="cursor-pointer">{t("progressHighToLow")}</SelectItem>
          <SelectItem value="low-to-high" className="cursor-pointer">{t("progressLowToHigh")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function AssignmentFilters() {
  const t = useTranslations("teacher.students.filters");
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-[12px] w-full sm:w-auto">
      <Select defaultValue="module1">
        <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-10 sm:h-[40px] bg-[#fafafa] border-0 rounded-[6px] sm:rounded-[8px] text-xs sm:text-sm cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="module1" className="cursor-pointer">Module 1</SelectItem>
          <SelectItem value="module2" className="cursor-pointer">Module 2</SelectItem>
          <SelectItem value="module3" className="cursor-pointer">Module 3</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="pending-high-low">
        <SelectTrigger className="w-full sm:w-[180px] md:w-[200px] h-10 sm:h-[40px] bg-[#fafafa] border-0 rounded-[6px] sm:rounded-[8px] text-xs sm:text-sm cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending-high-low" className="cursor-pointer">{t("pendingHighToLow")}</SelectItem>
          <SelectItem value="pending-low-high" className="cursor-pointer">{t("pendingLowToHigh")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// interface StudentsSearchFiltersProps {
//   type: "students" | "assignments";
// }

// export function StudentsSearchFilters({ type }: StudentsSearchFiltersProps) {
//   return (
//     <div className="flex flex-col sm:flex-row gap-2 sm:gap-[8px] items-stretch sm:items-center sm:justify-end w-full">
//       <SearchBar />
//       {type === "students" ? <StudentFilters /> : <AssignmentFilters />}
//     </div>
//   );
// }

// function SearchBar() {
//   return (
//     <div className="w-full sm:w-[280px] md:w-[380px]">
//       <div className="bg-[#fafafa] h-10 sm:h-[40px] rounded-[6px] sm:rounded-[8px] px-3 sm:px-[12px] py-1 sm:py-[4px] flex gap-2 sm:gap-[8px] items-center">
//         <Search className="h-5 w-5 sm:h-6 sm:w-6 text-[#7f859d] shrink-0" />
//         <Input
//           placeholder="Tìm kiếm"
//           className="flex-1 h-auto p-0 text-xs sm:text-[14px] text-[#7f859d] placeholder:text-[#7f859d] focus-visible:ring-0 bg-transparent border-0"
//         />
//       </div>
//     </div>
//   );
// }

// function StudentFilters() {
//   return (
//     <div className="flex flex-col sm:flex-row gap-2 sm:gap-[12px] w-full sm:w-auto">
//       <Select defaultValue="completed">
//         <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-10 sm:h-[40px] bg-[#fafafa] border-0 rounded-[6px] sm:rounded-[8px] text-xs sm:text-sm">
//           <SelectValue />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="completed">Đã hoàn thành</SelectItem>
//           <SelectItem value="in-progress">Đang học</SelectItem>
//           <SelectItem value="not-started">Chưa bắt đầu</SelectItem>
//         </SelectContent>
//       </Select>
//       <Select defaultValue="high-to-low">
//         <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-10 sm:h-[40px] bg-[#fafafa] border-0 rounded-[6px] sm:rounded-[8px] text-xs sm:text-sm">
//           <SelectValue />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="high-to-low">Tiến độ Cao &gt; Thấp</SelectItem>
//           <SelectItem value="low-to-high">Tiến độ Thấp &gt; Cao</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

// function AssignmentFilters() {
//   return (
//     <div className="flex flex-col sm:flex-row gap-2 sm:gap-[12px] w-full sm:w-auto">
//       <Select defaultValue="module1">
//         <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-10 sm:h-[40px] bg-[#fafafa] border-0 rounded-[6px] sm:rounded-[8px] text-xs sm:text-sm">
//           <SelectValue />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="module1">Module 1</SelectItem>
//           <SelectItem value="module2">Module 2</SelectItem>
//           <SelectItem value="module3">Module 3</SelectItem>
//         </SelectContent>
//       </Select>
//       <Select defaultValue="pending-high-low">
//         <SelectTrigger className="w-full sm:w-[180px] md:w-[200px] h-10 sm:h-[40px] bg-[#fafafa] border-0 rounded-[6px] sm:rounded-[8px] text-xs sm:text-sm">
//           <SelectValue />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="pending-high-low">Chờ chấm Cao &gt; Thấp</SelectItem>
//           <SelectItem value="pending-low-high">Chờ chấm Thấp &gt; Cao</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }
