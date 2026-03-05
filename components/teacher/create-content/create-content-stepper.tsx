import { Check } from "lucide-react";

export function CreateContentStepper() {
  return (
    <div className="w-full flex flex-col gap-[12px] items-center overflow-x-hidden overflow-y-visible mt-4 sm:mt-6 md:mt-8 lg:mt-[20px] pt-2 sm:pt-3">
      <div className="flex items-start justify-between max-w-[1008px] w-full lg:w-[800px] relative px-4 sm:px-0 gap-4 sm:gap-6 md:gap-8 lg:gap-0">
        {/* Connecting Line */}
        <div className="absolute top-[12px] h-0 z-0 left-[62.5px] sm:left-[72.5px] md:left-[94px] right-[62.5px] sm:right-[72.5px] md:right-[94px]">
          <div className="w-full h-[1px] bg-[#d2d2d2]" />
        </div>

        {/* Step 1: Info (Completed) */}
        <div className="flex flex-col items-center gap-[8px] sm:gap-[12px] w-[100px] sm:w-[120px] md:w-[188px] relative z-10 flex-shrink-0">
          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#4162e7] flex items-center justify-center">
            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
          </div>
          <p
            className="text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#63687a] text-center w-full"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Thông tin khóa học
          </p>
        </div>

        {/* Step 2: Content (Active) */}
        <div className="flex flex-col items-center gap-[8px] sm:gap-[12px] w-[100px] sm:w-[120px] md:w-[188px] relative z-10 flex-shrink-0">
          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#4162e7] flex items-center justify-center shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#3b59d2]">
            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
          </div>
          <p
            className="text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#2e46a4] text-center w-full"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Module & Bài tập
          </p>
        </div>

        {/* Step 3: Preview (Inactive) */}
        <div className="flex flex-col items-center gap-[8px] sm:gap-[12px] w-[100px] sm:w-[120px] md:w-[188px] relative z-10 flex-shrink-0">
          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#fafafa] border-[1.5px] border-[#d2d2d2] flex items-center justify-center">
            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#d2d2d2]" />
          </div>
          <p
            className="text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#63687a] text-center w-full"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Preview
          </p>
        </div>
      </div>
    </div>
  );
}
