"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { VideoUploadSection, type ModuleVideo } from "@/components/video/video-upload-section";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import teacherCourseService from "@/services/apis/teacher-course.service";

interface CreateContentModuleFormProps {
  moduleData: { title: string; description: string };
  setModuleData: (data: { title: string; description: string }) => void;
  courseId: string | number;
  currentModuleId: string | null;
  canUpload: boolean;
  moduleVideos: Record<string, ModuleVideo>;
  onCreateModule: () => void;
  fetchCourse: () => void;
  setCurrentModuleId: (id: string) => void;
}

export function CreateContentModuleForm({
  moduleData,
  setModuleData,
  courseId,
  currentModuleId,
  canUpload,
  moduleVideos,
  onCreateModule,
  fetchCourse,
  setCurrentModuleId,
}: CreateContentModuleFormProps) {
  const t = useTranslations("teacherCourseContent");
  return (
    <div className="w-full flex flex-col gap-[12px] items-start">
      {/* Section Title */}
      <div className="flex items-center justify-between w-full">
        <h2
          className="text-xl sm:text-2xl md:text-[24px] font-medium leading-[28px] sm:leading-[30px] md:leading-[32px] text-[#0f172a] w-full text-left"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
          }}
        >
          Thông tin module
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
            Tạo module
          </span>
        </Button>
      </div>

      {/* Module Title */}
      <div className="w-full flex flex-col gap-[4px] items-start">
        <Label
          className="text-sm font-normal text-[#7f859d] leading-[20px]"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 400,
          }}
        >
          Tên Module
        </Label>
        <Input
          placeholder={t("moduleNamePlaceholder")}
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
          Helper Message
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
          Mô tả module
        </Label>
        <div className="relative w-full">
          <Textarea
            placeholder={t("moduleDescPlaceholder")}
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

      {/* Video Upload Section */}
      <VideoUploadSection
        courseId={courseId.toString()}
        moduleId={currentModuleId || undefined}
        disabled={!canUpload}
        onVideoUploaded={(video) => {
          if (currentModuleId) {
            setModuleVideos((prev) => ({
              ...prev,
              [currentModuleId]: video,
            }));
          }
        }}
        existingVideo={
          currentModuleId ? moduleVideos[currentModuleId] : null
        }
        onModuleNeeded={async () => {
          if (!moduleData.title.trim()) {
            toast.error(t("moduleNameRequiredForVideo"));
            return null;
          }
          try {
            const response =
              await teacherCourseService.createModule(courseId.toString(), {
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
            toast.error(t("createModuleError"));
            return null;
          }
        }}
      />
    </div>
  );
}
