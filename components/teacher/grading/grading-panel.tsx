"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface GradingPanelProps {
  theoryScore: number;
  practiceScore: number;
  comment: string;
  attachedFiles: File[];
  isSaving: boolean;
  setPracticeScore: (score: number) => void;
  setComment: (comment: string) => void;
  setAttachedFiles: (files: File[]) => void;
  onPracticeScoreChange: (delta: number) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSaveDraft: () => Promise<void>;
  onRequestResubmission: () => void;
  onSubmit: () => void;
}

export function GradingPanel({
  theoryScore,
  practiceScore,
  comment,
  attachedFiles,
  isSaving,
  setPracticeScore,
  setComment,
  setAttachedFiles,
  onPracticeScoreChange,
  onFileUpload,
  onRemoveFile,
  onSaveDraft,
  onRequestResubmission,
  onSubmit,
}: GradingPanelProps) {
  const t = useTranslations("teacher.grading");
  return (
    <div className="bg-white border border-[#f4f4f7] rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] w-[384px] shrink-0 px-[12px] py-[16px] flex flex-col gap-[20px]">
      <div className="px-[12px] py-[12px]">
        <h3
          className="text-[18px] font-medium leading-[28px] text-[#3b3d48] mb-[12px]"
          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
        >
          Chấm điểm & nhận xét
        </h3>

        {/* Theory Score */}
        <div className="flex flex-col gap-[4px] mb-[12px]">
          <p
            className="text-[16px] font-medium leading-[24px] text-[#3b3d48]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Lý thuyết
          </p>
          <div className="bg-[#e8f6ed] flex gap-[8px] h-[40px] items-center px-[12px] py-[4px] rounded-[8px]">
            <p
              className="flex-1 text-[20px] font-medium leading-[30px] text-[#16a34a]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
            >
              {theoryScore}
            </p>
            <p
              className="text-[16px] leading-[24px] text-[#7f859d]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
            >
              /20 câu
            </p>
          </div>
        </div>

        {/* Practice Score */}
        <div className="flex flex-col gap-[4px] mb-[12px]">
          <p
            className="text-[16px] font-medium leading-[24px] text-[#3b3d48]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Thực hành
          </p>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={practiceScore}
              onChange={(e) =>
                setPracticeScore(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))
              }
              className="bg-[#fafafa] border border-[#f4f4f7] h-[82px] text-[36px] font-medium leading-[44px] text-[#dbdde5] text-center tracking-[-0.72px] pr-[60px]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              max={10}
              min={0}
            />
            <div className="absolute right-[16px] top-[11px] flex flex-col gap-[4px]">
              <button
                onClick={() => onPracticeScoreChange(1)}
                disabled={practiceScore >= 10}
                className="w-[18px] h-[22px] flex items-center justify-center disabled:opacity-50"
              >
                <ChevronUp className="h-[22px] w-[18px] text-[#3b3d48]" />
              </button>
              <button
                onClick={() => onPracticeScoreChange(-1)}
                disabled={practiceScore <= 0}
                className="w-[18px] h-[22px] flex items-center justify-center disabled:opacity-50"
              >
                <ChevronDown className="h-[22px] w-[18px] text-[#3b3d48]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="px-0 pt-[12px] pb-0 flex flex-col gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          <p
            className="text-[16px] font-medium leading-[24px] text-[#3b3d48]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            {t("commentLabel")}
          </p>
          <div className="relative">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("commentPlaceholder")}
              className="bg-[#fafafa] h-[160px] px-[12px] py-[8px] rounded-[8px] text-[14px] leading-[20px] text-[#7f859d] placeholder:text-[#7f859d] resize-none"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
              maxLength={500}
            />
            <p
              className="absolute bottom-[24px] right-[12px] text-[12px] leading-[16px] text-[#8c92ac]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
            >
              {comment.length}/500
            </p>
          </div>
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-[4px]">
          <p
            className="text-[16px] font-medium leading-[24px] text-[#3b3d48]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Tệp đính kèm (tùy chọn)
          </p>
          <div className="bg-white border border-[#dbdde5] border-dashed rounded-[12px] px-[32px] py-[20px] flex flex-col gap-[24px] items-center">
            <div className="flex flex-col items-center text-center">
              <p
                className="text-[16px] font-medium leading-[24px] text-[#3b3d48]"
                style={{ fontFamily: "Manrope, sans-serif", fontWeight: 500 }}
              >
                Chọn file hoặc kéo thả vào đây
              </p>
              <p
                className="text-[12px] leading-[18px] text-[#b1b1b1]"
                style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}
              >
                XLSX, CSV, PDF, MP4, MOV up to 50MB
              </p>
            </div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".xlsx,.csv,.pdf,.mp4,.mov"
              onChange={onFileUpload}
              multiple
            />
            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="outline"
                className="border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white h-[44px] px-[16px] py-[8px] rounded-[6px] transition-colors"
              >
                <span
                  className="text-[14px] font-medium leading-[20px]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  Browse File
                </span>
              </Button>
            </label>
          </div>
          {attachedFiles.length > 0 && (
            <div className="flex flex-col gap-[4px] mt-[8px]">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#fafafa] p-[8px] rounded-[8px]"
                >
                  <span
                    className="text-[14px] leading-[20px] text-[#3b3d48]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                  >
                    {file.name}
                  </span>
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="w-6 h-6 flex items-center justify-center hover:bg-[#e5e5e5] rounded"
                  >
                    <X className="h-4 w-4 text-[#3b3d48]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[4px] items-center justify-end">
        <Button
          onClick={onSaveDraft}
          disabled={isSaving}
          variant="outline"
          className="border-[#a8b7f4] text-[#8096ef] hover:bg-[#8096ef] hover:text-white h-[44px] px-[16px] py-[8px] rounded-[6px] disabled:opacity-50 transition-colors"
        >
          <span
            className="text-[14px] font-medium leading-[20px]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Lưu nháp
          </span>
        </Button>
        <Button
          onClick={onRequestResubmission}
          variant="outline"
          className="border-[#a8b7f4] text-[#8096ef] hover:bg-[#8096ef] hover:text-white h-[44px] px-[16px] py-[8px] rounded-[6px] transition-colors"
        >
          <span
            className="text-[14px] font-medium leading-[20px]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Yêu cầu nộp lại
          </span>
        </Button>
        <Button
          onClick={onSubmit}
          className="bg-[#a8b7f4] hover:bg-[#a8b7f4]/90 text-[#eceffd] h-[44px] px-[16px] py-[8px] rounded-[6px] w-[100px]"
        >
          <span
            className="text-[14px] font-medium leading-[20px]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Gửi điểm
          </span>
        </Button>
      </div>
    </div>
  );
}
