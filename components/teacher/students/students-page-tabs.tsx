"use client";

import { useTranslations } from "next-intl";

interface StudentsPageTabsProps {
  activeTab: "students" | "assignments";
  onTabChange: (tab: "students" | "assignments") => void;
}

export function StudentsPageTabs({ activeTab, onTabChange }: StudentsPageTabsProps) {
  const t = useTranslations("teacher.students.tabs");
  return (
    <div className="border-b-2 border-[#dbdde5] mb-4 sm:mb-6 md:mb-[32px]">
      <div className="flex gap-2 sm:gap-4">
        <TabButton
          label={t("students")}
          isActive={activeTab === "students"}
          onClick={() => onTabChange("students")}
        />
        <TabButton
          label={t("assignments")}
          isActive={activeTab === "assignments"}
          onClick={() => onTabChange("assignments")}
        />
      </div>
    </div>
  );
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[80px] sm:min-w-[100px] px-2 sm:px-[8px] py-2 sm:py-[10px] border-b-2 transition-colors cursor-pointer ${isActive
          ? "border-[#4162e7] text-[#1b2961]"
          : "border-transparent text-[#3b3d48]"
        }`}
    >
      <span className="text-xs sm:text-[14px] leading-4 sm:leading-[20px]">{label}</span>
    </button>
  );
}
