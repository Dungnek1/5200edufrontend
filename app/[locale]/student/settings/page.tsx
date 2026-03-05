"use client";

import { useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { MobileMenu } from "@/components/mobile-menu";
import { Card } from "@/components/ui/card";
import {
  User,
  ShieldCheck,
  Bell,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import {
  ProfileSettings,
  SecuritySettings,
  NotificationSettings,
  SupportSettings,
  ProfileSettingsMobile,
  SecuritySettingsMobile,
  NotificationSettingsMobile,
  SupportSettingsMobile,
} from "@/components/student/settings";
import { AlertCircle } from "@/components/student/settings/security-section";

type TabKey = "profile" | "security" | "notifications" | "support";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const t = useTranslations();

  const forceChange = searchParams.get("forceChange") === "true";
  const tabParam = searchParams.get("tab") as TabKey | null;

  const [activeTab, setActiveTab] = useState<TabKey>(
    forceChange ? "security" : tabParam || "profile",
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <main className="bg-[#FAFAFA] overflow-x-hidden">
        {/* Mobile Layout */}
        <div className="lg:hidden pb-8">
          {/* Mobile Menu */}
          <MobileMenu
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            isAuthenticated={true}
            navLinks={[]}
          />

          <div className="px-4 sm:px-6 space-y-4 sm:space-y-6 pt-4 sm:pt-6">
            {/* Navigation Tabs - Mobile */}
            <div className="bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.05)] p-2">
              {/* Title "Tài khoản" */}
              <h2
                className="px-3 py-2 text-base sm:text-lg font-bold text-[#3b3d48] mb-2"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("page.student.settings.title")}
              </h2>
              <nav className="space-y-1">
                <SettingsTabButton
                  key={`tab-profile-${locale}`}
                  label={t("page.student.settings.personalProfile")}
                  icon={User}
                  active={activeTab === "profile"}
                  onClick={() => {
                    if (!forceChange) {
                      setActiveTab("profile");
                      router.push(`/${locale}/student/settings?tab=profile`);
                    }
                  }}
                  disabled={forceChange}
                />
                <SettingsTabButton
                  key={`tab-security-${locale}`}
                  label={t("page.student.settings.accountSecurity")}
                  icon={ShieldCheck}
                  active={activeTab === "security"}
                  onClick={() => {
                    setActiveTab("security");
                    router.push(
                      `/${locale}/student/settings?tab=security${forceChange ? "&forceChange=true" : ""
                      }`,
                    );
                  }}
                />
                <SettingsTabButton
                  key={`tab-notifications-${locale}`}
                  label={t("page.student.settings.notifications")}
                  icon={Bell}
                  active={activeTab === "notifications"}
                  onClick={() => {
                    if (!forceChange) {
                      setActiveTab("notifications");
                      router.push(
                        `/${locale}/student/settings?tab=notifications`,
                      );
                    }
                  }}
                  disabled={forceChange}
                />
                <SettingsTabButton
                  key={`tab-support-${locale}`}
                  label={t("page.student.settings.supportCenter")}
                  icon={HelpCircle}
                  active={activeTab === "support"}
                  onClick={() => {
                    if (!forceChange) {
                      setActiveTab("support");
                      router.push(`/${locale}/student/settings?tab=support`);
                    }
                  }}
                  disabled={forceChange}
                />
              </nav>
            </div>

            {/* Mobile Content */}
            <div className="bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.05)] p-4 sm:p-6">
              {/* Force change password warning */}
              {forceChange && activeTab === "security" && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#ff9800] bg-[#fff3e0] p-4">
                  <AlertCircle className="h-5 w-5 text-[#ff9800] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#e65100]">
                      {t("page.student.settings.forceChangePassword")}
                    </p>
                    <p className="mt-1 text-xs text-[#f57c00]">
                      {t("page.student.settings.forceChangePasswordDesc")}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <ProfileSettingsMobile key={`profile-mobile-${locale}`} />
              )}
              {activeTab === "security" && (
                <SecuritySettingsMobile
                  key={`security-mobile-${locale}`}
                  forceChange={forceChange}
                />
              )}
              {activeTab === "notifications" && (
                <NotificationSettingsMobile
                  key={`notifications-mobile-${locale}`}
                />
              )}
              {activeTab === "support" && (
                <SupportSettingsMobile key={`support-mobile-${locale}`} />
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <section className="hidden lg:block pb-8 lg:pb-12 pt-4 sm:pt-6 md:pt-8">
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <h1
              className="mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl font-medium text-[#1b2961]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.settings.title")}
            </h1>

            {/* Container card giống Figma: sidebar + nội dung bên trong cùng 1 block trắng */}
            <Card className="rounded-xl lg:rounded-2xl border-none bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col md:flex-row">
                {/* Left sidebar tabs */}
                <aside className="w-full border-b border-[#f1f1f5] md:w-56 lg:w-64 md:border-b-0 md:border-r">
                  <nav className="space-y-1 py-4">
                    <SettingsTabButton
                      key={`tab-profile-${locale}`}
                      label={t("page.student.settings.personalProfile")}
                      icon={User}
                      active={activeTab === "profile"}
                      onClick={() => {
                        if (!forceChange) {
                          setActiveTab("profile");
                          router.push(
                            `/${locale}/student/settings?tab=profile`,
                          );
                        }
                      }}
                      disabled={forceChange}
                    />
                    <SettingsTabButton
                      key={`tab-security-${locale}`}
                      label={t("page.student.settings.accountSecurity")}
                      icon={ShieldCheck}
                      active={activeTab === "security"}
                      onClick={() => {
                        setActiveTab("security");
                        router.push(
                          `/${locale}/student/settings?tab=security${forceChange ? "&forceChange=true" : ""
                          }`,
                        );
                      }}
                    />
                    <SettingsTabButton
                      key={`tab-notifications-${locale}`}
                      label={t("page.student.settings.notifications")}
                      icon={Bell}
                      active={activeTab === "notifications"}
                      onClick={() => {
                        if (!forceChange) {
                          setActiveTab("notifications");
                          router.push(
                            `/${locale}/student/settings?tab=notifications`,
                          );
                        }
                      }}
                      disabled={forceChange}
                    />
                    <SettingsTabButton
                      key={`tab-support-${locale}`}
                      label={t("page.student.settings.supportCenter")}
                      icon={HelpCircle}
                      active={activeTab === "support"}
                      onClick={() => {
                        if (!forceChange) {
                          setActiveTab("support");
                          router.push(
                            `/${locale}/student/settings?tab=support`,
                          );
                        }
                      }}
                      disabled={forceChange}
                    />
                  </nav>
                </aside>

                {/* Right content panel */}
                <section className="flex-1 px-4 py-4 sm:py-6 md:px-8 md:py-8">
                  {/* Force change password warning */}
                  {forceChange && activeTab === "security" && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#ff9800] bg-[#fff3e0] p-4">
                      <AlertCircle className="h-5 w-5 text-[#ff9800] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#e65100]">
                          {t("page.student.settings.forceChangePassword")}
                        </p>
                        <p className="mt-1 text-xs text-[#f57c00]">
                          {t("page.student.settings.forceChangePasswordDesc")}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "profile" && (
                    <ProfileSettings key={`profile-${locale}`} />
                  )}
                  {activeTab === "security" && (
                    <SecuritySettings
                      key={`security-${locale}`}
                      forceChange={forceChange}
                    />
                  )}
                  {activeTab === "notifications" && (
                    <NotificationSettings key={`notifications-${locale}`} />
                  )}
                  {activeTab === "support" && (
                    <SupportSettings key={`support-${locale}`} />
                  )}
                </section>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}

type SettingsTabButtonProps = {
  label: string;
  active: boolean;
  icon: React.ElementType;
  onClick: () => void;
  disabled?: boolean;
};

function SettingsTabButton({
  label,
  active,
  icon: Icon,
  onClick,
  disabled = false,
}: SettingsTabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`mx-2 sm:mx-3 flex w-[calc(100%-16px)] sm:w-[calc(100%-24px)] items-center gap-2 sm:gap-3 rounded-md px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm transition-colors cursor-pointer ${active
          ? "bg-[#e4ebff] font-medium text-[#4162e7]"
          : disabled
            ? "bg-transparent text-[#bdbdbd] cursor-not-allowed"
            : "bg-transparent text-[#3b3d48] hover:bg-[#eceffd]"
        }`}
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <Icon
        className={`ml-1 sm:ml-2 md:ml-3 h-4 w-4 sm:h-5 sm:w-5 ${active
            ? "text-[#4162e7]"
            : disabled
              ? "text-[#bdbdbd]"
              : "text-[#7f859d]"
          }`}
      />
      <span>{label}</span>
    </button>
  );
}
