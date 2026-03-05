"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Upload, Save, Loader2, Plus, Tag, DollarSign } from "lucide-react";
import teacherCourseService from "@/services/apis/teacher-course.service";
import uploadService from "@/services/apis/upload.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";
import { useTranslations } from "next-intl";

interface EditCourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
    course: Course | null;
    onSuccess?: () => void;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

interface Tag {
    id: string;
    name: string;
    slug: string;
}

interface Coupon {
    id: string;
    code: string;
    description?: string;
    discountValue: number;
    discountType: string;
}

export function EditCourseDialog({
    open,
    onOpenChange,
    courseId,
    course,
    onSuccess,
}: EditCourseDialogProps) {
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || "vi";
    const t = useTranslations("teacher.courses.edit");

    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        categoryId: "",
        language: "vi",
        level: "BEGINNER",
        price: 0,
        originPrice: 0,
        outcomes: [] as string[],
        newOutcome: "",
        selectedTags: [] as string[],
        newTag: "",
        selectedCoupons: [] as string[],
        newCouponCode: "",
        newCouponDiscount: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open && course) {
            loadCourseData();
            fetchCategories();
            fetchTags();
            fetchCoupons();
        }
    }, [open, course]);

    const loadCourseData = () => {
        if (!course) return;

        setExistingThumbnailUrl(course.thumbnailUrl || null);

        let outcomes: string[] = [];
        const rawOutcomes = course.learningOutcomes as unknown;
        if (rawOutcomes) {
            if (Array.isArray(rawOutcomes)) {
                outcomes = (rawOutcomes as string[]).filter(Boolean);
            } else if (typeof rawOutcomes === "string") {
                outcomes = rawOutcomes.split(",").map((o: string) => o.trim()).filter(Boolean);
            }
        }

        const existingTags = (course as any).tags?.map((t: any) => t.tagId || t.id) || [];
        const existingCoupons = (course as any).coupons?.map((c: any) => c.couponId || c.id) || [];

        setFormData({
            title: course.title || "",
            subtitle: course.subtitle || "",
            description: course.description || "",
            categoryId: (course as any).categoryId || (course as any).category?.id || "",
            language: (course as any).language || "vi",
            level: (course as any).level || "BEGINNER",
            price: course.price || 0,
            originPrice: (course as any).originPrice || 0,
            outcomes: outcomes,
            newOutcome: "",
            selectedTags: existingTags,
            newTag: "",
            selectedCoupons: existingCoupons,
            newCouponCode: "",
            newCouponDiscount: 0,
        });
    };

    const fetchCategories = useCallback(async () => {
        try {
            setLoadingCategories(true);
            const response = await teacherCourseService.getCategories();
            if (response.success && Array.isArray(response.data)) {
                setCategories(response.data);
            }
        } catch (error) {
            toast.error(t("errors.loadCategoriesFailed"));
        } finally {
            setLoadingCategories(false);
        }
    }, [t]);

    const fetchTags = async () => {
        try {
            const response = await teacherCourseService.getTags();
            if (response.success && Array.isArray(response.data)) {
                setTags(response.data);
            }
        } catch (error) {
            // Silent fail
        }
    };

    const fetchCoupons = async () => {
        try {
            const response = await teacherCourseService.getCoupons();
            if (response.success && Array.isArray(response.data)) {
                setAvailableCoupons(response.data);
            }
        } catch (error) {
            // Silent fail
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = t("errors.titleRequired");
        if (!formData.description.trim()) newErrors.description = t("errors.descriptionRequired");
        if (!formData.categoryId) newErrors.categoryId = t("errors.categoryRequired");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSaving(true);

            const learningOutcomes = formData.outcomes.length > 0 ? formData.outcomes : undefined;

            const payload: any = {
                title: formData.title.trim(),
                subtitle: formData.subtitle.trim(),
                description: formData.description.trim(),
                categoryId: formData.categoryId.trim(),
                language: formData.language,
                level: formData.level,
                price: formData.price,
                originPrice: formData.originPrice,
            };

            if (learningOutcomes) {
                payload.learningOutcomes = learningOutcomes;
            }

            await teacherCourseService.updateCourse(courseId, payload);

            if (thumbnailFile) {
                try {
                    await uploadService.uploadCourseThumbnail(courseId, thumbnailFile);
                } catch (error) {
                    toast.warning(t("warnings.thumbnailUploadFailed"));
                }
            }

            toast.success(t("success.courseUpdated"));
            onOpenChange(false);

            if (onSuccess) {
                onSuccess();
            }

            router.push(`/${locale}/teacher/courses/${courseId}/create-content`);
        } catch (error: unknown) {
            let errorMessage = t("errors.updateFailed");
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
            setSaving(false);
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

    const handleAddTag = () => {
        if (formData.newTag.trim()) {
            const existingTag = tags.find(
                (t) => t.name.toLowerCase() === formData.newTag.trim().toLowerCase()
            );
            if (existingTag && !formData.selectedTags.includes(existingTag.id)) {
                setFormData((prev) => ({
                    ...prev,
                    selectedTags: [...prev.selectedTags, existingTag.id],
                    newTag: "",
                }));
            }
        }
    };

    const handleRemoveTag = (tagId: string) => {
        setFormData((prev) => ({
            ...prev,
            selectedTags: prev.selectedTags.filter((id) => id !== tagId),
        }));
    };

    const handleCreateCoupon = async () => {
        if (!formData.newCouponCode.trim() || formData.newCouponDiscount <= 0) {
            toast.error(t("errors.couponInvalid"));
            return;
        }

        try {
            const response = await teacherCourseService.createCoupon({
                code: formData.newCouponCode.trim(),
                discountValue: formData.newCouponDiscount,
                discountType: "PERCENTAGE",
            });

            if (response.success && response.data) {
                toast.success(t("success.couponCreated"));
                await fetchCoupons();
                setFormData((prev) => ({
                    ...prev,
                    newCouponCode: "",
                    newCouponDiscount: 0,
                }));
            }
        } catch (error) {
            toast.error(t("errors.couponCreateFailed"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-medium text-[#0f172a]">
                        {t("title")}
                    </DialogTitle>
                    <DialogDescription>{t("description")}</DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic" className="cursor-pointer">{t("tabs.basic")}</TabsTrigger>
                        <TabsTrigger value="pricing" className="cursor-pointer">{t("tabs.pricing")}</TabsTrigger>
                        <TabsTrigger value="tags" className="cursor-pointer">{t("tabs.tags")}</TabsTrigger>
                        <TabsTrigger value="coupons" className="cursor-pointer">{t("tabs.coupons")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4 mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">{t("fields.title")}</Label>
                                <Input
                                    id="title"
                                    placeholder={t("placeholders.title")}
                                    value={formData.title}
                                    onChange={(e) => {
                                        setFormData({ ...formData, title: e.target.value });
                                        if (errors.title) setErrors({ ...errors, title: "" });
                                    }}
                                    className={cn(errors.title && "border-red-500")}
                                />
                                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle">{t("fields.subtitle")}</Label>
                                <Input
                                    id="subtitle"
                                    placeholder={t("placeholders.subtitle")}
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">{t("fields.description")}</Label>
                                <Textarea
                                    id="description"
                                    placeholder={t("placeholders.description")}
                                    value={formData.description}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 500) {
                                            setFormData({ ...formData, description: e.target.value });
                                            if (errors.description) setErrors({ ...errors, description: "" });
                                        }
                                    }}
                                    className={cn("min-h-[120px]", errors.description && "border-red-500")}
                                />
                                <div className="flex justify-between items-center">
                                    {errors.description && (
                                        <p className="text-xs text-red-500">{errors.description}</p>
                                    )}
                                    <span className="text-xs text-[#8c92ac] ml-auto">
                                        {formData.description.length}/500
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">{t("fields.thumbnail")}</Label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-[#f4f4f7] rounded-lg p-4 cursor-pointer hover:border-[#4162e7] transition-colors"
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
                                    <div className="flex items-center gap-3">
                                        <Upload className="h-5 w-5 text-[#8c92ac]" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[#3b3d48]">
                                                {thumbnailFile
                                                    ? thumbnailFile.name
                                                    : existingThumbnailUrl
                                                        ? t("labels.changeThumbnail")
                                                        : t("labels.uploadThumbnail")}
                                            </p>
                                            <p className="text-xs text-[#8c92ac]">{t("labels.thumbnailHint")}</p>
                                        </div>
                                    </div>
                                </div>
                                {(existingThumbnailUrl || thumbnailFile) && (
                                    <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                                        <img
                                            src={
                                                thumbnailFile
                                                    ? URL.createObjectURL(thumbnailFile)
                                                    : existingThumbnailUrl || ""
                                            }
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setThumbnailFile(null);
                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-[#eceffd] cursor-pointer"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="outcomes">{t("fields.outcomes")}</Label>
                                <Input
                                    id="outcomes"
                                    placeholder={t("placeholders.outcomes")}
                                    value={formData.newOutcome}
                                    onChange={(e) => setFormData({ ...formData, newOutcome: e.target.value })}
                                    onKeyDown={handleAddOutcome}
                                />
                                {formData.outcomes.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {formData.outcomes.map((outcome, index) => (
                                            <div
                                                key={index}
                                                className="bg-[#efffec] flex items-center gap-2 px-3 py-1 rounded-md"
                                            >
                                                <span className="text-sm text-[#3b3d48]">{outcome}</span>
                                                <button type="button" onClick={() => handleRemoveOutcome(index)} className="cursor-pointer rounded hover:bg-[#fee] hover:text-red-500 transition-colors p-0.5">
                                                    <X className="h-3 w-3 text-[#3b3d48]" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">{t("fields.category")}</Label>
                                    <Select
                                        value={formData.categoryId}
                                        onValueChange={(value) => {
                                            setFormData({ ...formData, categoryId: value });
                                            if (errors.categoryId) setErrors({ ...errors, categoryId: "" });
                                        }}
                                        disabled={loadingCategories}
                                    >
                                        <SelectTrigger className={cn("cursor-pointer", errors.categoryId && "border-red-500")}>
                                            <SelectValue placeholder={t("placeholders.category")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.categoryId && (
                                        <p className="text-xs text-red-500">{errors.categoryId}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="language">{t("fields.language")}</Label>
                                    <Select
                                        value={formData.language}
                                        onValueChange={(value) => setFormData({ ...formData, language: value })}
                                    >
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vi">{t("languages.vietnamese")}</SelectItem>
                                            <SelectItem value="en">{t("languages.english")}</SelectItem>
                                            <SelectItem value="jp">{t("languages.japanese")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="level">{t("fields.level")}</Label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                                >
                                    <SelectTrigger className="cursor-pointer">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BEGINNER">{t("levels.beginner")}</SelectItem>
                                        <SelectItem value="INTERMEDIATE">{t("levels.intermediate")}</SelectItem>
                                        <SelectItem value="ADVANCED">{t("levels.advanced")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="pricing" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">{t("fields.price")}</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c92ac]" />
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="0"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: Number(e.target.value) })
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="originPrice">{t("fields.originPrice")}</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c92ac]" />
                                    <Input
                                        id="originPrice"
                                        type="number"
                                        placeholder="0"
                                        value={formData.originPrice}
                                        onChange={(e) =>
                                            setFormData({ ...formData, originPrice: Number(e.target.value) })
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="tags" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>{t("fields.tags")}</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder={t("placeholders.tagSearch")}
                                    value={formData.newTag}
                                    onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={handleAddTag} className="cursor-pointer">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {formData.selectedTags.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {formData.selectedTags.map((tagId) => {
                                        const tag = tags.find((t) => t.id === tagId);
                                        return (
                                            <div
                                                key={tagId}
                                                className="bg-[#eceffd] flex items-center gap-2 px-3 py-1 rounded-md"
                                            >
                                                <Tag className="h-3 w-3" />
                                                <span className="text-sm">{tag?.name || tagId}</span>
                                                <button type="button" onClick={() => handleRemoveTag(tagId)} className="cursor-pointer rounded hover:bg-[#fee] hover:text-red-500 transition-colors p-0.5">
                                                    <X className="h-3 w-3 text-[#3b3d48]" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="coupons" className="space-y-4 mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t("fields.createCoupon")}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder={t("placeholders.couponCode")}
                                        value={formData.newCouponCode}
                                        onChange={(e) =>
                                            setFormData({ ...formData, newCouponCode: e.target.value })
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder={t("placeholders.discount")}
                                        value={formData.newCouponDiscount}
                                        onChange={(e) =>
                                            setFormData({ ...formData, newCouponDiscount: Number(e.target.value) })
                                        }
                                        className="w-32"
                                    />
                                    <Button type="button" onClick={handleCreateCoupon} className="cursor-pointer">
                                        {t("buttons.create")}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>{t("fields.availableCoupons")}</Label>
                                {availableCoupons.length === 0 ? (
                                    <p className="text-sm text-[#8c92ac]">{t("labels.noCoupons")}</p>
                                ) : (
                                    <div className="space-y-2">
                                        {availableCoupons.map((coupon) => (
                                            <div
                                                key={coupon.id}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-medium">{coupon.code}</p>
                                                    <p className="text-sm text-[#8c92ac]">
                                                        {coupon.discountValue}% {t("labels.discount")}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="cursor-pointer"
                                                    onClick={async () => {
                                                        try {
                                                            await teacherCourseService.assignCouponToCourse(
                                                                courseId,
                                                                coupon.id
                                                            );
                                                            toast.success(t("success.couponAssigned"));
                                                        } catch (error) {
                                                            toast.error(t("errors.couponAssignFailed"));
                                                        }
                                                    }}
                                                >
                                                    {t("buttons.assign")}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                        {t("buttons.cancel")}
                    </Button>
                    <Button onClick={handleSubmit} disabled={saving} className="cursor-pointer disabled:cursor-not-allowed">
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {t("buttons.saving")}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                {t("buttons.save")}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
