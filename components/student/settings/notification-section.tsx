"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export function NotificationSettings() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h2
          className="text-lg font-medium text-[#1b2961]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.notifications")}
        </h2>
        <p className="mt-1 text-sm text-[#7f859d]">
          {t("page.student.settings.notificationsDesc")}
        </p>
      </header>

      {/* Example groups – email, in-app, marketing, system */}
      <NotificationRow
        title={t("page.student.settings.systemNotifications")}
        description={t("page.student.settings.systemNotificationsDesc")}
      />
      <NotificationRow
        title={t("page.student.settings.courseNotifications")}
        description={t("page.student.settings.courseNotificationsDesc")}
      />
      <NotificationRow
        title={t("page.student.settings.communityNotifications")}
        description={t("page.student.settings.communityNotificationsDesc")}
      />
      <NotificationRow
        title={t("page.student.settings.marketingEmail")}
        description={t("page.student.settings.marketingEmailDesc")}
      />
    </div>
  );
}

type NotificationRowProps = {
  title: string;
  description: string;
};

function NotificationRow({ title, description }: NotificationRowProps) {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-3 border-b border-[#f1f1f5] pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-[#1b2961]">{title}</p>
        <p className="text-xs text-[#7f859d]">{description}</p>
      </div>
      <div className="flex gap-3 text-xs text-[#3b3d48]">
        <label className="flex items-center gap-2">
          <Input type="checkbox" className="h-4 w-4" />
          {t("page.student.settings.email")}
        </label>
        <label className="flex items-center gap-2">
          <Input type="checkbox" className="h-4 w-4" />
          {t("page.student.settings.inApp")}
        </label>
      </div>
    </div>
  );
}

export function NotificationSettingsMobile() {
  const t = useTranslations();
  const [notifications, setNotifications] = useState({
    productLaunches: true,
    dealsPromotions: false,
    courseStats: false,
    courseRecommendations: false,
    instructorNotifications: false,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h2
          className="text-lg sm:text-xl font-bold text-[#3b3d48]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.notifications")}
        </h2>
        <p
          className="mt-1 text-sm text-[#8c92ac]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.notificationsDesc")}
        </p>
      </header>

      {/* Product updates and offers - reuse marketingEmail */}
      <div>
        <h3
          className="text-base sm:text-lg font-bold text-[#3b3d48] mb-4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.marketingEmail")}
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.productLaunches}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  productLaunches: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-[#dbdde5] text-[#4162e7] focus:ring-[#4162e7]"
            />
            <span
              className="text-sm sm:text-base text-[#3b3d48]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.settings.systemNotifications")}
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.dealsPromotions}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  dealsPromotions: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-[#dbdde5] text-[#4162e7] focus:ring-[#4162e7]"
            />
            <span
              className="text-sm sm:text-base text-[#3b3d48]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.settings.marketingEmailDesc")}
            </span>
          </label>
        </div>
      </div>

      {/* Your learning - reuse courseNotifications */}
      <div>
        <h3
          className="text-base sm:text-lg font-bold text-[#3b3d48] mb-4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.courseNotifications")}
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.courseStats}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  courseStats: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-[#dbdde5] text-[#4162e7] focus:ring-[#4162e7]"
            />
            <span
              className="text-sm sm:text-base text-[#3b3d48]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.settings.courseNotificationsDesc")}
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.courseRecommendations}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  courseRecommendations: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-[#dbdde5] text-[#4162e7] focus:ring-[#4162e7]"
            />
            <span
              className="text-sm sm:text-base text-[#3b3d48]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.settings.courseNotificationsDesc")}
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.instructorNotifications}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  instructorNotifications: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-[#dbdde5] text-[#4162e7] focus:ring-[#4162e7]"
            />
            <span
              className="text-sm sm:text-base text-[#3b3d48]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.settings.courseNotificationsDesc")}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
