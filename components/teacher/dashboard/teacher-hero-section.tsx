"use client";

import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";


interface TeacherHeroSectionProps {
  onConsultClick?: () => void;
}

export function TeacherHeroSection({
  onConsultClick,
}: TeacherHeroSectionProps) {
  const t = useTranslations("teacher.dashboard");
  return (
    <section className="w-full px-4 sm:px-6 lg:px-16 relative overflow-x-hidden max-[667px]:overflow-y-visible mb-6 sm:mb-10 md:mb-14 lg:mb-0 hero-section">
      <div className="flex flex-col lg:flex-row items-start gap-24 sm:gap-28 md:gap-32 lg:gap-6 xl:gap-8 w-full max-w-full overflow-x-hidden max-[667px]:overflow-y-visible">

        <div className="w-full lg:w-[52%] lg:space-y-10 xl:space-y-14 space-y-6 sm:space-y-8 md:space-y-10 max-[667px]:pr-4 sm:pr-4 md:pr-8 lg:pr-6 xl:pr-6 overflow-x-hidden min-w-0">

          <div
            className="inline-flex items-center rounded-lg bg-[#ffeee2] px-2 sm:px-3 py-1 sm:py-1.5 text-sm sm:text-base text-[#4c4642]"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 500,
            }}
          >
            <span>{t("hero.badge")}</span>
          </div>

          {/* Heading & Description - Mobile responsive */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-8 w-full overflow-x-hidden min-w-0">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[52px] leading-[32px] sm:leading-[40px] md:leading-[48px] lg:leading-[54px] font-bold text-[#1b2961] uppercase tracking-[-0.5px] sm:tracking-[-0.7px] lg:tracking-[-0.96px] break-words w-full"
              style={{
                fontFamily: "Be Vietnam Pro, sans-serif",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
              }}
            >
              {t("hero.heading").split("\n")[0]}
              <br />
              {t("hero.heading").split("\n")[1]}
            </h1>
            <p
              className="text-sm sm:text-base md:text-lg lg:text-[19px] leading-5 sm:leading-6 md:leading-7 lg:leading-[30px] text-[#0f172a] break-words w-full"
              style={{
                fontFamily: "Be Vietnam Pro, sans-serif",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
              }}
            >
              {t("hero.description")}
            </p>
          </div>

          {/* Features List - Mobile responsive */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-5 w-full overflow-x-hidden">
            <div className="flex items-start gap-2 min-w-0 w-full">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#149443] flex-shrink-0 mt-0.5" />
              <p
                className="text-sm sm:text-base md:text-[16px] leading-5 sm:leading-6 text-[#3b3d48] break-words min-w-0 flex-1"
                style={{
                  fontFamily: "Be Vietnam Pro, sans-serif",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("hero.feature1")}
              </p>
            </div>
            <div className="flex items-start gap-2 min-w-0 w-full">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#149443] flex-shrink-0 mt-0.5" />
              <p
                className="text-sm sm:text-base md:text-[16px] leading-5 sm:leading-6 text-[#3b3d48] break-words min-w-0 flex-1"
                style={{
                  fontFamily: "Be Vietnam Pro, sans-serif",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("hero.feature2")}
              </p>
            </div>
            <div className="flex items-start gap-2 min-w-0 w-full">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#149443] flex-shrink-0 mt-0.5" />
              <p
                className="text-sm sm:text-base md:text-[16px] leading-5 sm:leading-6 text-[#3b3d48] break-words min-w-0 flex-1"
                style={{
                  fontFamily: "Be Vietnam Pro, sans-serif",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("hero.feature3")}
              </p>
            </div>
          </div>

          {/* CTA Button - Mobile responsive */}
          <Button
            onClick={onConsultClick}
            className="px-4 sm:px-5 md:px-6 lg:px-4 py-2 sm:py-2.5 md:py-2 bg-[#4162e7] text-white rounded-md hover:bg-[#4162e7]/90 flex items-center gap-1 text-sm sm:text-base lg:text-sm leading-5 w-full sm:w-auto"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 500,
            }}
          >
            {t("hero.cta")}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>

        {/* Right Column - Image with Stats - Mobile responsive */}
        <div className="w-full lg:w-[48%] relative flex justify-center items-center max-[667px]:min-h-[500px] min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] pr-0 sm:pr-4 lg:pr-4 xl:pr-0 pl-0 sm:pl-4 md:pl-8 lg:pl-8 xl:pl-12 max-[667px]:overflow-x-hidden max-[667px]:overflow-y-visible overflow-visible image-container">
          {/* Group Container for Image + Badges */}
          <div className="relative ml-0 sm:ml-0 md:ml-0 lg:-ml-8 xl:-ml-16">
            {/* Circle Container with Person - Pop-out effect - Mobile responsive */}
            <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[480px] md:h-[480px] lg:w-[480px] lg:h-[480px] xl:w-[600px] xl:h-[600px] flex justify-center">
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full rounded-full z-0"
                style={{
                  background:
                    "linear-gradient(180deg, #FFFFFF 0%, rgba(193, 218, 255, 0.35) 40%, rgba(163, 210, 255, 0.5) 100%)",
                }}
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-full h-full overflow-hidden rounded-full">
                <img
                  src="/images/image 1344.png"
                  alt="Professional teacher"
                  className="object-cover object-[center_20%] lg:object-[center_15%] xl:object-[center_10%] w-full h-full"
                  loading="eager"
                />
              </div>
            </div>

            {/* Stats Cards - z-index cao nhất - Mobile responsive - Điều chỉnh để không che hình */}
            {/* Card 1: 1,200+ Doanh nhân - Mobile: bottom, Desktop: top-right */}
            <div className="absolute max-[667px]:-bottom-16 max-[667px]:left-auto max-[667px]:-right-4 -bottom-8 sm:-bottom-4 md:-bottom-2 lg:bottom-auto lg:-top-4 xl:-top-8 left-36 sm:left-32 md:left-28 lg:left-auto lg:-right-4 xl:-right-8 bg-[#f2f6fe] rounded-lg sm:rounded-[10px] shadow-[0px_6.67px_16.68px_-4.17px_rgba(7,15,44,0.1)] p-2.5 sm:p-3 md:p-3.5 lg:p-3.5 xl:p-4 max-[667px]:w-[150px] w-[160px] sm:w-[180px] md:w-[200px] lg:w-[240px] xl:w-[260px] z-20">
              <div className="flex flex-col gap-2 sm:gap-3 lg:gap-2">
                {/* Row 1: Avatar Group - 3 overlapping circles - Hiển thị ngang trên mobile */}
                <div className="flex items-center justify-start pl-0 pr-1 sm:pr-2 py-0 shrink-0">
                  <div className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-[26.69px] md:h-[26.69px] rounded-full shadow-[0px_0px_0px_1.67px_white] -mr-1 sm:-mr-2 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shrink-0"></div>
                  <div className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-[26.69px] md:h-[26.69px] rounded-full shadow-[0px_0px_0px_1.67px_white] -mr-1 sm:-mr-2 overflow-hidden bg-gradient-to-br from-purple-400 to-purple-600 shrink-0"></div>
                  <div className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-[26.69px] md:h-[26.69px] rounded-full shadow-[0px_0px_0px_1.67px_white] overflow-hidden bg-gradient-to-br from-pink-400 to-pink-600 shrink-0"></div>
                </div>

                {/* Row 2: Main Text */}
                <div className="flex items-start">
                  <p
                    className="text-xs sm:text-sm md:text-[14px] lg:text-[14px] xl:text-[16px] font-bold text-[#3b3d48] uppercase leading-tight"
                    style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                  >
                    {t("hero.stat1Value")}
                    <br />
                    {t("hero.stat1Label")}
                  </p>
                </div>

                {/* Row 3: Sub-text */}
                <div className="flex items-start">
                  <p
                    className="text-[10px] sm:text-xs md:text-[13px] lg:text-[13px] xl:text-[14.64px] text-[#63687a] leading-4 sm:leading-[16px] md:leading-[19.52px]"
                    style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                  >
                    {t("hero.stat1Sub")}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Đội ngũ giảng viên thực chiến - Mobile: left, Desktop: left */}
            <div className="absolute max-[667px]:top-[10rem] max-[667px]:-left-4 max-[667px]:max-w-[calc(100vw-32px)] top-[9rem] sm:top-[11rem] md:top-[13rem] lg:top-[18rem] xl:top-[22rem] -left-8 sm:-left-12 md:-left-16 lg:-left-12 xl:-left-8 bg-[#f2f6fe] rounded-lg sm:rounded-[6.746px] shadow-[0px_4.497px_11.243px_-2.811px_rgba(7,15,44,0.1)] max-[667px]:pt-3 max-[667px]:px-3 max-[667px]:pb-4 p-2 lg:p-2 max-[667px]:w-[160px] w-[180px] sm:w-[200px] md:w-[240px] lg:w-[220px] xl:w-[240px] z-20">
              {/* Ellipse decoration - absolute positioning không ảnh hưởng layout */}
              <div
                className="absolute left-[40px] sm:left-[50px] md:left-[64px] lg:left-[64px] -top-[30px] sm:-top-[35px] md:-top-[43px] w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[117px] md:h-[112px] opacity-30 pointer-events-none rounded-full blur-2xl z-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(163, 230, 255, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)",
                }}
              />
              <div className="flex gap-1.5 sm:gap-2 lg:gap-2 items-center relative z-10">
                {/* Icon */}
                <div className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-[24.734px] md:h-[24.734px] lg:w-[24.734px] lg:h-[24.734px] rounded-[2px] sm:rounded-[2.249px] bg-[#4162e7] flex-shrink-0"></div>

                {/* Text Content */}
                <div className="flex flex-col gap-[2px] sm:gap-[2.249px] flex-1 min-w-0">
                  <p
                    className="text-xs sm:text-sm md:text-[14px] lg:text-[14px] xl:text-[16px] font-bold text-[#3b3d48] uppercase leading-4 sm:leading-5"
                    style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                  >
                    {t("hero.stat2Label")}
                  </p>
                  <p
                    className="text-[10px] sm:text-[11px] lg:text-[11px] xl:text-[12px] text-[#63687a] leading-3 sm:leading-4"
                    style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                  >
                    {t("hero.stat2Sub")}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: +253 đánh giá tốt - Mobile: top-right, Desktop: bottom-right */}
            <div className="absolute max-[667px]:-top-16 max-[667px]:-right-4 max-[667px]:max-w-[calc(100vw-32px)] -top-16 sm:-top-12 md:-top-8 lg:top-auto lg:bottom-4 xl:bottom-8 -right-2 sm:right-0 md:right-2 lg:right-8 xl:right-12 bg-[#f2f6fe] rounded-lg sm:rounded-xl lg:rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-3 sm:p-4 lg:p-4 xl:p-6 max-[667px]:w-[150px] w-[170px] sm:w-[180px] md:w-[220px] lg:w-[220px] xl:w-[260px] z-20 lg:mt-4">
              <div className="flex gap-0.5 sm:gap-1 lg:gap-1 mb-1.5 sm:mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4 fill-[#FF9500] text-[#FF9500]"
                  />
                ))}
              </div>
              <p
                className="text-[10px] sm:text-[11px] lg:text-[11px] xl:text-xs font-bold text-[#3b3d48] uppercase tracking-wide"
                style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
              >
                {t("hero.stat3Label")}
              </p>
              <p
                className="text-[9px] sm:text-[10px] lg:text-[10px] xl:text-xs text-[#63687a]"
                style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
              >
                {t("hero.stat3Sub")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
