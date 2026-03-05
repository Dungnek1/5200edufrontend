"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { studentProfileService, userService } from "@/services/apis";
import type {
  StudentProfile,
  UpdateStudentProfileRequest,
} from "@/services/apis/student-profile.service";
import { getAvatarUrl } from "@/utils/media";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  country: string;
  preferredLanguages: string;
  schoolName: string;
  bio: string;
  interests: string;
  learningGoals: string;
}

const initialFormData: ProfileFormData = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "other",
  address: "",
  city: "",
  country: "",
  preferredLanguages: "",
  schoolName: "",
  bio: "",
  interests: "",
  learningGoals: "",
};

export const STUDENT_SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook", placeholder: "https://www.facebook.com/" },
  { key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/" },
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/in/" },
  { key: "tiktok", label: "TikTok", placeholder: "https://www.tiktok.com/@" },
] as const;

export type StudentSocialKey = (typeof STUDENT_SOCIAL_PLATFORMS)[number]["key"];

export function useStudentProfileSettings() {
  const { user, refreshSession } = useAuth();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const hasLoadedProfile = useRef(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [socialLinkUrls, setSocialLinkUrls] = useState<Partial<Record<StudentSocialKey, string>>>(
    {}
  );

  useEffect(() => {
    if (user) {
      if (formData.email !== user.email) {
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || "",
          email: user.email || "",
          phone: "",
        }));
      }

      if (!hasLoadedProfile.current) {
        loadStudentProfile();
        hasLoadedProfile.current = true;
      }
      setIsInitialLoading(false);
    }
  }, [user]);

  const loadStudentProfile = useCallback(async () => {
    if (!user) return;

    try {
      const profileResponse = await studentProfileService.getProfile();
      if (profileResponse.success && profileResponse.data) {
        const data = profileResponse.data;
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          city: data.city || "",
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: data.gender || "other",
          address: data.address || "",
          country: data.country || "",
          preferredLanguages: data.preferredLanguages || "",
          schoolName: data.schoolName || "",
          bio: data.bio || "",
          interests: data.interests || "",
          learningGoals: data.learningGoals || "",
        }));

        // Chỉ khởi tạo những platform đã có link (truthy),
        // còn lại để user tự bấm 'Thêm mạng xã hội' để hiện field.
        const initialSocialLinks: Partial<Record<StudentSocialKey, string>> = {};
        const social = data.socialLinks;
        if (social?.facebook) initialSocialLinks.facebook = social.facebook;
        if (social?.twitter) initialSocialLinks.twitter = social.twitter;
        if (social?.instagram) initialSocialLinks.instagram = social.instagram;
        if (social?.linkedin) initialSocialLinks.linkedin = social.linkedin;
        if (social?.tiktok) initialSocialLinks.tiktok = social.tiktok;
        setSocialLinkUrls(initialSocialLinks);
      }
    } catch (error: any) {
      // Student profile not found, will create on save
    }
  }, [user]);

  const handleAvatarSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("page.student.settings.fileTooLarge"));
      return;
    }

    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      toast.error(t("page.student.settings.invalidFileType"));
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [t]);

  const updateField = useCallback((field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateSocialLinkUrl = useCallback((platform: StudentSocialKey, url: string) => {
    setSocialLinkUrls((prev) => ({
      ...prev,
      [platform]: url,
    }));
  }, []);

  const clearSocialLinkUrl = useCallback((platform: StudentSocialKey) => {
    setSocialLinkUrls((prev) => {
      const next = { ...prev };
      delete next[platform];
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    const previousProfile = profile ? { ...profile } : null;

    try {
      // Validate date of birth before saving
      if (formData.dateOfBirth) {
        const dob = new Date(formData.dateOfBirth);
        const now = new Date();

        if (Number.isNaN(dob.getTime())) {
          toast.error(t("page.student.settings.invalidDateOfBirth"));
          return;
        }

        // Không cho phép ngày sinh trong tương lai
        if (dob > now) {
          toast.error(t("page.student.settings.invalidDateOfBirth"));
          return;
        }
      }

      setLoading(true);

      let avatarUrlFromUpload: string | undefined;
      if (avatarFile) {
        setUploading(true);
        try {
          const result = await userService.uploadAvatar(avatarFile);
          setAvatarFile(null);
          if (result.data?.avatarUrl) {
            avatarUrlFromUpload = result.data.avatarUrl;
            setAvatarPreview(getAvatarUrl(result.data.avatarUrl) + `?t=${Date.now()}`);
          }
        } finally {
          setUploading(false);
        }
      }

      const profileData: UpdateStudentProfileRequest = {
        city: formData.city || undefined,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : undefined,
        gender: formData.gender || undefined,
        address: formData.address || undefined,
        country: formData.country || undefined,
        preferredLanguages: formData.preferredLanguages || undefined,
        schoolName: formData.schoolName || undefined,
        bio: formData.bio || undefined,
        interests: formData.interests || undefined,
        learningGoals: formData.learningGoals || undefined,
        socialLinks: {
          facebook: socialLinkUrls.facebook ?? null,
          twitter: socialLinkUrls.twitter ?? null,
          instagram: socialLinkUrls.instagram ?? null,
          linkedin: socialLinkUrls.linkedin ?? null,
          tiktok: socialLinkUrls.tiktok ?? null,
        },
      };

      if (profile) {
        setProfile({ ...profile, ...profileData } as StudentProfile);
      }

      await Promise.all([
        userService.updateProfile({
          phone: formData.phone || undefined,
          fullName: formData.fullName || undefined,
          ...(avatarUrlFromUpload !== undefined && { avatarUrl: avatarUrlFromUpload }),
        }),
        profile
          ? studentProfileService.updateProfile(profileData)
          : studentProfileService.createProfile(profileData),
      ]);

      await refreshSession();
      toast.success(t("page.student.settings.profileUpdateSuccess"));
    } catch (error: any) {
      if (previousProfile) setProfile(previousProfile);
      toast.error(t("page.student.settings.profileUpdateError"));
    } finally {
      setLoading(false);
    }
  }, [avatarFile, formData, profile, refreshSession, socialLinkUrls, t]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getDisplayAvatarUrl = useCallback(() => {
    return avatarPreview || (user?.avatar ? getAvatarUrl(user.avatar) : null);
  }, [avatarPreview, user?.avatar]);

  return {
    user,
    loading,
    uploading,
    isInitialLoading,
    formData,
    socialLinkUrls,
    avatarPreview,
    fileInputRef,

    displayAvatarUrl: getDisplayAvatarUrl(),

    updateField,
    updateSocialLinkUrl,
    clearSocialLinkUrl,
    handleAvatarSelect,
    handleSave,
    triggerFileInput,

    t,
  };
}
