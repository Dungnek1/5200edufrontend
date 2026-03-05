"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  teacherProfileService,
  teacherSocialLinksService,
  teacherEducationService,
  teacherCertificateService,
  teacherGalleryService,
  userService,
} from "@/services/apis";
import type { GalleryImage } from "@/services/apis/teacher-gallery.service";
import type { TeacherProfile, SocialLink, Education, Certificate } from "@/types/teacher.types";
import { getAvatarUrl } from "@/utils/media";
import { toast } from "sonner";

export interface TeacherFormData {
  fullName: string;
  email: string;
  phone: string;
  professionalTitle: string;
  yearsExperience: string;
  bio: string;
}

const initialFormData: TeacherFormData = {
  fullName: "",
  email: "",
  phone: "",
  professionalTitle: "",
  yearsExperience: "",
  bio: "",
};

export const SOCIAL_PLATFORMS = [
  { value: "FACEBOOK", label: "Facebook", placeholder: "https://www.facebook.com/" },
  { value: "X", label: "X (Twitter)", placeholder: "https://x.com/" },
  { value: "YOUTUBE", label: "YouTube", placeholder: "https://www.youtube.com/" },
  { value: "TIKTOK", label: "TikTok", placeholder: "https://www.tiktok.com/@" },
  { value: "LINKEDIN", label: "LinkedIn", placeholder: "https://www.linkedin.com/in/" },
  { value: "WEBSITE", label: "Website", placeholder: "https://" },
  { value: "OTHER", label: "Other", placeholder: "https://" },
] as const;

export type SocialPlatform = typeof SOCIAL_PLATFORMS[number]["value"];

export function useTeacherProfileSettings() {
  const { user, refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [socialLinkUrls, setSocialLinkUrls] = useState<Record<string, string>>({});
  const [educations, setEducations] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [formData, setFormData] = useState<TeacherFormData>({
    ...initialFormData,
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  useEffect(() => {
    loadTeacherProfile();
    loadSocialLinks();
    loadEducations();
    loadCertificates();
    loadGalleryImages();
  }, []);

  const loadTeacherProfile = useCallback(async () => {
    try {
      const [teacherRes, userRes] = await Promise.allSettled([
        teacherProfileService.get(),
        userService.getProfile(),
      ]);

      // Teacher profile (chức danh, bio, năm kinh nghiệm)
      if (teacherRes.status === "fulfilled" && teacherRes.value.success && teacherRes.value.data) {
        const data = teacherRes.value.data;
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          professionalTitle: data.professionalTitle || "",
          yearsExperience: data.yearsExperience?.toString() || "",
          bio: data.bio || "",
        }));
      }

      // User info (tên, email, sđt) – đảm bảo phone được fill lại sau khi lưu
      if (userRes.status === "fulfilled" && userRes.value.data) {
        const u = userRes.value.data;
        setFormData((prev) => ({
          ...prev,
          fullName: u.fullName || prev.fullName || "",
          email: u.email || prev.email || "",
          phone: (u as any).phone || prev.phone || "",
        }));
      }
    } catch (error: unknown) {
      // Error loading teacher profile or user profile
    }
  }, []);

  const loadSocialLinks = useCallback(async () => {
    try {
      const response = await teacherSocialLinksService.list();
      if (response.success && response.data) {
        setSocialLinks(response.data);
        // Build URL map from loaded links
        const urls: Record<string, string> = {};
        for (const link of response.data) {
          urls[link.platform] = link.url;
        }
        setSocialLinkUrls(urls);
      }
    } catch (error: unknown) {
      // Error loading social links
    }
  }, []);

  const loadEducations = useCallback(async () => {
    try {
      const response = await teacherEducationService.list();
      if (response.success && response.data) {
        setEducations(response.data);
      }
    } catch (error: unknown) {
      // Error loading educations
    }
  }, []);

  const loadCertificates = useCallback(async () => {
    try {
      const response = await teacherCertificateService.list();
      if (response.success && response.data) {
        setCertificates(response.data);
      }
    } catch (error: unknown) {
      // Error loading certificates
    }
  }, []);

  const loadGalleryImages = useCallback(async () => {
    try {
      const response = await teacherGalleryService.getImages();
      if (response.success && response.data) {
        setGalleryImages(response.data);
      }
    } catch (error: unknown) {
      // Error loading gallery
    }
  }, []);

  const handleAvatarSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file quá lớn. Tối đa 5MB");
      e.target.value = "";
      return;
    }

    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      toast.error("Chỉ chấp nhận file JPG, PNG, WebP");
      e.target.value = "";
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const triggerAvatarFileInput = useCallback(() => {
    if (!uploading) avatarFileInputRef.current?.click();
  }, [uploading]);

  const displayAvatarUrl = avatarPreview ?? getAvatarUrl(user?.avatar) ?? getAvatarUrl(profile?.avatarUrl) ?? undefined;

  const updateField = useCallback((field: keyof TeacherFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateSocialLinkUrl = useCallback((platform: string, url: string) => {
    setSocialLinkUrls((prev) => ({ ...prev, [platform]: url }));
  }, []);

  const clearSocialLinkUrl = useCallback((platform: string) => {
    setSocialLinkUrls((prev) => {
      const next = { ...prev };
      delete next[platform];
      return next;
    });
  }, []);

  const handleAddEducation = useCallback(() => {
    const tempEducation: Education = {
      id: "",
      school: "",
      degree: "",
    };
    setEducations((prev) => [...prev, tempEducation]);
    toast.success("Thêm học vấn - vui lòng điền thông tin và lưu");
  }, []);

  const handleRemoveEducation = useCallback(async (id: string, index: number) => {
    if (!id) {
      setEducations((prev) => prev.filter((_, i) => i !== index));
      toast.success("Xóa học vấn");
      return;
    }
    
    try {
      await teacherEducationService.delete(id);
      setEducations((prev) => prev.filter((_, i) => i !== index));
      toast.success("Xóa học vấn thành công");
    } catch (error: unknown) {
      toast.error("Không thể xóa học vấn");
    }
  }, []);

  const handleUpdateEducation = useCallback(
    async (id: string, data: { school: string; degree: string }) => {
    },
    []
  );

  const updateEducationLocal = useCallback((index: number, field: "school" | "degree", value: string) => {
    setEducations((prev) => {
      const newEducations = [...prev];
      newEducations[index] = { ...newEducations[index], [field]: value };
      return newEducations;
    });
  }, []);

  const handleAddCertificate = useCallback(async () => {
    try {
      const response = await teacherCertificateService.create({ title: "" });
      if (response.success && response.data) {
        setCertificates((prev) => [...prev, response.data]);
        toast.success("Thêm chứng chỉ thành công");
      }
    } catch (error: unknown) {
      toast.error("Không thể thêm chứng chỉ");
    }
  }, []);

  const handleRemoveCertificate = useCallback(async (id: string, index: number) => {
    try {
      await teacherCertificateService.delete(id);
      setCertificates((prev) => prev.filter((_, i) => i !== index));
      toast.success("Xóa chứng chỉ thành công");
    } catch (error: unknown) {
      toast.error("Không thể xóa chứng chỉ");
    }
  }, []);

  const handleUploadCertificateImage = useCallback(async (certId: string, file: File) => {
    try {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Kích thước file quá lớn. Tối đa 10MB");
        return;
      }
      const response = await teacherCertificateService.uploadImage(certId, file);
      if (response.success) {
        loadCertificates();
        toast.success("Upload ảnh chứng chỉ thành công");
      }
    } catch (error: unknown) {
      toast.error("Không thể upload ảnh chứng chỉ");
    }
  }, [loadCertificates]);

  const handleUpdateCertificate = useCallback(async (id: string, title: string) => {
    try {
      await teacherCertificateService.update(id, { title });
    } catch (error: unknown) {
      toast.error("Không thể cập nhật chứng chỉ");
    }
  }, []);

  const updateCertificateLocal = useCallback((index: number, title: string) => {
    setCertificates((prev) => {
      const newCerts = [...prev];
      newCerts[index] = { ...newCerts[index], title };
      return newCerts;
    });
  }, []);

  const handleRemoveCertificateImage = useCallback(
    async (certId: string) => {
      try {
        await teacherCertificateService.update(certId, { imageUrl: null });
        loadCertificates();
      } catch (error: unknown) {
        // Error removing certificate image
      }
    },
    [loadCertificates]
  );

  const handleUploadTeachingImages = useCallback(
    async (files: File[]) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      for (const file of files) {
        if (file.size > maxSize) {
          toast.error("Kích thước file quá lớn. Tối đa 10MB");
          return;
        }
        if (!allowedTypes.includes(file.type)) {
          toast.error("Chỉ chấp nhận JPEG, JPG, PNG");
          return;
        }
      }
      try {
        setUploading(true);
        for (const file of files) {
          const response = await teacherGalleryService.uploadImageFile(file);
          if (!response.success) throw new Error("Upload failed");
        }
        await loadGalleryImages();
        toast.success(files.length > 1 ? "Đã tải lên ảnh thành công" : "Đã tải lên ảnh thành công");
      } catch (error: unknown) {
        toast.error("Không thể tải lên ảnh");
      } finally {
        setUploading(false);
      }
    },
    [loadGalleryImages]
  );

  const handleRemoveTeachingImage = useCallback(
    async (imageId: string) => {
      try {
        await teacherGalleryService.deleteImage(imageId);
        await loadGalleryImages();
      } catch (error: unknown) {
        toast.error("Không thể xóa ảnh");
      }
    },
    [loadGalleryImages]
  );

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);

      let avatarUrlToUpdate: string | undefined;
      if (avatarFile) {
        setUploading(true);
        try {
          const uploadResult = await userService.uploadAvatar(avatarFile);
          avatarUrlToUpdate = uploadResult.data?.avatarUrl;
          setAvatarFile(null);
        } catch (error: unknown) {
          toast.error("Ảnh đại diện không phù hợp hoặc xảy ra lỗi");
          return;
        } finally {
          setUploading(false);
        }
      }

      await userService.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        ...(avatarUrlToUpdate !== undefined && { avatarUrl: avatarUrlToUpdate }),
      });

      await teacherProfileService.update({
        professionalTitle: formData.professionalTitle,
        yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : undefined,
        bio: formData.bio,
      });

      // Sync social links: create/update/delete for each platform
      for (const { value: platform } of SOCIAL_PLATFORMS) {
        const existing = socialLinks.find((l) => l.platform === platform);
        const newUrl = socialLinkUrls[platform]?.trim();

        if (newUrl) {
          if (existing) {
            if (existing.url !== newUrl) {
              await teacherSocialLinksService.update(existing.id, { url: newUrl });
            }
          } else {
            await teacherSocialLinksService.create({ platform, url: newUrl });
          }
        } else if (existing) {
          await teacherSocialLinksService.delete(existing.id);
        }
      }

      // Batch process educations: create new, update existing
      const newEducations = educations.filter((edu) => !edu.id); // Temporary records (id is empty)
      const existingEducations = educations.filter((edu) => edu.id); // Records with id from DB

      // Create new education records
      for (const edu of newEducations) {
        if (edu.school || edu.degree) { // Only create if has data
          try {
            await teacherEducationService.create({
              school: edu.school,
              degree: edu.degree || "",
            });
          } catch (error: unknown) {
            toast.error(`Không thể thêm học vấn: ${edu.school}`);
          }
        }
      }

      // Update existing education records
      for (const edu of existingEducations) {
        try {
          await teacherEducationService.update(edu.id, {
            school: edu.school,
            degree: edu.degree || "",
          });
        } catch (error: unknown) {
          toast.error(`Không thể cập nhật học vấn: ${edu.school}`);
        }
      }

      toast.success("Cập nhật hồ sơ thành công");
      await refreshSession();
      await loadTeacherProfile();
      await loadSocialLinks();
      await loadEducations();

      setAvatarPreview(null);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(errorMessage || "Không thể lưu hồ sơ");
    } finally {
      setLoading(false);
    }
  }, [avatarFile, formData, socialLinks, socialLinkUrls, educations, refreshSession, loadTeacherProfile, loadSocialLinks, loadEducations]);

  return {
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
  };
}
