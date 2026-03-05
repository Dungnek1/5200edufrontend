"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  ChevronRight,
  Plus,
  X,
  Eye,
  Save,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  List,
  Sparkles,
} from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { cn } from "@/lib/utils";
import teacherCourseService from "@/services/apis/teacher-course.service";
import { toast } from "sonner";

import { logger } from '@/lib/logger';
export default function CreateCommunityPostPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const tCommon = useTranslations("common");
  const tBlog = useTranslations("blog");
  const tBlogForm = useTranslations("blog.form");

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      description?: string;
    }>
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxCharacters = 10000;
  const characterCount = content.length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);

      logger.info("🔄 [fetchCategories] Calling /teacher/categories...");
      let categoriesArray: typeof categories = [];

      try {
        const response = await teacherCourseService.getCategories();
        logger.info(
          "✅ [fetchCategories] Teacher Categories API response:",
          JSON.stringify(response, null, 2)
        );

        if (response.success && Array.isArray(response.data)) {
          categoriesArray = response.data;
          logger.info(
            "✅ [fetchCategories] Categories loaded from teacher endpoint:",
            categoriesArray.length
          );
        } else {
          logger.warn(
            "⚠️ [fetchCategories] Unexpected response format:",
            response
          );
        }
      } catch (teacherError: unknown) {
        logger.error(
          "❌ [fetchCategories] Teacher endpoint error:",
          teacherError
        );
        if (
          teacherError &&
          typeof teacherError === "object" &&
          "message" in teacherError
        ) {
          const err = teacherError as {
            message?: string;
            response?: { data?: unknown; status?: number };
          };
          logger.error("❌ [fetchCategories] Error details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
        }
      }

      if (categoriesArray.length === 0) {
        logger.info(
          "🔄 [fetchCategories] Teacher categories empty, trying public endpoint..."
        );
        try {
          const publicResponse =
            await teacherCourseService.getPublicCategories();
          logger.info(
            "✅ [fetchCategories] Public Categories API response:",
            JSON.stringify(publicResponse, null, 2)
          );

          if (publicResponse.success && Array.isArray(publicResponse.data)) {
            categoriesArray = publicResponse.data;
            logger.info(
              "✅ [fetchCategories] Public categories found:",
              categoriesArray.length
            );
          }
        } catch (publicError: unknown) {
          logger.error(
            "❌ [fetchCategories] Public endpoint error:",
            publicError
          );
          if (
            publicError &&
            typeof publicError === "object" &&
            "message" in publicError
          ) {
            const err = publicError as {
              message?: string;
              response?: { data?: unknown; status?: number };
            };
            logger.error("❌ [fetchCategories] Error details:", {
              message: err.message,
              response: err.response?.data,
              status: err.response?.status,
            });
          }
        }
      }

      setCategories(categoriesArray);

      if (categoriesArray.length === 0) {
        logger.warn(
          "⚠️ [fetchCategories] No categories found from any endpoint"
        );
        toast.warning(tBlogForm("noCategoriesHint"));
      } else {
        logger.info(
          "✅ [fetchCategories] Final categories count:",
          categoriesArray.length
        );
      }
    } catch (error: unknown) {
      logger.error("❌ [fetchCategories] Unexpected error:", error);
      if (error && typeof error === "object" && "message" in error) {
        const err = error as {
          message?: string;
          response?: { data?: unknown; status?: number };
        };
        logger.error("❌ [fetchCategories] Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
      toast.error(tBlogForm("loadCategoriesFailed"));
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="max-w-full mx-auto px-[64px]  pb-[40px]">
          <div className="flex flex-col gap-[20px]">

            <div className="flex gap-[8px] items-center text-[#7F859D]">
              <Home className="h-5 w-5 " />
              <ChevronRight className="h-4 w-4 " />
              <span
                className="text-[12px] font-medium leading-[12px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {tBlog("manage.title")}
              </span>
              <ChevronRight className="h-4 w-4 " />
              <span
                className="text-[12px] font-medium leading-[16px] text-[#3B59D2]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {tBlog("create")}
              </span>
            </div>


            <div className="flex items-center justify-between">
              <h1
                className="text-[30px] font-medium leading-[38px] text-[#0F172A]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {tBlog("create")}
              </h1>
            </div>


            <div className="flex flex-col gap-[12px]">

              <div className="flex justify-end">
                <Button
                  onClick={() => router.push(`/${locale}/teacher/community`)}
                  className="bg-[#4162e7] hover:bg-[#4162e7]/90 h-[44px] px-[16px] py-[8px] rounded-[6px]"
                >
                  <div className="flex gap-[4px] items-center">
                    <Plus className="h-5 w-5 text-white" />
                    <span
                      className="text-[14px] font-medium leading-[20px] text-white"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                    >
                      {tBlog("create")}
                    </span>
                  </div>
                </Button>
              </div>


              <div className="flex justify-center max-w-[752px] w-full mx-auto flex flex-col gap-[16px] px-[12px] py-[20px]">
                <div className="bg-white flex flex-col gap-[12px] w-full rounded-[8px] pb-[16px]">


                  <h2
                    className="text-[16px] font-medium leading-[24px] text-[#3B3D48]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    {tBlog("basicInfo")}
                  </h2>


                  <div className="flex flex-col gap-[10px]">

                    {imagePreview && (
                      <div className="h-[200px] w-full overflow-hidden relative">
                        <SafeImage
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}


                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="bg-white border border-dashed border-[#dbdde5] rounded-[12px] px-[32px] py-[20px] flex flex-col gap-[4px] items-center justify-center"
                    >
                      <p
                        className="text-[16px] font-medium leading-[24px] text-[#3b3d48] text-center"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      >
                        {tBlogForm("thumbnailHint")}
                      </p>
                      <p
                        className="text-[12px] leading-[18px] text-[#b1b1b1] text-center"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        {tBlogForm("thumbnailRecommendation")}
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="border-[#4162E7] text-[#4162E7] h-[44px] px-[16px] py-[8px] rounded-[6px] hover:bg-[#4162E7] hover:text-white transition-colors cursor-pointer"
                      >
                        <span
                          className="text-[14px] font-medium leading-[20px]"
                          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                        >
                          {tBlogForm("selectFile")}
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[12px]">
                    <label
                      className="text-[14px] leading-[20px] text-[#7f859d]"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                      {tBlogForm("title")}
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-[#fafafa] border border-[#f4f4f7] h-[40px] rounded-[8px] px-[12px] py-[4px] text-[14px] text-[#3b3d48]"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-[12px]">
                    <label
                      className="text-[14px] leading-[20px] text-[#7f859d]"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                      {tBlogForm("category")}
                    </label>
                    <Select
                      value={categoryId}
                      onValueChange={setCategoryId}
                      disabled={loadingCategories}
                    >
                      <SelectTrigger className="bg-[#fafafa] border-0 h-[40px] rounded-[8px] px-[12px] py-[4px]">
                        <SelectValue
                          placeholder={
                            loadingCategories
                              ? tBlogForm("loadingCategories")
                              : tBlogForm("selectCategory")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white p-[8px] rounded-[8px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] border-0 min-w-[120px] [&>div]:p-0">
                        {categories.map((category) => {
                          const isSelected = categoryId === category.id;
                          return (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                              className={cn(
                                isSelected
                                  ? "bg-[#eceffd] rounded-[4px] px-[8px] py-[8px] mb-[2px] focus:bg-[#eceffd]"
                                  : "px-[8px] py-[6px] rounded-[8px] focus:bg-[#fafafa]",
                                "cursor-pointer [&>span:first-child]:hidden pr-[8px]"
                              )}
                            >
                              <span
                                className={cn(
                                  "text-[14px] leading-[20px] text-[#3b3d48]",
                                  isSelected && "font-medium"
                                )}
                                style={{
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: isSelected ? 500 : 400,
                                }}
                              >
                                {category.name}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col gap-[12px]">
                    <label
                      className="text-[14px] leading-[20px] text-[#7f859d]"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                      {tBlogForm("tag")}
                    </label>
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={tBlogForm("tagPlaceholder")}
                      className="bg-[#fafafa] border border-[#f4f4f7] h-[40px] rounded-[8px] px-[12px] py-[4px] text-[14px] text-[#7f859d] placeholder:text-[#7f859d]"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    />
                    {tags.length > 0 && (
                      <div className="flex gap-[4px] items-start flex-wrap mt-[4px]">
                        {tags.map((tag, index) => (
                          <div
                            key={index}
                            className="bg-[#efffec] flex gap-[8px] items-center justify-center px-[8px] py-[4px] rounded-[4px]"
                          >
                            <span
                              className="text-[14px] font-medium leading-[20px] text-[#3b3d48]"
                              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                            >
                              {tag}
                            </span>
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="h-4 w-4 flex items-center justify-center cursor-pointer hover:bg-[#fee] hover:text-red-500 rounded transition-colors"
                            >
                              <X className="h-4 w-4 text-[#3b3d48]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>


                  <div className="flex flex-col gap-[8px]">
                    <label
                      className="text-[14px] leading-[20px] text-[#7f859d]"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                      {tBlogForm("content")}
                    </label>
                    <div className="border-[0.5px] border-[#dbdde5] rounded-[12px] flex flex-col h-[416px]">

                      <div className="flex gap-[8px] items-center p-[12px] border-b border-[#dbdde5]">
                        <button className="p-[6px] rounded-[6px] hover:bg-[#eceffd]">
                          <Bold className="h-5 w-5 text-[#8c92ac]" />
                        </button>
                        <button className="p-[6px] rounded-[6px] hover:bg-[#eceffd]">
                          <Italic className="h-5 w-5 text-[#8c92ac]" />
                        </button>
                        <button className="p-[6px] rounded-[6px] hover:bg-[#eceffd]">
                          <Underline className="h-5 w-5 text-[#8c92ac]" />
                        </button>
                        <div className="h-8 w-[12px]" />
                        <button className="p-[6px] rounded-[6px] hover:bg-[#eceffd]">
                          <AlignLeft className="h-5 w-5 text-[#8c92ac]" />
                        </button>
                        <button className="p-[6px] rounded-[6px] hover:bg-[#eceffd]">
                          <AlignCenter className="h-5 w-5 text-[#8c92ac]" />
                        </button>
                        <button className="p-[6px] rounded-[6px] hover:bg-[#eceffd]">
                          <List className="h-5 w-5 text-[#8c92ac]" />
                        </button>
                      </div>

                      {/* Textarea */}
                      <div className="flex-1 relative">
                        <Textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="w-full h-full border-0 rounded-none resize-none p-[16px] text-[14px] leading-[20px] text-[#4d505f] focus-visible:ring-0"
                          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                          placeholder={tBlogForm("contentPlaceholder")}
                        />
                        <div className="absolute bottom-[5.5px] right-[5.5px]">
                          <p
                            className="text-[14px] leading-[20px] text-[#4d505f] text-right"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                          >
                            {characterCount.toLocaleString()} {tCommon("characters")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="flex flex-col gap-[8px]">
                    <div className="flex gap-[11px] items-center">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.9981 1.00238V5.00142M20.9976 3.0019H16.9986M10.0172 1.8162C10.0601 1.58686 10.1818 1.37972 10.3613 1.23066C10.5407 1.0816 10.7667 1 11 1C11.2333 1 11.4593 1.0816 11.6388 1.23066C11.8182 1.37972 11.9399 1.58686 11.9828 1.8162L13.0335 7.37287C13.1081 7.76792 13.3001 8.1313 13.5844 8.41559C13.8687 8.69988 14.2321 8.89186 14.6271 8.96649L20.1838 10.0172C20.4131 10.0601 20.6203 10.1818 20.7693 10.3613C20.9184 10.5407 21 10.7667 21 11C21 11.2333 20.9184 11.4593 20.7693 11.6388C20.6203 11.8182 20.4131 11.9399 20.1838 11.9828L14.6271 13.0335C14.2321 13.1081 13.8687 13.3001 13.5844 13.5844C13.3001 13.8687 13.1081 14.2321 13.0335 14.6271L11.9828 20.1838C11.9399 20.4131 11.8182 20.6203 11.6388 20.7693C11.4593 20.9184 11.2333 21 11 21C10.7667 21 10.5407 20.9184 10.3613 20.7693C10.1818 20.6203 10.0601 20.4131 10.0172 20.1838L8.96649 14.6271C8.89186 14.2321 8.69988 13.8687 8.41559 13.5844C8.1313 13.3001 7.76792 13.1081 7.37287 13.0335L1.8162 11.9828C1.58686 11.9399 1.37972 11.8182 1.23066 11.6388C1.0816 11.4593 1 11.2333 1 11C1 10.7667 1.0816 10.5407 1.23066 10.3613C1.37972 10.1818 1.58686 10.0601 1.8162 10.0172L7.37287 8.96649C7.76792 8.89186 8.1313 8.69988 8.41559 8.41559C8.69988 8.1313 8.89186 7.76792 8.96649 7.37287L10.0172 1.8162ZM5.00142 18.9981C5.00142 20.1024 4.10621 20.9976 3.0019 20.9976C1.8976 20.9976 1.00238 20.1024 1.00238 18.9981C1.00238 17.8938 1.8976 16.9986 3.0019 16.9986C4.10621 16.9986 5.00142 17.8938 5.00142 18.9981Z" stroke="#3B59D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                      <h3
                        className="text-[18px] font-medium leading-[28px] text-[#3B59D2]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      >
                        {tBlog("writingTipsShort")}
                      </h3>
                    </div>
                    <ul className="flex flex-col gap-[4px] list-disc list-inside">
                      <li
                        className="text-[14px] leading-[20px] text-[#63687a]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        {tBlog("eventTips.useToolbar")}
                      </li>
                      <li
                        className="text-[14px] leading-[20px] text-[#63687a]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        {tBlog("eventTips.addTags")}
                      </li>
                      <li
                        className="text-[14px] leading-[20px] text-[#63687a]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        {tBlog("eventTips.autoSave")}
                      </li>
                      <li
                        className="text-[14px] leading-[20px] text-[#63687a]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        {tBlog("eventTips.usePreview")}
                      </li>
                    </ul>
                  </div>
                </div>


                <div className="flex gap-[8px] items-center justify-between px-[12px] pb-[16px]">
                  <Button
                    variant="outline"
                    className="border-[#4162e7] text-[#4162e7]  h-[44px] px-[16px] py-[8px] rounded-[6px] w-[122px]"
                  >
                    <div className="flex gap-[4px] items-center">
                      <Eye className="h-5 w-5" />
                      <span
                        className="text-[14px] font-medium leading-[20px]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      >
                        {tBlog("preview")}
                      </span>
                    </div>
                  </Button>
                  <div className="flex items-center gap-[10px]">
                    <Button
                      variant="outline"
                      className="border-[#4162e7] text-[#4162e7] h-[44px] px-[16px] py-[8px] rounded-[6px]"
                    >
                      <span
                        className="text-[14px] font-medium leading-[20px]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      >
                        {tBlog("saveDraft")}
                      </span>
                    </Button>
                    <Button
                      className="bg-[#4162e7]  h-[44px] px-[16px] py-[8px] rounded-[6px]"
                    >
                      <span
                        className="text-[14px] font-medium leading-[20px] text-white"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      >
                        {tBlog("saveAndPublish")}
                      </span>
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

