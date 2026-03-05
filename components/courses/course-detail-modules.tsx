"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, PlusCircle, X, CheckCircle, Lock, ClipboardList } from "lucide-react";
import { useTranslations } from "next-intl";
import { CourseSection } from "@/types/course";
import { toast } from "sonner";
import teacherCourseService from "@/services/apis/teacher-course.service";
import { progressService, ModuleProgress } from "@/services/apis/progress.service";
import type { Assignment } from "@/types/assignment";

import { formatFileSize } from "@/utils/formatFileSize";
import getIcon from "@/utils/getIcon";


interface CourseDetailModulesProps {
  modules: CourseSection[];
  currentLessonId?: string;
  onLessonClick?: (lessonId: string) => void;
  courseId: string;
  selectedModuleId?: string | null;
  onModuleSelect?: (moduleId: string) => void;
  disable?: boolean;
  /** Trang chỉ xem (review): ẩn ô nhập, nút Thêm, chỉ hiển thị nội dung */
  viewOnly?: boolean;
  progressData?: Record<string, ModuleProgress>;
  onProgressUpdate?: () => void; // Callback to refresh progress data
  /** Chế độ xem thử: chỉ module đầu tiên mở khóa, các module sau hiển thị icon khoá */
  trialMode?: boolean;
  trialUnlockedModuleId?: string | null;
  /** Bài tập theo từng module (sectionId -> assignments) */
  assignmentsBySection?: Record<string, Assignment[]>;
}

export function CourseDetailModules({
  modules,
  courseId,
  selectedModuleId,
  onModuleSelect,
  disable,
  viewOnly = false,
  progressData = {},
  onProgressUpdate,
  trialMode,
  trialUnlockedModuleId,
  assignmentsBySection = {},
}: CourseDetailModulesProps) {
  const t = useTranslations();

  const [expandedModule, setExpandedModule] = useState<string | null>(
    selectedModuleId || (modules.length > 0 ? modules[0].id : null)
  );
  const [minFinishValues, setMinFinishValues] = useState<Record<string, number>>({});
  const [selectedTargetSections, setSelectedTargetSections] = useState<Record<string, string[]>>({});
  const [targetSectionInput, setTargetSectionInput] = useState<Record<string, string>>({});

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
    if (onModuleSelect) {
      onModuleSelect(moduleId);
    }
  };

  const checkIsVideoMimeType = (mimeType: string) => {
    return mimeType?.startsWith('video/') || mimeType === 'application/x-mpegURL';
  };

  const handleDocumentClick = async (document: { documentUrl?: string; mimeType?: string; id: string, documentId: string }, sectionId: string) => {
    if (!document.documentUrl) {
      toast.info(t("course.enrollToView"));
      return;
    }

    // For non-video documents, mark as completed immediately
    if (!disable && !checkIsVideoMimeType(document.mimeType || '')) {
      try {
        console.log('[Progress] Marking document as completed:', {
          courseId,
          sectionId,
          documentId: document.documentId,
        });
        await progressService.updateModuleProgress(
          courseId,
          sectionId,
          document.documentId,
          { isCompleted: true }
        );

        // Refresh progress data
        if (onProgressUpdate) {
          onProgressUpdate();
        }

        toast.success(t("course.documentCompleted"));
      } catch (error) {
        console.error('[Progress] Failed to mark document as completed:', error);
      }
    }

    // Open document in new tab
    window.open(`${process.env.NEXT_PUBLIC_MINIO}/${document.documentUrl}`, "_blank");
  };

  const getDocumentProgress = (documentId: string) => {
    return progressData[documentId];
  };

  const handleMinFinishBlur = async (moduleId: string) => {
    if (!disable) return;

    const newValue = minFinishValues[moduleId];
    const currentModule = modules.find(m => m.id === moduleId);

    // Check if value actually changed
    if (currentModule && newValue === currentModule.minFinsish) {
      return; // No change, skip API call
    }

    const toastId = toast.loading(t('course.updatingMinFinish'));

    try {
      await teacherCourseService.updateModuleSettings(courseId, moduleId, {
        minFinsish: newValue || null,
      });
      toast.success(t('course.updateMinFinishSuccess'), { id: toastId });
    } catch {
      toast.error(t('course.updateMinFinishError'), { id: toastId });
    }
  };

  const handleTargetSectionChange = async (moduleId: string, targetSectionIds: string[]) => {
    if (!disable) return;

    const toastId = toast.loading(t('course.updatingTargetSection'));
    setSelectedTargetSections(prev => ({ ...prev, [moduleId]: targetSectionIds }));

    try {
      await teacherCourseService.updateModuleSettings(courseId, moduleId, {
        targetSection: targetSectionIds.length > 0 ? targetSectionIds : null,
      });
      toast.success(t('course.updateTargetSectionSuccess'), { id: toastId });
    } catch {
      toast.error(t('course.updateTargetSectionError'), { id: toastId });
      // Revert state on error
      setSelectedTargetSections(prev => {
        const newState = { ...prev };
        delete newState[moduleId];
        return newState;
      });
    }
  };

  const addTargetSection = (moduleId: string, targetSectionId: string) => {
    const currentModule = modules.find(m => m.id === moduleId);
    const currentSections = selectedTargetSections[moduleId] ||
      (currentModule && Array.isArray(currentModule.targetSection) ? currentModule.targetSection : []);

    if (!currentSections.includes(targetSectionId)) {
      const newSections = [...currentSections, targetSectionId];
      handleTargetSectionChange(moduleId, newSections);
    }
  };

  const removeTargetSection = (moduleId: string, targetSectionId: string) => {
    const currentModule = modules.find(m => m.id === moduleId);
    const currentSections = selectedTargetSections[moduleId] ||
      (currentModule && Array.isArray(currentModule.targetSection) ? currentModule.targetSection : []);

    const newSections = currentSections.filter(id => id !== targetSectionId);
    handleTargetSectionChange(moduleId, newSections);
  };

  const getModuleById = (moduleId: string) => {
    return modules.find(m => m.id === moduleId);
  };



  return (
    <div className="bg-white border border-[#f4f4f7] rounded-[8px] sm:rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] overflow-hidden w-full">
      {!disable && (
        <div className="flex items-center px-3 sm:px-[16px] py-3 sm:py-4 border-b border-[#f4f4f7]">
          <h2
            className="text-lg sm:text-xl font-medium text-[#0f172a]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            {t("course.courseContent")}
          </h2>
        </div>
      )}
      <section className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {modules.map((module, index) => {
              const isExpanded = expandedModule === module.id;
              const documents = module.documents || [];
              const isTrialLocked =
                !!trialMode &&
                !!trialUnlockedModuleId &&
                module.id !== trialUnlockedModuleId;

              return (
                <div
                  key={module.id}
                  className={`rounded-xl overflow-hidden bg-[#fafafa]`}
                >

                  <button
                    onClick={() => toggleModule(module.id)}
                    className="bg-white flex gap-4 items-center p-4 rounded-xl w-full hover:bg-[#eceffd] transition-colors cursor-pointer"
                  >
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className=" flex items-center justify-between min-w-0">

                          <div className="flex flex-col  gap-[8px]">
                            <div className=" flex items-center gap-[4px] ">
                              {!isExpanded && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect width="24" height="24" rx="12" fill="#F5F5F5" />
                                  <g clipPath="url(#clip0_2782_45055)">
                                    <path d="M5.3335 14.666C5.3335 12.7804 5.3335 11.8376 5.91928 11.2518C6.50507 10.666 7.44788 10.666 9.3335 10.666H14.6668C16.5524 10.666 17.4953 10.666 18.081 11.2518C18.6668 11.8376 18.6668 12.7804 18.6668 14.666C18.6668 16.5516 18.6668 17.4944 18.081 18.0802C17.4953 18.666 16.5524 18.666 14.6668 18.666H9.3335C7.44788 18.666 6.50507 18.666 5.91928 18.0802C5.3335 17.4944 5.3335 16.5516 5.3335 14.666Z" fill="#FAFAFA" stroke="#575757" strokeWidth="0.96" />
                                    <path d="M8 10.6673V9.33398C8 7.12485 9.79086 5.33398 12 5.33398C14.2091 5.33398 16 7.12485 16 9.33398V10.6673" stroke="#575757" strokeWidth="0.96" strokeLinecap="round" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_2782_45055">
                                      <rect width="16" height="16" fill="white" transform="translate(4 4)" />
                                    </clipPath>
                                  </defs>
                                </svg>

                              )}

                              <p
                                className="flex items-center  text-xs bg-[#4162e7] px-[8px] py-[2px] h-[24px] rounded-[4px] font-medium text-white  truncate"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                              >
                                {module.title}
                              </p>

                              {isTrialLocked && (
                                <div className="ml-2 flex items-center gap-1 text-xs text-[#8c92ac]">
                                  <Lock className="w-3 h-3" />
                                </div>
                              )}

                            </div>
                            <p
                              className="text-sm sm:text-base lg:text-base font-bold lg:font-bold text-[#3b3d48] leading-5 sm:leading-6 lg:leading-6 break-words text-left"
                              style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                              {module.description}
                            </p>


                          </div>

                          <div className="flex items-center gap-3">
                            {viewOnly ? (
                              module.minFinsish != null && module.minFinsish > 0 && (
                                <span className="text-xs text-gray-500 font-medium">{module.minFinsish} {t('common.minute')}</span>
                              )
                            ) : disable ? (
                              <input
                                type="number"
                                value={minFinishValues[module.id] ?? module.minFinsish ?? ''}
                                onChange={(e) => setMinFinishValues(prev => ({ ...prev, [module.id]: Number(e.target.value) }))}
                                onBlur={() => handleMinFinishBlur(module.id)}
                                placeholder={t('course.minTimePlaceholder')}
                                className="w-24 px-2 py-1 text-xs bg-[#eceffd] rounded focus:outline-none focus:border-none"
                              />
                            ) : (
                              module.minFinsish && module.minFinsish > 0 && (
                                <span className="text-xs text-gray-500 font-medium">{module.minFinsish} {t('common.minute')}</span>
                              )
                            )}
                          </div>

                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#3b3d48] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#3b3d48] flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="flex flex-col gap-2 p-3">


                      {documents.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          {t("course.noDocuments")}
                        </div>
                      ) : (
                        documents.map((document, index) => {
                          const progress = getDocumentProgress(document.documentId);
                          const isCompleted = progress?.isCompleted;
                          const watchPercent = progress?.watchPercent;
                          const isVideo = checkIsVideoMimeType(document.mimeType);

                          return (
                            <div
                              key={document.documentId || index}
                              onClick={() => handleDocumentClick(document, module.id)}
                              className="bg-white flex items-center p-3 rounded-xl hover:bg-[#eceffd] cursor-pointer border border-transparent hover:border-[#4162e7]/20 transition-all"
                            >
                              <div className="flex-1 flex gap-3 items-center min-w-0">
                                {/* <div className="w-10 h-10 rounded-lg bg-[#eceffd] flex items-center justify-center flex-shrink-0">
                                  {getIcon(document.mimeType)}
                                </div> */}
                                <img src='/icons/Alert.svg' alt='Alert Icon' className='w-[44px] h-[44px] rounded-[10px]' />

                                <div className="flex-1 flex flex-col gap-0.5 overflow-hidden min-w-0">
                                  <p
                                    className="text-sm font-medium leading-5 whitespace-pre-wrap text-[#3b3d48]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                  >
                                    {document.fileName}
                                  </p>
                                  <div
                                    className="flex gap-2 items-center text-xs text-[#7f859d]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                  >
                                    <span>{formatFileSize(document.fileSize)}</span>

                                    {/* Progress indicator */}
                                    {!disable && isCompleted && (
                                      <span className="flex items-center gap-1 text-green-600 font-medium">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        {t("course.completed")}
                                      </span>
                                    )}

                                    {!disable && !isCompleted && isVideo && watchPercent && watchPercent > 0 && (
                                      <span className="text-blue-600 font-medium">
                                        {Math.round(watchPercent)}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>


                              <div className="flex-shrink-0 ml-2">
                                {isCompleted && !disable ? (
                                  <CheckCircle className="w-5 h-5 text-green-600 fill-current" />
                                ) : !document.documentUrl ? (
                                  <PlusCircle className="w-5 h-5 text-gray-400 stroke-1" />
                                ) : (
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_2931_60955)">
                                      <path d="M6.6665 9.99999L9.99984 13.3333M9.99984 13.3333L13.3332 9.99999M9.99984 13.3333V6.66666M18.3332 9.99999C18.3332 14.6024 14.6022 18.3333 9.99984 18.3333C5.39746 18.3333 1.6665 14.6024 1.6665 9.99999C1.6665 5.39762 5.39746 1.66666 9.99984 1.66666C14.6022 1.66666 18.3332 5.39762 18.3332 9.99999Z" stroke="#3B3D48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_2931_60955">
                                        <rect width="20" height="20" fill="white" />
                                      </clipPath>
                                    </defs>
                                  </svg>

                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                      {/* Bài tập (assignments) */}
                      {(assignmentsBySection[module.id]?.length ?? 0) > 0 && (
                        <div className="flex flex-col gap-2">
                          {(assignmentsBySection[module.id] || []).map((assignment) => (
                            <div
                              key={assignment.id}
                              className="bg-white flex items-center p-3 rounded-xl border border-[#f4f4f7]"
                            >
                              <div className="flex-1 flex gap-3 items-center min-w-0">
                                <ClipboardList className="w-5 h-5 text-[#4162e7] shrink-0" />
                                <div className="flex-1 flex flex-col gap-0.5 overflow-hidden min-w-0">
                                  <p
                                    className="text-sm font-medium leading-5 text-[#3b3d48]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                  >
                                    {assignment.title}
                                  </p>
                                  <p className="text-xs text-[#7f859d]">
                                    {assignment.type === "QUIZ"
                                      ? t("teacherCourseContent.quizSummary.questions", {
                                          count: assignment.quizQuestions?.length ?? 0,
                                        })
                                      : t("quiz.essayTitle")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {disable && !viewOnly && (
                        <div className="mb-3 p-3 bg-white rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('course.targetModules')}:
                          </label>


                          <div className="flex flex-wrap gap-2 mb-2">
                            {(selectedTargetSections[module.id] ||
                              (Array.isArray(module.targetSection) ? module.targetSection : []))
                              .map(sectionId => {
                                const targetModule = getModuleById(sectionId);

                                return (
                                  <div
                                    key={sectionId}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#eceffd] text-blue-700 rounded-full text-xs font-medium "
                                  >
                                    <span>{targetModule ? targetModule.title : sectionId}</span>

                                    <button
                                      onClick={() => removeTargetSection(module.id, sectionId)}
                                      className="hover:bg-blue-200 rounded-full p-0.5 cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>

                                  </div>

                                );
                              })}
                          </div>


                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={targetSectionInput[module.id] || ''}
                              onChange={(e) => setTargetSectionInput(prev => ({ ...prev, [module.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && targetSectionInput[module.id]?.trim()) {
                                  addTargetSection(module.id, targetSectionInput[module.id].trim());
                                  setTargetSectionInput(prev => ({ ...prev, [module.id]: '' }));
                                }
                              }}
                              placeholder={t('course.targetModulePlaceholder')}
                              className="flex-1 px-3 py-2 text-sm rounded-lg focus:outline-none border border-gray-50"
                            />
                            <button
                              onClick={() => {
                                if (targetSectionInput[module.id]?.trim()) {
                                  addTargetSection(module.id, targetSectionInput[module.id].trim());
                                  setTargetSectionInput(prev => ({ ...prev, [module.id]: '' }));
                                }
                              }}
                              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                              {t('common.add')}
                            </button>
                          </div>
                        </div>
                      )}
                      {disable && viewOnly && (selectedTargetSections[module.id] || (Array.isArray(module.targetSection) ? module.targetSection : []))?.length > 0 && (
                        <div className="mb-3 p-3 bg-white rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('course.targetModules')}:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(selectedTargetSections[module.id] || (Array.isArray(module.targetSection) ? module.targetSection : []))
                              .map(sectionId => {
                                const targetModule = getModuleById(sectionId);
                                return (
                                  <span
                                    key={sectionId}
                                    className="inline-flex items-center px-3 py-1 bg-[#eceffd] text-blue-700 rounded-full text-xs font-medium"
                                  >
                                    {targetModule ? targetModule.title : sectionId}
                                  </span>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>


          {modules.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {t("course.noModules") || "Chưa có nội dung khóa học"}
              </p>
            </div>
          )}
      </section>
    </div>
  );
}
