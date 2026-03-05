"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Module } from "@/hooks/use-create-course-content";

interface CreateContentSidebarProps {
  modules: Module[];
  currentModuleId: string | null;
  modulesWithUnsavedEdits: Set<string>;
  loadModuleData: (module: Module) => void;
  handleDeleteModule: (moduleId: string) => void;
  handleCreateNewModule: () => void;
  totalModules: number;
  totalQuizzes: number;
}

export function CreateContentSidebar({
  modules,
  currentModuleId,
  modulesWithUnsavedEdits,
  loadModuleData,
  handleDeleteModule,
  handleCreateNewModule,
  totalModules,
  totalQuizzes,
}: CreateContentSidebarProps) {
  const t = useTranslations("teacherCourseContent");
  if (modules.length === 0) return null;

  return (
    <div className="bg-white border border-[#f4f4f7] rounded-[12px] flex flex-col gap-[12px] px-[12px] py-[16px] w-full lg:w-[384px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="border-b border-[#e5e7eb] pb-[12px] flex flex-col gap-[4px] px-[12px]">
        <h3
          className="text-[18px] font-medium text-[#3b3d48] leading-[28px]"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
          }}
        >
          Nội dung khóa học
        </h3>
        <p
          className="text-sm font-medium text-[#7f859d] leading-[20px]"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
          }}
        >
          {totalModules} module • {totalQuizzes} bài tập
        </p>
      </div>

      {/* Modules List */}
      <div className="flex flex-col gap-[8px]">
        {modules.map((module) => {
          const isActive = currentModuleId === module.id;
          const moduleNumber = module.sortOrder + 1;
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
                      Module {moduleNumber}
                    </span>
                  </div>
                  <p
                    className="text-base font-normal text-[#3b3d48] leading-[24px] break-words"
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {module.title || t("noTitle")}
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
                    {module.documentCount || 0} tài liệu
                  </span>
                  <span className="text-xs leading-[16px]">•</span>
                  <span className="text-sm leading-[20px]">
                    {module.quizCount || 0} bài tập
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-[#e35151] hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteModule(module.id);
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
        className="h-[44px] w-full border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white flex items-center gap-[4px] rounded-[6px] px-[16px] py-[8px] transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span
          className="text-sm font-medium leading-[20px]"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
          }}
        >
          Thêm Module mới
        </span>
      </Button>
    </div>
  );
}
