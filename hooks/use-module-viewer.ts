"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import studentCourseService from "@/services/apis/student-course.service";
import publicCourseService from "@/services/apis/public-course.service";
import { toast } from "sonner";
import type { Course, CourseSection } from "@/types/course";
import { useTranslations } from "next-intl";
import { logger } from "@/lib/logger";

/** Hook that manages state and data fetching for the module viewer page. */
export function useModuleViewer() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const courseId = params.id as string;
  const moduleIdParam = params.moduleId as string;
  const locale = params.locale as string;
  const { isAuthenticated, user } = useAuth();

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseSection[]>([]);
  const [currentModule, setCurrentModule] = useState<any>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(-1);

  const [activeTab, setActiveTab] = useState<"overview" | "assignment">("overview");
  const [showAssignmentTab, setShowAssignmentTab] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    totalPoints: number;
    passed: boolean;
    answers: Array<{ questionId: string; isCorrect: boolean; correctOptionId?: string; selectedOptionId?: string }>;
    highestScore?: number;
  } | null>(null);

  // Fetch course info for breadcrumbs
  useEffect(() => {
    if (!courseId) return;
    publicCourseService.getCourse(courseId).then((res) => {
      if (res.success && res.data) setCourse(res.data);
    }).catch((err) => logger.error("Failed to fetch course info:", err));
  }, [courseId]);

  // Check enrollment → fetch modules → fetch current module
  useEffect(() => {
    if (!courseId || !isAuthenticated || !user) {
      if (!isAuthenticated && courseId) {
        router.push(`/${locale}/student/courses/${courseId}`);
      }
      setCheckingEnrollment(false);
      return;
    }

    const init = async () => {
      try {
        setCheckingEnrollment(true);
        const enrollRes = await studentCourseService.getCourse(courseId);
        if (!enrollRes.success || !enrollRes.data) {
          setIsEnrolled(false);
          toast.error(t("lesson.notEnrolled"));
          router.push(`/${locale}/student/courses/${courseId}`);
          return;
        }
        setIsEnrolled(true);

        // Fetch all modules
        const modulesRes = await studentCourseService.getModules(courseId);
        const allModules: CourseSection[] = modulesRes.success ? modulesRes.data || [] : [];
        setModules(allModules);

        // Resolve 'first' or 'intro' to actual module ID
        let resolvedId = moduleIdParam;
        if (moduleIdParam === "first" || moduleIdParam === "intro") {
          if (allModules.length > 0) {
            resolvedId = allModules[0].id;
            router.replace(`/${locale}/student/courses/${courseId}/modules/${resolvedId}`);
          } else {
            setLoading(false);
            return;
          }
        }

        const idx = allModules.findIndex((m) => m.id === resolvedId);
        setCurrentModuleIndex(idx);
        setCurrentModuleId(resolvedId);

        // Fetch module detail
        setLoading(true);
        const modRes = await studentCourseService.getModule(courseId, resolvedId);
        if (modRes.success && modRes.data) {
          setCurrentModule(modRes.data);
          const hasAssignments = modRes.data.assignments?.length > 0 || modRes.data.quiz;
          setShowAssignmentTab(!!hasAssignments);
        }
      } catch (err) {
        logger.error("Module viewer init failed:", err);
        setIsEnrolled(false);
        toast.error(t("lesson.notEnrolled"));
        router.push(`/${locale}/student/courses/${courseId}`);
      } finally {
        setCheckingEnrollment(false);
        setLoading(false);
      }
    };

    init();
  }, [courseId, moduleIdParam, isAuthenticated, user, locale, router, t]);

  // n8n tracking webhook
  const sendWebhook = useCallback(async (event: string, data: any) => {
    try {
      const url = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      if (!url) return;
      await fetch(`${url}/lesson-tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event, userId: user?.id, courseId, moduleId: currentModuleId,
          timestamp: new Date().toISOString(), ...data,
        }),
      });
    } catch (err) {
      logger.error("Failed to send webhook:", err);
    }
  }, [user?.id, courseId, currentModuleId]);

  // Track module started
  useEffect(() => {
    if (currentModule && !loading) {
      sendWebhook("module_started", { moduleTitle: currentModule.title });
    }
  }, [currentModule, loading, sendWebhook]);

  const handleVideoEnd = async () => {
    if (!currentModuleId) return;
    try {
      await studentCourseService.completeLesson(courseId, currentModuleId);
      toast.success(t("lesson.completed"));
      sendWebhook("module_completed", { moduleTitle: currentModule?.title });
    } catch (err) {
      logger.error("Failed to mark module complete:", err);
    }
  };

  const handleQuizSubmit = async (answers: Array<{ questionId: string; selectedOption: string }>) => {
    const assignment = currentModule?.assignments?.[0];
    if (!assignment?.id) return;
    try {
      const res = await studentCourseService.submitQuiz(courseId, assignment.id, answers);
      if (res.success && res.data) {
        setQuizResult({
          score: res.data.score || 0,
          totalPoints: res.data.totalPoints || answers.length,
          passed: res.data.passed || false,
          answers: res.data.answers || [],
          highestScore: (res.data as any).highestScore,
        });
        setQuizSubmitted(true);
        if (currentModuleId) {
          await studentCourseService.completeLesson(courseId, currentModuleId);
        }
        toast.success(t("lesson.quizSubmitted"));
        sendWebhook("quiz_submitted", {
          quizId: assignment.id, score: res.data.score,
          totalPoints: res.data.totalPoints, passed: res.data.passed,
        });
      }
    } catch (err) {
      logger.error("Failed to submit quiz:", err);
      toast.error(t("lesson.quizSubmitError"));
    }
  };

  const handleRetakeQuiz = () => {
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const navigateModule = (direction: "prev" | "next") => {
    const newIdx = direction === "prev" ? currentModuleIndex - 1 : currentModuleIndex + 1;
    if (newIdx >= 0 && newIdx < modules.length) {
      router.push(`/${locale}/student/courses/${courseId}/modules/${modules[newIdx].id}`);
    }
  };

  // Resolve video URL from module data
  const videoUrl = currentModule?.video?.streamUrl
    || currentModule?.video?.videoUrl
    || currentModule?.videoUrl
    || (currentModuleId ? `${process.env.NEXT_PUBLIC_API_URL}/videos/modules/${currentModuleId}/stream` : null);

  return {
    courseId, locale, course, modules, currentModule, currentModuleId,
    currentModuleIndex, loading, checkingEnrollment, isEnrolled,
    activeTab, setActiveTab, showAssignmentTab,
    quizSubmitted, quizResult, videoUrl,
    handleVideoEnd, handleQuizSubmit, handleRetakeQuiz, navigateModule,
    router, t,
  };
}
