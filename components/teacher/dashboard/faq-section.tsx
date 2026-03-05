"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardFAQSectionProps {
  faqCount?: number;
}

export function DashboardFAQSection({ faqCount = 6 }: DashboardFAQSectionProps) {
  const t = useTranslations("teacher.dashboard");

  const [expandedIndex, setExpandedIndex] = useState<number>(1);

  const faqs = Array.from({ length: faqCount }, (_, i) => ({
    question: t(`faq.q${i + 1}`),
    answer: t(`faq.a${i + 1}`),
    index: i,
  }));

  return (

    <div className="w-full">
      <div className="bg-[#3b59d2] rounded-xl sm:rounded-2xl md:rounded-[16px] lg:rounded-[16px] p-4 sm:p-6 md:p-8 lg:p-8 xl:py-[80px] xl:px-[32px]">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-8 xl:gap-[64px] items-start max-w-full mx-auto px-0">
          <div className="flex flex-1 flex-col gap-4 sm:gap-5 lg:gap-5 xl:gap-[20px] items-start max-w-full lg:max-w-[768px] min-w-0 lg:min-w-[480px]">
            <div className="flex flex-col gap-2 sm:gap-3 lg:gap-3 xl:gap-[12px] items-start w-full">
              <p className="text-sm sm:text-base lg:text-base font-semibold text-[#eceffd] leading-5 sm:leading-6 lg:leading-6 not-italic" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                {t("faq.support")}
              </p>
              <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[30px] leading-7 sm:leading-8 md:leading-[40px] lg:leading-[45px] font-medium text-white w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                {t("faq.title")}
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-sm xl:text-base leading-4 sm:leading-5 lg:leading-5 xl:leading-[20px] text-white w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: "normal" }}>
              {t("faq.description")}
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-8 xl:gap-[32px] items-start min-w-0 lg:min-w-[480px] w-full">
            {faqs.map((faq) => (
              <button key={faq.index} onClick={() => setExpandedIndex(expandedIndex === faq.index ? -1 : faq.index)} className="w-full flex flex-col items-start min-w-0 p-0 cursor-pointer">
                <div className="flex gap-3 sm:gap-4 lg:gap-[16px] items-start w-full">
                  <div className="flex flex-1 flex-col gap-1 sm:gap-1.5 lg:gap-[4px] items-start text-left min-w-0">
                    <p className="text-xs sm:text-sm lg:text-[14px] font-semibold leading-5 sm:leading-6 md:leading-7 lg:leading-[28px] text-white w-full whitespace-pre-wrap" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                      {faq.question}
                    </p>
                    {expandedIndex === faq.index && (
                      <p className="text-xs sm:text-sm leading-4 sm:leading-5 text-[#f4f4f7] w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: "normal" }}>
                        {faq.answer}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-start shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0">
                      {expandedIndex === faq.index ? (
                        <MinusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                      ) : (
                        <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
}
