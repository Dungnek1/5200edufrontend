"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface DashboardCtaSectionProps {
  onConsultClick: () => void;
}

export function DashboardCtaSection({ onConsultClick }: DashboardCtaSectionProps) {
  const t = useTranslations("teacher.dashboard");

  return (
    <section className="bg-white py-12 sm:py-16 md:py-[32px] lg:py-16 xl:py-[32px]">
      <div className="w-full">
        <div className="bg-[#ecf6fd] rounded-xl sm:rounded-2xl md:rounded-[16px] lg:rounded-[16px] p-4 sm:p-5 lg:p-5 xl:px-[20px] xl:py-[40px] flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-8 xl:gap-[32px] items-center">
          <div className="flex flex-1 flex-col gap-4 sm:gap-5 lg:gap-5 xl:gap-[20px] items-start w-full">
            <div className="flex flex-col gap-2 sm:gap-3 lg:gap-3 xl:gap-[12px] items-start w-full">
              <h2
                className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[40px] leading-7 sm:leading-8 md:leading-10 lg:leading-[44px] xl:leading-[56px] font-bold text-[#1b2961] uppercase tracking-[0.2px] sm:tracking-[0.3px] lg:tracking-[0.4px] w-full"
                style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
              >
                {t("cta.title")}
              </h2>

              <div className="flex items-center justify-center w-full">
                <div className="flex flex-1 flex-col text-[#0f172a] text-sm sm:text-base lg:text-base xl:text-[20px]">
                  <p
                    className="leading-5 sm:leading-6 md:leading-7 lg:leading-[28px] xl:leading-[32px] mb-3 sm:mb-4 lg:mb-4 xl:mb-[16px]"
                    style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                  >
                    {t.rich("cta.description", {
                      platform: (chunks) => (
                        <span
                          className="font-bold text-[#4162e7]"
                          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                        >
                          {chunks}
                        </span>
                      ),
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full lg:w-auto">
              <Button
                onClick={onConsultClick}
                className="px-4 sm:px-5 lg:px-6 py-2 bg-[#4162e7] text-[#fafafa] rounded-[6px] hover:bg-[#4162e7]/90 flex items-center justify-center gap-1 text-sm leading-5 h-[44px] w-full sm:w-auto font-medium"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("cta.button")}
              </Button>
            </div>
          </div>

          <div className="relative shrink-0 w-full lg:w-[360px] h-[180px] sm:h-[200px] lg:h-[200px] xl:h-[360px]">
            <img
              src="/images/ui/instructor-collaboration.png"
              alt="Instructor collaboration"
              className="object-cover object-center rounded-lg w-full h-full"
              sizes="(max-width: 1024px) 100vw, 360px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}