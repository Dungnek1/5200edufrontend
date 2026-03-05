"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, Plus, ChevronDown } from "lucide-react";
import type { TeacherFormData } from "@/hooks/use-teacher-profile-settings";
import { SOCIAL_PLATFORMS } from "@/hooks/use-teacher-profile-settings";
import { getAvatarUrl } from "@/utils/media";
import { useTranslations } from "next-intl";

interface ProfileBasicInfoProps {
  user: { avatar?: string; fullName?: string } | null;
  profile: { avatarUrl?: string | null } | null;
  uploading: boolean;
  formData: TeacherFormData;
  displayAvatarUrl?: string | null;
  avatarFileInputRef: React.RefObject<HTMLInputElement | null>;
  onTriggerAvatarFileInput: () => void;
  onAvatarSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateField: (field: keyof TeacherFormData, value: string) => void;
  socialLinkUrls: Record<string, string>;
  onUpdateSocialLinkUrl: (platform: string, url: string) => void;
  onClearSocialLinkUrl: (platform: string) => void;
}

export function ProfileBasicInfo({
  user,
  profile,
  uploading,
  formData,
  displayAvatarUrl,
  avatarFileInputRef,
  onTriggerAvatarFileInput,
  onAvatarSelect,
  onUpdateField,
  socialLinkUrls,
  onUpdateSocialLinkUrl,
  onClearSocialLinkUrl,
}: ProfileBasicInfoProps) {
  const tFile = useTranslations("common.fileUpload");
  const tProfile = useTranslations("teacher.settings.profile");

  const avatarUrl = displayAvatarUrl ?? user?.avatar ?? profile?.avatarUrl ?? undefined;

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-base font-medium text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif" }}>
        {tProfile("basicInfo")}
      </p>

      {/* Avatar + upload */}
      <AvatarUploadSection
        avatarUrl={avatarUrl}
        uploading={uploading}
        fileInputRef={avatarFileInputRef}
        onTriggerFileInput={onTriggerAvatarFileInput}
        onUpload={onAvatarSelect}
        t={tFile}
      />

      {/* Họ và tên */}
      <FormField label={tProfile("fullName")}>
        <Input
          className="h-[44px] rounded-[8px] border-[#f4f4f7] bg-[#fafafa]"
          value={formData.fullName}
          onChange={(e) => onUpdateField("fullName", e.target.value)}
        />
      </FormField>

      {/* Số điện thoại và Email */}
      <div className="grid grid-cols-2 gap-3">
        <FormField label={tProfile("phone")}>
          <Input
            className="h-[44px] rounded-[8px] border-[#f4f4f7] bg-[#fafafa]"
            value={formData.phone}
            onChange={(e) => onUpdateField("phone", e.target.value)}
          />
        </FormField>
        <FormField label={tProfile("email")}>
          <Input className="h-[44px] rounded-[8px] border-[#f4f4f7] bg-[#fafafa]" value={formData.email} disabled />
        </FormField>
      </div>

      {/* Social Links */}
      <SocialLinksSection
        socialLinkUrls={socialLinkUrls}
        onUpdateUrl={onUpdateSocialLinkUrl}
        onClearUrl={onClearSocialLinkUrl}
      />

      {/* Mô tả bản thân */}
      <FormField label={tProfile("bio")}>
        <Textarea
          className="min-h-[186px] border-[#f4f4f7] bg-[#fafafa]"
          placeholder={tProfile("bioPlaceholder")}
          value={formData.bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
        />
      </FormField>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={className ? `space-y-1 ${className}` : "space-y-1"}>
      <label className="text-sm text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

interface AvatarUploadSectionProps {
  avatarUrl?: string | null;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onTriggerFileInput: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: ReturnType<typeof useTranslations<"common.fileUpload">>;
}

function AvatarUploadSection({ avatarUrl, uploading, fileInputRef, onTriggerFileInput, onUpload, t }: AvatarUploadSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 items-center sm:items-start">
      {/* Avatar */}
      <div className="relative shrink-0 w-[90px] h-[90px] sm:w-[100px] sm:h-[100px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-[80px] sm:h-[80px] rounded-full border-2 border-[#a8b7f4] p-1">
            <div className="w-full h-full rounded-full bg-[#ffefe7] overflow-hidden">
              <img
                src={getAvatarUrl(avatarUrl)}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upload box */}
      <div className="w-full flex-1 border border-dashed border-[#dbdde5] bg-[#f8f9ff] rounded-xl px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="text-sm sm:text-base font-medium text-[#3b3d48]">
            {uploading ? t("uploading") : t("dropHere")}
          </span>
          <span className="mt-1 text-xs text-[#7f859d]">
            {t("avatarHint")}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onUpload}
          disabled={uploading}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={onTriggerFileInput}
          className="w-full sm:w-auto h-10 sm:h-11 border border-[#4162e7] bg-white text-[#4162e7] hover:bg-[#4162e7] hover:text-white cursor-pointer"
        >
          {t("browse")}
        </Button>
      </div>
    </div>
  );
}

interface SocialLinksSectionProps {
  socialLinkUrls: Record<string, string>;
  onUpdateUrl: (platform: string, url: string) => void;
  onClearUrl: (platform: string) => void;
}

/** Chỉ cập nhật local state (socialLinkUrls). API chỉ gọi trong handleSave khi user bấm "Lưu thay đổi". */
function SocialLinksSection({
  socialLinkUrls,
  onUpdateUrl,
  onClearUrl,
}: SocialLinksSectionProps) {
  const tProfile = useTranslations("teacher.settings.profile");
  const addedPlatforms = SOCIAL_PLATFORMS.filter((p) => p.value in socialLinkUrls);
  const availableToAdd = SOCIAL_PLATFORMS.filter((p) => !(p.value in socialLinkUrls));

  return (
    <div className="space-y-3">
      <label className="text-sm text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif" }}>
        {tProfile("socialLinks")}
      </label>

      {/* Danh sách đã thêm: ô nhập link + nút X xóa (chỉ local state) */}
      <div className="space-y-3">
        {addedPlatforms.map(({ value, placeholder }) => (
          <div key={value} className="flex items-center gap-2">
            <FormField label={tProfile(`platforms.${value}`)} className="flex-1 min-w-0">
              <div className="relative">
                <Input
                  className="h-[44px] rounded-[8px] border-[#f4f4f7] bg-[#fafafa] pr-10"
                  value={socialLinkUrls[value] ?? ""}
                  onChange={(e) => onUpdateUrl(value, e.target.value)}
                  placeholder={placeholder}
                />
                <button
                  type="button"
                  onClick={() => onClearUrl(value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7f859d] hover:text-[#3b3d48]"
                  aria-label={tProfile("removeLink")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </FormField>
          </div>
        ))}
      </div>

      {/* Nút thêm mạng xã hội: dropdown chọn 1 trong 7 platform, add vào list (local state) */}
      {availableToAdd.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-[44px] rounded-[8px] border border-[#4162e7] bg-white text-[#4162e7] hover:bg-[#4162e7] hover:text-white cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              {tProfile("addSocialLink")}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[200px]">
            {availableToAdd.map(({ value }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => onUpdateUrl(value, "")}
              >
                {tProfile(`platforms.${value}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
