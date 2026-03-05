"use client";

import { AnimatedImage } from "@/components/shared/animated-image";
import { useTranslations } from "next-intl";

export function BecomeTeacherBenefits() {
  const t = useTranslations("page.becomeTeacher");

  const benefits = [
    {
      title: t("card1Title"),
      description: t("card1Desc"),
      videoSrc: "/animations/Team goals.gif",
      imageSrc: "/images/browser-stats-rafiki-2.svg",
      alt: "Team goals"
    },
    {
      title: t("card2Title"),
      description: t("card2Desc"),
      videoSrc: "/animations/Browser stats.gif",
      imageSrc: "/images/browser-stats-rafiki-1.svg",
      alt: "Browser stats"
    },
    {
      title: t("card3Title"),
      description: t("card3Desc"),
      videoSrc: "/animations/Business decisions.gif",
      imageSrc: "/images/business-decisions-bro.svg",
      alt: "Business decisions"
    }
  ];

  return (
    <section className="bg-transparent py-12 md:py-16 lg:py-20 xl:py-10 relative overflow-hidden lg:overflow-visible mt-6 md:mt-10 lg:mt-14 xl:mt-0">
      <div className="w-full px-4 md:px-6 lg:px-16 relative">
        <div className="mb-6 md:mb-8 lg:mb-8 xl:mb-[32px]">
          <h2 className="text-xl md:text-2xl lg:text-[28px] xl:text-[30px] leading-7 md:leading-8 lg:leading-[40px] xl:leading-[45px] font-medium text-[#0f172a] mb-2 md:mb-3" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {t("weUnderstandTitle")}
          </h2>
          <p className="text-sm md:text-base lg:text-base xl:leading-[28px] leading-5 md:leading-6 lg:leading-7 text-[#0f172a] max-w-full md:max-w-[635px]" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {t("weUnderstandDesc")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-5 justify-center items-stretch relative" style={{ gap: "20px", zIndex: 10 }}>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl md:rounded-[20px] lg:rounded-[20px] border border-[#f2f2f2] overflow-hidden h-auto sm:h-[350px] md:h-[380px] lg:h-[380px] w-full md:flex-1 md:min-w-[300px] flex flex-col relative"
              style={{ zIndex: 10 }}
            >
              <div className="h-[150px] sm:h-[180px] md:h-[200px] lg:h-[200px] relative rounded-[4px] shrink-0 w-full overflow-hidden bg-white flex items-center justify-center" style={{ zIndex: 1 }}>
                <AnimatedImage
                  videoSrc={benefit.videoSrc}
                  imageSrc={benefit.imageSrc}
                  alt={benefit.alt}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="bg-white flex flex-col gap-2 sm:gap-3 lg:gap-3 flex-1 p-4 sm:p-5 lg:p-5">
                <h3 className="text-base sm:text-lg md:text-[18px] lg:text-[18px] leading-5 sm:leading-6 md:leading-[24px] font-medium text-[#3b3d48]" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-[14px] lg:text-[14px] leading-4 sm:leading-5 md:leading-[20px] text-[#63687a]" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
