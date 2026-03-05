"use client";

import { BecomeTeacherFAQItem } from "./faq-item";
import { useTranslations } from "next-intl";

interface BecomeTeacherFAQSectionProps {
  expandedFAQ: number | null;
  setExpandedFAQ: (index: number | null) => void;
}

export function BecomeTeacherFAQSection({ expandedFAQ, setExpandedFAQ }: BecomeTeacherFAQSectionProps) {
  const t = useTranslations("page.becomeTeacher");

  const faqs = [
    { question: t("faq1Question"), answer: t("faq1Answer"), index: 0 },
    { question: t("faq2Question"), answer: t("faq2Answer"), index: 1 },
    { question: t("faq3Question"), answer: t("faq3Answer"), index: 2 },
    { question: t("faq4Question"), answer: t("faq4Answer"), index: 3 },
    { question: t("faq5Question"), answer: t("faq5Answer"), index: 4 },
    { question: t("faq6Question"), answer: t("faq6Answer"), index: 5 },
  ];

  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 lg:py-16 xl:py-16 px-4 sm:px-6 lg:px-16">
      <div className="w-full">
        <div className="bg-[#3b59d2] rounded-xl sm:rounded-2xl md:rounded-[16px] lg:rounded-[16px] p-4 sm:p-6 md:p-8 lg:p-8 xl:p-12">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-8 xl:gap-12 items-start max-w-full mx-auto px-0">
            <div className="flex flex-1 flex-col gap-4 sm:gap-5 lg:gap-5 xl:gap-[20px] items-start max-w-full lg:max-w-[768px] min-w-0 lg:min-w-[480px]">
              <div className="flex flex-col gap-2 sm:gap-3 lg:gap-3 xl:gap-[12px] items-start w-full">
                <p className="text-sm sm:text-base lg:text-base font-semibold text-[#eceffd] leading-5 sm:leading-6 lg:leading-6 not-italic" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                  {t("faqSupport")}
                </p>
                <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[30px] leading-7 sm:leading-8 md:leading-[40px] lg:leading-[45px] font-medium text-white w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                  {t("faqTitle")}
                </h2>
              </div>
              <p className="text-xs sm:text-sm lg:text-sm xl:text-base leading-4 sm:leading-5 lg:leading-5 xl:leading-[20px] text-white w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: "normal" }}>
                {t("faqDesc")}
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-8 xl:gap-[32px] items-start min-w-0 lg:min-w-[480px] w-full">
              {faqs.map((faq) => (
                <BecomeTeacherFAQItem
                  key={faq.index}
                  question={faq.question}
                  answer={faq.answer}
                  expanded={expandedFAQ === faq.index}
                  onToggle={() => setExpandedFAQ(expandedFAQ === faq.index ? null : faq.index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
