"use client";

import { PackageCard } from "@/components/home/package-card";
import { useTranslations } from "next-intl";

interface BecomeTeacherAIToolsSectionProps {
  aiToolPackages: any[];
  onConsultClick: () => void;
}

export function BecomeTeacherAIToolsSection({ aiToolPackages, onConsultClick }: BecomeTeacherAIToolsSectionProps) {
  const t = useTranslations("page.becomeTeacher");

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-20 xl:py-[40px] px-4 sm:px-6 lg:px-16 overflow-hidden lg:overflow-visible">
      <div className="w-full">
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center">
          <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[30px] leading-7 sm:leading-8 md:leading-[40px] lg:leading-[45px] font-medium text-[#0f172a] mb-2 sm:mb-3" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {t("aiToolsTitle")}
          </h2>
          <p className="text-sm sm:text-base lg:text-base leading-5 sm:leading-6 md:leading-7 text-[#0f172a] max-w-full md:max-w-[942px] mx-auto px-4 sm:px-0" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {t("aiToolsDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-8 sm:gap-9 md:gap-10 lg:gap-6 xl:gap-8">
          {aiToolPackages.map((pkg, index) => (
            <PackageCard key={pkg.id} package={pkg} index={index} onConsultClick={onConsultClick} />
          ))}
        </div>
      </div>
    </section>
  );
}
