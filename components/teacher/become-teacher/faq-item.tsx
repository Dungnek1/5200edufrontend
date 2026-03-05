"use client";

import { PlusCircle, MinusCircle } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  expanded?: boolean;
  onToggle?: () => void;
}

export function BecomeTeacherFAQItem({ question, answer, expanded = false, onToggle }: FAQItemProps) {
  return (
    <button onClick={onToggle} className="w-full flex flex-col items-start min-w-0 p-0 cursor-pointer">
      <div className="flex gap-3 md:gap-4 lg:gap-[16px] items-start w-full">
        <div className="flex flex-1 flex-col gap-1 md:gap-1.5 lg:gap-[4px] items-start text-left min-w-0">
          <p className="text-xs md:text-sm lg:text-sm xl:text-[14px] leading-5 md:leading-6 lg:leading-7 xl:leading-[28px] font-semibold text-white w-full whitespace-pre-wrap" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {question}
          </p>
          {expanded && answer && (
            <p className="text-xs md:text-sm leading-4 md:leading-5 text-[#f4f4f7] w-full" style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: "normal" }}>
              {answer}
            </p>
          )}
        </div>
        <div className="flex flex-col items-start shrink-0">
          <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center shrink-0">
            {expanded ? (
              <MinusCircle className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} />
            ) : (
              <PlusCircle className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
