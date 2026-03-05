"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, FileText, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Assignment, SubmitAssignmentPayload } from "@/types/assignment";
import studentCourseService from "@/services/apis/student-course.service";
import assignmentService from "@/services/apis/assignment.service";
import { getMinIOUrl } from "@/config/minio.config";

interface QuizTakerProps {
    assignment: Assignment;
    enrollmentId: string;
    onSubmitSuccess?: () => void;
    existingAttemptId?: string;
}

export function QuizTaker({ assignment, enrollmentId, onSubmitSuccess, existingAttemptId }: QuizTakerProps) {
    const t = useTranslations();
    const [selectedAnswers, setSelectedAnswers] = useState<Map<string, string>>(new Map());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [attemptDetail, setAttemptDetail] = useState<any>(null);
    const [isLoadingAttempt, setIsLoadingAttempt] = useState(false);
    const [essayContent, setEssayContent] = useState<string>("");
    const [isUploadingEssayFile, setIsUploadingEssayFile] = useState(false);
    const [essayAttachment, setEssayAttachment] = useState<{ name: string; objectKey: string } | null>(null);
    const essayFileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (existingAttemptId) {
            loadAttemptDetail(existingAttemptId);
        }
    }, [existingAttemptId]);

    const loadAttemptDetail = async (attemptId: string) => {
        if (!attemptId) {
            console.error('loadAttemptDetail called with empty attemptId');
            toast.error(t('quiz.invalidAttemptId'));
            return;
        }

        console.log('Loading attempt detail for:', attemptId);
        setIsLoadingAttempt(true);
        try {
            const response = await studentCourseService.getAssignmentAttempt(attemptId);
            console.log('Attempt detail response:', response);

            if (response.success && response.data) {
                setAttemptDetail(response.data);
                setShowResults(true);
            } else {
                console.error('Failed to load attempt detail:', response);
                toast.error(t('quiz.loadResultsFailed'));
            }
        } catch (error) {
            console.error('Failed to load attempt:', error);
            toast.error(t('quiz.loadResultsError'));
        } finally {
            setIsLoadingAttempt(false);
        }
    };

    const handleAnswerSelect = (questionId: string, optionId: string) => {
        setSelectedAnswers((prev) => {
            const newMap = new Map(prev);
            newMap.set(questionId, optionId);
            return newMap;
        });
    };

    const handleSubmit = async () => {
        if (!assignment.quizQuestions || assignment.quizQuestions.length === 0) {
            toast.error(t('quiz.noQuestions'));
            return;
        }


        const unansweredCount = assignment.quizQuestions.length - selectedAnswers.size;
        if (unansweredCount > 0) {
            const confirm = window.confirm(
                t('quiz.unansweredQuestions', { count: unansweredCount })
            );
            if (!confirm) return;
        }

        if (assignment.essayPrompt) {
            const hasText = essayContent.trim().length > 0;
            const hasFile = !!essayAttachment;
            if (!hasText && !hasFile) {
                toast.error(t('quiz.essayRequired'));
                return;
            }
        }

        if (isUploadingEssayFile) {
            toast.error(t('quiz.essayFileUploading'));
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: SubmitAssignmentPayload = {
                assignmentId: assignment.id,
                selectedAnswers: Array.from(selectedAnswers.entries()).map(([questionId, optionId]) => ({
                    questionId,
                    selectedOptionId: optionId,
                })),
                ...(assignment.essayPrompt
                    ? {
                        essayContent: essayContent.trim() || undefined,
                        attachmentUrl: essayAttachment?.objectKey,
                    }
                    : {}),
            };

            const response = await studentCourseService.submitAssignment(enrollmentId, payload);


            if (response.data) {
                console.log('Submit response:', response.data.attemptId);
                //@ts-ignore
                await loadAttemptDetail(response.data.data.attemptId);
                onSubmitSuccess?.();
            } else {
                toast.error(t('quiz.submitError'));
            }
        } catch (error) {
            toast.error(t('quiz.submitErrorGeneric'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showResults && attemptDetail) {
        const score = attemptDetail.score || 0;
        const maxScore = attemptDetail.maxScore || 0;
        const scorePercent = maxScore ? Math.round((score / maxScore) * 100) : 0;
        const passScore = assignment.passScore || 0;
        const isPassed = scorePercent >= passScore;


        const rawAnswers = attemptDetail.quizAnswers ?? attemptDetail.data?.quizAnswers ?? [];


        const answersMap = new Map(
            rawAnswers.map((ans: any) => [
                ans.questionId,
                { selectedOptionId: ans.selectedOptionId, isCorrect: ans.isCorrect }
            ])
        );

        // Calculate correct count
        const correctCount = Array.from(answersMap.values()).filter(ans => ans.isCorrect === true).length;
        const totalQuestions = assignment.quizQuestions?.length || 0;

        return (
            <div className="">

                <div className="">
                    <h3 className=" font-semibold flex items-center justify-between bg-[#E8F6ED] h-[40px] rounded-[8px] px-[12px] py-[4px] ">
                        <p className='text-[14px] text-[#3B3D48]'>{t('quiz.countQuestionsCorrect')}:</p>
                        <p>
                            <span className='text-[#16A34A] text-[16px]'> {correctCount} </span>
                            / <span className='text-[#7F859D] text-[14px]'> {totalQuestions} </span>
                        </p>
                    </h3>

                    {assignment.quizQuestions?.map((question, index) => {
                        const userAnswer = answersMap.get(question.id);
                        // isCorrect is stored per answer in DB by BE
                        const isQuestionCorrect = userAnswer?.isCorrect === true;
                        // The option user selected
                        const userSelectedOptionId = userAnswer?.selectedOptionId;

                        return (
                            <div key={question.id} className="p-[16px] flex flex-col gap-[12px]">

                                <div className="flex gap-3 flex-col">
                                    <button className="flex-shrink-0 h-[24px] max-w-[60px] px-[8px] py-[2px] rounded-[4px] bg-[#0A0BD9] text-[#FFFFFF] text-[14px] flex items-center justify-center font-semibold">
                                        {t('quiz.question')} {index + 1}
                                    </button>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{question.prompt}</h3>
                                    </div>
                                </div>


                                <div className="space-y-2 mt-2">
                                    {question.options.map((option) => {
                                        const isCorrectOption = option.isCorrect === true;

                                        const isWrongSelected = userSelectedOptionId === option.id && !isQuestionCorrect;

                                        const isRightSelected = userSelectedOptionId === option.id && isQuestionCorrect;

                                        return (
                                            <div
                                                key={option.id}
                                                className="flex items-center space-x-3 p-3 rounded-lg "
                                            >
                                                <div className={cn(
                                                    "w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                                                    isCorrectOption
                                                        ? "border-[0.5px] border-[#B7E2C7] bg-[#16A34A]"
                                                        : isWrongSelected
                                                            ? "border-red-500 bg-[#DC2626]"
                                                            : "border-[#DBDDE5] bg-white"
                                                )}>
                                                    {(isCorrectOption || isWrongSelected) && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <span className={cn(
                                                    "flex-1 text-sm px-[12px] py-[10.5px] rounded-[4px]",
                                                    isCorrectOption && "bg-[#E8F6ED] border-[0.5px] border-[#B7E2C7] font-medium",
                                                    isWrongSelected && "bg-[#FCE9E9] border-[0.5px] border-[#F4BCBC] font-medium",
                                                )}>
                                                    {option.text}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>


                                {question.explanation && (
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        <span className="font-medium">{t('quiz.explanation')}:</span> {question.explanation}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>


                {attemptDetail.essaySubmission && (
                    <div className="mt-4 space-y-3">
                        <h3 className="font-semibold text-lg">{t('quiz.essayTitle')}</h3>
                        {attemptDetail.essaySubmission.content && (
                            <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                                {attemptDetail.essaySubmission.content}
                            </div>
                        )}
                        {attemptDetail.essaySubmission.attachmentUrl && (
                            <a
                                href={`${process.env.NEXT_PUBLIC_MINIO}/${attemptDetail.essaySubmission.attachmentUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-600 underline"
                            >
                                {t('quiz.viewEssayAttachment')}
                            </a>
                        )}
                    </div>
                )}
            </div>
        );
    }


    if (isLoadingAttempt) {
        return (
            <Card className="p-6">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">{t('quiz.loading')}</p>
                </div>
            </Card>
        );
    } return (
        <div className="flex flex-col gap-[20px]">

            <Card className="p-4">
                <div>
                    <div>
                        <h2 className="text-xl font-bold">{assignment.title}</h2>
                        {assignment.instructions && (
                            <p className="text-sm text-muted-foreground mt-1">{assignment.instructions}</p>
                        )}
                    </div>
                </div>
                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                    {assignment.maxScore && (
                        <span>
                            {t('quiz.score')}: {assignment.maxScore}
                        </span>
                    )}
                    {assignment.passScore && (
                        <span>
                            {t('quiz.minScore')}: {assignment.passScore}%
                        </span>
                    )}
                    <span>
                        {t('quiz.questionCount')}: {assignment.quizQuestions?.length || 0}
                    </span>
                </div>
            </Card>


            {assignment.quizQuestions?.map((question, index) => (
                <div key={question.id} className="p-[16px] flex flex-col gap-[12px]  rounded-[12px]">
                    <div>
                        <div className="flex gap-3 flex-col">
                            <button className="flex-shrink-0 h-[24px] max-w-[60px] px-[8px] py-[2px] rounded-[4px] bg-[#0A0BD9] text-[#FFFFFF] text-[14px] flex items-center justify-center font-semibold">
                                Câu {index + 1}
                            </button>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{question.prompt}</h3>

                            </div>
                        </div>

                        <RadioGroup
                            value={selectedAnswers.get(question.id) || ""}
                            onValueChange={(value) => handleAnswerSelect(question.id, value)}
                            className="space-y-3 mt-4"
                        >
                            {question.options.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer"
                                >
                                    <RadioGroupItem value={option.id} id={option.id} />
                                    <Label
                                        htmlFor={option.id}
                                        className={`flex-1 cursor-pointer h-[41px] px-[12px] py-[10.5px] rounded-[4px] flex items-center transition-colors ${selectedAnswers.get(question.id) === option.id
                                            ? "bg-[#EAF2FF]"
                                            : "bg-white "
                                            }`}
                                    >
                                        {option.text}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>
            ))}


            {assignment.essayPrompt && (
                <div className=" space-y-4">
                    <div className="px-4 flex gap-3 flex-col">
                        <button className="flex-shrink-0 h-[24px] max-w-[80px] px-[8px] py-[2px] rounded-[4px] bg-[#0A0BD9] text-[#FFFFFF] text-[14px] flex items-center justify-center font-semibold">
                            {t('quiz.question')} {(assignment.quizQuestions?.length || 0) + 1}
                        </button>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-semibold text-lg">
                                {assignment.essayPrompt.rubric}
                            </h3>

                        </div>
                    </div>


                    <div className="space-y-2">
                        {essayAttachment ?
                            <>
                                <div className="flex items-center justify-between bg-[#FAFAFA] p-[12px] rounded-[8px]">
                                    <div className='flex items-center gap-[8px] border-[0.5px] border-[#B2B6C7] p-[8px] rounded-[8px]'>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-[#0A0BD9]" />
                                            <span className="text-sm font-medium text-[#3b3d48]">{essayAttachment.name}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setEssayAttachment(null);
                                                essayFileInputRef.current!.value = '';
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div
                                    onClick={() => !isUploadingEssayFile && essayFileInputRef.current?.click()}
                                    className={`bg-white border border-dashed rounded-[12px] flex flex-col gap-[24px] items-center px-[32px] py-[20px] transition-colors ${isUploadingEssayFile
                                        ? "border-[#DBDDE5] cursor-not-allowed opacity-50"
                                        : "border-[#DBDDE5] cursor-pointer"
                                        }`}
                                >
                                    <input
                                        ref={essayFileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt,.xlsx,.csv,.mp4,.mov"
                                        className="hidden"
                                        disabled={isUploadingEssayFile}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.csv', '.mp4', '.mov'];
                                            const fileExtension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] || '';

                                            if (!allowedExtensions.includes(fileExtension)) {
                                                toast.error(t('quiz.fileTypeError'));
                                                e.target.value = '';
                                                return;
                                            }

                                            if (file.size > 50 * 1024 * 1024) {
                                                toast.error(t('quiz.fileSizeError'));
                                                e.target.value = '';
                                                return;
                                            }

                                            try {
                                                setIsUploadingEssayFile(true);
                                                const res = await assignmentService.uploadAssignmentFile(file);
                                                setEssayAttachment({ name: file.name, objectKey: res.data.objectKey });
                                                toast.success(t('quiz.essayFileUploaded'));
                                            } catch (error: any) {
                                                console.error('File upload error:', error);
                                                const errorMessage = error?.response?.data?.message || error?.message || t('quiz.essayFileUploadError');
                                                toast.error(errorMessage);
                                                e.target.value = '';
                                            } finally {
                                                setIsUploadingEssayFile(false);
                                            }
                                        }}
                                    />

                                    <div className="flex flex-col items-center gap-[6.85px] text-center">
                                        <p
                                            className="text-[16px] font-medium text-[#3B3D48] leading-[24px]"
                                            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 500 }}
                                        >
                                            {t('quiz.dragAndDropHere')}
                                        </p>
                                        <p
                                            className="text-[12px] font-normal text-[#B1B1B1] leading-[18px]"
                                            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}
                                        >
                                            PDF, DOC, DOCX, TXT, XLSX, CSV, MP4, MOV up to 50MB
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isUploadingEssayFile}
                                        className="h-[44px] px-[16px] py-[8px] border border-[#0A0BD9] text-[#0A0BD9] text-[#0A0BD9] rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isUploadingEssayFile) {
                                                essayFileInputRef.current?.click();
                                            }
                                        }}
                                    >
                                        <span
                                            className="text-sm font-medium leading-[20px]"
                                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                        >
                                            {isUploadingEssayFile
                                                ? t('quiz.uploading')
                                                : essayAttachment
                                                    ? t('quiz.changeEssayFile')
                                                    : t('quiz.uploadEssayFile')}
                                        </span>
                                    </Button>
                                </div>
                            </>

                        }

                    </div>


                    <div className="flex flex-col gap-[4px]">
                        <Label className="text-[14px] text-[#7F859D] font-medium">
                            {t('quiz.essayContentLabel')}
                        </Label>
                        <textarea
                            className="w-full min-h-[120px] border border-[#F4F4F7] rounded-[8px] px-[12px] py-[10px] text-[#7F859D] text-[14px] bg-[#FAFAFA] focus:outline-none focus:border-none"
                            value={essayContent}
                            onChange={(e) => setEssayContent(e.target.value)}
                            placeholder={t('quiz.essayPlaceholder')}
                        />
                    </div>
                </div>
            )}




            <div className="flex flex-col gap-[4px]">
                <div className="text-sm text-muted-foreground">
                    {t('quiz.completed')}: {selectedAnswers.size} / {assignment.quizQuestions?.length || 0}
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedAnswers.size === 0 || isUploadingEssayFile}
                    size="lg"
                    className='max-w-[105px] mx-auto'
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.17031 5.2668L13.2453 2.90846C16.4203 1.85013 18.1453 3.58346 17.0953 6.75846L14.737 13.8335C13.1536 18.5918 10.5536 18.5918 8.97031 13.8335L8.27031 11.7335L6.17031 11.0335C1.41198 9.45013 1.41198 6.85846 6.17031 5.2668Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.42188 11.3745L11.4052 8.38281" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    {isSubmitting ? t('quiz.submitting') : t('quiz.submit')}
                </Button>
            </div>

        </div>
    );
}
