"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface CreateContentActionButtonsProps {
  loading: boolean;
  uploading: boolean;
  moduleData: { title: string };
  handleNext: () => void;
  handleReset: () => void;
}

export function CreateContentActionButtons({
  loading,
  uploading,
  moduleData,
  handleNext,
  handleReset,
}: CreateContentActionButtonsProps) {
  const t = useTranslations("teacherCourseContent");
  return (
    <div className="flex flex-col sm:flex-row gap-[8px] sm:gap-[4px] items-stretch sm:items-center w-full sm:w-auto sm:ml-auto sm:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={handleReset}
        className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white flex items-center justify-center gap-[4px] rounded-[6px] w-full sm:w-auto transition-colors"
      >
        <RotateCcw className="h-5 w-5" />
        <span
          className="text-sm font-medium leading-[20px]"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
          }}
        >
          {t("reset")}
        </span>
      </Button>

      <Button
        type="button"
        onClick={handleNext}
        disabled={loading || uploading || !moduleData.title.trim()}
        className={cn(
          "h-[44px] px-[16px] py-[8px] flex items-center justify-center gap-[4px] rounded-[6px] w-full sm:w-auto",
          loading || uploading || !moduleData.title.trim()
            ? "bg-[#a8b7f4] text-[#eceffd] cursor-not-allowed"
            : "bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4]",
        )}
      >
        <span
          className="text-sm font-medium leading-[20px]"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
          }}
        >
          {loading ? t("saving") : t("next")}
        </span>
        {!loading && <ChevronRight className="h-5 w-5" />}
      </Button>
    </div>
  );
}
