"use client";

import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GradingAssignment, GradingStudent } from "@/hooks/use-grading-assignment";

interface GradingModalsProps {
  assignment: GradingAssignment;
  student: GradingStudent;
  showNextModal: boolean;
  showCompleteModal: boolean;
  dontShowAgain: boolean;
  isSaving: boolean;
  setShowNextModal: (show: boolean) => void;
  setShowCompleteModal: (show: boolean) => void;
  setDontShowAgain: (dont: boolean) => void;
  onReview: () => void;
  onNextAssignment: () => void;
  onGoToList: () => void;
}

export function GradingModals({
  assignment,
  student,
  showNextModal,
  showCompleteModal,
  dontShowAgain,
  isSaving,
  setShowNextModal,
  setShowCompleteModal,
  setDontShowAgain,
  onReview,
  onNextAssignment,
  onGoToList,
}: GradingModalsProps) {
  const t = useTranslations("teacher.grading");
  return (
    <>
      {/* Loading Modal */}
      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(59,61,72,0.8)]">
          <div className="bg-white rounded-[16px] p-[24px] flex flex-col gap-[12px] items-center justify-center min-w-[200px]">
            <p
              className="text-[20px] font-bold leading-[28px] text-[#3b3d48] text-center"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
            >
              Loading
            </p>
            <Loader2 className="h-6 w-6 text-[#3b3d48] animate-spin" />
          </div>
        </div>
      )}

      {/* Modal: Chấm bài tiếp theo */}
      <Dialog open={showNextModal} onOpenChange={setShowNextModal}>
        <DialogOverlay className="bg-[rgba(59,61,72,0.8)]" />
        <DialogContent className="bg-white max-w-[400px] p-[24px] rounded-[16px] gap-[28px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle
              className="text-[20px] font-bold leading-[28px] text-[#3b3d48] text-center"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
            >
              Chấm bài tiếp theo
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-[12px]">
            <p
              className="text-[16px] leading-[24px] text-[#4d505f]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
            >
              <span>Bài làm của </span>
              <span style={{ fontFamily: "Roboto, sans-serif", fontWeight: 700 }}>
                {student.name}
              </span>
              <span> đã được chấm và lưu thành công. </span>
            </p>
            <p
              className="text-[16px] leading-[24px] text-[#4d505f]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
            >
              Hệ thống sẽ chuyển bạn sang bài làm tiếp theo.
            </p>
            <div className="flex gap-[8px] items-center">
              <button
                onClick={() => setDontShowAgain(!dontShowAgain)}
                className={`w-5 h-5 rounded-[5px] flex items-center justify-center ${
                  dontShowAgain ? "bg-[#4162e7]" : "bg-white border border-[#dbdde5]"
                }`}
              >
                {dontShowAgain && <Check className="h-3 w-3 text-white" />}
              </button>
              <p
                className="text-[14px] leading-[20px] text-[#4d505f]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
              >
                Không hiển thị thông báo này lần sau
              </p>
            </div>
          </div>
          <div className="flex gap-[4px] items-center">
            <Button
              onClick={onReview}
              variant="outline"
              className="flex-1 border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white h-[44px] px-[16px] py-[8px] rounded-[6px] transition-colors"
            >
              <span
                className="text-[14px] font-medium leading-[20px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                Xem lại
              </span>
            </Button>
            <Button
              onClick={onNextAssignment}
              className="flex-1 bg-[#4162e7] hover:bg-[#4162e7]/90 text-[#fafafa] h-[44px] px-[16px] py-[8px] rounded-[6px]"
            >
              <span
                className="text-[14px] font-medium leading-[20px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                Bài tiếp theo
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Hoàn thành chấm bài */}
      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogOverlay className="bg-[rgba(59,61,72,0.8)]" />
        <DialogContent className="bg-white max-w-[400px] p-[24px] rounded-[16px] gap-[28px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle
              className="text-[20px] font-bold leading-[28px] text-[#3b3d48] text-center"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
            >
              Hoàn thành chấm bài
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-[12px]">
            <p
              className="text-[16px] leading-[24px] text-[#4d505f]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
            >
              <span>{t("allGradedPrefix")}</span>
              <span style={{ fontFamily: "Roboto, sans-serif", fontWeight: 700 }}>
                {assignment.module}
              </span>
              <span>{t("allGradedInCourse")}</span>
              <span style={{ fontFamily: "Roboto, sans-serif", fontWeight: 700 }}>
                {assignment.courseTitle}
              </span>
            </p>
          </div>
          <div className="flex gap-[4px] items-center">
            <Button
              onClick={onReview}
              variant="outline"
              className="flex-1 border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white h-[44px] px-[16px] py-[8px] rounded-[6px] transition-colors"
            >
              <span
                className="text-[14px] font-medium leading-[20px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                Xem lại
              </span>
            </Button>
            <Button
              onClick={onGoToList}
              className="flex-1 bg-[#4162e7] hover:bg-[#4162e7]/90 text-[#fafafa] h-[44px] px-[16px] py-[8px] rounded-[6px]"
            >
              <span
                className="text-[14px] font-medium leading-[20px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                Danh sách bài tập
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
