"use client";

import { Button } from "@/components/ui/button";

import { useStudentProfileSettings } from "@/hooks/use-student-profile-settings";
import { ProfileFormFields } from "./profile-form-fields";

export function ProfileSettings() {
  const {
    user,
    loading,
    uploading,
    isInitialLoading,
    formData,
    displayAvatarUrl,
    fileInputRef,
    updateField,
    socialLinkUrls,
    updateSocialLinkUrl,
    clearSocialLinkUrl,
    handleAvatarSelect,
    handleSave,
    triggerFileInput,
    t,
  } = useStudentProfileSettings();

  if (isInitialLoading) {
    return <LoadingState title={t("page.student.settings.personalProfile")} subtitle={t("page.student.settings.personalInfo")} />;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        title={t("page.student.settings.personalProfile")}
        subtitle={t("page.student.settings.personalInfo")}
      />

      {/* Avatar Section */}
      <AvatarSection
        avatarUrl={displayAvatarUrl}
        userName={user?.fullName || ""}
        uploading={uploading}
        fileInputRef={fileInputRef}
        onAvatarSelect={handleAvatarSelect}
        onTriggerFileInput={triggerFileInput}
        t={t}
      />

      {/* Form Fields */}
      <ProfileFormFields
        formData={formData}
        onUpdateField={updateField}
        t={t}
        socialLinkUrls={socialLinkUrls}
        onUpdateSocialLinkUrl={updateSocialLinkUrl}
        onClearSocialLinkUrl={clearSocialLinkUrl}
      />

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#4162e7] hover:bg-[#3554d4] text-white px-8 py-2 rounded-lg"
        >
          {loading ? t("page.student.settings.saving") : t("page.student.settings.saveChanges")}
        </Button>
      </div>
    </div>
  );
}

export function ProfileSettingsMobile() {
  const {
    user,
    loading,
    uploading,
    isInitialLoading,
    formData,
    displayAvatarUrl,
    fileInputRef,
    updateField,
    socialLinkUrls,
    updateSocialLinkUrl,
    clearSocialLinkUrl,
    handleAvatarSelect,
    handleSave,
    triggerFileInput,
    t,
  } = useStudentProfileSettings();

  if (isInitialLoading) {
    return <LoadingState title={t("page.student.settings.personalProfile")} subtitle={t("page.student.settings.personalInfo")} />;
  }

  return (
    <div className="space-y-4 px-4 pb-20">
      <ProfileHeader
        title={t("page.student.settings.personalProfile")}
        subtitle={t("page.student.settings.personalInfo")}
      />

      {/* Avatar Section - Centered for mobile */}
      <div className="flex flex-col items-center gap-4">
        <AvatarSection
          avatarUrl={displayAvatarUrl}
          userName={user?.fullName || ""}
          uploading={uploading}
          fileInputRef={fileInputRef}
          onAvatarSelect={handleAvatarSelect}
          onTriggerFileInput={triggerFileInput}
          t={t}
          isMobile
        />
      </div>

      {/* Form Fields */}
      <ProfileFormFields
        formData={formData}
        onUpdateField={updateField}
        t={t}
        isMobile
        socialLinkUrls={socialLinkUrls}
        onUpdateSocialLinkUrl={updateSocialLinkUrl}
        onClearSocialLinkUrl={clearSocialLinkUrl}
      />

      {/* Save Button - Full width on mobile */}
      <div className="pt-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-[#4162e7] hover:bg-[#3554d4] text-white py-3 rounded-lg"
        >
          {loading ? t("page.student.settings.saving") : t("page.student.settings.saveChanges")}
        </Button>
      </div>
    </div>
  );
}

interface ProfileHeaderProps {
  title: string;
  subtitle: string;
}

function ProfileHeader({ title, subtitle }: ProfileHeaderProps) {
  return (
    <header className="mb-2">
      <h2 className="text-lg font-medium text-[#1b2961]">{title}</h2>
      <p className="mt-1 text-sm text-[#7f859d]">{subtitle}</p>
    </header>
  );
}

interface LoadingStateProps {
  title: string;
  subtitle: string;
}

function LoadingState({ title, subtitle }: LoadingStateProps) {
  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h2 className="text-lg font-medium text-[#1b2961]">{title}</h2>
        <p className="mt-1 text-sm text-[#7f859d]">{subtitle}</p>
      </header>
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#4162e7] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

interface AvatarSectionProps {
  avatarUrl: string | null;
  userName: string;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTriggerFileInput: () => void;
  t: (key: string) => string;
  isMobile?: boolean;
}

function AvatarSection({
  avatarUrl,
  userName,
  uploading,
  fileInputRef,
  onAvatarSelect,
  onTriggerFileInput,
  t,
  isMobile = false,
}: AvatarSectionProps) {
  const avatarSize = isMobile ? "h-20 w-20" : "h-24 w-24";

  return (
    <div className={`flex ${isMobile ? "flex-col items-center" : "flex-col sm:flex-row sm:items-center"} gap-4`}>
      {/* Avatar thumbnail */}
      <div className={`${avatarSize} rounded-full bg-[#ffefe7] overflow-hidden`}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            width={isMobile ? 80 : 96}
            height={isMobile ? 80 : 96}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-[#f59e0b]">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
      </div>

      {/* Upload buttons */}
      <div className={`flex ${isMobile ? "flex-col" : ""} gap-2`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onAvatarSelect}
        />
        <Button
          variant="outline"
          onClick={onTriggerFileInput}
          disabled={uploading}
          className="border-[#4162e7] bg-white text-[#4162e7] hover:bg-[#4162e7] hover:text-white"
        >
          {uploading ? t("page.student.settings.uploading") : t("page.student.settings.changePhoto")}
        </Button>
      </div>
    </div>
  );
}
