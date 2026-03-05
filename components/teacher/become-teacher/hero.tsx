"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface BecomeTeacherHeroProps {
  onRegister: () => void;
}

const textStyle = { fontFamily: "Be Vietnam Pro, sans-serif" };

export function BecomeTeacherHero({ onRegister }: BecomeTeacherHeroProps) {
  const t = useTranslations("page.becomeTeacher");

  return (
    <section className="w-full py-8 md:py-12 lg:py-12 xl:py-20 px-4 md:px-6 lg:px-16 relative overflow-x-hidden max-[667px]:overflow-y-visible mb-6 md:mb-10 lg:mb-0 xl:mb-14 hero-section">
      <div className="flex flex-col lg:flex-row items-start gap-24 md:gap-28 lg:gap-6 xl:gap-8 w-full max-w-full overflow-x-hidden max-[667px]:overflow-y-visible">
        {/* Left Column */}
        <div className="w-full lg:w-[52%] lg:space-y-10 space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-10 pr-4 md:pr-4 lg:pr-8 xl:pr-6 overflow-x-hidden min-w-0">
          {/* Badge */}
          <div
            className="inline-flex items-center rounded-lg bg-[#ffeee2] px-2 md:px-3 py-1 md:py-1.5 text-sm md:text-base text-[#4c4642]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            <span>{t("trustedBy")}</span>
          </div>

          {/* Heading & Description */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8 w-full overflow-x-hidden min-w-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-[52px] leading-[32px] md:leading-[40px] lg:leading-[48px] xl:leading-[54px] font-bold text-[#1b2961] uppercase tracking-[-0.5px] md:tracking-[-0.7px] lg:tracking-[-0.96px] break-words w-full" style={textStyle}>
              {t("heroTitle")}
            </h1>
            <p className="text-sm md:text-base lg:text-lg xl:text-[19px] leading-5 md:leading-6 lg:leading-7 xl:leading-[30px] text-[#0f172a] break-words w-full" style={textStyle}>
              {t("heroDesc")}
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3 md:space-y-4 lg:space-y-5 w-full overflow-x-hidden">
            {[
              t("feature1"),
              t("feature2"),
              t("feature3")
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-2 min-w-0 w-full">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#149443] flex-shrink-0 mt-0.5" />
                <p className="text-sm md:text-base lg:text-[16px] leading-5 md:leading-6 text-[#3b3d48] break-words min-w-0 flex-1" style={textStyle}>
                  {feature}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={onRegister}
            className="px-4 md:px-5 lg:px-6 xl:px-4 py-2 md:py-2.5 lg:py-2 bg-[#4162e7] text-white rounded-md hover:bg-[#4162e7]/90 flex items-center gap-1 text-sm md:text-base lg:text-sm leading-5 w-full md:w-auto"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            {t("applyNow")}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="w-4 h-4 md:w-5 md:h-5">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>

        {/* Right Column - Image with Stats */}
        <div className="w-full lg:w-[48%] relative flex justify-center items-center min-h-[500px] md:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] pr-0 pl-0 md:pr-4 md:pl-4 lg:pr-4 lg:pl-8 xl:pr-0 xl:pl-12 max-[667px]:overflow-x-hidden max-[667px]:overflow-y-visible md:overflow-visible image-container">
          <div className="relative ml-0 md:ml-0 lg:-ml-8 xl:-ml-16">
            {/* Circle Container with Person */}
            <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px] lg:w-[480px] lg:h-[480px] xl:w-[600px] xl:h-[600px] flex justify-center">
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full rounded-full z-0"
                style={{ background: "linear-gradient(180deg, #FFFFFF 0%, rgba(193, 218, 255, 0.35) 40%, rgba(163, 210, 255, 0.5) 100%)" }}
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-full h-full overflow-hidden rounded-full">
                <img
                  src="/images/image 1344.png"
                  alt="Professional teacher"
                  className="object-cover object-[center_20%] md:object-[center_15%] lg:object-[center_10%] w-full h-full"
                  loading="eager"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="absolute -bottom-16 left-auto -right-4 md:bottom-4 md:left-auto md:-right-8 lg:bottom-8 lg:-right-12 xl:bottom-12 xl:left-auto xl:-right-8 bg-[#f2f6fe] rounded-lg md:rounded-[10px] shadow-[0px_6.67px_16.68px_-4.17px_rgba(7,15,44,0.1)] p-2.5 md:p-3 lg:p-3.5 xl:p-4 w-[150px] md:w-[160px] lg:w-[180px] xl:w-[240px] z-20">
              <div className="flex flex-col gap-2 md:gap-3 lg:gap-2">
                <div className="flex items-center justify-start pl-0 pr-1 md:pr-2 py-0 shrink-0">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-5 h-5 md:w-[22px] md:h-[22px] lg:w-[26.69px] lg:h-[26.69px] rounded-full shadow-[0px_0px_0px_1.67px_white] -mr-1 md:-mr-2 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shrink-0"
                    />
                  ))}
                </div>
                <div className="flex items-start">
                  <p className="text-xs md:text-sm lg:text-[14px] xl:text-[16px] font-bold text-[#3b3d48] uppercase leading-tight" style={textStyle}>
                    {t("statsEntrepreneurs")}
                  </p>
                </div>
                <div className="flex items-start">
                  <p className="text-[10px] md:text-xs lg:text-[13px] xl:text-[14.64px] leading-4 md:leading-[16px] lg:leading-[19.52px] text-[#63687a]" style={textStyle}>
                    {t("onlineNow")}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute top-[10rem] md:top-[11rem] lg:top-[13rem] xl:top-[18rem] -left-4 md:-left-12 lg:-left-16 xl:-left-12 max-w-[calc(100vw-32px)] md:max-w-none w-[160px] md:w-[200px] lg:w-[240px] xl:w-[220px] pt-3 px-3 pb-4 bg-[#f2f6fe] rounded-lg md:rounded-[6.746px] shadow-[0px_4.497px_11.243px_-2.811px_rgba(7,15,44,0.1)] p-2 z-20">
              <div
                className="absolute left-[40px] md:left-[50px] lg:left-[64px] -top-[30px] md:-top-[35px] lg:-top-[43px] w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[117px] lg:h-[112px] opacity-30 pointer-events-none rounded-full blur-2xl z-0"
                style={{ background: "linear-gradient(135deg, rgba(163, 230, 255, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)" }}
              />
              <div className="flex gap-1.5 md:gap-2 items-center relative z-10">
                <div className="w-5 h-5 rounded-[2px] md:w-[22px] md:h-[22px] md:rounded-[2.249px] lg:w-[24.734px] lg:h-[24.734px] lg:rounded-[2.249px] bg-[#4162e7] flex-shrink-0 flex items-center justify-center">
                  <Users className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-white" />
                </div>
                <div className="flex flex-col gap-[2px] md:gap-[2.249px] flex-1 min-w-0">
                  <p className="text-xs md:text-sm lg:text-[14px] xl:text-[16px] leading-4 md:leading-5 font-bold text-[#3b3d48] uppercase" style={textStyle}>
                    {t("experiencedTeam")}
                  </p>
                  <p className="text-[10px] md:text-[11px] lg:text-[11px] xl:text-[12px] leading-3 md:leading-4 text-[#63687a]" style={textStyle}>
                    {t("experiencedTeamDesc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute top-4 md:top-8 lg:top-4 xl:top-8 -right-4 md:right-0 lg:right-4 xl:-right-4 max-w-[calc(100vw-32px)] md:max-w-none w-[150px] md:w-[180px] lg:w-[220px] xl:w-[220px] bg-[#f2f6fe] rounded-lg md:rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-3 md:p-4 lg:p-4 xl:p-6 z-20">
              <div className="flex gap-0.5 md:gap-1 mb-1.5 md:mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 fill-[#FF9500] text-[#FF9500]" />
                ))}
              </div>
              <p className="text-[10px] md:text-[11px] lg:text-[11px] xl:text-xs font-bold text-[#3b3d48] uppercase tracking-wide" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                {t("goodReviews")}
              </p>
              <p className="text-[9px] md:text-[10px] lg:text-[10px] xl:text-xs text-[#63687a]" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                {t("fromTeachers")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
