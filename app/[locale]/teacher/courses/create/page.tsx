"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight, Home, LinkIcon, ImageIcon, X, RotateCcw } from "lucide-react";
import { useCreateCourse } from "@/hooks/use-create-course";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function CreateCoursePage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const t = useTranslations();
  const tCreate = useTranslations("teacher.courses.createInfo");
  const tEdit = useTranslations("teacher.courses.edit");

  const {
    loading,
    thumbnailFile,
    categories,
    loadingCategories,
    formData,
    errors,
    updateField,
    handleAddOutcome,
    handleRemoveOutcome,
    handleReset,
    handleSubmit,
    handleThumbnailSelect,
    handleThumbnailRemove,
  } = useCreateCourse();

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-white mx-auto max-w-[1990px] w-full px-4 sm:px-6 md:px-8 lg:px-[64px] py-4 sm:py-5 md:py-[20px] pb-6 sm:pb-8 md:pb-[40px] flex flex-col gap-3 sm:gap-4 lg:gap-[16px]">
        {/* Header */}
        <div className="flex flex-col gap-4 md:gap-5 lg:gap-[20px]">
          <div className="flex items-center gap-2 md:gap-[8px] flex-wrap">
            <Home className="h-4 w-4 md:h-5 md:w-5 text-[#8c92ac]" />
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-[#8c92ac]" />
            <span
              className="text-xs font-medium text-[#7f859d] cursor-pointer hover:text-[#4162e7]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              onClick={() => router.push(`/${locale}/teacher/courses`)}
            >
              {t("nav.courseManagement")}
            </span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#8c92ac]" />
            <span
              className="text-xs font-medium text-[#3b59d2]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
            >
              {t("common.create")}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-3 md:gap-4">
            <h1 className="text-xl leading-6 md:text-2xl md:leading-7 lg:text-[30px] lg:leading-[38px] font-medium text-[#0f172a]">
              {t("teacher.courses.createNew")}
            </h1>
          </div>
        </div>

        {/* Stepper */}
        <div className="w-full flex flex-col gap-[12px] items-center overflow-x-hidden overflow-y-visible mt-4 md:mt-6 lg:mt-8 pt-2 md:pt-3">
          <div className="flex items-start justify-between max-w-[1008px] w-full lg:max-w-[800px] relative px-4 md:px-0 gap-4 md:gap-6 lg:gap-8">
            <div className="absolute top-[12px] h-0 z-0 left-[62.5px] md:left-[72.5px] lg:left-[94px] right-[62.5px] md:right-[72.5px] lg:right-[94px]">
              <div className="w-full h-[1px] bg-[#d2d2d2]" />
            </div>

            <div className="flex flex-col items-center gap-[8px] md:gap-[12px] w-[100px] md:w-[120px] lg:w-[188px] relative z-10 flex-shrink-0">
              <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-[#4162e7] flex items-center justify-center shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#3b59d2]">
                <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white" />
              </div>
              <p className="text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#2e46a4] text-center w-full" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                {tCreate("stepInfo")}
              </p>
            </div>

            <div className="flex flex-col items-center gap-[8px] sm:gap-[12px] w-[100px] sm:w-[120px] md:w-[188px] relative z-10 flex-shrink-0">
              <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-[#fafafa] border-[1.5px] border-[#d2d2d2] flex items-center justify-center">
                <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-[#d2d2d2]" />
              </div>
              <p className="text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#63687a] text-center w-full" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                {tCreate("stepContent")}
              </p>
            </div>

            <div className="flex flex-col items-center gap-[8px] sm:gap-[12px] w-[100px] sm:w-[120px] md:w-[188px] relative z-10 flex-shrink-0">
              <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-[#fafafa] border-[1.5px] border-[#d2d2d2] flex items-center justify-center">
                <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-[#d2d2d2]" />
              </div>
              <p className="text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#63687a] text-center w-full" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                {tCreate("stepPreview")}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center overflow-x-hidden">
          <div className="w-full flex flex-col items-start">
            <div className="w-full flex items-start">
              <div className="flex-1 flex items-start justify-center">
                <div className="w-full max-w-[748px] flex flex-col gap-[16px] md:gap-[20px] items-end justify-end px-4 md:px-0">
                  <h2 className="text-xl leading-[28px] md:text-2xl md:leading-[30px] lg:text-[24px] lg:leading-[32px] font-medium text-[#0f172a] w-full text-left" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                    {tCreate("sectionTitle")}
                  </h2>

                  <div className="w-full flex flex-col gap-[12px] items-start">
                    <div className="w-full flex flex-col gap-[4px] items-start">
                      <Label htmlFor="title" className="text-sm font-normal text-[#7f859d] leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                        {tCreate("courseName")}
                      </Label>
                      <Input
                        id="title"
                        placeholder={tEdit("placeholders.title")}
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        className={cn("h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm text-[#7f859d] placeholder:text-[#7f859d] px-[12px] py-[4px]", errors.title && "border-red-500")}
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      />
                      {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    <div className="w-full flex flex-col gap-[4px] items-start">
                      <Label htmlFor="description" className="text-sm font-normal text-[#7f859d] leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                        {tCreate("courseDescription")}
                      </Label>
                      <div className="relative w-full">
                        <Textarea
                          id="description"
                          placeholder=""
                          value={formData.description}
                          onChange={(e) => {
                            if (e.target.value.length <= 500) updateField("description", e.target.value);
                          }}
                          className={cn("h-[160px] rounded-[8px] border-none bg-[#f4f4f7] text-sm text-[#3b3d48] placeholder:text-[#3b3d48] resize-none px-[12px] py-[8px]", errors.description && "border border-red-500")}
                          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                        />
                        <span className="absolute bottom-[24px] right-[12px] text-xs text-[#8c92ac] leading-[16px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                          {tCreate("charCount", { current: formData.description.length })}
                        </span>
                      </div>
                      {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="w-full flex flex-col gap-[4px] items-start">
                      <Label className="text-sm font-normal text-[#7f859d] leading-[20px]">{tCreate("uploadThumbnail")}</Label>
                      <div
                        onClick={() => (document.getElementById("thumbnail-input") as HTMLInputElement)?.click()}
                        className="w-full h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] flex items-center gap-[8px] px-[12px] py-[4px] cursor-pointer hover:border-[#4162e7] hover:bg-[#f4f4f7] transition-colors"
                      >
                        <input
                          id="thumbnail-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleThumbnailSelect(file);
                          }}
                        />
                        <span className="flex-1 text-sm font-normal text-[#8c92ac] leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                          {tCreate("uploadImage")}
                        </span>
                        <LinkIcon className="h-6 w-6 text-[#63687a]" />
                      </div>
                      <p className="text-xs font-normal text-[#8c92ac] leading-[16px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                        {tCreate("thumbnailHint")}
                      </p>
                      {thumbnailFile && (
                        <div className="bg-[#f4f4f7] flex items-center justify-between gap-2 px-[8px] py-[6px] rounded-[4px]">
                          <div className="flex items-center gap-[8px]">
                            <ImageIcon className="h-4 w-4 text-[#3b3d48]" />
                            <span className="text-sm font-medium text-[#3b3d48] leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                              {thumbnailFile.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleThumbnailRemove();
                              const input = document.getElementById("thumbnail-input") as HTMLInputElement;
                              if (input) input.value = "";
                            }}
                            className="h-4 w-4 text-[#3b3d48] hover:text-red-500 hover:bg-[#fee] rounded flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="w-full flex flex-col gap-[4px] items-start">
                      <Label className="text-sm font-normal text-[#7f859d] leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                        {tCreate("courseValue")}
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        placeholder={tEdit("placeholders.outcomes")}
                        value={formData.price || ""}
                        onChange={(e) => updateField("price", Number(e.target.value) || 0)}
                        className="h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm text-[#7f859d] placeholder:text-[#7f859d] px-[12px] py-[4px]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      />
                      <Label className="text-sm font-normal text-[#7f859d] leading-[20px] mt-2" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                        {tCreate("learningOutcomes")}
                      </Label>
                      <Input
                        placeholder={tEdit("placeholders.outcomes")}
                        value={formData.newOutcome}
                        onChange={(e) => updateField("newOutcome", e.target.value)}
                        onKeyDown={handleAddOutcome}
                        className="h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm text-[#7f859d] placeholder:text-[#7f859d] px-[12px] py-[4px]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      />
                      {formData.outcomes.length > 0 && (
                        <div className="flex gap-[4px] items-start flex-wrap">
                          {formData.outcomes.map((outcome, index) => (
                            <div key={index} className="bg-[#efffec] flex items-center justify-center gap-[8px] px-[8px] py-[4px] rounded-[4px]">
                              <span className="text-sm font-medium text-[#3b3d48] leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                                {outcome}
                              </span>
                              <button type="button" onClick={() => handleRemoveOutcome(index)} className="h-4 w-4 text-[#3b3d48] hover:text-red-500 flex items-center justify-center cursor-pointer">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="w-full flex flex-col gap-[4px] items-start">
                      <Label className="text-sm font-normal text-[#7f859d] leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                        {tCreate("category")}
                      </Label>
                      <Select value={formData.categoryId} onValueChange={(v) => updateField("categoryId", v)} disabled={loadingCategories}>
                        <SelectTrigger className={cn("h-[40px] rounded-[8px] border-none bg-[#fafafa] text-sm text-[#3b3d48] px-[12px] py-[4px] cursor-pointer hover:bg-[#f4f4f7]", errors.categoryId && "border border-red-500")} style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                          <SelectValue placeholder={loadingCategories ? tEdit("buttons.loadingCategories") : tEdit("buttons.selectCategory")} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 shadow-xl z-50 max-h-[300px]">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id} className="cursor-pointer hover:bg-[#3c83f6] focus:bg-[#3c83f6]">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
                    </div>

                    <div className="w-full flex flex-col gap-[4px] items-start">
                      <Label className="text-sm font-normal text-[#7f859d] leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                        {tCreate("language")}
                      </Label>
                      <Select value={formData.language} onValueChange={(v) => updateField("language", v)}>
                        <SelectTrigger className="h-[40px] rounded-[8px] border-none bg-[#fafafa] text-sm text-[#3b3d48] px-[12px] py-[4px] cursor-pointer hover:bg-[#f4f4f7]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                          <SelectValue placeholder={tEdit("buttons.selectLanguage")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vi" className="cursor-pointer">{tEdit("languages.vietnamese")}</SelectItem>
                          <SelectItem value="en" className="cursor-pointer">{tEdit("languages.english")}</SelectItem>
                          <SelectItem value="jp" className="cursor-pointer">{tEdit("languages.japanese")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col md:flex-row gap-[8px] md:gap-[4px] md:items-center w-full md:w-auto md:ml-auto md:justify-end">
                      <Button type="button" variant="outline" onClick={handleReset} className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white flex items-center justify-center gap-[4px] rounded-[6px] w-full md:w-auto transition-colors cursor-pointer">
                        <RotateCcw className="h-5 w-5" />
                        <span className="text-sm font-medium leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                          {tCreate("reset")}
                        </span>
                      </Button>
                      <Button type="button" onClick={handleSubmit} disabled={loading} className="h-[44px] px-[16px] py-[8px] bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] flex items-center justify-center gap-[4px] rounded-[6px] w-full md:w-auto cursor-pointer disabled:cursor-not-allowed">
                        <span className="text-sm font-medium leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                          {loading ? tEdit("buttons.processing") : tEdit("buttons.next")}
                        </span>
                        {!loading && <ChevronRight className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
