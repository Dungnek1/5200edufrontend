"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, RotateCcw, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { FormData, Category } from "@/hooks/use-create-course";

interface CreateCourseFormProps {
  formData: FormData;
  errors: Record<string, string>;
  categories: Category[];
  loadingCategories: boolean;
  thumbnailFile: File | null;
  loading: boolean;
  onUpdateField: (field: keyof FormData, value: any) => void;
  onAddOutcome: (e?: React.KeyboardEvent) => void;
  onRemoveOutcome: (index: number) => void;
  onReset: () => void;
  onSubmit: () => void;
  onThumbnailSelect: (file: File) => void;
  onThumbnailRemove: () => void;
}

export function CreateCourseForm({
  formData,
  errors,
  categories,
  loadingCategories,
  thumbnailFile,
  loading,
  onUpdateField,
  onAddOutcome,
  onRemoveOutcome,
  onReset,
  onSubmit,
  onThumbnailSelect,
  onThumbnailRemove,
}: CreateCourseFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("teacher.courses.edit");
  const tSteps = useTranslations("teacherCourseContent.steps");

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      <div className="w-full flex flex-col items-start">
        <div className="w-full flex items-start">
          <div className="flex-1 flex items-start justify-center">
            <div className="w-full max-w-[748px] flex flex-col gap-[16px] md:gap-[20px] items-end justify-end px-4 md:px-0">
              {/* Section Title */}
              <h2 className="text-xl leading-[28px] md:text-2xl md:leading-[30px] lg:text-[24px] lg:leading-[32px] font-medium text-[#0f172a] w-full text-left">
                {tSteps("info")}
              </h2>

              <div className="w-full flex flex-col gap-[12px] items-start">
                {/* Course Title */}
                <FormField label={t("fields.title")} error={errors.title}>
                  <Input
                    placeholder={t("placeholders.title")}
                    value={formData.title}
                    onChange={(e) => onUpdateField("title", e.target.value)}
                    className={cn(
                      "h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm text-[#7f859d] placeholder:text-[#7f859d] px-[12px] py-[4px]",
                      errors.title && "border-red-500"
                    )}
                  />
                </FormField>

                {/* Description */}
                <FormField label={t("fields.description")} error={errors.description}>
                  <div className="relative w-full">
                    <Textarea
                      placeholder=""
                      value={formData.description}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          onUpdateField("description", e.target.value);
                        }
                      }}
                      className={cn(
                        "h-[160px] rounded-[8px] border-none bg-[#f4f4f7] text-sm text-[#3b3d48] placeholder:text-[#3b3d48] resize-none px-[12px] py-[8px]",
                        errors.description && "border border-red-500"
                      )}
                    />
                    <span className="absolute bottom-[24px] right-[12px] text-xs text-[#8c92ac] leading-[16px]">
                      {formData.description.length}/500
                    </span>
                  </div>
                </FormField>

                {/* Thumbnail Upload */}
                <ThumbnailUpload
                  fileInputRef={fileInputRef}
                  thumbnailFile={thumbnailFile}
                  onSelect={onThumbnailSelect}
                  onRemove={onThumbnailRemove}
                />

                {/* Learning Outcomes */}
                <LearningOutcomes
                  outcomes={formData.outcomes}
                  newOutcome={formData.newOutcome}
                  onNewOutcomeChange={(value) => onUpdateField("newOutcome", value)}
                  onAdd={onAddOutcome}
                  onRemove={onRemoveOutcome}
                />

                {/* Category */}
                <FormField label={t("fields.category")} error={errors.categoryId}>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => onUpdateField("categoryId", value)}
                    disabled={loadingCategories}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-[40px] rounded-[8px] border-none bg-[#fafafa] text-sm text-[#3b3d48] px-[12px] py-[4px] cursor-pointer",
                        errors.categoryId && "border border-red-500"
                      )}
                    >
                      <SelectValue placeholder={loadingCategories ? t("buttons.loadingCategories") : t("buttons.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-xl z-50 max-h-[300px]">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="cursor-pointer hover:bg-[#eceffd] focus:bg-[#eceffd]">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Language */}
                <FormField label={t("fields.language")}>
                  <Select value={formData.language} onValueChange={(value) => onUpdateField("language", value)}>
                    <SelectTrigger className="h-[40px] rounded-[8px] border-none bg-[#fafafa] text-sm text-[#3b3d48] px-[12px] py-[4px] cursor-pointer">
                      <SelectValue placeholder={t("buttons.selectLanguage")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi" className="cursor-pointer">Tiếng Việt</SelectItem>
                      <SelectItem value="en" className="cursor-pointer">Tiếng Anh</SelectItem>
                      <SelectItem value="jp" className="cursor-pointer">Tiếng Nhật</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Action Buttons */}
                <ActionButtons loading={loading} onReset={onReset} onSubmit={onSubmit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col gap-[4px] items-start">
      <Label className="text-sm font-normal text-[#7f859d] leading-[20px]">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface ThumbnailUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  thumbnailFile: File | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

function ThumbnailUpload({ fileInputRef, thumbnailFile, onSelect, onRemove }: ThumbnailUploadProps) {
  return (
    <div className="w-full flex flex-col gap-[4px] items-start">
      <Label className="text-sm font-normal text-[#7f859d] leading-[20px]">Upload ảnh minh họa</Label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] flex items-center gap-[8px] px-[12px] py-[4px] cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onSelect(file);
          }}
        />
        <span className="flex-1 text-sm font-normal text-[#8c92ac] leading-[20px]">Tải ảnh lên</span>
        <LinkIcon className="h-6 w-6 text-[#63687a]" />
      </div>
      <p className="text-xs font-normal text-[#8c92ac] leading-[16px]">
        Định dạng JPEG, JPG, PNG lên đến 10MB, kích thước khuyến nghị 370 x 200 pixel
      </p>
      {thumbnailFile && (
        <div className="bg-[#f4f4f7] flex items-center justify-between gap-2 px-[8px] py-[6px] rounded-[4px]">
          <div className="flex items-center gap-[8px]">
            <ImageIcon className="h-4 w-4 text-[#3b3d48]" />
            <span className="text-sm font-medium text-[#3b3d48] leading-[20px]">{thumbnailFile.name}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="h-4 w-4 text-[#3b3d48] hover:text-red-500 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

interface LearningOutcomesProps {
  outcomes: string[];
  newOutcome: string;
  onNewOutcomeChange: (value: string) => void;
  onAdd: (e?: React.KeyboardEvent) => void;
  onRemove: (index: number) => void;
}

function LearningOutcomes({ outcomes, newOutcome, onNewOutcomeChange, onAdd, onRemove }: LearningOutcomesProps) {
  return (
    <div className="w-full flex flex-col gap-[4px] items-start">
      <Label className="text-sm font-normal text-[#7f859d] leading-[20px]">Học viên sẽ học được gì</Label>
      <Input
        placeholder={t("placeholders.outcomes")}
        value={newOutcome}
        onChange={(e) => onNewOutcomeChange(e.target.value)}
        onKeyDown={onAdd}
        className="h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm text-[#7f859d] placeholder:text-[#7f859d] px-[12px] py-[4px]"
      />
      {outcomes.length > 0 && (
        <div className="flex gap-[4px] items-start flex-wrap">
          {outcomes.map((outcome, index) => (
            <div key={index} className="bg-[#efffec] flex items-center justify-center gap-[8px] px-[8px] py-[4px] rounded-[4px]">
              <span className="text-sm font-medium text-[#3b3d48] leading-[20px]">{outcome}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="h-4 w-4 text-[#3b3d48] hover:text-red-500 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ActionButtonsProps {
  loading: boolean;
  onReset: () => void;
  onSubmit: () => void;
}

function ActionButtons({ loading, onReset, onSubmit }: ActionButtonsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-[8px] md:gap-[4px] md:items-center w-full md:w-auto md:ml-auto md:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white flex items-center justify-center gap-[4px] rounded-[6px] w-full md:w-auto transition-colors cursor-pointer"
      >
        <RotateCcw className="h-5 w-5" />
        <span className="text-sm font-medium leading-[20px]">Reset</span>
      </Button>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="h-[44px] px-[16px] py-[8px] bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] flex items-center justify-center gap-[4px] rounded-[6px] w-full md:w-auto cursor-pointer"
      >
        <span className="text-sm font-medium leading-[20px]">{loading ? t("buttons.processing") : t("buttons.next")}</span>
        {!loading && <ChevronRight className="h-5 w-5" />}
      </Button>
    </div>
  );
}
