"use client";

import { Users, ClipboardCheck, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

interface StudentsStatsCardsProps {
  stats: {
    totalStudents: number;
    completionRate: number;
    pendingGrading: number;
  };
}

export function StudentsStatsCards({ stats }: StudentsStatsCardsProps) {
  const t = useTranslations("teacher.students.stats");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-[20px]">
      <StatCard
        icon={<Users className="h-4 w-4 text-[#8c92ac]" />}
        label={t("totalStudents")}
        value={stats.totalStudents}
      />
      <StatCard
        icon={<ClipboardCheck className="h-4 w-4 text-[#8c92ac]" />}
        label={t("completionRate")}
        value={stats.completionRate}
      />
      <StatCard
        icon={<FileText className="h-4 w-4 text-[#8c92ac]" />}
        label={t("pendingGrading")}
        value={stats.pendingGrading}
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white border border-[#c4cef8] rounded-[6px] sm:rounded-[8px] p-4 sm:p-[20px] flex flex-col gap-2 sm:gap-[12px]">
      <div className="bg-[#eceffd] rounded-full w-6 h-6 sm:w-[32px] sm:h-[32px] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-1 sm:gap-[4px]">
        <p className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#7f859d]">
          {label}
        </p>
        <p className="text-lg sm:text-xl lg:text-[24px] font-medium leading-6 sm:leading-7 lg:leading-[32px] text-[#3b3d48]">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
