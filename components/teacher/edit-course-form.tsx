"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
import {
    X,
    LinkIcon,
    ImageIcon,
    RotateCcw,
    ChevronRight,
    Home
} from "lucide-react";
import teacherCourseService from "@/services/apis/teacher-course.service";
import uploadService from "@/services/apis/upload.service";
import { CourseDetailModules } from "@/components/courses/course-detail-modules";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

interface EditCourseFormProps {
    courseId: string;
    course: Course;
    onCancel: () => void;
    onSuccess?: () => void;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export function EditCourseForm({
    courseId,
    course,
    onCancel,
    onSuccess,
}: EditCourseFormProps) {
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || "vi";
    const tNav = useTranslations("nav");
    const tCommon = useTranslations("common");
    const tEdit = useTranslations("teacher.courses.edit");
    const tCourseContent = useTranslations("teacherCourseContent");

    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [courseDetail, setCourseDetail] = useState<Course | null>(null);
    const [loadingModules, setLoadingModules] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        categoryIds: [] as string[],
        language: "vi",
        outcomes: [] as string[],
        newOutcome: "",
    });

    const [originalData, setOriginalData] = useState({
        title: "",
        description: "",
        price: 0,
        categoryIds: [] as string[],
        language: "vi",
        outcomes: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadCourseData();
        fetchCategories();
    }, [course]);

    // Đồng bộ lại category từ course khi danh sách categories vừa load xong (Radix Select cần có SelectItem mới hiện đúng)
    useEffect(() => {
        if (loadingCategories || !categories.length || formData.categoryIds.length > 0) return;
        const c = course as any;
        let ids: string[] = [];
        if (Array.isArray(c?.categoryIds) && c.categoryIds.length > 0) ids = c.categoryIds.map((id: unknown) => String(id));
        else if (c?.categoryId != null && c.categoryId !== "") ids = [String(c.categoryId)];
        else if (c?.category?.id != null) ids = [String(c.category.id)];
        else if (Array.isArray(c?.categories) && c.categories.length > 0) ids = c.categories.map((cat: any) => String(cat?.id ?? cat)).filter(Boolean);
        else if (c?.selectedCategoryId != null && c.selectedCategoryId !== "") ids = [String(c.selectedCategoryId)];
        else if (c?.packCategory?.id != null) ids = [String(c.packCategory.id)];
        else if (c?.courseCategory?.id != null) ids = [String(c.courseCategory.id)];
        if (ids.length > 0 && categories.some((cat) => cat.id === ids[0])) {
            setFormData((prev) => ({ ...prev, categoryIds: ids }));
        }
    }, [loadingCategories, categories, course, formData.categoryIds.length]);

    const loadCourseData = () => {
        if (!course) return;

        let outcomes: string[] = [];
        const rawOutcomes = course.learningOutcomes as unknown;
        if (rawOutcomes) {
            if (Array.isArray(rawOutcomes)) {
                outcomes = (rawOutcomes as string[]).filter(Boolean);
            } else if (typeof rawOutcomes === "string") {
                outcomes = rawOutcomes.split(",").map((o: string) => o.trim()).filter(Boolean);
            }
        }

        const c = course as any;

        let categoryIds: string[] = [];
        if (Array.isArray(c.categoryIds) && c.categoryIds.length > 0) {
            categoryIds = c.categoryIds.map((id: unknown) => String(id));
        } else if (c.categoryId != null && c.categoryId !== "") {
            categoryIds = [String(c.categoryId)];
        } else if (c.category?.id != null) {
            categoryIds = [String(c.category.id)];
        } else if (Array.isArray(c.categories) && c.categories.length > 0) {
            categoryIds = c.categories.map((cat: any) => String(cat?.id ?? cat)).filter(Boolean);
        } else if (c.selectedCategoryId != null && c.selectedCategoryId !== "") {
            categoryIds = [String(c.selectedCategoryId)];
        } else if (c.packCategory?.id != null) {
            categoryIds = [String(c.packCategory.id)];
        } else if (c.courseCategory?.id != null) {
            categoryIds = [String(c.courseCategory.id)];
        }

        const courseData = {
            title: course.title || "",
            description: course.description || "",
            price: course.price || 0,
            categoryIds,
            language: c.language || "vi",
            outcomes: outcomes,
        };

        setFormData({
            ...courseData,
            newOutcome: "",
        });

        setOriginalData(courseData);
    };

    const fetchCourseDetail = useCallback(async () => {
        try {
            setLoadingModules(true);
            const response = await teacherCourseService.getCourse(courseId);
            // Handle double-nested response: response.data may be { status, data: Course }
            const rawData = response.data as any;
            const courseData = rawData?.data?.sections ? rawData.data : rawData;
            if (courseData?.sections) {
                setCourseDetail(courseData as Course);
            }
        } catch (error) {
            toast.error(tCourseContent("loadModulesFailed"));
        } finally {
            setLoadingModules(false);
        }
    }, [courseId, tCourseContent]);

    const fetchCategories = useCallback(async () => {
        try {
            setLoadingCategories(true);
            const response = await teacherCourseService.getCategories();
            if (response.success && Array.isArray(response.data)) {
                setCategories(response.data);
            }
        } catch (error) {
            toast.error(tEdit("errors.loadCategoriesFailed"));
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    const hasFormDataChanged = () => {
        return (
            formData.title.trim() !== originalData.title ||
            formData.description.trim() !== originalData.description ||
            formData.price !== originalData.price ||
            formData.language !== originalData.language ||
            JSON.stringify(formData.categoryIds.sort()) !== JSON.stringify(originalData.categoryIds.sort()) ||
            JSON.stringify(formData.outcomes.sort()) !== JSON.stringify(originalData.outcomes.sort())
        );
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = tEdit("errors.titleRequired");
        if (!formData.description.trim()) newErrors.description = tEdit("errors.descriptionRequired");
        if (formData.categoryIds.length === 0) newErrors.categoryIds = tEdit("errors.categoryRequired");

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (!isValid) {
            const firstMessage = Object.values(newErrors)[0];
            if (firstMessage) toast.error(firstMessage);
        }
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            // Check if form data has changed and skip API call if no changes
            const hasChanges = hasFormDataChanged();
            const hasThumbnailChange = thumbnailFile !== null;

            if (hasChanges) {
                const payload: any = {
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    categoryIds: formData.categoryIds,
                    language: formData.language,
                };

                if (formData.outcomes.length > 0) {
                    payload.learningOutcomes = formData.outcomes;
                }
                if (formData.price && formData.price > 0) {
                    payload.price = formData.price;
                }

                await teacherCourseService.updateCourse(courseId, payload);
            }

            if (thumbnailFile) {
                try {
                    await uploadService.uploadCourseThumbnail(courseId, thumbnailFile);
                } catch (error) {
                    toast.warning(tEdit("warnings.thumbnailUploadFailed"));
                }
            }

            if (hasChanges || hasThumbnailChange) {
                toast.success(tEdit("success.courseUpdated"));
            }

            await fetchCourseDetail();
            setCurrentStep(2);
        } catch (error: unknown) {
            let errorMessage = tEdit("errors.updateFailed");
            if (error && typeof error === "object" && "response" in error) {
                const axiosError = error as {
                    response?: { data?: { message?: string; error?: string } };
                    message?: string;
                };
                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                } else if (axiosError.response?.data?.error) {
                    errorMessage = axiosError.response.data.error;
                } else if (axiosError.message) {
                    errorMessage = axiosError.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOutcome = (e?: React.KeyboardEvent) => {
        if (e && e.key !== "Enter") return;
        e?.preventDefault();

        if (formData.newOutcome.trim()) {
            setFormData((prev) => ({
                ...prev,
                outcomes: [...prev.outcomes, prev.newOutcome.trim()],
                newOutcome: "",
            }));
        }
    };

    const handleRemoveOutcome = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            outcomes: prev.outcomes.filter((_, i) => i !== index),
        }));
    };

    const handleThumbnailSelect = (file: File) => {
        setThumbnailFile(file);
    };

    return (
        <main className="min-h-screen bg-white">
            <div className="bg-white mx-auto max-w-[1990px] w-full px-4 sm:px-6 md:px-8 lg:px-[64px] py-4 sm:py-5 md:py-[20px] pb-6 sm:pb-8 md:pb-[40px] flex flex-col gap-3 sm:gap-4 lg:gap-[16px]">
                {/* Header */}
                <div className="flex flex-col gap-4 md:gap-5 lg:gap-[20px]">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 md:gap-[8px] flex-wrap">
                        <Home className="h-4 w-4 md:h-5 md:w-5 text-[#8c92ac]" />
                        <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-[#8c92ac]" />
                        <span
                            className="text-xs font-medium text-[#7f859d] cursor-pointer hover:text-[#4162e7]"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                            onClick={onCancel}
                        >
                            {tNav("courseManagement")}
                        </span>
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#8c92ac]" />
                        <span
                            className="text-xs font-medium text-[#3b59d2]"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                        >
                            {tCommon("edit")}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-3 md:gap-4">
                        <h1 className="text-xl leading-6 md:text-2xl md:leading-7 lg:text-[30px] lg:leading-[38px] font-medium text-[#0f172a]">
                            {tEdit("title")}
                        </h1>
                    </div>
                </div>

                {/* Stepper */}
                <div className="w-full flex flex-col gap-[12px] items-center overflow-x-hidden overflow-y-visible mt-4 md:mt-6 lg:mt-8 pt-2 md:pt-3">
                    <div className="flex items-start justify-between max-w-[1008px] w-full lg:max-w-[800px] relative px-4 md:px-0 gap-4 md:gap-6 lg:gap-8">
                        {/* Connecting Line */}
                        <div className="absolute top-[12px] h-0 z-0 left-[62.5px] md:left-[72.5px] lg:left-[94px] right-[62.5px] md:right-[72.5px] lg:right-[94px]">
                            <div className={cn("w-full h-[1px]", currentStep >= 2 ? "bg-[#4162e7]" : "bg-[#d2d2d2]")} />
                        </div>

                        {/* Step 1: Info */}
                        <div className="flex flex-col items-center gap-[8px] md:gap-[12px] w-[100px] md:w-[120px] lg:w-[188px] relative z-10 flex-shrink-0">
                            <div className={cn(
                                "h-5 w-5 md:h-6 md:w-6 rounded-full flex items-center justify-center",
                                currentStep >= 1
                                    ? "bg-[#4162e7] shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#3b59d2]"
                                    : "bg-[#fafafa] border-[1.5px] border-[#d2d2d2]"
                            )}>
                                <div className={cn("h-1.5 w-1.5 md:h-2 md:w-2 rounded-full", currentStep >= 1 ? "bg-white" : "bg-[#d2d2d2]")} />
                            </div>
                            <p
                                className={cn(
                                    "text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-center w-full",
                                    currentStep >= 1 ? "text-[#2e46a4]" : "text-[#63687a]"
                                )}
                                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                            >
                                {tCourseContent("steps.info")}
                            </p>
                        </div>

                        {/* Step 2: Modules */}
                        <div className="flex flex-col items-center gap-[8px] sm:gap-[12px] w-[100px] sm:w-[120px] md:w-[188px] relative z-10 flex-shrink-0">
                            <div className={cn(
                                "h-5 w-5 md:h-6 md:w-6 rounded-full flex items-center justify-center",
                                currentStep >= 2
                                    ? "bg-[#4162e7] shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#3b59d2]"
                                    : "bg-[#fafafa] border-[1.5px] border-[#d2d2d2]"
                            )}>
                                <div className={cn("h-1.5 w-1.5 md:h-2 md:w-2 rounded-full", currentStep >= 2 ? "bg-white" : "bg-[#d2d2d2]")} />
                            </div>
                            <p
                                className={cn(
                                    "text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-center w-full",
                                    currentStep >= 2 ? "text-[#2e46a4]" : "text-[#63687a]"
                                )}
                                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                            >
                                {tCourseContent("steps.content")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="w-full flex flex-col items-center overflow-x-hidden">
                    <div className="w-full flex flex-col items-start">
                        <div className="w-full flex items-start">
                            <div className="flex-1 flex items-start justify-center">
                                {currentStep === 1 ? (
                                    <div className="w-full max-w-[748px] flex flex-col gap-[16px] md:gap-[20px] items-end justify-end px-4 md:px-0">
                                        <h2
                                            className="text-xl leading-[28px] md:text-2xl md:leading-[30px] lg:text-[24px] lg:leading-[32px] font-medium text-[#0f172a] w-full text-left"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                        >
                                            {tEdit("tabs.basic")}
                                        </h2>

                                        <div className="w-full flex flex-col gap-[12px] items-start">
                                            {/* Title */}
                                            <div className="w-full flex flex-col gap-[4px] items-start">
                                                <Label
                                                    htmlFor="title"
                                                    className="text-sm font-normal text-[#7f859d] leading-[20px]"
                                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                >
                                                    {tEdit("fields.title")}
                                                </Label>
                                                <Input
                                                    id="title"
                                                    placeholder={tEdit("placeholders.title")}
                                                    value={formData.title}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, title: e.target.value });
                                                        if (errors.title) setErrors({ ...errors, title: "" });
                                                    }}
                                                    className={cn(
                                                        "h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm text-[#7f859d] placeholder:text-[#7f859d] px-[12px] py-[4px]",
                                                        errors.title && "border-red-500"
                                                    )}
                                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                />
                                                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                                            </div>

                                            {/* Description */}
                                            <div className="w-full flex flex-col gap-[4px] items-start">
                                                <Label
                                                    htmlFor="description"
                                                    className="text-sm font-normal text-[#7f859d] leading-[20px]"
                                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                >
                                                    {tEdit("fields.description")}
                                                </Label>
                                                <div className="relative w-full">
                                                    <Textarea
                                                        id="description"
                                                        placeholder=""
                                                        value={formData.description}
                                                        onChange={(e) => {
                                                            if (e.target.value.length <= 500) {
                                                                setFormData({ ...formData, description: e.target.value });
                                                                if (errors.description) setErrors({ ...errors, description: "" });
                                                            }
                                                        }}
                                                        className={cn(
                                                            "h-[160px] rounded-[8px] border-none bg-[#f4f4f7] text-sm text-[#3b3d48] placeholder:text-[#3b3d48] resize-none px-[12px] py-[8px]",
                                                            errors.description && "border border-red-500"
                                                        )}
                                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                    />
                                                    <span
                                                        className="absolute bottom-[24px] right-[12px] text-xs text-[#8c92ac] leading-[16px]"
                                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                    >
                                                        {formData.description.length}/500
                                                    </span>
                                                </div>
                                                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                                            </div>

                                            {/* Thumbnail */}
                                            <div className="w-full flex flex-col gap-[4px] items-start">
                                                <div className="w-full flex flex-col gap-[4px] items-start">
                                                    <Label className="text-sm font-normal text-[#7f859d] leading-[20px]">
                                                        {tEdit("fields.thumbnail")}
                                                    </Label>
                                                    {/* Hiển thị ảnh hiện có khi chưa chọn ảnh mới */}
                                                    {!thumbnailFile && course?.thumbnailUrl && (
                                                        <div className="relative w-full max-w-[370px] aspect-[370/200] rounded-[8px] overflow-hidden bg-[#f4f4f7] border border-[#f4f4f7]">
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_MINIO || ""}/${course.thumbnailUrl}`}
                                                                alt={course.title || tEdit("labels.thumbnailAlt")}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}
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
                                                                if (file) handleThumbnailSelect(file);
                                                            }}
                                                        />
                                                        <span
                                                            className="flex-1 text-sm font-normal text-[#8c92ac] leading-[20px]"
                                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                        >
                                                            {!thumbnailFile && course?.thumbnailUrl
                                                                ? tEdit("labels.changeThumbnail")
                                                                : tEdit("labels.uploadThumbnail")}
                                                        </span>
                                                        <LinkIcon className="h-6 w-6 text-[#63687a]" />
                                                    </div>
                                                    <p
                                                        className="text-xs font-normal text-[#8c92ac] leading-[16px]"
                                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                    >
                                                        {tEdit("labels.thumbnailHint")}
                                                    </p>
                                                </div>
                                                {thumbnailFile && (
                                                    <div className="bg-[#f4f4f7] flex items-center justify-between gap-2 px-[8px] py-[6px] rounded-[4px]">
                                                        <div className="flex items-center gap-[8px]">
                                                            <ImageIcon className="h-4 w-4 text-[#3b3d48]" />
                                                            <span
                                                                className="text-sm font-medium text-[#3b3d48] leading-[20px]"
                                                                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                                            >
                                                                {thumbnailFile.name}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setThumbnailFile(null);
                                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                                            }}
                                                            className="h-4 w-4 text-[#3b3d48] hover:text-red-500 flex items-center justify-center cursor-pointer"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price & Outcomes */}
                                            <div className="w-full flex flex-col gap-[4px] items-start">
                                                <Label
                                                    className="text-sm font-normal text-[#7f859d] leading-[20px]"
                                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                >
                                                    {tEdit("fields.price")}
                                                </Label>
                                                <Input
                                                    placeholder={tEdit("placeholders.outcomes")}
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                    className="h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm text-[#7f859d] placeholder:text-[#7f859d] px-[12px] py-[4px]"
                                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                />

                                                <Label
                                                    className="text-sm font-normal text-[#7f859d] leading-[20px]"
                                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                >
                                                    {tEdit("fields.outcomes")}
                                                </Label>
                                                <Input
                                                    placeholder={tEdit("placeholders.outcomes")}
                                                    value={formData.newOutcome}
                                                    onChange={(e) => setFormData({ ...formData, newOutcome: e.target.value })}
                                                    onKeyDown={handleAddOutcome}
                                                    className="h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm text-[#7f859d] placeholder:text-[#7f859d] px-[12px] py-[4px]"
                                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                />
                                            </div>

                                            {formData.outcomes.length > 0 && (
                                                <div className="flex gap-[4px] items-start flex-wrap">
                                                    {formData.outcomes.map((outcome, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-[#efffec] flex items-center justify-center gap-[8px] px-[8px] py-[4px] rounded-[4px]"
                                                        >
                                                            <span
                                                                className="text-sm font-medium text-[#3b3d48] leading-[20px]"
                                                                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                                            >
                                                                {outcome}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveOutcome(index)}
                                                                className="h-4 w-4 text-[#3b3d48] hover:text-red-500 flex items-center justify-center cursor-pointer"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Category */}
                                            <div className="w-full flex flex-col gap-[4px] items-start">
                                                <Label
                                                    className="text-sm font-normal text-[#7f859d] leading-[20px]"
                                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                >
                                                    {tEdit("fields.category")}
                                                </Label>
                                                <Select
                                                    value={formData.categoryIds[0] && categories.some((c) => c.id === formData.categoryIds[0]) ? formData.categoryIds[0] : undefined}
                                                    onValueChange={(value) => {
                                                        setFormData({ ...formData, categoryIds: [value] });
                                                        if (errors.categoryIds) setErrors({ ...errors, categoryIds: "" });
                                                    }}
                                                    disabled={loadingCategories}
                                                >
                                                    <SelectTrigger
                                                        className={cn(
                                                            "h-[40px] rounded-[8px] border-none bg-[#fafafa] text-sm text-[#3b3d48] px-[12px] py-[4px] cursor-pointer hover:bg-[#f4f4f7]",
                                                            errors.categoryIds && "border border-red-500"
                                                        )}
                                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                    >
                                                        <SelectValue placeholder={loadingCategories ? tEdit("buttons.loadingCategories") : tEdit("buttons.selectCategory")} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border-gray-200 shadow-xl z-50 max-h-[300px]">
                                                        {categories.map((category) => (
                                                            <SelectItem
                                                                key={category.id}
                                                                value={category.id}
                                                                className="cursor-pointer hover:bg-[#3c83f6] focus:bg-[#3c83f6]"
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.categoryIds && <p className="text-xs text-red-500 mt-1">{errors.categoryIds}</p>}
                                            </div>

                                            {/* Language */}
                                            <div className="w-full flex flex-col gap-[4px] items-start">
                                                <Label
                                                    className="text-sm font-normal text-[#7f859d] leading-[20px]"
                                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                >
                                                    {tEdit("fields.language")}
                                                </Label>
                                                <Select
                                                    value={formData.language || "vi"}
                                                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                                                >
                                                    <SelectTrigger
                                                        className="h-[40px] rounded-[8px] border-none bg-[#fafafa] text-sm text-[#3b3d48] px-[12px] py-[4px] cursor-pointer hover:bg-[#f4f4f7]"
                                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                                    >
                                                        <SelectValue placeholder={tEdit("buttons.selectLanguage")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="vi">{tEdit("languages.vietnamese")}</SelectItem>
                                                        <SelectItem value="en">{tEdit("languages.english")}</SelectItem>
                                                        <SelectItem value="jp">{tEdit("languages.japanese")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col md:flex-row gap-[8px] md:gap-[4px] md:items-center w-full md:w-auto md:ml-auto md:justify-end">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={onCancel}
                                                    className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white flex items-center justify-center gap-[4px] rounded-[6px] w-full md:w-auto transition-colors cursor-pointer"
                                                >
                                                    <RotateCcw className="h-5 w-5" />
                                                    <span
                                                        className="text-sm font-medium leading-[20px]"
                                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                                    >
                                                        {tCommon("cancel")}
                                                    </span>
                                                </Button>

                                                <Button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                    className="h-[44px] px-[16px] py-[8px] bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] flex items-center justify-center gap-[4px] rounded-[6px] w-full md:w-auto cursor-pointer disabled:cursor-not-allowed"
                                                >
                                                    <span
                                                        className="text-sm font-medium leading-[20px]"
                                                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                                    >
                                                        {loading ? tEdit("buttons.processing") : tEdit("buttons.next")}
                                                    </span>
                                                    {!loading && <ChevronRight className="h-5 w-5" />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-[748px] flex flex-col gap-[16px] md:gap-[20px] px-4 md:px-0">
                                        <div className="flex items-center justify-between">
                                            <h2
                                                className="text-xl leading-[28px] md:text-2xl md:leading-[30px] lg:text-[24px] lg:leading-[32px] font-medium text-[#0f172a]"
                                                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                            >
                                                {tCourseContent("steps.content")}
                                            </h2>
                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentStep(1)}
                                                className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] transition-colors cursor-pointer"
                                            >
                                                {tCommon("back")}
                                            </Button>
                                        </div>

                                        {loadingModules ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">{tCommon("loadingModules")}</p>
                                            </div>
                                        ) : (
                                            <CourseDetailModules
                                                modules={(courseDetail || course).sections || []}
                                                courseId={course.id}
                                                disable={true}
                                            />
                                        )}

                                        <div className="flex justify-end mt-4">
                                            <Button
                                                onClick={() => {
                                                    if (onSuccess) onSuccess();
                                                    onCancel();
                                                }}
                                                className="h-[44px] px-[16px] py-[8px] bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] cursor-pointer"
                                            >
                                                {tCommon("complete")}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
