"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

type QuizOption = {
  id: string;
  text: string;
  isCorrect?: boolean;
  explanation?: string;
};

type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  explanation?: string;
};

type QuizResult = {
  score: number;
  totalPoints: number;
  passed: boolean;
  answers: Array<{
    questionId: string;
    isCorrect: boolean;
    correctOptionId?: string;
    selectedOptionId?: string;
  }>;
  highestScore?: number;
};

type LessonQuizProps = {
  questions: QuizQuestion[];
  onSubmit: (answers: Array<{ questionId: string; selectedOption: string }>) => Promise<void>;
  submitted: boolean;
  result: QuizResult | null;
  onRetake?: () => void;
};

export function LessonQuiz({ questions, onSubmit, submitted, result, onRetake }: LessonQuizProps) {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const courseId = (params?.id as string) || '';

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    if (submitted) return; // Don't allow changes after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    const unansweredQuestions = questions.filter(q => !selectedAnswers[q.id]);
    if (unansweredQuestions.length > 0) {
      return; // Could show error toast here
    }

    setIsSubmitting(true);
    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));
      await onSubmit(answers);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allQuestionsAnswered = questions.length > 0 && questions.every(q => selectedAnswers[q.id]);

  const getQuestionResult = (questionId: string) => {
    if (!result?.answers) return null;
    return result.answers.find(a => a.questionId === questionId);
  };

  const scorePercentage = result ? Math.round((result.score / result.totalPoints) * 100) : 0;

  const getQuestionExplanation = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question?.explanation || '';
  };

  const getCorrectOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return null;
    return question.options.find(opt => opt.isCorrect);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Result Summary Card (shown after submission) - Mobile Design */}
      {submitted && result && (
        <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white">
          <div className="flex flex-col gap-2">
            <p className="text-sm sm:text-base font-medium opacity-90">
              Bạn đã hoàn thành
            </p>
            <p className="text-base sm:text-lg font-semibold">
              Điểm của bạn
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold">
                {result.score}/{result.totalPoints}
              </span>
            </div>
            {result.highestScore !== undefined && result.highestScore > 0 && (
              <p className="text-xs sm:text-sm opacity-90 mt-1">
                Điểm cao nhất: {result.highestScore}/{result.totalPoints}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Retake Button (shown after submission) */}
      {submitted && result && onRetake && (
        <Button
          onClick={onRetake}
          className="w-full bg-[#4162e7] hover:bg-[#3652d3] text-white py-2.5 sm:py-3 text-sm sm:text-base font-medium"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Làm lại bài tập
        </Button>
      )}

      {/* Questions */}
      {questions.map((q, idx) => {
        const questionResult = getQuestionResult(q.id);
        const userAnswer = selectedAnswers[q.id];

        return (
          <div
            key={q.id}
            className="rounded-xl border border-[#f4f4f7] bg-white p-5"
          >
            <div className="mb-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded bg-[#4162e7] px-2 py-0.5 text-sm font-medium text-white">
                  {t('quiz.question')} {idx + 1}
                </span>
                {submitted && questionResult && (
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
                    questionResult.isCorrect
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {questionResult.isCorrect ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        {t('quiz.correct')}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        {t('quiz.incorrect')}
                      </>
                    )}
                  </span>
                )}
              </div>
              <h3
                className="text-base font-medium leading-6 text-[#3b3d48]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {q.prompt}
              </h3>
            </div>

            <div className="space-y-3 pl-4">
              {q.options.map((opt) => {
                const isSelected = userAnswer === opt.id;
                const isCorrectAnswer = submitted && questionResult?.correctOptionId === opt.id;
                const isWrongSelection = submitted && isSelected && !questionResult?.isCorrect;

                let optionStyle = "border-[#dbdde5] bg-white hover:bg-[#eceffd]";
                let radioStyle = "border-[#dbdde5] bg-white";

                if (submitted) {
                  if (isCorrectAnswer) {
                    optionStyle = "border-[#b7e2c7] bg-[#e8f6ed]";
                    radioStyle = "border-transparent bg-[#16a34a]";
                  } else if (isWrongSelection) {
                    optionStyle = "border-[#f4bcbc] bg-[#fce9e9]";
                    radioStyle = "border-transparent bg-[#dc2626]";
                  }
                } else if (isSelected) {
                  optionStyle = "border-[#4162e7] bg-[#f0f3ff]";
                  radioStyle = "border-transparent bg-[#4162e7]";
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleOptionSelect(q.id, opt.id)}
                    className={`flex w-full items-start gap-3 rounded border px-3 py-2 text-left transition-colors ${optionStyle} ${
                      submitted ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <div className="mt-0.5">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${radioStyle}`}>
                        {(isSelected || isCorrectAnswer) && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>
                    </div>
                    <span
                      className="flex-1 text-sm leading-5 text-[#3b3d48]"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {opt.text}
                    </span>
                    {submitted && isCorrectAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                    {submitted && isWrongSelection && (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Submit Button - Mobile Design */}
      {!submitted ? (
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!allQuestionsAnswered || isSubmitting}
          className={`w-full bg-[#4162e7] hover:bg-[#3652d3] text-white py-2.5 sm:py-3 text-sm sm:text-base font-medium ${
            !allQuestionsAnswered || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Đang nộp bài...
            </>
          ) : (
            'Nộp bài'
          )}
        </Button>
      ) : null}

      {/* Continue Course Button (shown after submission) */}
      {submitted && result && (
        <Button
          onClick={() => router.push(`/${locale}/courses/${courseId}`)}
          className="w-full bg-[#4162e7] hover:bg-[#3652d3] text-white py-2.5 sm:py-3 text-sm sm:text-base font-medium"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Tiếp tục khóa học
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
        </Button>
      )}

      {/* Empty state */}
      {questions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('quiz.noQuestions')}</p>
        </div>
      )}
    </div>
  );
}
