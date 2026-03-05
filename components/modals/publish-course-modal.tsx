"use client";

import React, { useState } from "react";
import { Calendar, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import teacherCourseService from "@/services/apis/teacher-course.service";
import { useTranslations } from "next-intl";

interface PublishCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  courseTitle: string;
  isPublished?: boolean;
  onSuccess?: () => void;
}

type PublishMode = "now" | "schedule" | null;

export function PublishCourseModal({
  open,
  onOpenChange,
  courseId,
  courseTitle,
  isPublished = false,
  onSuccess,
}: PublishCourseModalProps) {
  const t = useTranslations("page.teacher.publishCourse");
  const [mode, setMode] = useState<PublishMode>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublishNow = async () => {
    try {
      setLoading(true);
      const response = await teacherCourseService.publishCourse(courseId);

      if (response.success) {
        toast.success(t("publishSuccess"), {
          description: t("publishSuccessDesc"),
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        throw new Error(response.message || t("publishError"));
      }
    } catch (error: any) {
      toast.error(t("publishError"), {
        description: error.message || t("tryAgainLater"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulePublish = async () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error(t("selectDateTimeError"));
      return;
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();

    if (scheduledDateTime <= now) {
      toast.error(t("futureTimeError"));
      return;
    }

    try {
      setLoading(true);
      const response = await teacherCourseService.schedulePublish(
        courseId,
        { scheduledAt: scheduledDateTime.toISOString() }
      );

      if (response.success) {
        toast.success(t("scheduleSuccess"), {
          description: `${t("scheduleSuccessDesc")} ${scheduledDateTime.toLocaleString()}`,
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        throw new Error(response.message || t("scheduleError"));
      }
    } catch (error: any) {
      toast.error(t("scheduleError"), {
        description: error.message || t("tryAgainLater"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm(t("confirmUnpublish"))) {
      return;
    }

    try {
      setLoading(true);
      const response = await teacherCourseService.unpublishCourse(courseId);

      if (response.success) {
        toast.success(t("unpublishSuccess"), {
          description: t("unpublishSuccessDesc"),
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        throw new Error(response.message || t("unpublishError"));
      }
    } catch (error: any) {
      toast.error(t("unpublishError"), {
        description: error.message || t("tryAgainLater"),
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMode(null);
    setScheduledDate("");
    setScheduledTime("");
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onOpenChange(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isPublished ? t("managePublishing") : mode === "schedule" ? t("schedulePublish") : t("publishCourse")}
          </DialogTitle>
          <DialogDescription>
            {isPublished
              ? t("managePublishingDesc")
              : mode === null
                ? t("choosePublishMethod")
                : mode === "schedule"
                  ? t("chooseDateTimeDesc")
                  : t("publishNowDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isPublished ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">{t("published")}</p>
                  <p className="text-sm text-green-700 mt-1">
                    {t("publishedDesc", { title: courseTitle })}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">{t("note")}:</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-700">
                      <li>{t("unpublishWarning1")}</li>
                      <li>{t("unpublishWarning2")}</li>
                      <li>{t("unpublishWarning3")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : mode === null ? (
            <div className="space-y-3">
              <Button
                onClick={() => setMode("now")}
                variant="default"
                className="w-full h-auto py-4 px-6 flex items-start gap-3"
                disabled={loading}
              >
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-base">{t("publishNow")}</p>
                  <p className="text-sm text-white/80 mt-1">
                    {t("publishNowButtonDesc")}
                  </p>
                </div>
              </Button>

              <Button
                onClick={() => setMode("schedule")}
                variant="outline"
                className="w-full h-auto py-4 px-6 flex items-start gap-3"
                disabled={loading}
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-base">{t("schedulePublishButton")}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t("schedulePublishButtonDesc")}
                  </p>
                </div>
              </Button>
            </div>
          ) : mode === "schedule" ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("publishDate")}
                  </label>
                  <input
                    type="date"
                    min={minDate}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("publishTime")}
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                {scheduledDate && scheduledTime && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      {t("willBePublishedAt")}{" "}
                      <strong>
                        {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isPublished ? (
            <>
              <Button
                onClick={handleUnpublish}
                variant="destructive"
                disabled={loading}
                className="flex-1"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("unpublish")}
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                disabled={loading}
                className="flex-1"
              >
                {t("close")}
              </Button>
            </>
          ) : mode === null ? (
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={loading}
              className="w-full"
            >
              {t("cancel")}
            </Button>
          ) : mode === "schedule" ? (
            <>
              <Button
                onClick={() => setMode(null)}
                variant="outline"
                disabled={loading}
                className="flex-1"
              >
                {t("back")}
              </Button>
              <Button
                onClick={handleSchedulePublish}
                disabled={loading || !scheduledDate || !scheduledTime}
                className="flex-1"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("schedulePublishButtonAction")}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleClose}
                variant="outline"
                disabled={loading}
                className="flex-1"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handlePublishNow}
                disabled={loading}
                className="flex-1"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("publishNow")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
