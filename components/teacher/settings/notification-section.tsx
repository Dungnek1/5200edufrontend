"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { notificationSettingsService } from "@/services/apis";
import type { NotificationSettings as NotificationSettingsType } from "@/services/apis/notification-settings.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function NotificationSettings() {
  const [notifications, setNotifications] = useState<NotificationSettingsType>({
    studentSubmission: { email: true, inApp: true },
    pendingGrading: { email: true, inApp: true },
    courseCompletion: { email: true, inApp: true },
  });
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const t = useTranslations("teacher.settings.notifications");

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const response = await notificationSettingsService.get();
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error: any) {
      const status = error?.response?.status ?? error?.status;

      // Nếu backend chưa hỗ trợ endpoint (404) thì giữ nguyên default state,
      // không hiển thị toast lỗi để tránh làm người dùng tưởng đang thao tác sai.
      if (status === 404) {
        return;
      }

      toast.error(t("loadError"));
    }
  };

  const toggleNotification = async (category: keyof NotificationSettingsType, type: 'email' | 'inApp') => {
    const key = `${category}-${type}`;
    if (loadingKey === key) return;

    const prev = { ...notifications };
    const newValue = !notifications[category]?.[type];
    const updated = {
      ...notifications,
      [category]: {
        ...notifications[category],
        [type]: newValue,
      },
    };

    setNotifications(updated);

    try {
      setLoadingKey(key);
      await notificationSettingsService.update(updated);
    } catch (error: any) {
      toast.error(t("updateError"));
      setNotifications(prev);
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="space-y-[20px] px-[12px] py-[20px]">
      <header className="mb-0">
        <h2 className="text-[24px] font-medium leading-[32px] text-[#0f172a]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
          {t("title")}
        </h2>
        <p className="mt-[4px] text-[16px] leading-[24px] text-[#8c92ac]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
          {t("subtitle")}
        </p>
      </header>

      {/* Nộp bài của sinh viên */}
      <div className="border-b border-[#dbdde5] pb-[12px] pt-0 space-y-[16px]">
        <div className="space-y-0.5">
          <p className="text-base font-medium text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif" }}>
            {t("studentSubmissionTitle")}
          </p>
          <p className="text-sm text-[#63687a]" style={{ fontFamily: "Roboto, sans-serif" }}>
            {t("studentSubmissionDesc")}
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between px-3">
            <p className="text-sm text-[#4a5565] w-[71px]" style={{ fontFamily: "Roboto, sans-serif" }}>
              {t("channelEmail")}
            </p>
            <Switch
              checked={notifications.studentSubmission?.email || false}
              onCheckedChange={() => toggleNotification('studentSubmission', 'email')}
              disabled={loadingKey !== null}
            />
          </div>
          <div className="flex items-center justify-between px-3">
            <p className="text-sm text-[#4a5565]" style={{ fontFamily: "Roboto, sans-serif" }}>
              {t("channelInApp")}
            </p>
            <Switch
              checked={notifications.studentSubmission?.inApp || false}
              onCheckedChange={() => toggleNotification('studentSubmission', 'inApp')}
              disabled={loadingKey !== null}
            />
          </div>
        </div>
      </div>

      {/* Bài tập chờ chấm điểm */}
      <div className="border-b border-[#dbdde5] pb-[12px] pt-0 space-y-[16px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[16px] font-medium leading-[24px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
            {t("pendingGradingTitle")}
          </p>
          <p className="text-[14px] leading-[20px] text-[#63687a]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
            {t("pendingGradingDesc")}
          </p>
        </div>
        <div className="space-y-[12px]">
          <div className="flex items-center justify-between">
            <p className="text-[14px] leading-[20px] text-[#4a5565]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
              {t("channelEmail")}
            </p>
            <Switch
              checked={notifications.pendingGrading?.email || false}
              onCheckedChange={() => toggleNotification('pendingGrading', 'email')}
              disabled={loadingKey !== null}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[14px] leading-[20px] text-[#4a5565]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
              {t("channelInApp")}
            </p>
            <Switch
              checked={notifications.pendingGrading?.inApp || false}
              onCheckedChange={() => toggleNotification('pendingGrading', 'inApp')}
              disabled={loadingKey !== null}
            />
          </div>
        </div>
      </div>

      {/* Thông báo hoàn thành khóa học */}
      <div className="pb-[12px] pt-0 space-y-[16px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[16px] font-medium leading-[24px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
            {t("courseCompletionTitle")}
          </p>
          <p className="text-[14px] leading-[20px] text-[#63687a]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
            {t("courseCompletionDesc")}
          </p>
        </div>
        <div className="space-y-[12px]">
          <div className="flex items-center justify-between">
            <p className="text-[14px] leading-[20px] text-[#4a5565]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
              {t("channelEmail")}
            </p>
            <Switch
              checked={notifications.courseCompletion?.email || false}
              onCheckedChange={() => toggleNotification('courseCompletion', 'email')}
              disabled={loadingKey !== null}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[14px] leading-[20px] text-[#4a5565]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
              {t("channelInApp")}
            </p>
            <Switch
              checked={notifications.courseCompletion?.inApp || false}
              onCheckedChange={() => toggleNotification('courseCompletion', 'inApp')}
              disabled={loadingKey !== null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
