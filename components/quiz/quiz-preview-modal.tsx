"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface QuizPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  quizTitle: string;
  questions: Array<{
    id: string;
    prompt: string;
    points: number;
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
  }>;
  essayPrompt?: {
    rubric: string;
    minWords: number;
    maxWords: number;
  };
}

/**
 * Quiz Preview Modal
 * Shows quiz preview after teacher creates it
 */
export function QuizPreviewModal({
  open,
  onClose,
  onConfirm,
  quizTitle,
  questions,
  essayPrompt,
}: QuizPreviewModalProps) {
  const t = useTranslations("quiz.create.previewModal");

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      if (overlay) {
        (overlay as HTMLElement).style.backgroundColor = 'rgba(59, 61, 72, 0.8)';
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[788px] max-h-[90vh] p-4 sm:p-[20px] bg-[#FAFAFA] border-0 shadow-none flex flex-col gap-5 rounded-[16px] w-[95vw] sm:w-full">
        <DialogTitle className="sr-only">
          {t("title")}
        </DialogTitle>

        {/* Quiz Section */}
        <div className="bg-white border border-[#f4f4f7] rounded-[12px]">
          {/* Section Header - hiển thị tên bài tập */}
          <div className="bg-white border-b border-[#f4f4f7] rounded-tl-[12px] rounded-tr-[12px] h-auto sm:h-[77px] flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6">
            <h3 className="text-base sm:text-[18px] font-medium text-[#3b3d48] leading-[24px] sm:leading-[28px]">
              {quizTitle || t("theoryTitle")}
            </h3>
          </div>

          {/* Questions List */}
          <div className="rounded-bl-[12px] rounded-br-[12px] p-[12px] overflow-y-auto bg-[#FAFAFA] max-h-[600px]">
            <div className="flex flex-col gap-[8px] px-0 py-3">
              {questions.map((question, qIndex) => (
                <div
                  key={question.id}
                  className="bg-white border-[0.5px] border-[#f4f4f7] rounded-[12px] p-4 flex flex-col gap-3"
                >
                  <div className="flex gap-3 flex-col">
                    <Badge className="shrink-0 h-[24px] max-w-[80px] px-[8px] py-[2px] rounded-[4px] bg-[#0A0BD9] text-[#FFFFFF] text-[14px] flex items-center justify-center font-semibold">
                      {t("questionLabel", { number: qIndex + 1 })}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-[#3b3d48]">{question.prompt}</h3>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = option.isCorrect;
                      return (
                        <div
                          key={`${question.id}-option-${optionIndex}`}
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-lg",
                            isCorrect ? "bg-[#e8f6ed] border border-[#b7e2c7]" : "bg-white"
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                              isCorrect ? "bg-[#16a34a]" : "border-2 border-[#dbdde5] bg-white"
                            )}
                          >
                            {isCorrect && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="flex-1 text-sm text-[#3b3d48]">{option.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Essay Question Section - chỉ hiển thị setup, không có ô nhập */}
              {essayPrompt?.rubric && (
                <div className="bg-white border-[0.5px] border-[#f4f4f7] rounded-[12px] p-4 flex flex-col gap-3">
                  <h4 className="text-base font-semibold text-[#3b3d48]">
                    {t("essayTitle")}
                  </h4>
                  <p className="text-sm text-[#4d505f]">
                    {essayPrompt.rubric}
                  </p>
                  {essayPrompt.minWords > 0 && essayPrompt.maxWords > 0 && (
                    <p className="text-xs text-[#7f859d]">
                      {t("essayWordCount", {
                        min: essayPrompt.minWords,
                        max: essayPrompt.maxWords,
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end">
          <Button
            onClick={handleConfirm}
            className="h-[44px] px-[16px] py-[8px] bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] rounded-[6px] w-full sm:w-auto cursor-pointer"
          >
            <span
              className="text-sm font-medium leading-[20px]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
            >
              {t("done")}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
