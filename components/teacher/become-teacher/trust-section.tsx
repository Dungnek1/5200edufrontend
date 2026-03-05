"use client";


import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { useTranslations } from "next-intl";

interface TrustCard {
  id: number;
  icon: string;
  title: string;
  description: string;
  width: string;
}

export function BecomeTeacherTrustSection() {
  const t = useTranslations("page.becomeTeacher");

  const trustCards: TrustCard[] = [
    {
      id: 1,
      icon: "/images/ui/trust-icon-1.png",
      title: t("trustCard1Title"),
      description: t("trustCard1Desc"),
      width: "419px",
    },
    {
      id: 2,
      icon: "/images/ui/trust-icon-2.png",
      title: t("trustCard2Title"),
      description: t("trustCard2Desc"),
      width: "383px",
    },
    {
      id: 3,
      icon: "/images/ui/trust-icon-3.png",
      title: t("trustCard3Title"),
      description: t("trustCard3Desc"),
      width: "455px",
    },
    {
      id: 4,
      icon: "/images/ui/trust-icon-4.png",
      title: t("trustCard4Title"),
      description: t("trustCard4Desc"),
      width: "482px",
    },
  ];

  return (
    <section className="bg-transparent pt-16 sm:pt-20 md:pt-24 lg:pt-32 xl:pt-36 pb-0 px-4 sm:px-6 lg:px-16 relative overflow-hidden lg:overflow-visible">
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-[60px] items-start px-0 pt-8 sm:pt-10 md:pt-12 lg:pt-[60px] pb-0 relative w-full">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-[12px] items-start relative shrink-0 w-full">
          <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[30px] leading-7 sm:leading-8 md:leading-[40px] lg:leading-[45px] font-medium text-[#0f172a] text-center w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {t("trustTitle")}
          </h2>
          <p className="text-sm sm:text-base md:text-[16px] leading-5 sm:leading-6 md:leading-7 lg:leading-[28px] text-[#0f172a] text-center w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {t("trustDesc")}
          </p>
        </div>

        {/* Desktop: OrbitingCircles layout */}
        <div className="hidden xl:flex relative w-full" style={{ overflow: "hidden", minHeight: "1100px", height: "auto", position: "relative", alignItems: "center", justifyContent: "center", padding: "100px 0", zIndex: 1 }}>
          {/* Central Logo */}
          <div className="absolute z-30 hidden md:flex items-center justify-center" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "260px", height: "260px" }}>
            <img src="/main.svg" alt="5200AI Logo" width={260} height={260} className="object-contain w-full h-full" />
          </div>

          {/* Orbiting Cards */}
          <div className="absolute inset-0 h-full w-full z-10 hidden md:flex items-center justify-center">
            <OrbitingCircles className="h-full w-full max-w-[1200px] mx-auto" radius={450} duration={40} iconSize={300} speed={1} reverse={false} delay={0} path={false}>
              {trustCards.map((card) => (
                <div key={card.id} className="bg-white border-[0.5px] border-[#c4cef8] border-solid flex gap-4 items-start p-4 lg:gap-5 lg:p-5 rounded-[16px] lg:rounded-[20px] shadow-[0px_1px_26.8px_0px_rgba(11,15,43,0.05)] relative z-10" style={{ width: card.width, minWidth: card.width, maxWidth: "360px" }}>
                  <div className="relative shrink-0 w-[72px] h-[72px] lg:w-[90px] lg:h-[90px] bg-gray-50 rounded-lg overflow-hidden">
                    <img src={card.icon} alt={card.title} width={90} height={90} className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
                    <h3 className="text-[16px] leading-[24px] lg:text-[20px] lg:leading-[30px] font-medium text-[#3b3d48] w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                      {card.title}
                    </h3>
                    <p className="text-[13px] leading-[18px] lg:text-[14px] lg:leading-[20px] text-[#63687a] w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </OrbitingCircles>
          </div>
        </div>

        {/* Tablet/Laptop: Grid Layout */}
        <div className="hidden md:grid xl:hidden grid-cols-2 gap-5 w-full">
          {trustCards.map((card) => (
            <div key={card.id} className="bg-white border-[0.5px] border-[#c4cef8] border-solid flex gap-4 items-start p-5 rounded-[16px] shadow-[0px_1px_26.8px_0px_rgba(11,15,43,0.05)] h-full">
              <div className="relative shrink-0 w-[80px] h-[80px] bg-gray-50 rounded-lg overflow-hidden">
                <img src={card.icon} alt={card.title} width={80} height={80} className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-2 items-start min-w-0">
                <h3 className="text-[18px] leading-[26px] font-medium text-[#3b3d48] w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                  {card.title}
                </h3>
                <p className="text-[14px] leading-[20px] text-[#63687a] w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Stack cards vertically */}
        <div className="flex flex-col gap-4 sm:gap-5 md:hidden w-full">
          {trustCards.map((card) => (
            <div key={card.id} className="bg-white border-[0.5px] border-[#c4cef8] border-solid flex gap-3 items-start p-4 rounded-xl shadow-[0px_1px_26.8px_0px_rgba(11,15,43,0.05)]">
              <div className="relative shrink-0 w-16 h-16 bg-gray-50 rounded-lg overflow-hidden">
                <img src={card.icon} alt={card.title} width={64} height={64} className="object-cover" sizes="64px" />
              </div>
              <div className="flex flex-1 flex-col gap-1 items-start min-w-0">
                <h3 className="text-base leading-5 font-medium text-[#3b3d48] w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                  {card.title}
                </h3>
                <p className="text-xs leading-4 text-[#63687a] w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
