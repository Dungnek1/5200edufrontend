"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  RotateCcw,
  Home,
  Check,
  Trash2,
  GripVertical,
  Lock,
  Plus,
  Upload,
} from "lucide-react";
import teacherCourseService from "@/services/apis/teacher-course.service";
import uploadService from "@/services/apis/upload.service";
import courseDraftService from "@/services/apis/course-draft.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";
import { QuizCreationModal } from "@/components/quiz/quiz-creation-modal";
import { QuizSummaryCard } from "@/components/quiz/quiz-summary-card";
import { VideoUploadSection, type ModuleVideo } from "@/components/video/video-upload-section";
import quizService from "@/services/apis/quiz.service";
import type { Assignment } from "@/services/apis/quiz.service";
import { formatFileSize } from "@/utils/formatFileSize";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface Module {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  documentCount?: number;
  quizCount?: number;
}

interface Quiz {
  id: string;
  title: string;
  instructions?: string;
  questionCount: number;
  timeLimitMinutes: number;
  passScore: number;
  totalPoints?: number;
  questions?: any[];
  essayPrompt?: {
    rubric: string;
    minWords?: number;
    maxWords?: number;
  };
}

export default function CreateCourseContentPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || "vi";
  const courseId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [moduleVideos, setModuleVideos] = useState<Record<string, ModuleVideo>>(
    {},
  );
  const [modulesWithUnsavedEdits, setModulesWithUnsavedEdits] = useState<
    Set<string>
  >(new Set());
  const [canUpload, setCanUpload] = useState(false); // Track if user can upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const autoCreateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoCreatingRef = useRef(false);

  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
  }>({ open: false, title: "", description: "", onConfirm: () => { } });

  const [moduleData, setModuleData] = useState({
    title: "",
    description: "",
  });

  const isFirstModule = modules.length === 0;
  const currentModule = modules.find((m) => m.id === currentModuleId);

  const isInitialLoad = useRef(true);
  const [isCourseLoaded, setIsCourseLoaded] = useState(false);

  useEffect(() => {
    const creatingNew = courseDraftService.isCreatingNewModule(courseId);
    const canUploadNow = !!currentModuleId && !creatingNew;
    setCanUpload(canUploadNow);
  }, [currentModuleId, courseId]);

  const onCreateModule = async () => {
    try {
      isAutoCreatingRef.current = true;

      const response = await teacherCourseService.createModule(courseId, {
        title: moduleData.title.trim(),
        description: moduleData.description.trim(),
      });

      if (response.success && response.data) {
        const newModuleId = response.data.id;
        const newSortOrder = modules.length;

        const newModule: Module = {
          id: newModuleId,
          title: moduleData.title.trim(),
          description: moduleData.description.trim(),
          sortOrder: newSortOrder,
          documentCount: 0,
          quizCount: 0,
        };
        setModules((prev) => [...prev, newModule]);

        setCurrentModuleId(newModuleId);
        setMaterials([]);
        setQuizzes([]);

        courseDraftService.setCreatingNewModule(courseId, false);
        setCanUpload(true);

        fetchCourse();

      }
    } catch (error) {
    } finally {
      isAutoCreatingRef.current = false;
    }
  };

  useEffect(() => {
    if (courseId) {
      courseDraftService.getOrCreateSessionId(courseId);
    }
  }, [courseId]);

  const fetchCourse = useCallback(async () => {
    try {
      const response = await teacherCourseService.getCourse(courseId);
      if (response.success && response.data) {
        const data = response.data as any;
        // Backend có thể trả về course trong data.data (double wrap) — unwrap để lấy đúng course có sections
        const coursePayload = data?.data ?? data;
        setCourse(coursePayload);
        // API trả về sections, không phải modules — dùng sections để load đúng nội dung có sẵn (kể cả khi vào từ trang review "Chỉnh sửa")
        const rawModules = coursePayload.sections ?? coursePayload.modules ?? data.sections ?? data.modules;
        if (rawModules && Array.isArray(rawModules) && rawModules.length > 0) {
          const sortedModules = [...rawModules].sort(
            (a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
          );
          const courseModules = sortedModules.map((m: any) => ({
            id: m.id,
            title: m.title ?? "",
            description: m.description ?? "",
            sortOrder: m.sortOrder ?? 0,
            documentCount: m.documentCount ?? (Array.isArray(m.documents) ? m.documents.length : 0),
            quizCount: m.quizCount ?? 0,
          }));
          setModules(courseModules);
          setIsCourseLoaded(true);
        } else {
          // API không có sections (khóa mới) — thử dùng cache session nếu có (draft chưa lưu)
          const cachedModules = courseDraftService.loadModulesFromSession(courseId);
          if (cachedModules && cachedModules.length > 0) {
            setModules(cachedModules);
          }
          setIsCourseLoaded(true);
        }
      }
    } catch (error) {
      // Lỗi API — vẫn thử load từ session
      const cachedModules = courseDraftService.loadModulesFromSession(courseId);
      if (cachedModules && cachedModules.length > 0) {
        setModules(cachedModules);
      }
      setIsCourseLoaded(true);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  useEffect(() => {
    if (modules.length > 0 && courseId) {
      courseDraftService.saveModulesToSession(courseId, modules);
    }
  }, [modules, courseId]);

  const lastLoadedModuleRef = useRef<string | null>(null);
  const isLoadingFromStorageRef = useRef(false);

  // Normalize question for modal (backend may use "question" vs "prompt", options format)
  const normalizeQuestion = (q: any) => {
    const opts = (q.options || []).map((opt: any) => ({
      id: opt.id,
      text: String(opt.text ?? opt.optionText ?? "").trim(),
      isCorrect: Boolean(opt.isCorrect),
    }));
    // Đảm bảo ít nhất 2 options (form yêu cầu)
    while (opts.length < 2) {
      opts.push({ id: undefined, text: "", isCorrect: false });
    }
    return {
      id: q.id || String(Date.now()),
      prompt: String(q.prompt ?? q.question ?? "").trim(),
      points: q.points ?? 1,
      explanation: q.explanation,
      options: opts,
    };
  };

  // Transform Assignment to Quiz interface
  const transformToQuiz = (assignment: Assignment): Quiz => {
    const a = assignment as any;
    // Map quizQuestions (from API) hoặc questions (from frontend), hỗ trợ nhiều format
    const rawQuestions =
      a.quizQuestions ?? a.questions ?? a.QuizQuestions ?? [];
    const questions = Array.isArray(rawQuestions)
      ? rawQuestions.map(normalizeQuestion)
      : [];

    return {
      id: assignment.id,
      title: assignment.title,
      instructions: assignment.instructions,
      questionCount: questions.length || 0,
      timeLimitMinutes: Math.round((assignment.timeLimitSeconds || 0) / 60),
      passScore: assignment.passScore || 0,
      totalPoints: (assignment as any).maxScore,
      questions: questions,
      essayPrompt: assignment.essayPrompt ? {
        rubric: assignment.essayPrompt.rubric || "",
        minWords: assignment.essayPrompt.minWords || 100,
        maxWords: assignment.essayPrompt.maxWords || 500,
      } : undefined,
    };
  };

  // Fetch assignments for current module
  const fetchAssignments = useCallback(
    async (moduleId: string) => {
      try {
        const res = await quizService.listAssignments(courseId);
        if (res.success && res.data) {
          // Filter assignments for current module (QUIZ + ESSAY)
          const filtered = res.data.filter((a: Assignment) => {
            const sid = (a as any).sectionId ?? (a as any).section?.id;
            return sid === moduleId && (a.type === "QUIZ" || a.type === "ESSAY");
          });
          const transformed = filtered.map(transformToQuiz);
          setQuizzes(transformed);
        }
      } catch (error) {
        // Silent fail - assignments are optional
      }
    },
    [courseId]
  );

  const loadModuleData = useCallback(
    async (module: Module) => {
      if (lastLoadedModuleRef.current === module.id) {
        setCurrentModuleId(module.id);
        const newModuleData = {
          title: module.title,
          description: module.description || "",
        };
        setModuleData(newModuleData);

        courseDraftService.setCreatingNewModule(courseId, false);
        setCanUpload(true);

        // Fetch assignments for this module
        await fetchAssignments(module.id);

        return;
      }

      isLoadingFromStorageRef.current = true;
      setCurrentModuleId(module.id);

      courseDraftService.setCreatingNewModule(courseId, false);
      setCanUpload(true);

      const savedDraft = await courseDraftService.getModuleDraft(
        courseId,
        module.id,
      );
      const title = savedDraft?.title || module.title;
      const description = savedDraft?.description || module.description || "";

      const newModuleData = {
        title,
        description,
      };
      setModuleData(newModuleData);

      try {
        const res = await uploadService.getModuleDocuments(courseId, module.id);
        if (res.success && res.data) {
          setMaterials(res.data);
        }

        // Fetch assignments for this module
        await fetchAssignments(module.id);

        lastLoadedModuleRef.current = module.id;
      } catch (error) {
      }

      setTimeout(() => {
        isLoadingFromStorageRef.current = false;
      }, 100);
    },
    [courseId, fetchAssignments],
  );

  useEffect(() => {
    if (!isCourseLoaded || modules.length === 0) return;

    const urlModuleId = searchParams.get("moduleId");

    if (urlModuleId) {
      const targetModule = modules.find((m: Module) => m.id === urlModuleId);
      if (targetModule && targetModule.id !== currentModuleId) {
        loadModuleData(targetModule);
        router.replace(`/${locale}/teacher/courses/${courseId}/create-content`);
      }
    } else if (isInitialLoad.current && !currentModuleId) {
      loadModuleData(modules[0]);
      isInitialLoad.current = false;
    }
  }, [
    searchParams,
    isCourseLoaded,
    modules,
    currentModuleId,
    locale,
    courseId,
    loadModuleData,
    router,
  ]);

  useEffect(() => {
    const autoSave = async () => {
      if (
        currentModuleId &&
        moduleData.title.trim() &&
        !isLoadingFromStorageRef.current
      ) {
        await courseDraftService.saveModuleDraft(courseId, currentModuleId, {
          title: moduleData.title,
          description: moduleData.description,
        });

        const module = modules.find((m) => m.id === currentModuleId);
        if (module) {
          const hasUnsaved = await courseDraftService.hasUnsavedEdits(
            courseId,
            currentModuleId,
            module.title,
            module.description || "",
          );
          setModulesWithUnsavedEdits((prev) => {
            const newSet = new Set(prev);
            if (hasUnsaved) {
              newSet.add(currentModuleId);
            } else {
              newSet.delete(currentModuleId);
            }
            return newSet;
          });
        }
      }
    };

    autoSave();
  }, [moduleData, currentModuleId, courseId, modules]);

  useEffect(() => {
    const updateUnsavedEdits = async () => {
      if (modules.length === 0) return;

      const unsavedSet = new Set<string>();
      for (const module of modules) {
        const hasUnsaved = await courseDraftService.hasUnsavedEdits(
          courseId,
          module.id,
          module.title,
          module.description || "",
        );
        if (hasUnsaved) {
          unsavedSet.add(module.id);
        }
      }
      setModulesWithUnsavedEdits(unsavedSet);
    };

    updateUnsavedEdits();
  }, [modules, courseId]);

  const handleUploadDocument = async (file: File) => {
    if (!canUpload) {
      toast.error(t("teacherCourseContent.createModuleFirst"));
      return;
    }

    const videoExtensions = [".mp4", ".mov", ".avi", ".webm"];
    const fileName = file.name.toLowerCase();
    const isVideo = videoExtensions.some((ext) => fileName.endsWith(ext));

    if (isVideo) {
      toast.error(t("teacherCourseContent.videoUploadWarning"));
      return;
    }

    let moduleId = currentModuleId;

    if (!moduleId && isFirstModule) {
      if (!moduleData.title.trim()) {
        toast.error(t("teacherCourseContent.moduleNameRequired"));
        return;
      }

      try {
        setUploading(true);

        setCurrentModuleId(moduleId);
        setMaterials([]);
        await performUpload(file, moduleId as string);
        await fetchCourse();
      } catch (error: any) {
        toast.error(t("teacherCourseContent.createModuleError"));
      } finally {
        setUploading(false);
      }
    } else if (moduleId) {
      await performUpload(file, moduleId);
    } else {
      toast.error(t("teacherCourseContent.createModuleFirst"));
    }
  };

  const performUpload = async (file: File, moduleId: string) => {
    try {
      setUploading(true);
      const response = await uploadService.uploadModuleDocument(
        courseId,
        moduleId,
        file,
      );

      if (response.success) {
        toast.success(t("teacherCourseContent.uploadDocumentSuccess"));
        const res = await uploadService.getModuleDocuments(courseId, moduleId);
        if (res.success && res.data) {
          setMaterials(res.data);

          setModules((prev) =>
            prev.map((m) =>
              m.id === moduleId ? { ...m, documentCount: res.data.length } : m,
            ),
          );
        }

        fetchCourse();
      }
    } catch (error) {
      toast.error(t("teacherCourseContent.uploadDocumentError"));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, documentName: string) => {
    if (!currentModuleId) return;

    setConfirmDialog({
      open: true,
      title: t("teacherCourseReview.deleteDocument"),
      description: t("teacherCourseContent.deleteDocumentConfirm", { name: documentName }),
      onConfirm: async () => {
        try {
          const response = await uploadService.deleteModuleDocument(
            courseId,
            currentModuleId,
            documentId,
          );
          if (response.success) {
            toast.success(t("teacherCourseContent.deleteDocumentSuccess"));
            const newMaterials = materials.filter((m) => m.id !== documentId);
            setMaterials(newMaterials);

            setModules((prev) =>
              prev.map((m) =>
                m.id === currentModuleId
                  ? { ...m, documentCount: newMaterials.length }
                  : m,
              ),
            );

            fetchCourse();
          }
        } catch (error) {
          toast.error(t("teacherCourseContent.deleteDocumentError"));
        }
      },
    });
  };

  const handleSaveModule = async () => {
    if (!moduleData.title.trim()) {
      toast.error(t("teacherCourseContent.moduleNameRequired"));
      return;
    }

    try {
      setLoading(true);

      if (currentModuleId) {
        try {
          const response = await teacherCourseService.updateModule(
            courseId,
            currentModuleId,
            {
              title: moduleData.title.trim(),
              description: moduleData.description.trim(),
            },
          );

          if (response.success) {
            setModules((prev) =>
              prev.map((m) =>
                m.id === currentModuleId
                  ? {
                    ...m,
                    title: moduleData.title,
                    description: moduleData.description,
                  }
                  : m,
              ),
            );

            await courseDraftService.deleteModuleDraft(
              courseId,
              currentModuleId,
            );

            setModulesWithUnsavedEdits((prev) => {
              const newSet = new Set(prev);
              newSet.delete(currentModuleId);
              return newSet;
            });

            toast.success(t("teacherCourseContent.updateModuleSuccess"));
          } else {
            throw new Error("Update failed");
          }
        } catch (updateError) {

          await courseDraftService.saveModuleDraft(courseId, currentModuleId, {
            title: moduleData.title,
            description: moduleData.description,
          });

          const module = modules.find((m) => m.id === currentModuleId);
          if (module) {
            const hasUnsaved = await courseDraftService.hasUnsavedEdits(
              courseId,
              currentModuleId,
              module.title,
              module.description || "",
            );
            setModulesWithUnsavedEdits((prev) => {
              const newSet = new Set(prev);
              if (hasUnsaved) {
                newSet.add(currentModuleId);
              } else {
                newSet.delete(currentModuleId);
              }
              return newSet;
            });
          }

          toast.error(t("teacherCourseContent.updateModuleError") + ` (${t("teacherCourseContent.draftSaved")})`);
        }
      } else {
        const response = await teacherCourseService.createModule(courseId, {
          title: moduleData.title,
          description: moduleData.description,
        });

        if (response.success && response.data) {
          toast.success(t("teacherCourseContent.createModuleSuccess"));
          const newModuleId = response.data.id;
          const newSortOrder = modules.length;

          const newModule: Module = {
            id: newModuleId,
            title: moduleData.title,
            description: moduleData.description,
            sortOrder: newSortOrder,
            documentCount: 0,
            quizCount: 0,
          };
          setModules((prev) => [...prev, newModule]);

          setCurrentModuleId(newModuleId);
          setMaterials([]);
          setQuizzes([]);

          courseDraftService.setCreatingNewModule(courseId, false);
          setCanUpload(true);

          fetchCourse();
        }
      }
    } catch (error: any) {
      toast.error(t("teacherCourseContent.saveModuleError"));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const creatingFirstModule = modules.length === 0;

    if (creatingFirstModule) {
      await handleSaveModule();
      setModuleData({ title: "", description: "" });
      setCurrentModuleId(null);
      setMaterials([]);
      setQuizzes([]);
      lastLoadedModuleRef.current = null;
      return;
    } else if (!currentModuleId) {
      await handleSaveModule();
      setModuleData({ title: "", description: "" });
      setCurrentModuleId(null);
      setMaterials([]);
      setQuizzes([]);
      lastLoadedModuleRef.current = null;
      return;
    } else {
      setModules((prev) =>
        prev.map((m) =>
          m.id === currentModuleId
            ? {
              ...m,
              title: moduleData.title,
              description: moduleData.description,
            }
            : m,
        ),
      );
      await courseDraftService.saveModuleDraft(courseId, currentModuleId, {
        title: moduleData.title,
        description: moduleData.description,
      });
    }


    courseDraftService.clearModulesSession(courseId);
    courseDraftService.setCreatingNewModule(courseId, false);

    router.push(`/${locale}/teacher/courses/${courseId}/review`);
  };

  const handleGetDocuments = async (moduleId: string) => {
    try {
      const res = await uploadService.getModuleDocuments(courseId, moduleId);
      if (res.success && res.data) {
        setMaterials(res.data);
      }
      lastLoadedModuleRef.current = moduleId;
    } catch (error) {
    }
  };

  const handleCreateNewModule = async () => {
    courseDraftService.setCreatingNewModule(courseId, true);

    setCanUpload(false);

    setModuleData({ title: "", description: "" });
    setCurrentModuleId(null);
    setMaterials([]);
    setQuizzes([]);

    // CRITICAL FIX: Clear video state for new module
    // This prevents video from previous module from showing in new module
    setModuleVideos((prev) => {
      const newVideos = { ...prev };
      // Don't delete existing module videos, just don't show any for new module
      return newVideos;
    });

    lastLoadedModuleRef.current = null;
  };

  const handleDeleteModule = async (moduleId: string, moduleName: string) => {
    // Check if module has documents or quizzes
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    const hasDocuments = (module.documentCount || 0) > 0;
    const hasQuizzes = (module.quizCount || 0) > 0;

    if (hasDocuments || hasQuizzes) {
      const items: string[] = [];
      if (hasDocuments) {
        items.push(t("teacherCourseContent.materials", { count: module.documentCount }));
      }
      if (hasQuizzes) {
        items.push(t("teacherCourseContent.quizzes", { count: module.quizCount }));
      }
      toast.error(t("teacherCourseContent.cannotDeleteModule", { items: items.join(", ") }));
      return;
    }

    setConfirmDialog({
      open: true,
      title: t("teacherCourseReview.deleteModule"),
      description: t("teacherCourseContent.deleteModuleConfirm", { name: moduleName }),
      onConfirm: async () => {
        try {
          const response = await teacherCourseService.deleteModule(
            courseId,
            moduleId,
          );

          if (response.success) {
            toast.success(t("teacherCourseContent.deleteModuleSuccess"));

            // Immediately remove module from UI
            setModules((prev) => prev.filter((m) => m.id !== moduleId));

            // Cleanup related state
            await courseDraftService.deleteModuleDraft(courseId, moduleId);

            setModuleVideos((prev) => {
              const newVideos = { ...prev };
              delete newVideos[moduleId];
              return newVideos;
            });

            setModulesWithUnsavedEdits((prev) => {
              const newSet = new Set(prev);
              newSet.delete(moduleId);
              return newSet;
            });

            // If deleted module was active, reset form
            if (currentModuleId === moduleId) {
              setModuleData({ title: "", description: "" });
              setCurrentModuleId(null);
              setMaterials([]);
              setQuizzes([]);
              lastLoadedModuleRef.current = null;
            }

            // ✅ FIX: Removed fetchCourse() to prevent race condition
            // The state is already updated correctly above, no need to refetch
          }
        } catch (error) {
          toast.error(t("teacherCourseContent.deleteModuleError"));
        }
      },
    });
  };

  const handleOpenQuizModal = () => {
    if (!currentModuleId) {
      toast.error(t("teacherCourseContent.createModuleFirst"));
      return;
    }
    setEditingQuiz(null);
    setQuizModalOpen(true);
  };

  const handleEditQuiz = async (quiz: Quiz) => {
    try {
      const res = await quizService.getAssignment(courseId, quiz.id);
      if (res.success && res.data) {
        const raw = res.data as any;
        // Hỗ trợ response nested (data.data) từ một số API
        const assignment = raw.data ?? raw;
        const fullQuiz = transformToQuiz(assignment as Assignment);
        setEditingQuiz(fullQuiz);
        setQuizModalOpen(true);
      }
    } catch (error) {
      toast.error(t("teacherCourseContent.loadQuizFailed"));
    }
  };

  const handleCreateQuiz = async (quizData: any) => {
    if (!currentModuleId) return;

    try {
      const transformedData = {
        type: "QUIZ" as const,
        title: quizData.title,
        instructions: quizData.instructions,
        timeLimitSeconds: quizData.timeLimitMinutes * 60, // Convert minutes to seconds
        passScore: quizData.passScore,
        questions: quizData.questions,
        // Essay prompt với đầy đủ rubric, minWords, maxWords
        essayPrompt: {
          rubric: quizData.essayPrompt?.rubric || quizData.instructions || "Viết câu trả lời tự luận cho chủ đề này.",
          minWords: quizData.essayPrompt?.minWords || 100,
          maxWords: quizData.essayPrompt?.maxWords || 500,
        },
      };

      if (editingQuiz) {
        await quizService.updateAssignment(
          courseId,
          editingQuiz.id,
          transformedData,
        );
        toast.success(t("teacherCourseContent.updateQuizSuccess") + "!");
        await fetchAssignments(currentModuleId);
      } else {
        const createRes = await quizService.createAssignment(courseId, {
          ...transformedData,
          sectionId: currentModuleId
        });
        toast.success(t("teacherCourseContent.createQuizSuccess") + "!");

        setModules((prev) =>
          prev.map((m) =>
            m.id === currentModuleId
              ? { ...m, quizCount: (m.quizCount || 0) + 1 }
              : m,
          ),
        );

        // Thêm bài tập mới ngay từ response (list API có thể chưa kịp trả về)
        if (createRes.success && createRes.data) {
          const newQuiz = transformToQuiz({ ...createRes.data, sectionId: currentModuleId } as Assignment);
          setQuizzes((prev) => [...prev, newQuiz]);
        } else {
          await fetchAssignments(currentModuleId);
        }
      }

      setQuizModalOpen(false);
      setEditingQuiz(null);
    } catch (error: any) {
      throw error;
    }
  };

  const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
    if (!currentModuleId) return;

    setConfirmDialog({
      open: true,
      title: t("teacherCourseReview.deleteQuiz"),
      description: t("teacherCourseContent.deleteQuizConfirm", { title: quizTitle }),
      onConfirm: async () => {
        try {
          await quizService.deleteAssignment(courseId, quizId);
          toast.success(t("teacherCourseContent.deleteQuizSuccess"));

          setModules((prev) =>
            prev.map((m) =>
              m.id === currentModuleId
                ? { ...m, quizCount: Math.max((m.quizCount || 1) - 1, 0) }
                : m,
            ),
          );

          // Refresh assignments list
          await fetchAssignments(currentModuleId);
        } catch (error) {
          toast.error(t("teacherCourseContent.deleteQuizError"));
        }
      },
    });
  };

  const totalModules = modules.length;
  const totalQuizzes = modules.reduce((sum, m) => sum + (m.quizCount || 0), 0);
  const totalDocuments = modules.reduce(
    (sum, m) => sum + (m.documentCount || 0),
    0,
  );

  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="bg-white mx-auto max-w-[1990px] w-full px-4 sm:px-6 md:px-8 lg:px-[64px] py-4 sm:py-5 md:py-[20px] pb-6 sm:pb-8 md:pb-[40px] flex flex-col gap-3 sm:gap-4 lg:gap-[16px]">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:gap-5 lg:gap-[20px]">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 sm:gap-[8px] flex-wrap">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-[#8c92ac]" />
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#8c92ac]" />
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

            {/* Title */}
            <div className="flex items-center justify-between w-full">
              <h1
                className="text-xl sm:text-2xl lg:text-[30px] font-medium leading-6 sm:leading-7 lg:leading-[38px] text-[#0f172a]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {t("teacherCourseContent.pageTitle")}
              </h1>
            </div>
          </div>

          {/* Stepper */}
          <div className="w-full flex flex-col gap-[12px] items-center overflow-x-hidden overflow-y-visible mt-4 sm:mt-6 md:mt-8 lg:mt-[20px] pt-2 sm:pt-3">
            <div className="flex items-start justify-between max-w-[1008px] w-full lg:w-[800px] relative px-4 sm:px-0 gap-4 sm:gap-6 md:gap-8 lg:gap-0">
              {/* Connecting Line - Show on all screens, from step 1 to step 3 */}
              <div className="absolute top-[12px] h-0 z-0 left-[62.5px] sm:left-[72.5px] md:left-[94px] right-[62.5px] sm:right-[72.5px] md:right-[94px]">
                <div className="w-full h-[1px] bg-[#d2d2d2]" />
              </div>

              {/* Step 1: Info (Completed) */}
              <div className="flex flex-col items-center gap-[8px] sm:gap-[12px] w-[100px] sm:w-[120px] md:w-[188px] relative z-10 flex-shrink-0">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#4162e7] flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
                <p
                  className="text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#63687a] text-center w-full"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  {t("teacherCourseContent.steps.info")}
                </p>
              </div>

              {/* Step 2: Content (Active) */}
              <div className="flex flex-col items-center gap-[8px] sm:gap-[12px] w-[100px] sm:w-[120px] md:w-[188px] relative z-10 flex-shrink-0">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#4162e7] flex items-center justify-center shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#3b59d2]">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
                </div>
                <p
                  className="text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#2e46a4] text-center w-full"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  {t("teacherCourseContent.steps.content")}
                </p>
              </div>

              {/* Step 3: Preview (Inactive) */}
              <div className="flex flex-col items-center gap-[8px] sm:gap-[12px] w-[100px] sm:w-[120px] md:w-[188px] relative z-10 flex-shrink-0">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#fafafa] border-[1.5px] border-[#d2d2d2] flex items-center justify-center">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#d2d2d2]" />
                </div>
                <p
                  className="text-xs sm:text-sm md:text-base font-medium leading-[18px] sm:leading-[20px] md:leading-[24px] text-[#63687a] text-center w-full"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  {t("teacherCourseContent.steps.preview")}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full flex flex-col items-start overflow-x-hidden">
            <div className="w-full flex flex-col lg:flex-row items-start gap-[12px] lg:gap-[32px]">
              {/* Form Section - căn phải khối trái, mở rộng form rộng hơn */}
              <div className="flex-1 flex items-start justify-center w-full lg:justify-end">
                <div className="w-full max-w-[960px] flex flex-col gap-[16px] sm:gap-[20px] items-end justify-end px-4 sm:px-0">
                  {/* Section Title */}
                  <div className="flex items-center justify-between w-full">
                    <h2
                      className="text-xl sm:text-2xl md:text-[24px] font-medium leading-[28px] sm:leading-[30px] md:leading-[32px] text-[#0f172a] w-full text-left"
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {t("teacherCourseContent.sectionTitle")}
                    </h2>
                    <Button
                      onClick={onCreateModule}
                      className="h-[44px] px-[16px] py-[8px] bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] rounded-[6px] shrink-0 cursor-pointer"
                    >
                      <span
                        className="text-sm font-medium leading-[20px]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {t("teacherCourseContent.createModuleButton")}
                      </span>
                    </Button>
                  </div>

                  <div className="w-full flex flex-col gap-[12px] items-start">
                    {/* Module Title */}
                    <div className="w-full flex flex-col gap-[4px] items-start">
                      <Label
                        className="text-sm font-normal text-[#7f859d] leading-[20px]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("teacherCourseContent.moduleName")}
                      </Label>
                      <Input
                        placeholder={t("teacherCourseContent.moduleNamePlaceholder")}
                        value={moduleData.title}
                        onChange={(e) =>
                          setModuleData({
                            ...moduleData,
                            title: e.target.value,
                          })
                        }
                        className="h-[40px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-[#7f859d] placeholder:text-[#7f859d] text-sm px-[12px] py-[4px]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      />
                      <p
                        className="text-xs font-normal text-[#8c92ac] leading-[16px]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("teacherCourseContent.helperMessage")}
                      </p>
                    </div>

                    {/* Module Description */}
                    <div className="w-full flex flex-col gap-[4px] items-start">
                      <Label
                        className="text-sm font-normal text-[#7f859d] leading-[20px]"
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {t("teacherCourseContent.moduleDescription")}
                      </Label>
                      <div className="relative w-full">
                        <Textarea
                          placeholder={t("teacherCourseContent.moduleDescPlaceholder")}
                          value={moduleData.description}
                          onChange={(e) => {
                            if (e.target.value.length <= 500) {
                              setModuleData({
                                ...moduleData,
                                description: e.target.value,
                              });
                            }
                          }}
                          className="h-[160px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-[#7f859d] placeholder:text-[#7f859d] text-sm resize-none px-[12px] py-[4px]"
                          style={{
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: 400,
                          }}
                        />
                        <span
                          className="absolute bottom-[24px] right-[12px] text-xs text-[#8c92ac] leading-[16px] text-right"
                          style={{
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: 400,
                          }}
                        >
                          {moduleData.description.length}/500
                        </span>
                      </div>
                    </div>

                    <VideoUploadSection
                      courseId={courseId}
                      moduleId={currentModuleId || undefined}
                      disabled={!canUpload}
                      onVideoUploaded={async (video) => {
                        if (currentModuleId) {
                          if (video === null) {
                            // Video deleted - remove from state
                            setModuleVideos((prev) => {
                              const newVideos = { ...prev };
                              delete newVideos[currentModuleId];
                              return newVideos;
                            });
                          } else {
                            // Video uploaded - add to state
                            setModuleVideos((prev) => ({
                              ...prev,
                              [currentModuleId]: video,
                            }));
                            handleGetDocuments(currentModuleId);
                          }
                        }
                        await fetchCourse();
                      }}
                      existingVideo={
                        currentModuleId ? moduleVideos[currentModuleId] : null
                      }
                      onModuleNeeded={async () => {
                        if (!moduleData.title.trim()) {
                          toast.error(
                            t("teacherCourseContent.moduleNameRequiredForVideo"),
                          );
                          return null;
                        }
                        try {
                          const response =
                            await teacherCourseService.createModule(courseId, {
                              title: moduleData.title,
                              description: moduleData.description,
                            });
                          if (response.success && response.data) {
                            const newModuleId = response.data.id;
                            setCurrentModuleId(newModuleId);
                            await fetchCourse();
                            return newModuleId;
                          }
                          return null;
                        } catch (error) {
                          toast.error(t("teacherCourseContent.createModuleError"));
                          return null;
                        }
                      }}
                    />

                    <div className="w-full flex flex-col items-start rounded-[12px]">
                      <div className="bg-white border border-[#f4f4f7] rounded-[12px] flex h-[77px] items-center justify-between px-[25px] py-[25px] w-full">
                        <h3
                          className="text-[20px] font-bold text-[#3b3d48] leading-[28px] not-italic"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          {t("teacherCourseContent.learningMaterials")}
                        </h3>
                      </div>
                      <div className="bg-white border border-[#f4f4f7] border-t-0 rounded-bl-[12px] rounded-br-[12px] w-full p-[12px]">
                        {!canUpload && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 flex items-start gap-2">
                            <div className="text-amber-600 text-sm flex-shrink-0 mt-0.5">
                              ⚠️
                            </div>
                            <p
                              className="text-sm text-amber-800"
                              style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                              {t("teacherCourseContent.warningCreateFirst")}
                            </p>
                          </div>
                        )}
                        {materials.length === 0 ? (
                          <div
                            onClick={() =>
                              canUpload && fileInputRef.current?.click()
                            }
                            className={`bg-white border border-dashed rounded-[12px] flex flex-col gap-[24px] items-center px-[32px] py-[20px] transition-colors ${!canUpload
                              ? "border-gray-300 cursor-not-allowed opacity-50"
                              : "border-[#dbdde5] cursor-pointer hover:border-[#4162e7]"
                              }`}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".xlsx,.csv,.pdf"
                              className="hidden"
                              disabled={!canUpload}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadDocument(file);
                              }}
                            />
                            <div className="flex flex-col items-center gap-[6.85px] text-center">
                              <p
                                className="text-base font-medium text-[#3b3d48] leading-[24px]"
                                style={{
                                  fontFamily: "Manrope, sans-serif",
                                  fontWeight: 500,
                                }}
                              >
                                {t("teacherCourseContent.selectOrDrag")}
                              </p>
                              <p
                                className="text-xs font-normal text-[#b1b1b1] leading-[18px]"
                                style={{
                                  fontFamily: "Manrope, sans-serif",
                                  fontWeight: 400,
                                }}
                              >
                                {t("teacherCourseContent.fileFormats")}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={!canUpload}
                              className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (canUpload) {
                                  fileInputRef.current?.click();
                                }
                              }}
                            >
                              <span
                                className="text-sm font-medium leading-[20px]"
                                style={{
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: 500,
                                }}
                              >
                                {t("teacherCourseContent.browseFile")}
                              </span>
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {materials
                              .map((file) => {
                                const fileName =
                                  file.originalName ||
                                  file.name ||
                                  file.fileName ||
                                  "";
                                const fileSize =
                                  file.size || file.fileSize || "";

                                const key =
                                  file.id ||
                                  file.documentId ||
                                  Math.random().toString();

                                return (
                                  <div
                                    key={key}
                                    className="bg-white border-[0.5px] border-[#f4f4f7] rounded-[12px] flex h-[68px] items-center p-[12px]"
                                  >
                                    <div className="flex flex-1 gap-1.5 items-center">
                                      <div className="flex flex-1 gap-3 items-center ">
                                        <div className="aspect-square w-[44px] h-[44px] rounded-[10px] bg-[#fafafa] border border-[#f4f4f7] flex items-center justify-center flex-shrink-0">
                                          <Upload className="h-6 w-6 text-[#4162e7]" />
                                        </div>
                                        <div className="flex flex-1 flex-col gap-1 min-w-0 py-[8px]">
                                          <p className="text-base font-normal text-[#3b3d48] leading-[24px] truncate">
                                            {fileName}
                                          </p>
                                          <div className="flex items-center gap-1 text-xs text-[#7f859d]">
                                            <span className="leading-[16px]">
                                              {formatFileSize(fileSize)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 text-[#e35151] hover:text-red-600 hover:bg-red-50 flex-shrink-0 cursor-pointer"
                                        onClick={() =>
                                          handleDeleteDocument(file.id, fileName)
                                        }
                                      >
                                        <Trash2 className="h-5 w-5" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}

                            <div className="flex items-center justify-center pt-3">
                              <Button
                                type="button"
                                variant="outline"
                                disabled={!canUpload}
                                onClick={() =>
                                  canUpload && fileInputRef.current?.click()
                                }
                                className="h-[44px] px-4 border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white flex items-center gap-1 rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                <Plus className="h-5 w-5" />
                                <span className="text-sm font-medium leading-[20px]">
                                  {t("teacherCourseContent.addFile")}
                                </span>
                              </Button>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.csv,.pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUploadDocument(file);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quiz Summary Section */}
                    <QuizSummaryCard
                      quizzes={quizzes}
                      onEdit={handleEditQuiz}
                      onDelete={handleDeleteQuiz}
                      onCreate={handleOpenQuizModal}
                      canCreateMore={quizzes.length < 1}
                    />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-[8px] sm:gap-[4px] items-stretch sm:items-center w-full sm:w-auto sm:ml-auto sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setModuleData({ title: "", description: "" });
                          setMaterials([]);
                          setQuizzes([]);
                        }}
                        className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white flex items-center justify-center gap-[4px] rounded-[6px] w-full sm:w-auto transition-colors cursor-pointer"
                      >
                        <RotateCcw className="h-5 w-5" />
                        <span
                          className="text-sm font-medium leading-[20px]"
                          style={{
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          {t("teacherCourseContent.reset")}
                        </span>
                      </Button>

                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={
                          loading || uploading || !moduleData.title.trim()
                        }
                        className={cn(
                          "h-[44px] px-[16px] py-[8px] flex items-center justify-center gap-[4px] rounded-[6px] w-full sm:w-auto cursor-pointer disabled:cursor-not-allowed",
                          loading || uploading || !moduleData.title.trim()
                            ? "bg-[#a8b7f4] text-[#eceffd]"
                            : "bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4]",
                        )}
                      >
                        <span
                          className="text-sm font-medium leading-[20px]"
                          style={{
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          {loading ? t("teacherCourseContent.saving") : t("teacherCourseContent.next")}
                        </span>
                        {!loading && <ChevronRight className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Placeholder khi chưa có module: giữ cùng vị trí form như lúc đã có sidebar */}
              {modules.length === 0 && (
                <div className="hidden lg:block w-[384px] flex-shrink-0" aria-hidden />
              )}

              {/* Sidebar - Only show after first module is created */}
              {modules.length > 0 && (
                <div className="bg-white border border-[#f4f4f7] rounded-[12px] flex flex-col gap-[12px] px-[12px] py-[16px] w-full lg:w-[384px] flex-shrink-0 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]">
                  {/* Header */}
                  <div className="border-b border-[#e5e7eb] pb-[12px] flex flex-col gap-[4px] px-[12px]">
                    <h3
                      className="text-[18px] font-medium text-[#3b3d48] leading-[28px]"
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {t("teacherCourseContent.courseContent")}
                    </h3>
                    <p
                      className="text-sm font-medium text-[#7f859d] leading-[20px]"
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {t("teacherCourseContent.modulesAndQuizzes", { modules: totalModules, quizzes: totalQuizzes })}
                    </p>
                  </div>

                  {/* Modules List */}
                  <div className="flex flex-col gap-[8px]">
                    {modules.map((module, index) => {
                      const isActive = currentModuleId === module.id;
                      const moduleNumber = module.sortOrder + 1; // sortOrder 0 = Module 1, sortOrder 1 = Module 2, etc.
                      const hasUnsaved = modulesWithUnsavedEdits.has(module.id);

                      return (
                        <div
                          key={module.id}
                          className={cn(
                            "flex gap-[8px] items-center p-[12px] rounded-[12px] cursor-pointer transition-colors",
                            isActive
                              ? "bg-[#eceffd] border-[1.5px] border-[#4162e7]"
                              : "bg-white border-[0.5px] border-[#f4f4f7]",
                          )}
                          onClick={() => loadModuleData(module)}
                        >
                          {/* Drag Handle */}
                          <div className="flex items-center justify-center shrink-0">
                            <GripVertical className="h-6 w-6 text-[#63687a]" />
                          </div>

                          {/* Module Content */}
                          <div className="flex-1 flex flex-col gap-[4px] min-w-0 overflow-hidden">
                            <div className="flex flex-col gap-[8px]">
                              <div className="flex gap-[8px] items-start">
                                {/* Lock icon for first module */}
                                {module.sortOrder === 0 && (
                                  <div className="bg-[#f5f5f5] rounded-full p-[4px] shrink-0">
                                    <Lock className="h-4 w-4 text-[#575757]" />
                                  </div>
                                )}
                                <span
                                  className={cn(
                                    "text-sm font-medium px-[8px] py-[2px] rounded-[3.562px] shrink-0",
                                    isActive
                                      ? "bg-[#4162e7] text-white"
                                      : "bg-[#cacdd9] text-white",
                                  )}
                                  style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: 500,
                                  }}
                                >
                                  Module {index + 1}
                                </span>
                              </div>
                              <p
                                className="text-base font-normal text-[#3b3d48] leading-[24px] break-words"
                                style={{
                                  fontFamily: "Roboto, sans-serif",
                                  fontWeight: 400,
                                }}
                              >
                                {module.title || t("teacherCourseContent.noTitle")}
                              </p>
                            </div>
                            <div
                              className="flex gap-[4px] items-start text-[#7f859d]"
                              style={{
                                fontFamily: "Roboto, sans-serif",
                                fontWeight: 400,
                              }}
                            >
                              <span className="text-sm leading-[20px]">
                                {t("teacherCourseContent.materials", { count: module.documentCount || 0 })}
                              </span>
                              <span className="text-xs leading-[16px]">•</span>
                              <span className="text-sm leading-[20px]">
                                {t("teacherCourseContent.quizzes", { count: module.quizCount || 0 })}
                              </span>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-[#e35151] hover:text-red-600 hover:bg-red-50 flex-shrink-0 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModule(module.id, module.title);
                            }}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Module Button */}
                  <Button
                    variant="outline"
                    onClick={handleCreateNewModule}
                    className="h-[44px] w-full border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white flex items-center gap-[4px] rounded-[6px] px-[16px] py-[8px] transition-colors cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                    <span
                      className="text-sm font-medium leading-[20px]"
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {t("teacherCourseContent.addNewModule")}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Quiz Creation Modal */}
      <QuizCreationModal
        open={quizModalOpen}
        onClose={() => {
          setQuizModalOpen(false);
          setEditingQuiz(null);
        }}
        onCreate={handleCreateQuiz}
        moduleId={currentModuleId || undefined}
        moduleInfo={
          currentModule
            ? {
              id: currentModule.id,
              title: currentModule.title,
              description: currentModule.description,
              sortOrder: currentModule.sortOrder,
            }
            : null
        }
        editingQuiz={editingQuiz}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, open }))
        }
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={t("teacherCourseContent.confirmDelete")}
        cancelText={t("teacherCourseContent.confirmCancel")}
        onConfirm={confirmDialog.onConfirm}
        variant="destructive"
      />
    </>
  );
}