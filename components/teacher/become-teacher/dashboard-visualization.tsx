"use client";


import { useTranslations } from "next-intl";

interface BecomeTeacherDashboardVisualizationProps {
  onConsultClick: () => void;
}

export function BecomeTeacherDashboardVisualization({ onConsultClick }: BecomeTeacherDashboardVisualizationProps) {
  const t = useTranslations("page.becomeTeacher");

  return (
    <section className="relative overflow-x-visible overflow-y-visible">
      {/* Background Ellipses */}
      <div className="absolute pointer-events-none ellipse-container" style={{ overflow: "visible", zIndex: 0, top: 0, left: 0, right: 0, width: "100vw", height: "100%", marginLeft: "calc(-50vw + 50%)" }}>
        <div className="absolute top-0 max-[667px]:left-0 max-[667px]:w-[150px] max-[667px]:h-[150px] -left-[50px] sm:-left-[80px] md:-left-[150px] lg:-left-[200px] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] opacity-50 sm:opacity-60 md:opacity-70 rounded-full blur-xl sm:blur-2xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(129, 212, 250, 0.8) 0%, rgba(163, 230, 255, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)", zIndex: 0 }} />
        <div className="absolute top-[300px] sm:top-[400px] md:top-[450px] max-[667px]:right-0 max-[667px]:w-[120px] max-[667px]:h-[120px] -right-[80px] sm:-right-[120px] md:-right-[200px] lg:-right-[300px] w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] opacity-50 sm:opacity-60 md:opacity-70 rounded-full blur-2xl sm:blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(129, 212, 250, 0.8) 0%, rgba(163, 230, 255, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)", zIndex: 0 }} />
        <div className="absolute top-[500px] sm:top-[550px] md:top-[600px] max-[667px]:right-0 max-[667px]:w-[180px] max-[667px]:h-[140px] -right-[100px] sm:-right-[150px] md:-right-[300px] lg:-right-[400px] w-[300px] h-[250px] sm:w-[450px] sm:h-[400px] md:w-[700px] md:h-[600px] lg:w-[1000px] lg:h-[800px] opacity-40 sm:opacity-50 md:opacity-60 rounded-full blur-2xl sm:blur-3xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(129, 212, 250, 0.7) 0%, rgba(163, 230, 255, 0.5) 50%, rgba(255, 255, 255, 0.85) 100%)", zIndex: 0 }} />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-16 relative z-[2]">
        <div className="bg-[#010002] rounded-none sm:rounded-2xl md:rounded-[16px] lg:rounded-[16px] flex flex-col lg:flex-row lg:gap-5 gap-0 items-center lg:items-center pl-4 sm:pl-6 md:pl-8 lg:pl-0 xl:pl-0 pr-4 sm:pr-6 md:pr-8 lg:pr-12 xl:pr-12 pt-6 sm:pt-8 md:pt-12 lg:py-12 pb-0 lg:pb-12 relative lg:min-h-[450px]">
          {/* Image */}
          <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[400px] w-full lg:w-1/3 lg:flex-1 lg:max-w-[33.333%] mt-8 sm:mt-10 lg:mt-0 flex items-center justify-center order-2 lg:order-1">
            <img src="/images/sa1.png" alt="Dashboard illustration" className="object-contain object-center pointer-events-none w-full h-full" />
          </div>

          {/* Right Content */}
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14 items-start lg:items-center relative shrink-0 w-full lg:w-2/3 lg:flex-[2] z-10 pb-6 sm:pb-8 lg:pb-0 order-1 lg:order-2 lg:px-8 xl:px-10">
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 items-start lg:items-start relative shrink-0 w-full max-w-full lg:max-w-[600px] xl:max-w-[650px] mx-auto lg:ml-[255px] xl:ml-[305px]">
              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 items-center lg:items-start leading-[0] relative shrink-0 text-xl sm:text-2xl md:text-3xl lg:text-[42px] xl:text-[48px] text-white w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 500, textShadow: "0px 0px 2.271px rgba(255,255,255,0.25), 0px 2.065px 7.7px rgba(255,255,255,0.6)" }}>
                <div className="flex flex-col justify-center relative shrink-0 w-full">
                  <p className="leading-[52px] sm:leading-[56px] md:leading-[60px] lg:leading-[56px] xl:leading-[64px] whitespace-normal text-left">
                    {t("customToolsTitle")} {t("customToolsTitle2")}
                  </p>
                </div>
              </div>
              <p className="flex flex-col gap-2 sm:gap-2.5 md:gap-3 items-start lg:items-start leading-[0] overflow-clip relative shrink-0 text-sm sm:text-base md:text-lg lg:text-[16px] xl:text-[18px] text-white w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif", textShadow: "0px 0px 2.271px rgba(255,255,255,0.25), 0px 2.065px 7.7px rgba(255,255,255,0.6)" }}>
                <span className="leading-[22px] sm:leading-[24px] md:leading-[26px] lg:leading-[28px] xl:leading-[30px] whitespace-pre-wrap text-left">{t("customToolsDesc1")} </span>
                <span className="leading-[22px] sm:leading-[24px] md:leading-[26px] lg:leading-[28px] xl:leading-[30px] whitespace-pre-wrap text-left">{t("customToolsDesc2")} </span>
                <span className="leading-[22px] sm:leading-[24px] md:leading-[26px] lg:leading-[28px] xl:leading-[30px] whitespace-pre-wrap text-left">{t("customToolsDesc3")}</span>
              </p>
            </div>

            {/* CTA Button - Design consultation */}
            <button
              onClick={onConsultClick}
              className="flex gap-2 items-center justify-center px-6 lg:px-8 py-3 relative rounded-[4px] shrink-0 w-full sm:w-auto transition-all hover:scale-105 cursor-pointer"
              style={{
                fontFamily: "Be Vietnam Pro, sans-serif",
                textShadow:
                  "0px 0px 2.271px rgba(255,255,255,0.25), 0px 2.065px 7.7px rgba(255,255,255,0.6)",
                background:
                  "linear-gradient(180deg, rgba(65, 98, 231, 0.8) 0%, rgba(65, 98, 231, 0.95) 100%)",
                boxShadow:
                  "0px 0px 2.271px 0px rgba(255,255,255,0.25), 0px 3.202px 32.021px 0px rgba(1,7,87,0.3), 0px 4.269px 4.269px 0px rgba(1,47,227,0.08), 0px 8.539px 17.078px 0px rgba(1,47,227,0.12), 0px 38.425px 34.156px 0px rgba(1,47,227,0.21), inset 0px -2.135px 3.416px 0px rgba(255,255,255,0.1), inset 0px 8.539px 25.617px 0px rgba(255,255,255,0.24)",
              }}
            >
              <div className="flex flex-col justify-center relative shrink-0 text-sm md:text-base text-white whitespace-nowrap" style={{ fontFamily: "Be Vietnam Pro, sans-serif", textShadow: "0px 0px 2.271px rgba(255,255,255,0.25), 0px 2.065px 7.7px rgba(255,255,255,0.6)" }}>
              <p className="leading-[16.305px]">{t("designConsultation")}</p>
              </div>
              <div className="flex items-center justify-center relative shrink-0">
                <img src="/images/Vector.png" alt="Design tool icon" width={22} height={21} className="h-[21.297px] w-[22.326px] object-contain" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
