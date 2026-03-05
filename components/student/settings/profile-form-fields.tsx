"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, Plus, ChevronDown } from "lucide-react";
import type {
  ProfileFormData,
  StudentSocialKey,
} from "@/hooks/use-student-profile-settings";
import { STUDENT_SOCIAL_PLATFORMS } from "@/hooks/use-student-profile-settings";

interface ProfileFormFieldsProps {
  formData: ProfileFormData;
  onUpdateField: (field: keyof ProfileFormData, value: string) => void;
  t: (key: string) => string;
  isMobile?: boolean;
  socialLinkUrls: Partial<Record<StudentSocialKey, string>>;
  onUpdateSocialLinkUrl: (platform: StudentSocialKey, url: string) => void;
  onClearSocialLinkUrl: (platform: StudentSocialKey) => void;
}

export function ProfileFormFields({
  formData,
  onUpdateField,
  t,
  isMobile = false,
  socialLinkUrls,
  onUpdateSocialLinkUrl,
  onClearSocialLinkUrl,
}: ProfileFormFieldsProps) {
  const inputClass = isMobile
    ? "h-10 rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm px-3"
    : "h-[44px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm px-4";

  return (
    <div className={`grid gap-4 ${isMobile ? "" : "md:grid-cols-2"}`}>
      {/* Full Name */}
      <FormField label={t("page.student.settings.fullName")}>
        <Input
          value={formData.fullName}
          onChange={(e) => onUpdateField("fullName", e.target.value)}
          className={inputClass}
          placeholder={t("page.student.settings.fullName")}
        />
      </FormField>

      {/* Email - read only */}
      <FormField label={t("page.student.settings.email")}>
        <Input
          value={formData.email}
          disabled
          className={`${inputClass} bg-gray-100 cursor-not-allowed`}
        />
      </FormField>

      {/* Phone */}
      <FormField label={t("page.student.settings.phone")}>
        <Input
          value={formData.phone}
          onChange={(e) => onUpdateField("phone", e.target.value)}
          className={inputClass}
          placeholder={t("page.student.settings.phone")}
        />
      </FormField>

      {/* Date of Birth */}
      <FormField label={t("page.student.settings.dateOfBirth")}>
        <Input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => onUpdateField("dateOfBirth", e.target.value)}
          className={inputClass}
        />
      </FormField>

      {/* Gender */}
      <FormField label={t("page.student.settings.gender")}>
        <Select value={formData.gender} onValueChange={(val) => onUpdateField("gender", val)}>
          <SelectTrigger className={inputClass}>
            <SelectValue placeholder={t("page.student.settings.selectGender")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{t("page.student.settings.male")}</SelectItem>
            <SelectItem value="female">{t("page.student.settings.female")}</SelectItem>
            <SelectItem value="other">{t("page.student.settings.other")}</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {/* City */}
      <FormField label={t("page.student.settings.city")}>
        <Input
          value={formData.city}
          onChange={(e) => onUpdateField("city", e.target.value)}
          className={inputClass}
          placeholder={t("page.student.settings.city")}
        />
      </FormField>

      {/* Country */}
      <FormField label={t("page.student.settings.country")}>
        <Input
          value={formData.country}
          onChange={(e) => onUpdateField("country", e.target.value)}
          className={inputClass}
          placeholder={t("page.student.settings.country")}
        />
      </FormField>

      {/* Address */}
      <FormField label={t("page.student.settings.address")} fullWidth={!isMobile}>
        <Input
          value={formData.address}
          onChange={(e) => onUpdateField("address", e.target.value)}
          className={inputClass}
          placeholder={t("page.student.settings.address")}
        />
      </FormField>

      {/* School Name */}
      <FormField label={t("page.student.settings.schoolName")} fullWidth={!isMobile}>
        <Input
          value={formData.schoolName}
          onChange={(e) => onUpdateField("schoolName", e.target.value)}
          className={inputClass}
          placeholder={t("page.student.settings.schoolName")}
        />
      </FormField>

      {/* Bio */}
      <FormField label={t("page.student.settings.bio")} fullWidth>
        <Textarea
          value={formData.bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          className="min-h-[100px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm px-4 py-3"
          placeholder={t("page.student.settings.bioPlaceholder")}
        />
      </FormField>

      {/* Interests */}
      <FormField label={t("page.student.settings.interests")} fullWidth={!isMobile}>
        <Input
          value={formData.interests}
          onChange={(e) => onUpdateField("interests", e.target.value)}
          className={inputClass}
          placeholder={t("page.student.settings.interestsPlaceholder")}
        />
      </FormField>

      {/* Learning Goals */}
      <FormField label={t("page.student.settings.learningGoals")} fullWidth={!isMobile}>
        <Input
          value={formData.learningGoals}
          onChange={(e) => onUpdateField("learningGoals", e.target.value)}
          className={inputClass}
          placeholder={t("page.student.settings.learningGoalsPlaceholder")}
        />
      </FormField>

      {/* Social Links Section */}
      <SocialLinksSection
        t={t}
        isMobile={isMobile}
        socialLinkUrls={socialLinkUrls}
        onUpdateUrl={onUpdateSocialLinkUrl}
        onClearUrl={onClearSocialLinkUrl}
      />
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

function FormField({ label, children, fullWidth = false }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "md:col-span-2" : ""}`}>
      <label className="text-sm font-medium text-[#3b3d48]">{label}</label>
      {children}
    </div>
  );
}

interface SocialLinksSectionProps {
  t: (key: string) => string;
  isMobile: boolean;
  socialLinkUrls: Partial<Record<StudentSocialKey, string>>;
  onUpdateUrl: (platform: StudentSocialKey, url: string) => void;
  onClearUrl: (platform: StudentSocialKey) => void;
}

function SocialLinksSection({
  t,
  isMobile,
  socialLinkUrls,
  onUpdateUrl,
  onClearUrl,
}: SocialLinksSectionProps) {
  const addedPlatforms = STUDENT_SOCIAL_PLATFORMS.filter(
    (p) => socialLinkUrls[p.key as StudentSocialKey] !== undefined
  );
  const availableToAdd = STUDENT_SOCIAL_PLATFORMS.filter(
    (p) => socialLinkUrls[p.key as StudentSocialKey] === undefined
  );

  return (
    <div className="md:col-span-2 space-y-3 pt-2">
      <label className="text-sm font-medium text-[#3b3d48]">
        {t("page.student.settings.socialLinks")}
      </label>

      <div className="space-y-3">
        {addedPlatforms.map(({ key, label, placeholder }) => {
          const value = socialLinkUrls[key as StudentSocialKey] ?? "";
          return (
            <FormField key={key} label={label} fullWidth>
              <div className="relative">
                <Input
                  value={value}
                  onChange={(e) => onUpdateUrl(key as StudentSocialKey, e.target.value)}
                  className={`${isMobile ? "h-10 rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm px-3" : "h-[44px] rounded-[8px] border border-[#f4f4f7] bg-[#fafafa] text-sm px-4"} pr-10`}
                  placeholder={placeholder}
                />
                <button
                  type="button"
                  onClick={() => onClearUrl(key as StudentSocialKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7f859d] hover:text-[#3b3d48] cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </FormField>
          );
        })}
      </div>

      {availableToAdd.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-11 border border-[#4162e7] bg-white text-[#4162e7] hover:bg-[#4162e7] hover:text-white cursor-pointer"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t("page.student.settings.addSocialLink")}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[200px]">
            {availableToAdd.map(({ key, label }) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onUpdateUrl(key as StudentSocialKey, "")}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
