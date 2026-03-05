"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X, Sparkles, Loader2, Eye, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import teacherCourseService from "@/services/apis/teacher-course.service";
import { blogService, type Blog } from "@/services/apis/blog.service";
import { toast } from "sonner";
import BlogEditor from "@/components/blogs/BlogEditor";
import EventDetails from "@/components/home/event-details";
import type { BlogItem } from "@/types/blog";

interface BlogFormProps {
    mode: "create" | "edit";
    blog?: Blog;
    onCancel: () => void;
    onSuccess: () => void;
}

export function BlogForm({ mode, blog, onCancel, onSuccess }: BlogFormProps) {
    const t = useTranslations();

    const [title, setTitle] = useState(blog?.title || "");
    const [subtitle, setSubtitle] = useState(blog?.subtitle || "");
    const [categoryId, setCategoryId] = useState(blog?.categoryId || "");
    const [categories, setCategories] = useState<
        Array<{ id: string; name: string; slug: string; description?: string }>
    >([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [availableTags, setAvailableTags] = useState<
        Array<{ id: string; name: string; slug: string }>
    >([]);
    const [loadingTags, setLoadingTags] = useState(false);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(blog?.tagIds || []);
    const [content, setContent] = useState(blog?.content || "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        blog?.thumbnailUrl ? `${process.env.NEXT_PUBLIC_MINIO}/${blog.thumbnailUrl}` : null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleToggleTag = (tagId: string) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleRemoveTag = (tagId: string) => {
        setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
    };

    const fetchCategories = useCallback(async () => {
        try {
            setLoadingCategories(true);
            const publicResponse = await teacherCourseService.getPublicCategories();
            if (publicResponse.success && Array.isArray(publicResponse.data)) {
                setCategories(publicResponse.data);
            }
        } catch (error) {
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    const fetchTags = useCallback(async () => {
        try {
            setLoadingTags(true);
            const response = await teacherCourseService.getTags();
            if (response.success && Array.isArray(response.data)) {
                setAvailableTags(response.data);
            }
        } catch (error) {
            setAvailableTags([]);
        } finally {
            setLoadingTags(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchTags();
    }, [fetchCategories, fetchTags]);

    const generateSlug = (text: string): string => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleSaveDraft = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error(t("blog.validation.titleRequired") + " & " + t("blog.validation.contentRequired"));
            return;
        }

        setIsSubmitting(true);
        try {
            const slug = generateSlug(title);

            if (mode === "edit" && blog) {
                await blogService.updateBlog(blog.id, {
                    title: title.trim(),
                    slug,
                    subtitle: subtitle.trim() || undefined,
                    content: content.trim(),
                    tagIds: selectedTagIds,
                });
                toast.success("Cập nhật bản nháp thành công!");
            } else {
                await blogService.createBlog({
                    title: title.trim(),
                    slug,
                    subtitle: subtitle.trim() || undefined,
                    thumbnail: imageFile || undefined,
                    content: content.trim(),
                    categoryId: categoryId || undefined,
                    type: "HOITHAO",
                    tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
                });
                toast.success(t("blog.created"));
            }

            onSuccess();
        } catch (error: unknown) {
            if (error && typeof error === "object" && "message" in error) {
                const err = error as { message?: string };
                toast.error(err.message || t("blog.upload.failed"));
            } else {
                toast.error(t("blog.upload.failed"));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveAndPublish = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error(t("blog.validation.titleRequired") + " & " + t("blog.validation.contentRequired"));
            return;
        }

        if (!categoryId) {
            toast.error(t("blog.validation.categoryRequired"));
            return;
        }

        setIsSubmitting(true);
        try {
            const slug = generateSlug(title);

            if (mode === "edit" && blog) {
                await blogService.updateBlog(blog.id, {
                    title: title.trim(),
                    slug,
                    subtitle: subtitle.trim() || undefined,
                    content: content.trim(),
                    tagIds: selectedTagIds,
                });

                if (blog.status === "DRAFT") {
                    await blogService.publishBlog(blog.id);
                }

                toast.success("Cập nhật và xuất bản thành công!");
            } else {
                const result = await blogService.createBlog({
                    title: title.trim(),
                    slug,
                    subtitle: subtitle.trim() || undefined,
                    thumbnail: imageFile || undefined,
                    content: content.trim(),
                    categoryId,
                    type: "CONGDONG",
                    tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
                });

                if (result.success && result.data?.id) {
                    await blogService.publishBlog(result.data.id);
                }

                toast.success(t("blog.published"));
            }

            onSuccess();
        } catch (error: unknown) {
            if (error && typeof error === "object" && "message" in error) {
                const err = error as { message?: string };
                toast.error(err.message || t("blog.upload.failed"));
            } else {
                toast.error(t("blog.upload.failed"));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showPreview) {
        const previewEvent: BlogItem = {
            id: "preview", slug: "preview", title, content,
            thumbnailUrl: imagePreview || "",
            status: "DRAFT", categoryId, creatorId: "", type: "CONGDONG",
            publishedAt: null, createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(), updatedBy: null,
            creator: { id: "", fullName: "", email: "", avatarUrl: null },
            category: { id: categoryId, name: categories.find((c) => c.id === categoryId)?.name || "", slug: "" },
            tags: availableTags.filter((tag) => selectedTagIds.includes(tag.id)).map((tag) => tag.name),
        };
        return (
            <div className="relative z-20 bg-[#FAFAFA] min-h-screen">
                {/* Preview header bar */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#e2e4eb] shadow-sm px-4 sm:px-8 lg:px-[64px] py-[12px]">
                    <div className="max-w-[1990px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-[12px]">
                            <div className="flex items-center gap-[8px] bg-[#eceffd] px-[12px] py-[4px] rounded-full">
                                <Eye className="h-4 w-4 text-[#4162e7]" />
                                <span className="text-[14px] font-medium text-[#4162e7]">
                                    {t("blog.preview")}
                                </span>
                            </div>
                            {title && (
                                <span className="text-[13px] text-[#7f859d] truncate max-w-[300px]">
                                    {title}
                                </span>
                            )}
                        </div>
                        <Button
                            type="button"
                            onClick={() => { setShowPreview(false); window.scrollTo(0, 0); }}
                            className="bg-[#4162e7] hover:bg-[#4162e7]/90 h-[40px] px-[20px] rounded-[8px] shadow-sm"
                        >
                            <X className="h-4 w-4 text-white mr-2" />
                            <span className="text-[14px] font-medium text-white">
                                {t("blog.backToEdit")}
                            </span>
                        </Button>
                    </div>
                </div>
                {/* Actual student view */}
                <EventDetails event={previewEvent} isPreview />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-full mx-auto px-[64px] pb-[40px]">
                <div className="flex flex-col gap-[20px]">
                    <div className="flex items-center justify-between">
                        <h1
                            className="text-[30px] font-medium leading-[38px] text-[#0F172A]"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                        >
                            {mode === "edit" ? "Chỉnh sửa blog" : t("blog.create")}
                        </h1>
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            className="border-[#4162e7] text-[#4162e7]"
                        >
                            Hủy
                        </Button>
                    </div>

                    <div className="flex justify-center px-[200px]">
                        <div className="bg-white flex flex-col gap-[12px] w-full rounded-[8px] pb-[16px]">
                            <div className="flex flex-col gap-[16px] px-[12px] py-[20px]">
                                <h2
                                    className="text-[16px] font-medium leading-[24px] text-[#3b3d48]"
                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                >
                                    {t("blog.basicInfo")}
                                </h2>

                                <div className="flex flex-col gap-[10px]">
                                    {imagePreview && (
                                        <div className="h-[200px] w-full rounded-[8px] overflow-hidden relative">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
                                            {t("blog.form.thumbnailHint")}
                                        </p>
                                        <p
                                            className="text-[12px] leading-[18px] text-[#b1b1b1] text-center"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                        >
                                            {t("blog.form.thumbnailType")} {t("blog.form.maxSize")} 10MB
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
                                            className="mt-[8px] border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white h-[44px] px-[16px] py-[8px] rounded-[6px] transition-colors"
                                        >
                                            <span
                                                className="text-[14px] font-medium leading-[20px]"
                                                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                            >
                                                {t("blog.form.selectFile")}
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-[4px]">
                                    <label
                                        className="text-[14px] leading-[20px] text-[#7f859d]"
                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                    >
                                        {t("blog.form.title")}
                                    </label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={t("blog.form.titlePlaceholder")}
                                        className="bg-[#fafafa] border border-[#f4f4f7] h-[40px] rounded-[8px] px-[12px] py-[4px] text-[14px] text-[#3b3d48]"
                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                    />
                                </div>

                                <div className="flex flex-col gap-[4px]">
                                    <label
                                        className="text-[14px] leading-[20px] text-[#7f859d]"
                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                    >
                                        {t("blog.form.category")}
                                    </label>
                                    <Select value={categoryId} onValueChange={setCategoryId} disabled={loadingCategories}>
                                        <SelectTrigger className="bg-[#fafafa] border-0 h-[40px] rounded-[8px] px-[12px] py-[4px]">
                                            <SelectValue
                                                placeholder={
                                                    loadingCategories
                                                        ? t("blog.form.loadingCategories")
                                                        : t("blog.form.selectCategory")
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

                                <div className="flex flex-col gap-[4px]">
                                    <label
                                        className="text-[14px] leading-[20px] text-[#7f859d]"
                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                    >
                                        {t("blog.form.tag")}
                                    </label>
                                    {loadingTags ? (
                                        <div className="bg-[#fafafa] border-0 h-[40px] rounded-[8px] px-[12px] py-[4px] flex items-center">
                                            <span
                                                className="text-[14px] leading-[20px] text-[#7f859d]"
                                                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                            >
                                                {t("blog.form.loadingTags")}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="bg-[#fafafa] border-0 rounded-[8px] px-[12px] py-[8px] max-h-[200px] overflow-y-auto">
                                            {availableTags.length === 0 ? (
                                                <p
                                                    className="text-[14px] leading-[20px] text-[#7f859d]"
                                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                >
                                                    {t("blog.form.noTags")}
                                                </p>
                                            ) : (
                                                <div className="flex flex-col gap-[8px]">
                                                    {availableTags.map((tag) => (
                                                        <label
                                                            key={tag.id}
                                                            className="flex items-center gap-[8px] cursor-pointer hover:bg-[#eceffd] px-[4px] py-[4px] rounded-[4px] transition-colors"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedTagIds.includes(tag.id)}
                                                                onChange={() => handleToggleTag(tag.id)}
                                                                className="h-4 w-4 rounded border-[#cbcbcb] text-[#4162e7] focus:ring-[#4162e7]"
                                                            />
                                                            <span
                                                                className="text-[14px] leading-[20px] text-[#3b3d48]"
                                                                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                            >
                                                                {tag.name}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {selectedTagIds.length > 0 && (
                                        <div className="flex gap-[4px] items-start flex-wrap mt-[4px]">
                                            {selectedTagIds.map((tagId) => {
                                                const tag = availableTags.find((t) => t.id === tagId);
                                                if (!tag) return null;
                                                return (
                                                    <div
                                                        key={tagId}
                                                        className="bg-[#efffec] flex gap-[8px] items-center justify-center px-[8px] py-[4px] rounded-[4px]"
                                                    >
                                                        <span
                                                            className="text-[14px] font-medium leading-[20px] text-[#3b3d48]"
                                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTag(tagId)}
                                                            className="h-4 w-4 flex items-center justify-center cursor-pointer hover:bg-[#fee] hover:text-red-500 rounded transition-colors"
                                                        >
                                                            <X className="h-4 w-4 text-[#3b3d48]" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-[8px]">
                                    <label
                                        className="text-[14px] leading-[20px] text-[#7f859d]"
                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                    >
                                        Nội dung
                                    </label>
                                    <BlogEditor onChange={setContent} maxLength={10000} initialContent={content} />
                                </div>

                                <div className="flex flex-col gap-[8px]">
                                    <div className="flex gap-[11px] items-center">
                                        <Sparkles className="h-6 w-6 text-[#3b59d2]" />
                                        <h3
                                            className="text-[18px] font-medium leading-[28px] text-[#3b59d2]"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                        >
                                            {t("blog.writingTips")}
                                        </h3>
                                    </div>
                                    <ul className="flex flex-col gap-[4px] list-disc list-inside">
                                        <li
                                            className="text-[14px] leading-[20px] text-[#63687a]"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                        >
                                            {t("blog.tips.engaging")}
                                        </li>
                                        <li
                                            className="text-[14px] leading-[20px] text-[#63687a]"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                        >
                                            {t("blog.tips.keywords")}
                                        </li>
                                        <li
                                            className="text-[14px] leading-[20px] text-[#63687a]"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                        >
                                            {t("blog.tips.structure")}
                                        </li>
                                        <li
                                            className="text-[14px] leading-[20px] text-[#63687a]"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                        >
                                            {t("blog.tips.images")}
                                        </li>
                                        <li
                                            className="text-[14px] leading-[20px] text-[#63687a]"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                        >
                                            {t("blog.tips.cta")}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-[8px] items-center justify-end px-[12px] pb-[16px]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isSubmitting}
                                    onClick={(e) => { e.preventDefault(); setShowPreview(true); window.scrollTo(0, 0); }}
                                    className="border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white h-[44px] px-[16px] py-[8px] rounded-[6px] w-[122px] transition-colors"
                                >
                                    <div className="flex gap-[4px] items-center">
                                        <Eye className="h-5 w-5" />
                                        <span
                                            className="text-[14px] font-medium leading-[20px]"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                        >
                                            {t("blog.preview")}
                                        </span>
                                    </div>
                                </Button>
                                <Button
                                    onClick={handleSaveDraft}
                                    disabled={isSubmitting}
                                    variant="outline"
                                    className="border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white h-[44px] px-[16px] py-[8px] rounded-[6px] transition-colors"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <span
                                            className="text-[14px] font-medium leading-[20px]"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                        >
                                            {t("blog.saveDraft")}
                                        </span>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleSaveAndPublish}
                                    disabled={isSubmitting}
                                    className="bg-[#4162e7] hover:bg-[#4162e7]/90 h-[44px] px-[16px] py-[8px] rounded-[6px]"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                                    ) : (
                                        <span
                                            className="text-[14px] font-medium leading-[20px] text-white"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                        >
                                            {t("blog.saveAndPublish")}
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
