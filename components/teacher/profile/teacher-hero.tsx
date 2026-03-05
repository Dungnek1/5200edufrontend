"use client";

import { useState } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";

import { CertificateModal } from "@/components/modals/certificate-modal";
import { Teacher } from "@/types/teacher";
import { getAvatarUrl } from "@/utils/media";




interface TeacherHeroProps {
  teacher: Teacher
}

export function TeacherHero({ teacher }: TeacherHeroProps) {
  const t = useTranslations("page.teachers");
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<{
    name: string;
    imageUrl: string | null;
  } | null>(null);

  const reviewsCount =
    teacher.stats.reviews || Math.floor(teacher.stats.students * 0.3);

  const getSocialLink = (platform: string) => {
    return (
      teacher.socialLinks?.find(
        (link) => link.platform.toLowerCase() === platform.toLowerCase(),
      )?.url || "#"
    );
  };

  return (
    <section className="w-full   overflow-x-hidden">

      <div className="lg:hidden flex flex-col gap-4 sm:gap-5">

        <div className="absolute left-1/2 -translate-x-1/2 -top-32 sm:-top-40 w-[375px] h-[375px] bg-gradient-to-br from-[#eceffd] to-[#d0d9ff] rounded-full opacity-50 -z-10" />

        <div className="flex justify-center pt-8 sm:pt-12 relative z-10">
          <div className="relative w-full h-full  overflow-hidden bg-gray-200 flex-shrink-0">
            <img
              src={getAvatarUrl(teacher.avatarUrl)}
              alt={teacher.name}

              className="object-cover  h-full  w-full"

            />
          </div>
        </div>


        <div className="flex gap-3 items-center justify-center">
          <a
            href={getSocialLink("facebook")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Facebook className="w-4 h-4 text-[#8c92ac]" />
          </a>
          <a
            href={getSocialLink("instagram")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#8c92ac]" />
          </a>
          <a
            href={getSocialLink("linkedin")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Linkedin className="w-4 h-4 text-[#8c92ac]" />
          </a>
          <a
            href={getSocialLink("youtube")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Youtube className="w-4 h-4 text-[#8c92ac]" />
          </a>
        </div>

        <div className="flex-1 overflow-hidden  justify-between">

          <div className="flex items-center gap-2 ">
            <h3 className="text-[16px] font-semibold text-[#3B3D48] truncate">
              {teacher.name}
            </h3>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-1_1899_79557" fill="white">
                <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" />
              </mask>
              <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="url(#paint0_linear_1899_79557)" />
              <path d="M10 20V18C5.58172 18 2 14.4183 2 10H0H-2C-2 16.6274 3.37258 22 10 22V20ZM20 10H18C18 14.4183 14.4183 18 10 18V20V22C16.6274 22 22 16.6274 22 10H20ZM10 0V2C14.4183 2 18 5.58172 18 10H20H22C22 3.37258 16.6274 -2 10 -2V0ZM10 0V-2C3.37258 -2 -2 3.37258 -2 10H0H2C2 5.58172 5.58172 2 10 2V0Z" fill="white" mask="url(#path-1-inside-1_1899_79557)" />
              <path fillRule="evenodd" clipRule="evenodd" d="M14.024 7.17567C14.1364 7.28819 14.1996 7.44077 14.1996 7.59987C14.1996 7.75897 14.1364 7.91156 14.024 8.02407L9.22396 12.8241C9.11144 12.9366 8.95885 12.9997 8.79976 12.9997C8.64066 12.9997 8.48807 12.9366 8.37556 12.8241L5.97556 10.4241C5.86626 10.3109 5.80578 10.1593 5.80715 10.002C5.80852 9.84471 5.87162 9.69423 5.98286 9.58298C6.09411 9.47174 6.2446 9.40863 6.40192 9.40727C6.55923 9.4059 6.71079 9.46638 6.82396 9.57567L8.79976 11.5515L13.1756 7.17567C13.2881 7.06319 13.4407 7 13.5998 7C13.7589 7 13.9114 7.06319 14.024 7.17567Z" fill="white" />
              <defs>
                <linearGradient id="paint0_linear_1899_79557" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4162E7" />
                  <stop offset="1" stopColor="#AD46FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {teacher.bio && (
            <p className="text-[14px] text-[#3B3D48] line-clamp-1">
              {teacher.bio}
            </p>
          )}

        </div>


        <div className='flex flex-col gap-[8px]'>
          <p className="text-[#3B3D48] text-[24px] font-medium">
            {t("educationAndCertificates")}
          </p>
          {/* <div>
            <p>{teacher.education.map((edu: any, index: number) => (
              <span key={index} className='text-[#3B3D48] text-[16px]'>{edu.degree} {edu.department}</span>
            ))}</p>
            <p>{teacher.education.map((edu: any, index: number) => (
              <span key={index} className='text-[#8C92AC] text-[14px]'>{edu.school}</span>
            ))}</p>
          </div> */}
        </div>

        <div className='flex flex-col gap-[8px]'>
          <p className='text-[#2E46A4] text-[16px]'>
            {t("trainingCertificates")}
          </p>

          <p>{teacher?.certificates && teacher.certificates.map((cert: any, index: number) => (
            <span key={index} className='text-[#8C92AC] text-[14px]'>{cert.name}</span>
          ))}</p>

        </div>
        {/* Stats - Horizontal */}
        <div className="flex items-center justify-around border-t border-[#dbdde5] pt-4 sm:pt-5">
          <div className="flex flex-col items-center gap-1">
            <p
              className="text-xl sm:text-2xl font-bold text-[#3b3d48]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {teacher.stats.students.toLocaleString()}
            </p>
            <p
              className="text-xs sm:text-sm font-normal text-[#8c92ac]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              học viên
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p
              className="text-xl sm:text-2xl font-bold text-[#3b3d48]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {reviewsCount.toLocaleString()}
            </p>
            <p
              className="text-xs sm:text-sm font-normal text-[#8c92ac]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              đánh giá
            </p>
          </div>
        </div>
      </div>


      <div className="hidden lg:flex lg:gap-5 lg:items-center lg:justify-start mx-auto max-w-[1520px]">

        <div className="flex flex-col gap-5 items-center justify-center flex-shrink-0">

          <div className="relative h-full w-full flex items-center justify-center">
            <div className="relative w-[432px] h-[324px] overflow-hidden flex items-center justify-center bg-gray-100">
              <img
                src={getAvatarUrl(teacher.avatarUrl)}
                alt={teacher.name}

                className="object-cover h-[324px] w-[432px]"

              />
            </div>
          </div>


          <div className="flex gap-3 items-start">
            <a
              href={getSocialLink("facebook")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-[#4162e7] rounded-lg flex items-center justify-center p-px hover:bg-blue-50 transition-colors"
            >
              <Facebook className="w-5 h-5 text-[#4162e7]" />
            </a>
            <a
              href={getSocialLink("twitter")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-[#4162e7] rounded-lg flex items-center justify-center p-px hover:bg-blue-50 transition-colors"
            >
              <Twitter className="w-4 h-4 text-[#4162e7]" />
            </a>
            <a
              href={getSocialLink("linkedin")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-[#4162e7] rounded-lg flex items-center justify-center p-px hover:bg-blue-50 transition-colors"
            >
              <Linkedin className="w-5 h-5 text-[#4162e7]" />
            </a>
            <a
              href={getSocialLink("instagram")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-[#4162e7] rounded-lg flex items-center justify-center p-px hover:bg-blue-50 transition-colors"
            >
              <Instagram className="w-5 h-5 text-[#4162e7]" />
            </a>
            <a
              href={getSocialLink("youtube")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-[#4162e7] rounded-lg flex items-center justify-center p-px hover:bg-blue-50 transition-colors"
            >
              <Youtube className="w-5 h-5 text-[#4162e7]" />
            </a>
          </div>
        </div>


        <div className="flex flex-col gap-5 items-start justify-center flex-1 min-w-[500px] ml-16">

          <div className="flex flex-col gap-3 items-start w-full">
            <h1
              className="text-[24px] font-bold text-black leading-tight w-full"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {teacher.name}
            </h1>
            <div
              className="text-[16px]  font-normal text-black leading-6 w-full"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {teacher.bio ? (
                <p>{teacher.bio}</p>
              ) : (
                <p>{t("noBio")}</p>
              )}
            </div>
          </div>


          {teacher.educations && teacher.educations.length > 0 && (
            <div className="flex flex-col gap-2 items-start w-full">
                <h2
                  className="text-[24px] text-[#3B3D48] font-medium leading-8"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {t("education")}
                </h2>
              {teacher.educations.map((edu, index) => {
                return (
                  <div key={index} className="flex flex-col items-start w-full">
                    <p
                      className="text-[16px] font-medium text-[#3B3D48] leading-6 w-full"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {edu.degree} {edu.department}
                    </p>

                    <p
                      className="text-[14px] font-normal text-[#8C92AC] leading-5 w-full"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {edu.school}
                    </p>

                  </div>
                );
              })}
            </div>
          )}


          <div className="flex flex-col gap-2 items-start w-full">
            <h2
              className="text-[16px] text-[#2E46A4] font-medium leading-8"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("trainingCertificates")}
            </h2>

            {teacher.certificates && teacher.certificates.length > 0 ? (
              teacher.certificates.map((cert, index) => {


                return (
                  <div key={index} className="flex flex-col items-start w-full">
                    {cert.fileUrl ? (
                      <button
                        onClick={() => {
                          setSelectedCertificate({
                            name: cert.name,
                            imageUrl: cert.fileUrl || null,
                          });
                          setShowCertificate(true);
                        }}
                        className="text-[16px] font-medium text-[#8C92AC] leading-6 w-full text-left hover:underline cursor-pointer"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {cert.name}
                      </button>
                    ) : (
                      <p
                        className="text-[14px] font-medium text-[#8C92AC] leading-6 w-full"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {cert.name}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p
                className="text-base font-normal text-[#8c92ac] leading-6 w-full"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("noCertificates")}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-5 items-start">
            <div className="border border-[#8c92ac] rounded flex flex-col gap-1 items-center px-3 py-1">
              <p
                className="text-xl font-medium text-[#3b3d48] leading-[30px]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {teacher.stats.students.toLocaleString()}
              </p>
              <p
                className="text-sm font-normal text-[#8c92ac] leading-5"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("students")}
              </p>
            </div>
            <div className="border border-[#8c92ac] rounded flex flex-col gap-1 items-center px-3 py-1">
              <p
                className="text-xl font-medium text-[#3b3d48] leading-[30px]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {reviewsCount.toLocaleString()}
              </p>
              <p
                className="text-sm font-normal text-[#8c92ac] leading-5"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("reviews")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
        <CertificateModal
        open={showCertificate}
        onClose={() => {
          setShowCertificate(false);
          setSelectedCertificate(null);
        }}
        certificateTitle={selectedCertificate?.name || t("certificateDefaultTitle")}
        certificateImage={
          selectedCertificate?.imageUrl || null
        }
      />
    </section>
  );
}
