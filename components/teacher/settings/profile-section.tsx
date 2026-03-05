"use client";

import { Button } from "@/components/ui/button";
import { useTeacherProfileSettings } from "@/hooks/use-teacher-profile-settings";
import { ProfileBasicInfo } from "./profile-basic-info";
import { ProfileProfessionalInfo } from "./profile-professional-info";
import { useTranslations } from "next-intl";

export function ProfileSettings() {
  const {
    user,
    loading,
    uploading,
    profile,
    formData,
    educations,
    certificates,
    galleryImages,
    handleUploadTeachingImages,
    handleRemoveTeachingImage,
    updateField,
    handleAvatarSelect,
    avatarFileInputRef,
    triggerAvatarFileInput,
    displayAvatarUrl,
    socialLinkUrls,
    updateSocialLinkUrl,
    clearSocialLinkUrl,
    handleAddEducation,
    handleRemoveEducation,
    handleUpdateEducation,
    updateEducationLocal,
    handleAddCertificate,
    handleRemoveCertificate,
    handleUploadCertificateImage,
    handleUpdateCertificate,
    updateCertificateLocal,
    handleRemoveCertificateImage,
    handleSave,
  } = useTeacherProfileSettings();

  const tProfile = useTranslations("teacher.settings.profile");
  const tCommon = useTranslations("common");

  return (
    <div className="flex flex-col gap-[20px] px-[12px] py-[20px]">
      {/* Header */}
      <header className="mb-0">
        <h2
          className="text-[24px] font-medium leading-[32px] text-[#0f172a]"
          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
        >
          {tProfile("basicInfo")}
        </h2>
        <p
          className="mt-[4px] text-[16px] leading-[24px] text-[#8c92ac]"
          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
        >
          {tProfile("subtitle")}
        </p>
      </header>

      {/* Basic Info Section */}
      <ProfileBasicInfo
        user={user}
        profile={profile}
        uploading={uploading}
        formData={formData}
        displayAvatarUrl={displayAvatarUrl}
        avatarFileInputRef={avatarFileInputRef}
        onTriggerAvatarFileInput={triggerAvatarFileInput}
        onAvatarSelect={handleAvatarSelect}
        onUpdateField={updateField}
        socialLinkUrls={socialLinkUrls}
        onUpdateSocialLinkUrl={updateSocialLinkUrl}
        onClearSocialLinkUrl={clearSocialLinkUrl}
      />

      {/* Professional Info Section */}
      <ProfileProfessionalInfo
        formData={formData}
        educations={educations}
        certificates={certificates}
        galleryImages={galleryImages}
        uploadingTeachingImages={uploading}
        onUploadTeachingImages={handleUploadTeachingImages}
        onRemoveTeachingImage={handleRemoveTeachingImage}
        onUpdateField={updateField}
        onAddEducation={handleAddEducation}
        onRemoveEducation={handleRemoveEducation}
        onUpdateEducation={handleUpdateEducation}
        onUpdateEducationLocal={updateEducationLocal}
        onAddCertificate={handleAddCertificate}
        onRemoveCertificate={handleRemoveCertificate}
        onUploadCertificateImage={handleUploadCertificateImage}
        onUpdateCertificate={handleUpdateCertificate}
        onUpdateCertificateLocal={updateCertificateLocal}
        onRemoveCertificateImage={handleRemoveCertificateImage}
      />

      {/* Save Button */}
      <div className="flex justify-end px-3 py-0">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="h-11 bg-[#4162e7] text-white hover:bg-[#3554d4] px-4 cursor-pointer"
        >
          {loading ? tCommon("loading") : tProfile("save")}
        </Button>
      </div>
    </div>
  );
}
