"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, X, Eye, Link as LinkIcon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QuizPreviewModal } from "./quiz-preview-modal";
import { Textarea } from "../ui/textarea";
import { useTranslations } from "next-intl";

interface QuizQuestion {
  id: string;
  prompt: string;
  points: number;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

interface QuizCreationModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (quizData: {
    title: string;
    instructions: string;
    timeLimitMinutes: number;
    passScore: number;
    questions: QuizQuestion[];
    essayPrompt: {
      rubric: string;
      minWords: number;
      maxWords: number;
    };
  }) => Promise<void>;
  moduleId?: string;
  moduleInfo?: {
    id: string;
    title: string;
    description?: string;
    sortOrder: number;
  } | null;
  editingQuiz?: {
    id: string;
    title: string;
    instructions?: string;
    timeLimitMinutes: number;
    passScore: number;
    questionCount: number;
    questions?: QuizQuestion[];
    essayPrompt?: {
      rubric: string;
      minWords?: number;
      maxWords?: number;
    };
  } | null;
}

/**
 * Quiz Creation Modal
 * Modal component for creating/editing quizzes without leaving the page
 */
export function QuizCreationModal({
  open,
  onClose,
  onCreate,
  moduleId,
  moduleInfo,
  editingQuiz,
}: QuizCreationModalProps) {
  const tQuiz = useTranslations("quiz");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showGradingPanel, setShowGradingPanel] = useState(false);

  // Initialize state with default values
  const [quizData, setQuizData] = useState({
    title: "Bài tập lý thuyết",
    instructions: "",
    timeLimitMinutes: 30,
    passScore: 15,
  });

  const [essayPrompt, setEssayPrompt] = useState({
    rubric: "",
    minWords: 100,
    maxWords: 500,
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "1",
      prompt: "",
      points: 1,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);

  // Sync state with editingQuiz when it changes
  useEffect(() => {
    if (editingQuiz) {
      setQuizData({
        title: editingQuiz.title || "Bài tập lý thuyết",
        instructions: editingQuiz.instructions || "",
        timeLimitMinutes: editingQuiz.timeLimitMinutes || 30,
        passScore: editingQuiz.passScore || 15,
      });

      setEssayPrompt({
        rubric: editingQuiz.essayPrompt?.rubric || "",
        minWords: editingQuiz.essayPrompt?.minWords || 100,
        maxWords: editingQuiz.essayPrompt?.maxWords || 500,
      });

      setQuestions(
        editingQuiz.questions && editingQuiz.questions.length > 0
          ? editingQuiz.questions
          : [
            {
              id: "1",
              prompt: "",
              points: 1,
              options: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
              ],
            },
          ]
      );
    }
  }, [editingQuiz]);

  const resetForm = () => {
    setQuizData({
      title: "Bài tập lý thuyết",
      instructions: "",
      timeLimitMinutes: 30,
      passScore: 15,
    });
    setEssayPrompt({
      rubric: "",
      minWords: 100,
      maxWords: 500,
    });
    setQuestions([
      {
        id: "1",
        prompt: "",
        points: 1,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
    setShowPreview(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      prompt: "",
      points: 1,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDuplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    const duplicated: QuizQuestion = {
      ...questionToDuplicate,
      id: Date.now().toString(),
    };
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, duplicated);
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.error(tQuiz("create.errors.minQuestion"));
      return;
    }
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = text;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === optionIndex,
    }));
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length <= 2) {
      toast.error(tQuiz("create.errors.minOptionsGlobal"));
      return;
    }
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(newQuestions);
  };

  const validateQuiz = () => {
    if (!quizData.title) {
      toast.error(tQuiz("create.errors.titleRequired"));
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.prompt) {
        toast.error(
          tQuiz("create.errors.questionRequired", { index: i + 1 })
        );
        return false;
      }
      if (q.options.length < 2) {
        toast.error(
          tQuiz("create.errors.minOptions", { index: i + 1 })
        );
        return false;
      }
      const hasCorrect = q.options.some((opt) => opt.isCorrect);
      if (!hasCorrect) {
        toast.error(
          tQuiz("create.errors.mustChooseCorrect", { index: i + 1 })
        );
        return false;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          toast.error(
            tQuiz("create.errors.optionEmpty", {
              index: i + 1,
              label: String.fromCharCode(65 + j),
            })
          );
          return false;
        }
      }
    }

    // Validate essay prompt
    if (!essayPrompt.rubric.trim()) {
      toast.error(tQuiz("create.errors.essayPromptRequired"));
      return false;
    }

    return true;
  };

  const handlePreview = () => {
    if (validateQuiz()) {
      setShowPreview(true);
    }
  };

  const handleSaveQuiz = async () => {
    if (!validateQuiz()) {
      return;
    }
    try {
      setLoading(true);
      await onCreate({
        title: quizData.title,
        instructions: quizData.instructions,
        timeLimitMinutes: quizData.timeLimitMinutes,
        passScore: quizData.passScore,
        questions: questions.map(q => ({
          id: q.id,
          prompt: q.prompt,
          points: q.points,
          options: q.options,
        })),
        essayPrompt: {
          rubric: essayPrompt.rubric,
          minWords: essayPrompt.minWords || 100,
          maxWords: essayPrompt.maxWords || 500,
        },
      });
      // Parent (create-content) đã hiển thị toast "Tạo bài tập thành công!"
      resetForm();
      onClose();
    } catch (error: unknown) {
      const fallbackMessage = tQuiz("create.genericError");
      const errorMessage =
        error instanceof Error ? error.message || fallbackMessage : fallbackMessage;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const totalQuestions = questions.length;
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-[1152px] max-h-[90vh] overflow-y-auto p-4 sm:p-5 bg-[#fafafa] border-0 shadow-none rounded-[16px] w-[95vw] sm:w-full">

          <DialogTitle className="sr-only">
            {editingQuiz ? tQuiz("create.pageTitleEdit") : tQuiz("create.pageTitle")}
          </DialogTitle>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[24px] font-medium leading-[32px] text-[#0f172a]">
              {editingQuiz ? tQuiz("create.pageTitleEdit") : tQuiz("create.pageTitle")}
            </h2>

          </div>

          <div className="flex flex-col lg:flex-row gap-5 items-start">

            <div className="flex-1 space-y-5 w-full">
              {/* Module Card */}
              {moduleInfo && (
                <div className="bg-white border border-[#f4f4f7] rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] p-4">
                  <div className="flex flex-col gap-1">
                    <Badge className="w-fit px-2 py-0.5 rounded-[3.562px] text-sm font-medium bg-[#4162e7] text-white mb-1">
                      Module {moduleInfo.sortOrder + 1}
                    </Badge>
                    <h3
                      className="text-[18px] font-medium text-[#3b3d48] leading-[28px] max-h-[60px] overflow-hidden"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                    >
                      {moduleInfo.title}
                    </h3>
                    {moduleInfo.description && (
                      <p
                        className="text-sm font-normal text-[#8c92ac] leading-[20px] line-clamp-3"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        {moduleInfo.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Section */}
              <div className="bg-white border border-[#f4f4f7] rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]">
                {/* Section Header */}
                <div className="bg-white border-b border-[#f4f4f7] rounded-tl-[12px] rounded-tr-[12px] h-[77px] flex items-center justify-between px-[25px] py-[25px]">
                  <h3 className="text-[18px] font-medium text-[#3b3d48] leading-[28px]">
                    {tQuiz("create.defaultTitle")}
                  </h3>
                  {/* Settings Gear Icon - Mobile Only */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowGradingPanel(!showGradingPanel)}
                    className="lg:hidden h-8 w-8 text-[#63687a] hover:text-[#3b3d48] hover:bg-[#eceffd] rounded transition-colors cursor-pointer"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>

                {/* Questions List */}
                <div className="bg-[#fafafa] border-t-0 border border-[#f4f4f7] rounded-bl-[12px] rounded-br-[12px] p-[12px]">
                  <div className="flex flex-col gap-[8px] px-0 py-3">
                    {questions.map((question, qIndex) => (
                      <div
                        key={question.id}
                        className="bg-white border-[0.5px] border-[#f4f4f7] rounded-[12px] px-[12px] py-4 flex gap-3"
                      >
                        {/* Drag Handle */}
                        <div className="flex items-center justify-center shrink-0 cursor-pointer">
                          <GripVertical className="h-6 w-6 text-[#63687a]" />
                        </div>

                        {/* Question Content */}
                        <div className="flex-1 flex flex-col gap-[12px]">
                          {/* Question Badge and Input */}
                          <div className="flex flex-col gap-[12px]">
                            <div className="flex items-center justify-between">
                              <Badge
                                className="w-fit px-2 py-0.5 rounded-[4px] text-sm font-medium bg-[#4162e7] text-white"
                                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                              >
                                Câu {qIndex + 1}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {/* <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDuplicateQuestion(qIndex)}
                                  className="h-7 w-7 text-[#63687a] hover:text-[#3b3d48] hover:bg-[#eceffd] rounded transition-colors"
                                  title="Nhân bản câu hỏi"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button> */}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteQuestion(qIndex)}
                                  className="h-7 w-7 text-[#e35151] hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Xóa câu hỏi"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Input
                              placeholder={tQuiz("questionPrompt")}
                              value={question.prompt}
                              onChange={(e) =>
                                handleQuestionChange(qIndex, "prompt", e.target.value)
                              }
                              className="h-10 bg-[#fafafa] border border-[#f4f4f7] rounded-[8px] text-sm px-3 py-1"
                              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                            />
                          </div>

                          {/* Options */}
                          <div className="flex flex-col gap-2">
                            {question.options.map((option, oIndex) => {
                              const isCorrect = option.isCorrect;
                              return (
                                <div
                                  key={oIndex}
                                  className="flex gap-2 items-center"
                                >
                                  <div className="flex items-center justify-center shrink-0 cursor-pointer">
                                    <GripVertical className="h-6 w-6 text-[#63687a]" />
                                  </div>
                                  <div className="flex items-center justify-center flex-shrink-0">
                                    <div
                                      className={cn(
                                        "w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer",
                                        isCorrect
                                          ? "bg-[#16a34a] border-[#16a34a]"
                                          : "border-[#dbdde5] bg-white"
                                      )}
                                      onClick={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                    >
                                      {isCorrect && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                      )}
                                    </div>
                                  </div>
                                  <Input
                                    placeholder={tQuiz("answerOption", { number: oIndex + 1 })}
                                    value={option.text}
                                    onChange={(e) =>
                                      handleOptionChange(qIndex, oIndex, e.target.value)
                                    }
                                    className={cn(
                                      "h-10 flex-1 rounded-[8px] text-sm px-3 py-1",
                                      isCorrect
                                        ? "bg-[#e8f6ed] border border-[#b7e2c7] text-[#3b3d48]"
                                        : "bg-[#fafafa] border border-[#f4f4f7]"
                                    )}
                                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-[#e35151] hover:text-red-600 hover:bg-red-50 shrink-0 cursor-pointer"
                                    onClick={() => handleRemoveOption(qIndex, oIndex)}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </div>
                              );
                            })}

                            {/* Add Option Button */}
                            <div className="bg-white rounded-[4px] pl-2 pr-3 py-2">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleAddOption(qIndex)}
                                className="w-full justify-start pl-7 text-[#4162e7] hover:bg-transparent hover:text-[#3554d4] h-auto py-1 cursor-pointer"
                              >
                                <Plus className="h-5 w-5 mr-1" />
                                <span
                                  className="text-sm font-medium"
                                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                                >
                                  {tQuiz("create.addAnswer")}
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-[8px] sm:gap-[4px] items-stretch sm:items-center sm:justify-end w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] flex items-center justify-center gap-[4px] w-full sm:w-auto transition-colors cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.9842 10.0009C12.9842 11.6509 11.6509 12.9842 10.0009 12.9842C8.35091 12.9842 7.01758 11.6509 7.01758 10.0009C7.01758 8.35091 8.35091 7.01758 10.0009 7.01758C11.6509 7.01758 12.9842 8.35091 12.9842 10.0009Z" stroke="#4162E7" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.99987 16.8913C12.9415 16.8913 15.6832 15.1579 17.5915 12.1579C18.3415 10.9829 18.3415 9.00794 17.5915 7.83294C15.6832 4.83294 12.9415 3.09961 9.99987 3.09961C7.0582 3.09961 4.31654 4.83294 2.4082 7.83294C1.6582 9.00794 1.6582 10.9829 2.4082 12.1579C4.31654 15.1579 7.0582 16.8913 9.99987 16.8913Z" stroke="#4162E7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  <span
                    className="text-sm font-medium leading-[20px]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    {tQuiz("create.preview")}
                  </span>
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveQuiz}
                  disabled={loading}
                  className="h-[44px] px-[16px] py-[8px] bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] rounded-[6px] flex items-center justify-center gap-[4px] w-full sm:w-auto cursor-pointer disabled:cursor-not-allowed"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.8864 17.1123C4.10679 18.3327 6.07098 18.3327 9.99935 18.3327C13.9277 18.3327 15.8919 18.3327 17.1123 17.1123C18.3327 15.8919 18.3327 13.9277 18.3327 9.99935C18.3327 9.7148 18.3327 9.57252 18.3201 9.42785C18.2612 8.75342 17.9877 8.09316 17.5524 7.57463C17.4591 7.4634 17.356 7.36032 17.1498 7.15416L12.8445 2.84888C12.6384 2.64273 12.5353 2.53964 12.4241 2.44628C11.9055 2.01101 11.2453 1.73752 10.5708 1.67864C10.4262 1.66602 10.2839 1.66602 9.99935 1.66602C6.07098 1.66602 4.10679 1.66602 2.8864 2.8864C1.66602 4.10679 1.66602 6.07098 1.66602 9.99935C1.66602 13.9277 1.66602 15.8919 2.8864 17.1123Z" stroke="white" />
                    <path d="M14.1673 18.3327V17.4993C14.1673 15.928 14.1673 15.1423 13.6792 14.6542C13.191 14.166 12.4053 14.166 10.834 14.166H9.16732C7.59597 14.166 6.8103 14.166 6.32214 14.6542C5.83398 15.1423 5.83398 15.928 5.83398 17.4993V18.3327" stroke="white" />
                    <path d="M5.83398 6.66602H10.834" stroke="white" strokeLinecap="round" />
                  </svg>

                  <span
                    className="text-sm font-medium leading-[20px]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    {loading
                      ? tQuiz("create.saving")
                      : editingQuiz
                        ? tQuiz("create.update")
                        : tQuiz("create.save")}
                  </span>
                </Button>
              </div>
            </div>


            {showGradingPanel && (
              <div className="w-full lg:hidden mb-4">
                <Card className="bg-white border border-[#f4f4f7] rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]">
                  <CardContent className="px-3 py-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-[18px] font-medium text-[#3b3d48] leading-[28px]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      >
                        {tQuiz("create.gradingTitle")}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowGradingPanel(false)}
                        className="h-8 w-8 text-[#8c92ac] hover:text-[#3b3d48] cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1 p-3">
                      <p
                        className="text-sm sm:text-base font-normal text-[#4d505f] leading-[20px] sm:leading-[24px] mb-4"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        {tQuiz("create.gradingDesc1")}
                      </p>
                      <p
                        className="text-sm sm:text-base font-normal text-[#4d505f] leading-[20px] sm:leading-[24px] mb-4"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        {tQuiz("create.gradingDesc2")}
                      </p>

                      {/* Pass Score Input */}
                      <div className="flex flex-col gap-1">
                        <Label
                          className="text-sm sm:text-base font-normal text-[#7f859d] leading-[20px] sm:leading-[24px]"
                          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                        >
                          {tQuiz("create.passScoreLabel")}
                        </Label>
                        <div className="bg-[#fafafa] h-10 flex items-center justify-between px-3 py-1 rounded-[8px] gap-2">
                          <Input
                            type="number"
                            value={quizData.passScore}
                            onChange={(e) =>
                              setQuizData({
                                ...quizData,
                                passScore: parseInt(e.target.value) || 0,
                              })
                            }
                            className="h-auto p-0 border-0 bg-transparent text-lg sm:text-[20px] font-medium text-[#3b3d48] focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                            min="1"
                            max={totalQuestions}
                          />
                          <span
                            className="text-sm sm:text-base font-normal text-[#7f859d] leading-[20px] sm:leading-[24px] text-right"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                          >
                            {tQuiz("create.passScoreSuffix", { total: totalQuestions })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Add Question Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddQuestion}
                      className="w-full h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] flex items-center gap-[4px] transition-colors cursor-pointer"
                    >
                      <Plus className="h-5 w-5" />
                      <span
                        className="text-sm font-medium leading-[20px]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      >
                        {tQuiz("create.addQuestion")}
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="hidden lg:block w-[384px] flex-shrink-0">
              <Card className="bg-white border border-[#f4f4f7] rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]">
                <CardContent className="px-3 py-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-1 p-3">
                    <h3
                      className="text-[18px] font-medium text-[#3b3d48] leading-[28px] mb-4"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                    >
                      {tQuiz("create.gradingTitle")}
                    </h3>
                    <p
                      className="text-base font-normal text-[#4d505f] leading-[24px] mb-4"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                      {tQuiz("create.gradingDesc1")}
                    </p>
                    <p
                      className="text-base font-normal text-[#4d505f] leading-[24px] mb-4"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                      {tQuiz("create.gradingDesc2")}
                    </p>

                    {/* Pass Score Input */}
                    <div className="flex flex-col gap-1">
                      <Label
                        className="text-base font-normal text-[#7f859d] leading-[24px]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        {tQuiz("create.passScoreLabel")}
                      </Label>
                      <div className="bg-[#fafafa] h-10 flex items-center justify-between px-3 py-1 rounded-[8px] gap-2">
                        <Input
                          type="number"
                          value={quizData.passScore}
                          onChange={(e) =>
                            setQuizData({
                              ...quizData,
                              passScore: parseInt(e.target.value) || 0,
                            })
                          }
                          className="h-auto p-0 border-0 bg-transparent text-[20px] font-medium text-[#3b3d48] focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                          min="1"
                          max={totalQuestions}
                        />
                        <span
                          className="text-base font-normal text-[#7f859d] leading-[24px] text-right"
                          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                        >
                          {tQuiz("create.passScoreSuffix", { total: totalQuestions })}
                        </span>
                      </div>
                    </div>

                    {/* Essay Prompt Section */}
                    <div className="border-t border-[#f4f4f7] pt-4 mt-4">
                      <h4
                        className="text-base font-medium text-[#3b3d48] leading-[24px] mb-3"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      >
                        Câu hỏi tự luận
                      </h4>
                      <p
                        className="text-sm font-normal text-[#7f859d] leading-[20px] mb-3"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        Mỗi bài tập sẽ có thêm 1 câu hỏi tự luận cuối cùng để học viên thể hiện hiểu biết sâu hơn.
                      </p>

                      {/* Rubric */}
                      <div className="flex flex-col gap-1 mb-3">
                        <Label
                          className="text-sm font-normal text-[#7f859d] leading-[20px]"
                          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                        >
                          Nội dung câu hỏi tự luận? <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          placeholder="Nhập nội dung câu hỏi tự luận (bắt buộc)..."
                          value={essayPrompt.rubric}
                          onChange={(e) =>
                            setEssayPrompt({
                              ...essayPrompt,
                              rubric: e.target.value,
                            })
                          }
                          className="h-[80px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-[#3b3d48] text-sm resize-none px-3 py-2"
                          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                        />
                      </div>


                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <Label
                            className="text-sm font-normal text-[#7f859d] leading-[20px]"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                          >
                            Số từ tối thiểu
                          </Label>
                          <Input
                            type="number"
                            value={essayPrompt.minWords}
                            onChange={(e) =>
                              setEssayPrompt({
                                ...essayPrompt,
                                minWords: Math.max(50, Math.min(10000, parseInt(e.target.value) || 50)),
                              })
                            }
                            className="h-10 rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-[#3b3d48] text-sm px-3"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                            min="50"
                            max="10000"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label
                            className="text-sm font-normal text-[#7f859d] leading-[20px]"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                          >
                            Số từ tối đa
                          </Label>
                          <Input
                            type="number"
                            value={essayPrompt.maxWords}
                            onChange={(e) =>
                              setEssayPrompt({
                                ...essayPrompt,
                                maxWords: Math.max(50, Math.min(10000, parseInt(e.target.value) || 500)),
                              })
                            }
                            className="h-10 rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-[#3b3d48] text-sm px-3"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                            min="50"
                            max="10000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>


                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddQuestion}
                    className="w-full h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] flex items-center gap-[4px] transition-colors cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                    <span
                      className="text-sm font-medium leading-[20px]"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                    >
                      {tQuiz("create.addQuestion")}
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QuizPreviewModal
        open={showPreview}
        onClose={handleClosePreview}
        quizTitle={quizData.title}
        questions={questions}
        essayPrompt={essayPrompt}
      />
    </>
  );
}
