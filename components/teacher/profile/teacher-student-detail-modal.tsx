"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Eye, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModuleProgress {
  id: string;
  moduleNumber: string;
  title: string;
  status: "completed" | "pending-grading" | "in-progress" | "not-started";
  assignments?: string;
  grade?: string;
}

interface StudentDetailModalProps {
  open: boolean;
  onClose: () => void;
  student: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    course: {
      title: string;
      duration: string;
      modules: number;
      assignments: number;
    };
    overallProgress: number;
    completedAssignments: number;
    totalAssignments: number;
    modules: ModuleProgress[];
  };
}

export function TeacherStudentDetailModal({ open, onClose, student }: StudentDetailModalProps) {
  const t = useTranslations("teacher.students.modal");

  useEffect(() => {
    if (open) {
      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      if (overlay) {
        (overlay as HTMLElement).style.backgroundColor = 'rgba(59, 61, 72, 0.8)';
      }
    }
  }, [open]);

  if (!student) {
    return null;
  }

  const getStatusBadge = (status: ModuleProgress["status"]) => {
    const statusMap: Record<ModuleProgress["status"], { text: string; color: string }> = {
      "completed": { text: t("completed"), color: "#149443" },
      "pending-grading": { text: t("pendingGrading"), color: "#FF9500" },
      "in-progress": { text: t("inProgress"), color: "#4162e7" },
      "not-started": { text: t("notStarted"), color: "#7f859d" },
    };
    const { text, color } = statusMap[status];
    return (
      <span
        className="text-[14px] leading-[20px]"
        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400, color }}
      >
        {text}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto p-0 bg-white rounded-[12px] [&>button]:hidden">
        <div className="p-[16px]">
          {/* Header */}
          <DialogHeader className="mb-0">
            <div className="flex items-center justify-between mb-[16px]">
              <DialogTitle
                className="text-[20px] font-medium leading-[28px] text-[#0f172a]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {t("title")}
              </DialogTitle>
              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center rounded-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="h-4 w-4 text-[#3b3d48]" />
              </button>
            </div>
          </DialogHeader>

          {/* Student Profile */}
          <div className="flex gap-[8px] items-start mb-[16px] p-[8px]">
            <div className="w-[68px] h-[68px] rounded-full overflow-hidden bg-[#ffefe7] shrink-0">
              <img
                src={student?.avatar || "/images/avatars/Ellipse 29.png"}
                alt={student?.name}
                width={68}
                height={68}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-[8px] mb-[4px]">
                <h3
                  className="text-[20px] font-medium leading-[30px] text-[#3b3d48]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  {student.name}
                </h3>
                <Badge className="bg-[#ffeee2] text-[#4c4642] border-0 px-[12px] py-[2px] rounded-[8px] text-[14px] leading-[20px]">
                  {t("studying")}
                </Badge>
              </div>
              <div className="flex items-center gap-[8px]">
                <span
                  className="text-[14px] leading-[20px] text-[#7f859d]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                >
                  {student.email}
                </span>
                {student.phone && (
                  <>
                    <span className="text-[14px] leading-[20px] text-[#7f859d]">•</span>
                    <span
                      className="text-[14px] leading-[20px] text-[#7f859d]"
                      style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                      {student.phone}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="flex gap-[8px] items-start mb-[16px] p-[8px]">
            <div className="w-[60px] h-[60px] rounded-[8px] bg-[#eceffd] flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6 text-[#4162e7]" />
            </div>
            <div className="flex-1">
              <h4
                className="text-[16px] font-medium leading-[20px] text-[#3b3d48] mb-[4px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {student.course.title}
              </h4>
              <div className="flex items-center gap-[8px] text-[12px] leading-[16px] text-[#7f859d]">
                <span>{student.course.duration}</span>
                <span>•</span>
                <span>{student.course.modules} {t("modules")}</span>
                <span>•</span>
                <span>{student.course.assignments} {t("assignments")}</span>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="flex gap-[12px] mb-[16px]">
            <div className="flex-1 bg-white border border-[#c4cef8] rounded-[8px] p-[16px]">
              <p
                className="text-[14px] leading-[20px] text-[#7f859d] mb-[4px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
              >
                {t("overallProgress")}
              </p>
              <p
                className="text-[24px] font-medium leading-[32px] text-[#3b3d48]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {student.overallProgress}%
              </p>
            </div>
            <div className="flex-1 bg-white border border-[#c4cef8] rounded-[8px] p-[16px]">
              <p
                className="text-[14px] leading-[20px] text-[#7f859d] mb-[4px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
              >
                {t("assignmentsLabel")}
              </p>
              <p
                className="text-[24px] font-medium leading-[32px] text-[#3b3d48]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {student.completedAssignments}/{student.totalAssignments}
              </p>
            </div>
          </div>

          {/* Learning Progress */}
          <div className="mb-[16px]">
            <h4
              className="text-[20px] font-medium leading-[28px] text-[#0f172a] mb-[12px]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
            >
              {t("learningProgress")}
            </h4>
            <div className="flex flex-col gap-[8px]">
              {student.modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white border border-[#f4f4f7] rounded-[8px] p-[12px]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-[8px] mb-[8px]">
                        <span
                          className="bg-[#eceffd] text-[#2e46a4] px-[8px] py-[2px] rounded-[8px] text-[14px] leading-[20px]"
                          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                        >
                          {module.moduleNumber}
                        </span>
                      </div>
                      <h5
                        className="text-[16px] font-medium leading-[24px] text-[#3b3d48] mb-[4px]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                      >
                        {module.title}
                      </h5>
                      <div className="flex items-center gap-[8px]">
                        {getStatusBadge(module.status)}
                        {module.assignments && (
                          <>
                            <span className="text-[14px] leading-[20px] text-[#7f859d]">•</span>
                            <span
                              className="text-[14px] leading-[20px] text-[#3b3d48]"
                              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                            >
                              {module.assignments}
                            </span>
                          </>
                        )}
                        {module.grade && (
                          <>
                            <span className="text-[14px] leading-[20px] text-[#7f859d]">•</span>
                            <span
                              className="text-[14px] leading-[20px] text-[#149443]"
                              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                            >
                              {module.grade}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="ml-[12px]">
                      {module.status === "completed" && (
                        <Button
                          className="bg-[#4162e7] hover:bg-[#4162e7]/90 h-[32px] px-[16px] py-[8px] rounded-[6px] cursor-pointer"
                        >
                          <div className="flex gap-[4px] items-center">
                            <Eye className="h-4 w-4 text-white" />
                            <span
                              className="text-[14px] font-medium leading-[20px] text-white"
                              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                            >
                              {t("view")}
                            </span>
                          </div>
                        </Button>
                      )}
                      {module.status === "pending-grading" && (
                        <Button
                          className="bg-[#4162e7] hover:bg-[#4162e7]/90 h-[32px] px-[16px] py-[8px] rounded-[6px] cursor-pointer"
                        >
                          <span
                            className="text-[14px] font-medium leading-[20px] text-white"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                          >
                            {t("grade")}
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-[8px] justify-center pt-[12px] border-t border-[#f4f4f7]">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-[44px] px-[16px] rounded-[6px] border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white transition-colors cursor-pointer"
            >
              <span
                className="text-[14px] font-medium leading-[20px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {t("close")}
              </span>
            </Button>
            <Button
              className="bg-[#4162e7] hover:bg-[#4162e7]/90 h-[44px] px-[16px] rounded-[6px] cursor-pointer"
            >
              <span
                className="text-[14px] font-medium leading-[20px] text-white"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {t("gradeLatest")}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
