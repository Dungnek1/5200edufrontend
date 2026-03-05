import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import teacherCourseService from "@/services/apis/teacher-course.service";
import uploadService from "@/services/apis/upload.service";
import courseDraftService from "@/services/apis/course-draft.service";
import quizService from "@/services/apis/quiz.service";
import { logger } from '@/lib/logger';
import type { Course } from "@/types/course";

export interface Module {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  documentCount?: number;
  quizCount?: number;
}

export interface Quiz {
  id: string;
  title: string;
  instructions?: string;
  questionCount: number;
  timeLimitMinutes: number;
  passScore: number;
  totalPoints?: number;
  questions?: any[];
}

export interface ModuleVideo {
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  uploadedAt: string;
}

export interface UseCreateCourseContentProps {
  courseId: string;
  locale: string;
}

export interface UseCreateCourseContentReturn {
  loading: boolean;
  uploading: boolean;
  course: Course | null;
  modules: Module[];
  currentModuleId: string | null;
  materials: any[];
  quizzes: Quiz[];
  moduleVideos: Record<string, ModuleVideo>;
  modulesWithUnsavedEdits: Set<string>;
  canUpload: boolean;
  moduleData: { title: string; description: string };
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isFirstModule: boolean;
  currentModule: Module | undefined;
  isCourseLoaded: boolean;
  totalModules: number;
  totalQuizzes: number;
  totalDocuments: number;

  quizModalOpen: boolean;
  editingQuiz: Quiz | null;
  setQuizModalOpen: (open: boolean) => void;
  setEditingQuiz: (quiz: Quiz | null) => void;

  setModuleData: (data: { title: string; description: string }) => void;
  onCreateModule: () => Promise<void>;
  handleUploadDocument: (file: File) => Promise<void>;
  handleDeleteDocument: (documentId: string) => Promise<void>;
  handleSaveModule: () => Promise<void>;
  handleNext: () => Promise<void>;
  handleCreateNewModule: () => void;
  handleDeleteModule: (moduleId: string) => Promise<void>;
  handleOpenQuizModal: () => void;
  handleEditQuiz: (quiz: Quiz) => void;
  handleCreateQuiz: (quizData: any) => Promise<void>;
  handleDeleteQuiz: (quizId: string) => Promise<void>;
  handleReset: () => void;

  loadModuleData: (module: Module) => Promise<void>;
  setModuleVideos: (videos: Record<string, ModuleVideo>) => void;
  setQuizzes: (quizzes: Quiz[]) => void;
  fetchCourse: () => Promise<void>;
  setCurrentModuleId: (id: string | null) => void;
}

export function useCreateCourseContent({
  courseId,
  locale,
}: UseCreateCourseContentProps): UseCreateCourseContentReturn {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [moduleVideos, setModuleVideos] = useState<Record<string, ModuleVideo>>({});
  const [modulesWithUnsavedEdits, setModulesWithUnsavedEdits] = useState<Set<string>>(new Set());
  const [canUpload, setCanUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const autoCreateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoCreatingRef = useRef(false);

  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const [moduleData, setModuleData] = useState({
    title: "",
    description: "",
  });

  const isFirstModule = modules.length === 0;
  const currentModule = modules.find((m) => m.id === currentModuleId);
  const isInitialLoad = useRef(true);
  const [isCourseLoaded, setIsCourseLoaded] = useState(false);
  const lastLoadedModuleRef = useRef<string | null>(null);
  const isLoadingFromStorageRef = useRef(false);

  const totalModules = modules.length;
  const totalQuizzes = modules.reduce((sum, m) => sum + (m.quizCount || 0), 0);
  const totalDocuments = modules.reduce((sum, m) => sum + (m.documentCount || 0), 0);

  useEffect(() => {
    if (courseId) {
      courseDraftService.getOrCreateSessionId(courseId);
    }
  }, [courseId]);

  const fetchCourse = useCallback(async () => {
    try {
      const response = await teacherCourseService.getCourse(courseId);
      if (response.success && response.data) {
        setCourse(response.data);
        if (response.data.modules && response.data.modules.length > 0) {
          const sortedModules = [...response.data.modules].sort(
            (a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0),
          );
          const courseModules = sortedModules.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            sortOrder: m.sortOrder || 0,
            documentCount: m.documentCount || 0,
            quizCount: m.quizCount || 0,
          }));
          setModules(courseModules);
          setIsCourseLoaded(true);
        }
      }
    } catch (error) {
      logger.error("Error fetching course:", error);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      const cachedModules = courseDraftService.loadModulesFromSession(courseId);
      if (cachedModules && cachedModules.length > 0) {
        setModules(cachedModules);
        setIsCourseLoaded(true);
        logger.info("[CreateContent] Loaded modules from session:", cachedModules.length);
      }
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  useEffect(() => {
    if (modules.length > 0 && courseId) {
      courseDraftService.saveModulesToSession(courseId, modules);
    }
  }, [modules, courseId]);

  useEffect(() => {
    const creatingNew = courseDraftService.isCreatingNewModule(courseId);
    const canUploadNow = !!currentModuleId && !creatingNew;
    setCanUpload(canUploadNow);
    logger.info("[CreateContent] Upload permission:", {
      currentModuleId,
      creatingNew,
      canUploadNow,
    });
  }, [currentModuleId, courseId]);

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
        lastLoadedModuleRef.current = module.id;
      } catch (error) {
        logger.error("Error loading materials:", error);
      }

      setTimeout(() => {
        isLoadingFromStorageRef.current = false;
      }, 100);
    },
    [courseId],
  );

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

        logger.info("✅ Module auto-created:", newModuleId);
      }
    } catch (error) {
      logger.error("❌ Auto-create module error:", error);
    } finally {
      isAutoCreatingRef.current = false;
    }
  };

  const handleUploadDocument = async (file: File) => {
    if (!canUpload) {
      toast.error("Vui lòng tạo module thành công trước khi upload tài liệu");
      return;
    }

    const videoExtensions = [".mp4", ".mov", ".avi", ".webm"];
    const fileName = file.name.toLowerCase();
    const isVideo = videoExtensions.some((ext) => fileName.endsWith(ext));

    if (isVideo) {
      toast.error('Vui lòng tải video lên trong phần "Video bài giảng" bên trên.');
      return;
    }

    let moduleId = currentModuleId;

    if (!moduleId && isFirstModule) {
      if (!moduleData.title.trim()) {
        toast.error("Vui lòng nhập tên module trước khi upload");
        return;
      }

      try {
        setUploading(true);
        if (moduleId) {
          setCurrentModuleId(moduleId);
          setMaterials([]);
          await performUpload(file, moduleId);
          await fetchCourse();
        } else {
          toast.error("Vui lòng tạo module trước");
        }
      } catch (error: any) {
        toast.error("Không thể tạo module");
      } finally {
        setUploading(false);
      }
    } else if (moduleId) {
      await performUpload(file, moduleId);
    } else {
      toast.error("Vui lòng tạo module trước");
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
        toast.success("Upload tài liệu thành công");
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
      logger.error("Upload error:", error);
      toast.error("Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!currentModuleId) return;

    try {
      if (confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
        const response = await uploadService.deleteModuleDocument(
          courseId,
          currentModuleId,
          documentId,
        );
        if (response.success) {
          toast.success("Đã xóa tài liệu");
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
      }
    } catch (error) {
      logger.error("Delete error:", error);
      toast.error("Không thể xóa tài liệu");
    }
  };

  const handleSaveModule = async () => {
    if (!moduleData.title.trim()) {
      toast.error("Vui lòng nhập tên module");
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

            toast.success("Đã cập nhật module");
          } else {
            throw new Error("Update failed");
          }
        } catch (updateError) {
          logger.error("Error updating module:", updateError);

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

          toast.error("Không thể cập nhật module (đã lưu nháp)");
        }
      } else {
        const response = await teacherCourseService.createModule(courseId, {
          title: moduleData.title,
          description: moduleData.description,
        });

        if (response.success && response.data) {
          toast.success("Tạo module thành công");
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
      logger.error("Error saving module:", error);
      toast.error("Không thể lưu module");
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

  const handleCreateNewModule = async () => {
    courseDraftService.setCreatingNewModule(courseId, true);
    setCanUpload(false);
    setModuleData({ title: "", description: "" });
    setCurrentModuleId(null);
    setMaterials([]);
    setQuizzes([]);
    lastLoadedModuleRef.current = null;
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      const response = await teacherCourseService.deleteModule(
        courseId,
        moduleId,
      );
      if (response.success) {
        toast.success("Đã xóa module");

        // Immediately remove module from state
        setModules((prev) => prev.filter((m) => m.id !== moduleId));

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

        // ✅ FIX: Removed fetchCourse() to prevent race condition
        // State is already updated correctly above

        if (currentModuleId === moduleId) {
          setModuleData({ title: "", description: "" });
          setCurrentModuleId(null);
          setMaterials([]);
          setQuizzes([]);
        }
      }
    } catch (error) {
      logger.error("Delete error:", error);
      toast.error("Không thể xóa module");
    }
  };

  const handleOpenQuizModal = () => {
    if (!currentModuleId) {
      toast.error("Vui lòng tạo module trước");
      return;
    }
    setEditingQuiz(null);
    setQuizModalOpen(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setQuizModalOpen(true);
  };

  const handleCreateQuiz = async (quizData: any) => {
    if (!currentModuleId) return;

    try {
      const transformedData = {
        type: "QUIZ" as const,
        title: quizData.title,
        instructions: quizData.instructions,
        timeLimitSeconds: quizData.timeLimitMinutes * 60,
        passScore: quizData.passScore,
        questions: quizData.questions,
      };

      if (editingQuiz) {
        await quizService.updateAssignment(
          courseId,
          editingQuiz.id,
          transformedData,
        );
        toast.success("Cập nhật bài tập thành công!");
      } else {
        await quizService.createAssignment(courseId, {
          ...transformedData,
          lessonId: currentModuleId,
          moduleId: currentModuleId,
        });
        toast.success("Tạo bài tập thành công!");
      }

      setQuizModalOpen(false);
      setEditingQuiz(null);
    } catch (error: any) {
      logger.error("Error creating/updating quiz:", error);
      throw error;
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!currentModuleId) return;

    try {
      await quizService.deleteAssignment(courseId, quizId);
      toast.success("Đã xóa bài tập");
    } catch (error) {
      toast.error("Không thể xóa bài tập");
    }
  };

  const handleReset = () => {
    setModuleData({ title: "", description: "" });
    setMaterials([]);
    setQuizzes([]);
  };

  return {
    loading,
    uploading,
    course,
    modules,
    currentModuleId,
    materials,
    quizzes,
    moduleVideos,
    modulesWithUnsavedEdits,
    canUpload,
    moduleData,
    fileInputRef,
    isFirstModule,
    currentModule,
    isCourseLoaded,
    totalModules,
    totalQuizzes,
    totalDocuments,

    quizModalOpen,
    editingQuiz,
    setQuizModalOpen,
    setEditingQuiz,

    setModuleData,
    onCreateModule,
    handleUploadDocument,
    handleDeleteDocument,
    handleSaveModule,
    handleNext,
    handleCreateNewModule,
    handleDeleteModule,
    handleOpenQuizModal,
    handleEditQuiz,
    handleCreateQuiz,
    handleDeleteQuiz,
    handleReset,

    loadModuleData,
    setModuleVideos,
    setQuizzes,
    fetchCourse,
    setCurrentModuleId,
  };
}
