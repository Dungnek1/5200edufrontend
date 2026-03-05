"use client";

import { Button } from "@/components/ui/button";
import { useTeacherProfileSettings } from "@/hooks/use-teacher-profile-settings";
import { SOCIAL_PLATFORMS } from "@/hooks/use-teacher-profile-settings";
import { getAvatarUrl } from "@/utils/media";
import { useTranslations } from "next-intl";
import { Mail, Phone, Globe, FileText, Download, Image as ImageIcon } from "lucide-react";
import type { Education, Certificate } from "@/types/teacher.types";
import type { GalleryImage } from "@/services/apis/teacher-gallery.service";

function getFileNameFromUrl(url: string): string {
  try {
    const withoutQuery = url.split("?")[0] || "";
    const last = withoutQuery.split("/").filter(Boolean).pop() || "";
    return decodeURIComponent(last) || last;
  } catch {
    const withoutQuery = url.split("?")[0] || "";
    return withoutQuery.split("/").filter(Boolean).pop() || "";
  }
}

export function ProfilePreview({ onUpdate }: { onUpdate: () => void }) {
  const {
    user,
    profile,
    formData,
    educations,
    certificates,
    galleryImages,
    socialLinkUrls,
  } = useTeacherProfileSettings();

  const tProfile = useTranslations("teacher.settings.profile");

  const displayName = formData?.fullName || user?.fullName || "";
  const displayEmail = formData?.email || user?.email || "";
  const displayPhone = formData?.phone || "";
  const displayBio = formData?.bio || profile?.bio || "";
  const avatarUrl = user?.avatar || profile?.avatarUrl;
  const socialLinksList = SOCIAL_PLATFORMS.filter((p) => socialLinkUrls[p.value]?.trim()).map(
    (p) => ({ platform: p.value, url: socialLinkUrls[p.value].trim() })
  );

  return (
    <div className="flex flex-col gap-0 px-0 py-0">
      {/* Header */}
      <header className="mb-6">
        <h2
          className="text-[24px] font-medium leading-[32px] text-[#0f172a]"
          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
        >
          {tProfile("personalProfile")}
        </h2>
        <p
          className="mt-1 text-[16px] leading-[24px] text-[#8c92ac]"
          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
        >
          {tProfile("previewSubtitle")}
        </p>
      </header>

      {/* Thông tin cơ bản */}
      <section className="pt-6 pb-6">
        <h3
          className="text-base font-medium text-[#3b3d48] mb-4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {tProfile("basicInfo")}
        </h3>
        <div className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#ffefe7] overflow-hidden flex-shrink-0">
              <img
                src={getAvatarUrl(avatarUrl)}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              {displayName && (
                <p
                  className="text-lg font-medium text-[#0f172a]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {displayName}
                </p>
              )}
              {displayEmail && (
                <div className="flex items-center gap-2 text-[#3b3d48]">
                  <Mail className="h-4 w-4 flex-shrink-0 text-[#7f859d]" />
                  <span className="text-sm break-all" style={{ fontFamily: "Roboto, sans-serif" }}>
                    {displayEmail}
                  </span>
                </div>
              )}
              {displayPhone && (
                <div className="flex items-center gap-2 text-[#3b3d48]">
                  <Phone className="h-4 w-4 flex-shrink-0 text-[#7f859d]" />
                  <span className="text-sm" style={{ fontFamily: "Roboto, sans-serif" }}>
                    {displayPhone}
                  </span>
                </div>
              )}
              {socialLinksList.length > 0 && (
                <div className="flex items-start gap-2">
                  <Globe className="mt-1 h-4 w-4 flex-shrink-0 text-[#7f859d]" />
                  <div className="flex flex-col gap-1">
                    {socialLinksList.map(({ url }) => (
                      <a
                        key={url}
                        href={url.startsWith("http") ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#4162e7] hover:underline break-all"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mô tả bản thân */}
      {(displayBio || profile?.bio) && (
        <section className="border-t border-[#e2e8f0] pt-6 pb-6">
          <h3
            className="text-base font-medium text-[#3b3d48] mb-3"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {tProfile("bio")}
          </h3>
          <p
            className="text-sm text-[#3b3d48] whitespace-pre-wrap leading-relaxed"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {displayBio || profile?.bio || ""}
          </p>
        </section>
      )}

      {/* Thông tin nghề nghiệp */}
      <section className="border-t border-[#e2e8f0] pt-6 pb-6">
        <h3
          className="text-base font-medium text-[#3b3d48] mb-4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {tProfile("professionalInfo")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-[#7f859d] mb-1" style={{ fontFamily: "Roboto, sans-serif" }}>
              {tProfile("title")}
            </p>
            <p className="text-sm text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif" }}>
              {formData?.professionalTitle || profile?.professionalTitle || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#7f859d] mb-1" style={{ fontFamily: "Roboto, sans-serif" }}>
              {tProfile("yearsExperience")}
            </p>
            <p className="text-sm text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif" }}>
              {formData?.yearsExperience ?? profile?.yearsExperience ?? "—"}
            </p>
          </div>
        </div>

        {educations && educations.length > 0 && (
          <div className="mb-6 mt-2 pt-4 border-t border-[#f4f4f7]">
            <p className="text-base font-medium text-[#3b3d48] mb-3" style={{ fontFamily: "Roboto, sans-serif" }}>
              {tProfile("education")}
            </p>
            <div className="divide-y divide-[#f4f4f7]">
              {educations.map((edu: Education, index: number) => (
                <div key={edu.id || index} className="py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#7f859d] mb-1" style={{ fontFamily: "Roboto, sans-serif" }}>
                        {tProfile("educationSchoolLabel")}
                      </p>
                      <p className="text-sm text-[#0f172a]" style={{ fontFamily: "Roboto, sans-serif" }}>
                        {edu.school || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#7f859d] mb-1" style={{ fontFamily: "Roboto, sans-serif" }}>
                        {tProfile("educationDegreeLabel")}
                      </p>
                      <p className="text-sm text-[#0f172a]" style={{ fontFamily: "Roboto, sans-serif" }}>
                        {edu.degree || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {certificates && certificates.length > 0 && (
          <div className="space-y-4 mb-6 mt-2 pt-4 border-t border-[#f4f4f7]">
            {certificates.map((cert: Certificate, index: number) => (
              <div key={cert.id || index} className="p-3 rounded-lg bg-[#fafafa] border border-[#f4f4f7]">
                <p className="text-xs text-[#7f859d] mb-1" style={{ fontFamily: "Roboto, sans-serif" }}>
                  {tProfile("certificateNameLabel")}
                </p>
                <p className="text-sm text-[#3b3d48] mb-2" style={{ fontFamily: "Roboto, sans-serif" }}>
                  {cert.title || "—"}
                </p>
                {cert.imageUrl && (
                  <a
                    href={getAvatarUrl(cert.imageUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#4162e7] hover:bg-[#eceffd]"
                  >
                    <FileText className="h-4 w-4" />
                    <span style={{ fontFamily: "Roboto, sans-serif" }}>
                      {getFileNameFromUrl(getAvatarUrl(cert.imageUrl))}
                    </span>
                    <Download className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {galleryImages && galleryImages.length > 0 && (
          <div className="mt-2 pt-4 border-t border-[#f4f4f7]">
            <p className="text-xs text-[#7f859d] mb-2" style={{ fontFamily: "Roboto, sans-serif" }}>
              {tProfile("teachingImages")}
            </p>
            <div className="flex flex-wrap gap-2">
              {galleryImages.map((img: GalleryImage) => (
                <a
                  key={img.id}
                  href={getAvatarUrl(img.imageUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#4162e7] hover:bg-[#eceffd]"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="max-w-[120px] truncate" style={{ fontFamily: "Roboto, sans-serif" }}>
                    {getFileNameFromUrl(getAvatarUrl(img.imageUrl))}
                  </span>
                  <Download className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Cập nhật button */}
      <div className="flex justify-end pt-4 pb-2">
        <Button
          onClick={onUpdate}
          className="h-11 bg-[#4162e7] text-white hover:bg-[#3554d4] px-6 cursor-pointer"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {tProfile("update")}
        </Button>
      </div>
    </div>
  );
}
