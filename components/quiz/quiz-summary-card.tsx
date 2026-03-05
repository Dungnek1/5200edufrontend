"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface Quiz {
  id: string;
  title: string;
  questionCount: number;
  timeLimitMinutes: number;
  passScore: number;
}

interface QuizSummaryCardProps {
  quizzes: Quiz[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: string, quizTitle: string) => void;
  onCreate: () => void;
  canCreateMore?: boolean;
}

/**
 * Quiz Summary Card
 * Displays quiz summary in module view
 * Shows quiz count, titles, and edit/delete actions
 */
export function QuizSummaryCard({
  quizzes,
  onEdit,
  onDelete,
  onCreate,
  canCreateMore = true,
}: QuizSummaryCardProps) {
  const t = useTranslations("teacherCourseContent.quizSummary");
  const handleDelete = (quizId: string, quizTitle: string) => {
    if (confirm(t("confirmDelete", { title: quizTitle }))) {
      onDelete(quizId, quizTitle);
    }
  };

  return (
    <div className="w-full flex flex-col items-start rounded-[12px]">

      <div className="bg-white border border-[#f4f4f7] rounded-[12px] flex h-[77px] items-center justify-between px-[25px] py-[25px] w-full">
        <h3
          className="text-[20px] font-bold text-[#3b3d48] leading-[28px] not-italic"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
        >
          {t("title")}
        </h3>
        {canCreateMore && (
          <Button
            onClick={onCreate}
            className="h-[44px] px-[16px] py-[8px] bg-[#4162e7] text-[#fafafa] hover:bg-[#3554d4] rounded-[6px] flex-shrink-0 cursor-pointer"
          >
            <span
              className="text-sm font-medium leading-[20px]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
            >
              {t("create")}
            </span>
          </Button>
        )}
      </div>


      {quizzes.length > 0 && (
        <div className="bg-white border border-[#f4f4f7] border-t-0 rounded-bl-[12px] rounded-br-[12px] w-full p-[12px]">
          <div className="flex flex-col gap-2">
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="bg-[#fafafa] border border-[#f4f4f7] rounded-[8px] p-3"
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex-1">
                      <h4 className="text-base font-medium text-[#3b3d48] leading-[24px] mb-1">
                        {quiz.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#7f859d]">
                        <span>{t("questions", { count: quiz.questionCount })}</span>
                        <span>•</span>
                        <span>{t("timeLimit", { count: quiz.timeLimitMinutes })}</span>
                        <span>•</span>
                        <span>{t("passScore", { pass: quiz.passScore, total: quiz.questionCount })}</span>
                      </div>
                    </div>


                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(quiz)}
                        className="h-8 w-8 text-[#4162e7] hover:bg-[#eceffd] cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(quiz.id, quiz.title)}
                        className="h-8 w-8 text-[#e35151] hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add More Button */}
            {canCreateMore && (
              <Button
                variant="outline"
                onClick={onCreate}
                className="w-full border border-dashed border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[8px] transition-colors cursor-pointer"
              >
                <FileText className="h-4 w-4 mr-2" />
                {t("addMore")}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
