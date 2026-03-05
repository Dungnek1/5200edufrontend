"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import teacherCourseService from "@/services/apis/teacher-course.service";
import uploadService from "@/services/apis/upload.service";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export type SaveStatus = "idle" | "saving" | "saved" | "unsaved";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface FormData {
  title: string;
  description: string;
  categoryId: string;
  language: string;
  price: number;
  outcomes: string[];
  newOutcome: string;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  categoryId: "",
  language: "vi",
  price: 0,
  outcomes: [],
  newOutcome: "",
};

export function useCreateCourse() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();
  const locale = (params.locale as string) || "vi";

  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [draftCourseId, setDraftCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [lastSavedDraftData, setLastSavedDraftData] = useState({
    title: "",
    description: "",
    categoryId: "",
    language: "vi",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = t("teacher.courses.edit.errors.titleRequired");
    if (!formData.description.trim()) newErrors.description = t("teacher.courses.edit.errors.descriptionRequired");
    if (!formData.categoryId) newErrors.categoryId = t("teacher.courses.edit.errors.categoryRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.title, formData.description, formData.categoryId, t]);

  const handleSaveAsDraft = useCallback(async () => {
    if (!formData.title.trim() || loading) return;

    try {
      setSaveStatus("saving");
      setLoading(true);

      const payload: {
        title: string;
        description: string;
        status: string;
        categoryIds?: string[];
        language?: string;
        learningOutcomes?: string[];
        price?: number;
      } = {
        title: formData.title.trim(),
        description: formData.description.trim() || "",
        status: "DRAFT",
      };
      if (formData.categoryId) payload.categoryIds = [formData.categoryId];
      if (formData.language) payload.language = formData.language;
      if (formData.outcomes.length > 0) payload.learningOutcomes = formData.outcomes;
      if (formData.price > 0) payload.price = formData.price;

      const response = await teacherCourseService.createCourse(payload);

      if (response.success && response.data) {
        const courseId = String(response.data.id);
        setDraftCourseId(courseId);
        setLastSavedDraftData({
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
          language: formData.language,
        });
        setHasUnsavedChanges(false);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);

        if (thumbnailFile) {
          try {
            await uploadService.uploadCourseThumbnail(courseId, thumbnailFile);
          } catch (error) {
            logger.error("Error uploading thumbnail:", error);
          }
        }
        logger.info("Draft saved automatically");
      }
    } catch (error: unknown) {
      logger.error("Error saving draft:", error);
      setSaveStatus("unsaved");
    } finally {
      setLoading(false);
    }
  }, [formData, thumbnailFile, loading]);

  const handleUpdateDraft = useCallback(async () => {
    if (!draftCourseId || !formData.title.trim() || loading) return;

    try {
      setSaveStatus("saving");

      const payload: Record<string, unknown> = {
        title: formData.title.trim(),
        description: formData.description.trim() || "",
      };
      if (formData.categoryId) payload.categoryIds = [formData.categoryId];
      if (formData.language) payload.language = formData.language;
      if (formData.outcomes.length > 0) payload.learningOutcomes = formData.outcomes;
      if (formData.price > 0) payload.price = formData.price;

      await teacherCourseService.updateCourse(draftCourseId, payload as Parameters<typeof teacherCourseService.updateCourse>[1]);

      setLastSavedDraftData({
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        language: formData.language,
      });
      setHasUnsavedChanges(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);

      if (thumbnailFile) {
        try {
          await uploadService.uploadCourseThumbnail(draftCourseId, thumbnailFile);
        } catch (error) {
          logger.error("Error uploading thumbnail:", error);
        }
      }
      logger.info("Draft updated automatically");
    } catch (error: unknown) {
      logger.error("Error updating draft:", error);
      setSaveStatus("unsaved");
    }
  }, [draftCourseId, formData, thumbnailFile, loading]);

  useEffect(() => {
    if (formData.title.trim() && !draftCourseId && !loading) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      setHasUnsavedChanges(true);
      setSaveStatus("unsaved");
      autoSaveTimerRef.current = setTimeout(handleSaveAsDraft, 2000);
    }

    if (draftCourseId) {
      const hasChanges =
        formData.title !== lastSavedDraftData.title ||
        formData.description !== lastSavedDraftData.description ||
        formData.categoryId !== lastSavedDraftData.categoryId ||
        formData.language !== lastSavedDraftData.language;

      if (hasChanges) {
        setHasUnsavedChanges(true);
        setSaveStatus("unsaved");
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = setTimeout(handleUpdateDraft, 3000);
      } else {
        setHasUnsavedChanges(false);
        setSaveStatus("idle");
      }
    }

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [formData, draftCourseId, lastSavedDraftData, loading, handleSaveAsDraft, handleUpdateDraft]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      let courseId: string | null = draftCourseId;

      const basePayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        language: formData.language || undefined,
        learningOutcomes: formData.outcomes.length > 0 ? formData.outcomes : undefined,
        price: formData.price > 0 ? formData.price : undefined,
      };

      if (courseId) {
        await teacherCourseService.updateCourse(courseId, {
          ...basePayload,
          categoryIds: formData.categoryId ? [formData.categoryId] : undefined,
        });
      } else {
        const payload = {
          ...basePayload,
          categoryIds: formData.categoryId ? [formData.categoryId] : undefined,
        };
        const response = await teacherCourseService.createCourse(payload);
        if (response.success && response.data) {
          courseId = String(response.data.id);
        }
      }

      if (courseId) {
        if (thumbnailFile) {
          try {
            await uploadService.uploadCourseThumbnail(courseId, thumbnailFile);
          } catch (error) {
            logger.error("Error uploading thumbnail:", error);
            toast.warning(t("teacher.courses.create.successNoThumb"));
          }
        }
        toast.success(t("teacher.courses.create.success"));
        setHasUnsavedChanges(false);
        router.push(`/${locale}/teacher/courses/${courseId}/create-content`);
      }
    } catch (error: unknown) {
      logger.error("Error creating course:", error);
      let errorMessage = t("teacher.courses.create.failed");
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
        errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, draftCourseId, thumbnailFile, locale, router, validateForm, t]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      let categoriesArray: Category[] = [];

      try {
        const response = await teacherCourseService.getCategories();
        if (response.success && Array.isArray(response.data)) {
          categoriesArray = response.data;
        }
      } catch (teacherError) {
        logger.error("Teacher endpoint error:", teacherError);
      }

      if (categoriesArray.length === 0) {
        try {
          const publicResponse = await teacherCourseService.getPublicCategories();
          if (publicResponse.success && Array.isArray(publicResponse.data)) {
            categoriesArray = publicResponse.data;
          }
        } catch (publicError) {
          logger.error("Public endpoint error:", publicError);
        }
      }

      setCategories(categoriesArray);
      if (categoriesArray.length === 0) {
        toast.warning(t("teacher.courses.create.categoriesEmpty"));
      }
    } catch (error) {
      logger.error("Unexpected error:", error);
      toast.error(t("teacher.courses.create.categoriesLoadFailed"));
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [t]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const updateField = useCallback((field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }, []);

  const handleAddOutcome = useCallback((e?: React.KeyboardEvent) => {
    if (e && e.key !== "Enter") return;
    e?.preventDefault();
    setFormData((prev) => {
      if (!prev.newOutcome.trim()) return prev;
      return {
        ...prev,
        outcomes: [...prev.outcomes, prev.newOutcome.trim()],
        newOutcome: "",
      };
    });
  }, []);

  const handleRemoveOutcome = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index),
    }));
  }, []);

  const handleReset = useCallback(() => {
    setFormData(initialFormData);
    setThumbnailFile(null);
    setDraftCourseId(null);
    setLastSavedDraftData({ title: "", description: "", categoryId: "", language: "vi" });
    setHasUnsavedChanges(false);
    setSaveStatus("idle");
  }, []);

  const handleThumbnailSelect = useCallback((file: File) => {
    setThumbnailFile(file);
  }, []);

  const handleThumbnailRemove = useCallback(() => {
    setThumbnailFile(null);
  }, []);

  return {
    loading,
    thumbnailFile,
    categories,
    loadingCategories,
    saveStatus,
    formData,
    errors,
    locale,
    updateField,
    handleAddOutcome,
    handleRemoveOutcome,
    handleReset,
    handleSubmit,
    handleThumbnailSelect,
    handleThumbnailRemove,
  };
}
