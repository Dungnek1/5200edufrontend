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

export function DashboardTrustSection() {
  const t = useTranslations("teacher.dashboard");

  const trustCards: TrustCard[] = [
    {
      id: 1,
      icon: "/images/ui/trust-icon-1.png",
      title: t("trust.card1.title"),
      description: t("trust.card1.description"),
      width: "419px",
    },
    {
      id: 2,
      icon: "/images/ui/trust-icon-2.png",
      title: t("trust.card2.title"),
      description: t("trust.card2.description"),
      width: "383px",
    },
    {
      id: 3,
      icon: "/images/ui/trust-icon-3.png",
      title: t("trust.card3.title"),
      description: t("trust.card3.description"),
      width: "455px",
    },
    {
      id: 4,
      icon: "/images/ui/trust-icon-4.png",
      title: t("trust.card4.title"),
      description: t("trust.card4.description"),
      width: "482px",
    },
  ];

  return (
    <section className="bg-transparent py-[40px]  relative overflow-hidden lg:overflow-visible">
      <div className="flex flex-col gap-[40px] sm:gap-[10px] md:gap-[20px] lg:gap-[40px] items-start px-0  pb-0 relative w-full ">
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-[12px] items-start relative shrink-0 w-full">
          <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[30px] leading-7 sm:leading-8 md:leading-[40px] lg:leading-[45px] font-medium text-[#0f172a] text-center w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {t("trust.title")}
          </h2>
          <p className="text-sm sm:text-base md:text-[16px] leading-5 sm:leading-6 md:leading-7 lg:leading-[28px] text-[#0f172a] text-center w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {t("trust.description")}
          </p>
        </div>

        <div className="hidden md:flex relative w-full" style={{ overflow: "hidden", minHeight: "1000px", height: "auto", position: "relative", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
          <div className="absolute z-30 hidden md:flex items-center justify-center" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "260px", height: "260px" }}>
            <img src="/main.svg" alt="5200AI Logo" width={260} height={260} className="object-contain w-full h-full" />
          </div>
          <div className="absolute inset-0 h-full w-full z-10 hidden md:block">
            <OrbitingCircles className="h-full w-full" radius={400} duration={40} iconSize={500}>
              {trustCards.map((card) => (
                <div key={card.id} className="bg-white border-[0.5px] border-[#c4cef8] border-solid flex gap-[20px] items-start p-[20px] rounded-[20px] shadow-[0px_1px_26.8px_0px_rgba(11,15,43,0.05)] relative z-10" style={{ width: card.width, minWidth: card.width }}>
                  <div className="relative shrink-0 w-[100px] h-[100px] bg-gray-50 rounded-lg overflow-hidden">
                    <img src={card.icon} alt={card.title} width={100} height={100} className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
                    <h3 className="text-[20px] leading-[30px] font-medium text-[#3b3d48] w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                      {card.title}
                    </h3>
                    <p className="text-[14px] leading-[20px] text-[#63687a] w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </OrbitingCircles>
          </div>
        </div>

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
