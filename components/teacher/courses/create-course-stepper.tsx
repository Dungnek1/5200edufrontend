"use client";

import { useTranslations } from "next-intl";

interface CreateCourseStepperProps {
  currentStep: 1 | 2 | 3;
}

export function CreateCourseStepper({ currentStep }: CreateCourseStepperProps) {
  const t = useTranslations("teacherCourseContent.steps");
  return (
    <div className="w-full flex flex-col gap-[12px] items-center overflow-x-hidden overflow-y-visible mt-4 md:mt-6 lg:mt-8 pt-2 md:pt-3">
      <div className="flex items-start justify-between max-w-[1008px] w-full lg:max-w-[800px] relative px-4 md:px-0 gap-4 md:gap-6 lg:gap-8">
        {/* Connecting Line */}
        <div className="absolute top-[12px] h-0 z-0 left-[62.5px] md:left-[72.5px] lg:left-[94px] right-[62.5px] md:right-[72.5px] lg:right-[94px]">
          <div className="w-full h-[1px] bg-[#d2d2d2]" />
        </div>

        <StepItem
          number={1}
          label={t("info")}
          isActive={currentStep === 1}
          isCompleted={currentStep > 1}
        />
        <StepItem
          number={2}
          label={t("content")}
          isActive={currentStep === 2}
          isCompleted={currentStep > 2}
        />
        <StepItem
          number={3}
          label={t("preview")}
          isActive={currentStep === 3}
          isCompleted={false}
        />
      </div>
    </div>
  );
}

interface StepItemProps {
  number: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

function StepItem({ label, isActive, isCompleted }: StepItemProps) {
  const dotStyles = isActive || isCompleted
    ? "bg-[#4162e7] shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#3b59d2]"
    : "bg-[#fafafa] border-[1.5px] border-[#d2d2d2]";

  const innerDotStyles = isActive || isCompleted ? "bg-white" : "bg-[#d2d2d2]";
  const textStyles = isActive || isCompleted ? "text-[#2e46a4]" : "text-[#63687a]";

  return (
    <div className="flex flex-col items-center gap-[8px] md:gap-[12px] w-[100px] md:w-[120px] lg:w-[188px] relative z-10 flex-shrink-0">
      <div className={`h-5 w-5 md:h-6 md:w-6 rounded-full flex items-center justify-center ${dotStyles}`}>
        <div className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full ${innerDotStyles}`} />
      </div>
      <p className={`text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-center w-full ${textStyles}`}>
        {label}
      </p>
    </div>
  );
}
