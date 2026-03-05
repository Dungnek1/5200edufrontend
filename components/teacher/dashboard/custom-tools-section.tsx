"use client";

import { useTranslations } from "next-intl";

interface DashboardCustomToolsSectionProps {
  onConsultClick: () => void;
}

export function DashboardCustomToolsSection({ onConsultClick }: DashboardCustomToolsSectionProps) {
  const t = useTranslations("teacher.dashboard");

  return (
    <section className=" relative overflow-x-visible overflow-y-visible py-[32px]">
      <div className="absolute pointer-events-none ellipse-container" style={{ overflow: "visible", zIndex: 0, top: 0, left: 0, right: 0, width: "100vw", height: "100%", marginLeft: "calc(-50vw + 50%)" }}>
        <div className="absolute top-0 max-[667px]:left-0 max-[667px]:w-[150px] max-[667px]:h-[150px] -left-[50px] sm:-left-[80px] md:-left-[150px] lg:-left-[200px] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] opacity-50 sm:opacity-60 md:opacity-70 rounded-full blur-xl sm:blur-2xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(129, 212, 250, 0.8) 0%, rgba(163, 230, 255, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)", zIndex: 0 }} />
        <div className="absolute top-[300px] sm:top-[400px] md:top-[450px] max-[667px]:right-0 max-[667px]:w-[120px] max-[667px]:h-[120px] -right-[80px] sm:-right-[120px] md:-right-[200px] lg:-right-[300px] w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] opacity-50 sm:opacity-60 md:opacity-70 rounded-full blur-2xl sm:blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(129, 212, 250, 0.8) 0%, rgba(163, 230, 255, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)", zIndex: 0 }} />
        <div className="absolute top-[500px] sm:top-[550px] md:top-[600px] max-[667px]:right-0 max-[667px]:w-[180px] max-[667px]:h-[140px] -right-[100px] sm:-right-[150px] md:-right-[300px] lg:-right-[400px] w-[300px] h-[250px] sm:w-[450px] sm:h-[400px] md:w-[700px] md:h-[600px] lg:w-[1000px] lg:h-[800px] opacity-40 sm:opacity-50 md:opacity-60 rounded-full blur-2xl sm:blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(129, 212, 250, 0.7) 0%, rgba(163, 230, 255, 0.5) 50%, rgba(255, 255, 255, 0.85) 100%)", zIndex: 0 }} />
      </div>

      <div className="w-full  relative z-[2]">
        <div className="bg-[#010002]  rounded-[16px] sm:rounded-2xl md:rounded-[16px] py-[40px] xl:py-[16px] sm:py-[40px] lg:rounded-[16px] flex flex-col lg:flex-row lg:gap-5 gap-0 items-center lg:justify-end  relative lg:min-h-[450px]">
          <div className="px-[24px]  sm:px-[24px]   xl:px-0 flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-[40.763px] xl:gap-[40.763px] items-center lg:items-center relative shrink-0 w-full lg:w-[498.214px] z-10 pb-6 sm:pb-8 lg:pb-0">
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-[14.493px] items-center lg:items-center relative shrink-0 w-full">
              <div className="flex flex-col gap-1 sm:gap-2 md:gap-[3.623px] items-center lg:items-center leading-[0] relative shrink-0 text-lg sm:text-xl md:text-2xl lg:text-[36.234px] text-white w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 500, textShadow: "0px 0px 2.271px rgba(255,255,255,0.25), 0px 2.065px 7.7px rgba(255,255,255,0.6)" }}>
                <div className="flex flex-col justify-center relative shrink-0 w-full">
                  <p className="leading-[47.104px] whitespace-pre-wrap">{t("customTools.title1")} </p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 w-full">
                  <p className="leading-[47.104px] whitespace-pre-wrap">{t("customTools.title2")}</p>
                </div>
              </div>
              <p className="flex flex-col gap-1 items-start lg:items-start leading-[0] overflow-clip relative shrink-0 text-xs sm:text-sm md:text-[14.493px] text-white w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif", textShadow: "0px 0px 2.271px rgba(255,255,255,0.25), 0px 2.065px 7.7px rgba(255,255,255,0.6)" }}>
                <span className="leading-[16.305px] whitespace-pre-wrap">{t("customTools.desc1")} </span>
                <span className="leading-[16.305px] whitespace-pre-wrap">{t("customTools.desc2")} </span>
                <span className="leading-[16.305px] whitespace-pre-wrap">{t("customTools.desc3")}</span>
              </p>
            </div>
            <button onClick={onConsultClick} className="flex gap-2 sm:gap-[9.058px] items-center justify-center px-0 lg:px-0 py-3 sm:py-3.5 md:py-[14.493px] relative rounded-[3.623px] lg:rounded-[3.623px] shrink-0 w-full sm:w-auto lg:w-[271.753px] transition-all hover:scale-105" style={{ fontFamily: "Be Vietnam Pro, sans-serif", textShadow: "0px 0px 2.271px rgba(255,255,255,0.25), 0px 2.065px 7.7px rgba(255,255,255,0.6)", background: "linear-gradient(180deg, rgba(65, 98, 231, 0.8) 0%, rgba(65, 98, 231, 0.95) 100%)", boxShadow: "0px 0px 2.271px 0px rgba(255,255,255,0.25), 0px 3.202px 32.021px 0px rgba(1,7,87,0.3), 0px 4.269px 4.269px 0px rgba(1,47,227,0.08), 0px 8.539px 17.078px 0px rgba(1,47,227,0.12), 0px 38.425px 34.156px 0px rgba(1,47,227,0.21), inset 0px -2.135px 3.416px 0px rgba(255,255,255,0.1), inset 0px 8.539px 25.617px 0px rgba(255,255,255,0.24)" }}>
              <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-xs sm:text-sm md:text-[14.493px] text-white whitespace-nowrap" style={{ fontFamily: "Be Vietnam Pro, sans-serif", textShadow: "0px 0px 2.271px rgba(255,255,255,0.25), 0px 2.065px 7.7px rgba(255,255,255,0.6)" }}>
                <p className="leading-[16.305px]">{t("customTools.button")}</p>
              </div>
              <div className="flex items-center justify-center relative shrink-0">
                <div className="flex-none rotate-180">
                  <svg width="22" height="21" viewBox="0 0 22 21" fill="none" className="h-[21.297px] w-[22.326px]">
                    <path d="M8 4L14 10.5L8 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
          <div className="relative lg:absolute bottom-0 left-0  h-[280px] sm:h-[320px] md:h-[380px] lg:h-[400px] w-full lg:w-[528px]">
            <img src="/images/sa1.png" alt="Dashboard illustration" sizes="(max-width: 1024px) 100vw, 528px" className=" lg:object-cover object-center pointer-events-none  rounded-none sm:rounded-2xl md:rounded-[16px] lg:rounded-[16px] " />
          </div>
        </div>
      </div>
    </section>
  );
}
