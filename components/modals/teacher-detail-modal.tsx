"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { X, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Teacher } from "@/types/teacher";
import { getAvatarUrl } from "@/utils/media";



interface TeacherDetailModalProps {
  open: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

export function TeacherDetailModal({
  open,
  onClose,
  teacher,
}: TeacherDetailModalProps) {
  const t = useTranslations();

  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] p-0 bg-white rounded-xl sm:rounded-2xl overflow-hidden [&>button]:hidden">
        <div className="relative w-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 sm:right-6 top-4 sm:top-6 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:opacity-70 transition-opacity z-10 bg-white/80 rounded-full"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#3b3d48]" />
          </button>

          {/* Header Section - Mobile responsive */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3b3d48] flex items-center gap-2">
                {teacher.name}
                {/* Verification Badge */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="path-1-inside-1_3051_119849" fill="white">
                    <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" />
                  </mask>
                  <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="url(#paint0_linear_3051_119849)" />
                  <path d="M0 10M20 10M20 10M0 10M10 0M20 10M10 20M0 10M10 20V18C5.58172 18 2 14.4183 2 10H0H-2C-2 16.6274 3.37258 22 10 22V20ZM20 10H18C18 14.4183 14.4183 18 10 18V20V22C16.6274 22 22 16.6274 22 10H20ZM10 0V2C14.4183 2 18 5.58172 18 10H20H22C22 3.37258 16.6274 -2 10 -2V0ZM10 0V-2C3.37258 -2 -2 3.37258 -2 10H0H2C2 5.58172 5.58172 2 10 2V0Z" fill="white" mask="url(#path-1-inside-1_3051_119849)" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0215 7.17579C14.134 7.28831 14.1972 7.4409 14.1972 7.59999C14.1972 7.75909 14.134 7.91168 14.0215 8.02419L9.22151 12.8242C9.109 12.9367 8.95641 12.9999 8.79731 12.9999C8.63822 12.9999 8.48563 12.9367 8.37311 12.8242L5.97311 10.4242C5.86382 10.311 5.80334 10.1595 5.80471 10.0022C5.80608 9.84484 5.86918 9.69435 5.98042 9.5831C6.09167 9.47186 6.24216 9.40876 6.39947 9.40739C6.55679 9.40602 6.70835 9.4665 6.82151 9.57579L8.79731 11.5516L13.1731 7.17579C13.2856 7.06331 13.4382 7.00012 13.5973 7.00012C13.7564 7.00012 13.909 7.06331 14.0215 7.17579Z" fill="white" />
                  <defs>
                    <linearGradient id="paint0_linear_3051_119849" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#4162E7" />
                      <stop offset="1" stop-color="#AD46FF" />
                    </linearGradient>
                  </defs>
                </svg>

              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#3b3d48] mt-1 sm:mt-2">
              {teacher.title || teacher.bio || ""}
            </p>
          </div>

          {/* Image Section - Mobile responsive */}
          <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden bg-gray-100">
            <img
              src={getAvatarUrl(teacher.avatarUrl)}
              alt={teacher.name || ""}
              className="object-cover w-full h-full"
              sizes="(max-width: 667px) 100vw, (max-width: 1024px) 600px, 700px"
            />
          </div>

          {/* Education and Certificates Section - Mobile responsive */}
          {((teacher.education && teacher.education.length > 0) || (teacher.achievements && teacher.achievements.length > 0)) && (
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#3b3d48] mb-4 sm:mb-6">
                {t("page.teachers.educationAndCertificates")}
              </h3>

              <div className="space-y-4 sm:space-y-5">
                {/* Education */}
                {teacher.education && teacher.education.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    {teacher.education.map((edu, index) => (
                      <div key={index} className="flex flex-col gap-1 sm:gap-2">
                        <p className="text-sm sm:text-base font-bold text-[#3b3d48]">
                          {typeof edu === "string" ? edu : edu.degree}
                        </p>
                        {typeof edu !== "string" && edu.institution && (
                          <p className="text-xs sm:text-sm text-[#8c92ac]">
                            {edu.institution}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Certificates */}
                {/* {teacher.achievements && teacher.achievements.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    {teacher.achievements.map((cert, index) => (
                      <div key={index} className="flex flex-col gap-1 sm:gap-2">
                        <p className="text-sm sm:text-base font-bold text-[#4162e7]">
                          {typeof cert === "string" ? cert : cert}
                        </p>
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
