"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2 } from "lucide-react";
import type { Education, Certificate } from "@/types/teacher.types";
import type { TeacherFormData } from "@/hooks/use-teacher-profile-settings";
import type { GalleryImage } from "@/services/apis/teacher-gallery.service";
import { useTranslations } from "next-intl";

interface ProfileProfessionalInfoProps {
  formData: TeacherFormData;
  educations: Education[];
  certificates: Certificate[];
  galleryImages: GalleryImage[];
  uploadingTeachingImages?: boolean;
  onUploadTeachingImages: (files: File[]) => void;
  onRemoveTeachingImage: (imageId: string) => void;
  onUpdateField: (field: keyof TeacherFormData, value: string) => void;
  onAddEducation: () => void;
  onRemoveEducation: (id: string, index: number) => void;
  onUpdateEducation: (id: string, data: { school: string; degree: string }) => void;
  onUpdateEducationLocal: (index: number, field: "school" | "degree", value: string) => void;
  onAddCertificate: () => void;
  onRemoveCertificate: (id: string, index: number) => void;
  onUploadCertificateImage: (certId: string, file: File) => void;
  onUpdateCertificate: (id: string, title: string) => void;
  onUpdateCertificateLocal: (index: number, title: string) => void;
  onRemoveCertificateImage: (certId: string) => void;
}

export function ProfileProfessionalInfo({
  formData,
  educations,
  certificates,
  galleryImages,
  uploadingTeachingImages,
  onUploadTeachingImages,
  onRemoveTeachingImage,
  onUpdateField,
  onAddEducation,
  onRemoveEducation,
  onUpdateEducation,
  onUpdateEducationLocal,
  onAddCertificate,
  onRemoveCertificate,
  onUploadCertificateImage,
  onUpdateCertificate,
  onUpdateCertificateLocal,
  onRemoveCertificateImage,
}: ProfileProfessionalInfoProps) {
  const tProfile = useTranslations("teacher.settings.profile");

  return (
    <div className="flex flex-col gap-[20px] border-t border-[#dbdde5] pt-[20px]">
      <p className="text-base font-medium text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif" }}>
        {tProfile("professionalInfo")}
      </p>

      {/* Chức danh và Số năm kinh nghiệm */}
      <div className="grid grid-cols-2 gap-3">
        <FormField label={tProfile("title")}>
          <Input
            className="h-[44px] rounded-[8px] border-[#f4f4f7] bg-[#fafafa]"
            value={formData.professionalTitle}
            onChange={(e) => onUpdateField("professionalTitle", e.target.value)}
            placeholder={tProfile("titlePlaceholder")}
          />
        </FormField>
        <FormField label={tProfile("yearsExperience")}>
          <Input
            className="h-[44px] rounded-[8px] border-[#f4f4f7] bg-[#fafafa]"
            type="number"
            value={formData.yearsExperience}
            onChange={(e) => onUpdateField("yearsExperience", e.target.value)}
            placeholder={tProfile("yearsExperiencePlaceholder")}
          />
        </FormField>
      </div>

      {/* Học vấn */}
      <EducationSection
        educations={educations}
        onAdd={onAddEducation}
        onRemove={onRemoveEducation}
        onUpdate={onUpdateEducation}
        onUpdateLocal={onUpdateEducationLocal}
      />

      {/* Chứng chỉ */}
      <CertificateSection
        certificates={certificates}
        onAdd={onAddCertificate}
        onRemove={onRemoveCertificate}
        onUploadImage={onUploadCertificateImage}
        onUpdate={onUpdateCertificate}
        onUpdateLocal={onUpdateCertificateLocal}
        onRemoveImage={onRemoveCertificateImage}
      />

      {/* Hình ảnh hoạt động giảng dạy */}
      <TeachingImagesSection
        images={galleryImages}
        onUpload={onUploadTeachingImages}
        onRemove={onRemoveTeachingImage}
        uploading={uploadingTeachingImages}
      />
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

interface EducationSectionProps {
  educations: Education[];
  onAdd: () => void;
  onRemove: (id: string, index: number) => void;
  onUpdate: (id: string, data: { school: string; degree: string }) => void;
  onUpdateLocal: (index: number, field: "school" | "degree", value: string) => void;
}

function EducationSection({ educations, onAdd, onRemove, onUpdate, onUpdateLocal }: EducationSectionProps) {
  const tProfile = useTranslations("teacher.settings.profile");

  return (
    <div className="flex flex-col gap-2">
      {educations.map((edu, index) => (
        <div key={edu.id || index} className="flex gap-3 items-end">
          <div className="flex-1 grid grid-cols-2 gap-3">
            <FormField label={tProfile("educationSchoolLabel")}>
              <Input
                className="h-[44px] rounded-[8px] border-[#f4f4f7] bg-[#fafafa]"
                value={edu.school}
                onChange={(e) => {
                  onUpdateLocal(index, "school", e.target.value);
                  if (edu.id) {
                    onUpdate(edu.id, { school: e.target.value, degree: edu.degree || "" });
                  }
                }}
              />
            </FormField>
            <FormField label={tProfile("educationDegreeLabel")}>
              <Input
                className="h-[44px] rounded-[8px] border-[#f4f4f7] bg-[#fafafa]"
                value={edu.degree || ""}
                onChange={(e) => {
                  onUpdateLocal(index, "degree", e.target.value);
                  if (edu.id) {
                    onUpdate(edu.id, { school: edu.school, degree: e.target.value });
                  }
                }}
              />
            </FormField>
          </div>
          <button
            onClick={() => edu.id && onRemove(edu.id, index)}
            className="h-[44px] w-[44px] flex items-center justify-center text-[#e35151] hover:bg-[#fee] rounded-[8px] cursor-pointer"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="h-11 border border-[#4162e7] bg-white text-[#4162e7] hover:bg-[#4162e7] hover:text-white cursor-pointer"
      >
        <Plus className="h-5 w-5 mr-2" />
        {tProfile("addEducation")}
      </Button>
    </div>
  );
}

interface CertificateSectionProps {
  certificates: Certificate[];
  onAdd: () => void;
  onRemove: (id: string, index: number) => void;
  onUploadImage: (certId: string, file: File) => void;
  onUpdate: (id: string, title: string) => void;
  onUpdateLocal: (index: number, title: string) => void;
  onRemoveImage: (certId: string) => void;
}

function CertificateSection({
  certificates,
  onAdd,
  onRemove,
  onUploadImage,
  onUpdate,
  onUpdateLocal,
  onRemoveImage,
}: CertificateSectionProps) {
  const tProfile = useTranslations("teacher.settings.profile");

  return (
    <div className="flex flex-col gap-[8px]">
      {certificates.map((cert, index) => (
        <div key={cert.id || index} className="flex flex-col gap-[8px]">
          <div className="flex gap-[16px] items-end">
            <div className="flex-1 flex flex-col gap-[4px]">
              <label
                className="text-[14px] leading-[20px] text-[#7f859d]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
              >
                {tProfile("certificateNameLabel")}
              </label>
              <Input
                className="h-[44px] rounded-[8px] border-[#f4f4f7] bg-[#fafafa]"
                value={cert.title}
                onChange={(e) => {
                  onUpdateLocal(index, e.target.value);
                  if (cert.id) {
                    onUpdate(cert.id, e.target.value);
                  }
                }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-[4px] min-h-0 overflow-visible">
              <label
                className="text-[14px] leading-[20px] text-[#7f859d] flex-shrink-0"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
              >
                {tProfile("certificateImageLabel")}
              </label>
              <div className="flex items-center gap-2 min-h-[48px] overflow-visible py-0.5">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  id={`cert-img-${cert.id || index}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && cert.id) {
                      onUploadImage(cert.id, file);
                    }
                  }}
                />
                <label htmlFor={`cert-img-${cert.id || index}`} className="flex-shrink-0 overflow-visible">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 min-h-[44px] rounded-lg border-2 border-[#4162e7] bg-[#4162e7] text-white hover:bg-[#3556d4] hover:border-[#3556d4] cursor-pointer px-4 box-border"
                    asChild
                  >
                    <span>{tProfile("certificateChooseFile")}</span>
                  </Button>
                </label>
                <span className="text-sm text-[#7f859d] truncate min-w-0">
                  {tProfile("certificateImagePlaceholder")}
                </span>
              </div>
            </div>
            <button
              onClick={() => cert.id && onRemove(cert.id, index)}
              className="h-[44px] w-[44px] flex items-center justify-center text-[#e35151] hover:bg-[#fee] rounded-[8px] cursor-pointer"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          {cert.imageUrl && (
            <div className="bg-[#f4f4f7] flex items-center justify-between px-2 py-1.5 rounded">
              <div className="flex items-center gap-1">
                <span className="text-sm text-[#3b3d48]">{cert.imageUrl.split("/").pop() || "certificate.jpg"}</span>
              </div>
              <button onClick={() => cert.id && onRemoveImage(cert.id)} className="text-[#3b3d48]">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="h-11 border border-[#4162e7] bg-white text-[#4162e7] hover:bg-[#4162e7] hover:text-white cursor-pointer"
      >
        <Plus className="h-5 w-5 mr-2" />
        {tProfile("addCertificate")}
      </Button>
    </div>
  );
}

interface TeachingImagesSectionProps {
  images: GalleryImage[];
  onUpload: (files: File[]) => void;
  onRemove: (imageId: string) => void;
  uploading?: boolean;
}

function TeachingImagesSection({ images, onUpload, onRemove, uploading }: TeachingImagesSectionProps) {
  const tProfile = useTranslations("settings.profile");
  const tFile = useTranslations("common.fileUpload");
  const tCommon = useTranslations("common");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onUpload(Array.from(files));
      e.target.value = "";
    }
  };

  const handleBrowseClick = () => {
    if (!uploading) inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif" }}>
        {tProfile("teachingImages")}
      </label>
      <div className="flex items-center gap-3">
        <Input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Button
          type="button"
          onClick={handleBrowseClick}
          className="h-10 bg-[#4162e7] text-white hover:bg-[#3554d4] px-4 cursor-pointer disabled:opacity-60"
          disabled={uploading}
        >
          {uploading ? tProfile("uploading") : tFile("browse")}
        </Button>
        <span className="text-sm text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif" }}>
          {tProfile("teachingImagesPlaceholder")}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group rounded overflow-hidden border border-[#e2e8f0] w-20 h-20 flex-shrink-0"
          >
            <img
              src={img.imageUrl}
              alt={img.title || tProfile("teachingImages")}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(img.id)}
              className="absolute top-0.5 right-0.5 p-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={tCommon("delete")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
