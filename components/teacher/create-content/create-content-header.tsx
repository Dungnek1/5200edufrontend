"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";

interface CreateContentHeaderProps {
  locale: string;
}

export function CreateContentHeader({ locale }: CreateContentHeaderProps) {
  const router = useRouter();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tCourses = useTranslations("teacher.courses");

  return (
    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-[20px]">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-[8px] flex-wrap">
        <Home className="h-4 w-4 sm:h-5 sm:w-5 text-[#8c92ac]" />
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#8c92ac]" />
        <span
          className="text-xs font-medium text-[#7f859d] cursor-pointer hover:text-[#4162e7]"
          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          onClick={() => router.push(`/${locale}/teacher/courses`)}
        >
          {tNav("courseManagement")}
        </span>
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#8c92ac]" />
        <span
          className="text-xs font-medium text-[#3b59d2]"
          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
        >
          {tCommon("create")}
        </span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between w-full">
        <h1
          className="text-xl sm:text-2xl lg:text-[30px] font-medium leading-6 sm:leading-7 lg:leading-[38px] text-[#0f172a]"
          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
        >
          {tCourses("createNew")}
        </h1>
      </div>
    </div>
  );
}
