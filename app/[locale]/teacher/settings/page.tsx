"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { User, ShieldCheck, Bell, CreditCard, AlertCircle } from "lucide-react";
import { ProfileSettings, ProfilePreview, SecuritySettings, NotificationSettings, PaymentSettings } from "@/components/teacher/settings";
import { useTranslations } from "next-intl";

type TabKey = "profile" | "security" | "notifications" | "payment";
type ProfileViewMode = "preview" | "edit";

export default function InstructorSettingsPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const tSettings = useTranslations("teacher.settings");

  const forceChange = searchParams.get("forceChange") === "true";
  const tabParam = searchParams.get("tab") as TabKey | null;

  const [activeTab, setActiveTab] = useState<TabKey>(
    forceChange ? "security" : (tabParam || "profile")
  );
  const [profileViewMode, setProfileViewMode] = useState<ProfileViewMode>("preview");
  const prevTabRef = useRef<TabKey>(forceChange ? "security" : (tabParam || "profile"));

  useEffect(() => {
    if (forceChange) {
      setActiveTab("security");
    } else if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [forceChange, tabParam]);

  // Khi quay lại tab "Hồ sơ cá nhân" từ tab khác → luôn mặc định hiện preview
  useEffect(() => {
    if (activeTab === "profile" && prevTabRef.current !== "profile") {
      setProfileViewMode("preview");
    }
    prevTabRef.current = activeTab;
  }, [activeTab]);

  return (
    <>
      <main className="bg-[#fafafa] overflow-x-hidden">
        <div className="mx-auto max-w-[1990px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-[64px] py-4 sm:py-6 md:py-8">
          <h1
            className="mb-4 sm:mb-6 lg:mb-8 text-xl sm:text-2xl md:text-[26px] lg:text-[28px] xl:text-[30px] font-medium leading-tight text-[#0f172a]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {tSettings("title")}
          </h1>

          <Card className="rounded-lg lg:rounded-xl border-none bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col md:flex-row">
              {/* Left sidebar tabs */}
              <aside className="w-full border-b border-[#f4f4f7] md:w-[220px] lg:w-[250px] xl:w-[273px] md:border-b-0 md:border-r md:border-[#f4f4f7]">
                <nav className="space-y-0 p-2 sm:p-3">
                  <SettingsTabButton
                    label={tSettings("tabs.profile")}
                    icon={User}
                    active={activeTab === "profile"}
                    onClick={() => {
                      if (!forceChange) {
                        setActiveTab("profile");
                        router.replace(`/${locale}/teacher/settings?tab=profile`);
                      }
                    }}
                    disabled={forceChange}
                  />
                  <SettingsTabButton
                    label={tSettings("tabs.security")}
                    icon={ShieldCheck}
                    active={activeTab === "security"}
                    onClick={() => {
                      setActiveTab("security");
                      router.replace(`/${locale}/teacher/settings?tab=security${forceChange ? '&forceChange=true' : ''}`);
                    }}
                  />
                  <SettingsTabButton
                    label={tSettings("tabs.notifications")}
                    icon={Bell}
                    active={activeTab === "notifications"}
                    onClick={() => {
                      if (!forceChange) {
                        setActiveTab("notifications");
                        router.replace(`/${locale}/teacher/settings?tab=notifications`);
                      }
                    }}
                    disabled={forceChange}
                  />
                  <SettingsTabButton
                    label={tSettings("tabs.payment")}
                    icon={CreditCard}
                    active={activeTab === "payment"}
                    onClick={() => {
                      if (!forceChange) {
                        setActiveTab("payment");
                        router.replace(`/${locale}/teacher/settings?tab=payment`);
                      }
                    }}
                    disabled={forceChange}
                  />
                </nav>
              </aside>

              {/* Right content panel */}
              <section className="flex-1 p-4 sm:p-6 md:p-8">
                {forceChange && activeTab === "security" && (
                  <div className="mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3 rounded-lg border border-[#ff9800] bg-[#fff3e0] p-3 sm:p-4">
                    <AlertCircle className="h-5 w-5 text-[#ff9800] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#e65100]">
                        {tSettings("security.forceChangeTitle")}
                      </p>
                      <p className="mt-1 text-xs text-[#f57c00]">
                        {tSettings("security.forceChangeMessage")}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "profile" && (
                  profileViewMode === "preview" ? (
                    <ProfilePreview onUpdate={() => setProfileViewMode("edit")} />
                  ) : (
                    <ProfileSettings />
                  )
                )}
                {activeTab === "security" && <SecuritySettings forceChange={forceChange} />}
                {activeTab === "notifications" && <NotificationSettings />}
                {activeTab === "payment" && <PaymentSettings />}
              </section>
            </div>
          </Card>
        </div>

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
      className={`flex-shrink-0 w-full flex items-center gap-2 sm:gap-2 md:gap-3 h-9 sm:h-10 md:h-11 px-2 sm:px-3 rounded-md lg:rounded-lg text-xs sm:text-sm md:text-base transition-colors ${active
        ? "bg-[#eceffd] font-medium text-[#4162e7] cursor-pointer"
        : disabled
          ? "bg-transparent text-[#bdbdbd] cursor-not-allowed"
          : "bg-transparent text-[#3b3d48] hover:bg-[#eceffd] cursor-pointer"
        }`}
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <Icon
        className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 ${active
          ? "text-[#4162e7]"
          : disabled
            ? "text-[#bdbdbd]"
            : "text-[#3b3d48]"
          }`}
      />
      <span className="whitespace-nowrap text-left">{label}</span>
    </button>
  );
}
