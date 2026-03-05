"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { userService } from "@/services/apis";
import consultationService from "@/services/apis/consultation.service";
import { CourseSection } from "@/components/home/course-section";
import { CommunityEventsSection } from "@/components/home/community-events-section";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/shared/logo";
import { CourseDetailReviews } from "@/components/courses/course-detail-reviews";


export default function LocaleHomePage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const t = useTranslations();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [consultationFormData, setConsultationFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [consultationLoading, setConsultationLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationLoading(true);
    try {
      const response = await consultationService.submitConsultation({
        fullName: consultationFormData.name,
        email: consultationFormData.email,
        phone: consultationFormData.phone,
      });
      if (response.status === "success") {
        toast.success(t("page.home.consultation.successMessage"));
        setConsultationFormData({ name: "", email: "", phone: "" });
      } else {
        toast.error(response.message || t("page.home.consultation.errorGeneric"));
      }
    } catch (err) {
      toast.error(t("page.home.consultation.errorSubmit"));
    } finally {
      setConsultationLoading(false);
    }
  };



  const heroSlides = [
    {
      id: 1,
      heading1: t("page.home.hero.slide1.heading1"),
      heading2: t("page.home.hero.slide1.heading2"),
      heading2Color: "#2E48E8",
      buttonText: t("page.home.hero.slide1.button"),
      buttonAction: () => router.push(`/${locale}/explore`),
      showStats: true,
      imageSrc: "/og-images/Frame 2147227357.svg",
    },
    {
      id: 2,
      heading1: t("page.home.hero.slide2.heading1"),
      heading2: t("page.home.hero.slide2.heading2"),
      heading2Color: "#FA0605", // Red
      buttonText: t("page.home.hero.slide2.button"),
      buttonAction: () => router.push(`/${locale}/explore`),
      showStats: false,
      imageSrc: "/og-images/PIC2.svg",
    },
    {
      id: 3,
      heading1: t("page.home.hero.slide3.heading1"),
      heading2: t("page.home.hero.slide3.heading2"),
      heading2Color: "#FA0605", // Red
      buttonText: t("page.home.hero.slide3.button"),
      buttonAction: () => router.push(`/${locale}/become-teacher`),
      showStats: false,
      imageSrc: "/og-images/PIC3.svg",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <section className="mx-auto flex max-w-[1520px] flex-col gap-5 py-4 pb-6 md:flex-row md:items-center md:gap-12 sm:py-6 md:py-8 md:pb-16 lg:py-8 lg:pb-20 px-4 sm:px-6 lg:px-16 relative">

        <div className="space-y-6 min-h-[220px] md:flex-1 md:max-w-[600px] md:space-y-8 relative md:min-h-[500px]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >

              <div className="space-y-6 md:space-y-8">
                <h1 className="font-['Be Vietnam Pro',sans-serif] text-[32px] font-bold leading-[40px] text-[#333333] md:text-[36px] md:leading-[44px] lg:text-[56px] lg:leading-[64px]">
                  <span>{slide.heading1}</span>
                  <br />
                  <span style={{ color: slide.heading2Color }}>
                    {slide.heading2}
                  </span>
                </h1>

                <button
                  onClick={slide.buttonAction}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#FF6633] px-6 text-sm font-bold text-white shadow-[0px_4px_10px_rgba(0,0,0,0.1)] transition-shadow hover:shadow-[0px_6px_15px_rgba(255,102,51,0.3)] md:h-14 md:w-auto md:px-8 md:text-base cursor-pointer mt-4 md:mt-0"
                >
                  {slide.buttonText}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>


              {slide.showStats && (
                <div className="mt-2 sm:mt-4 md:mt-6 grid grid-cols-3 gap-4 font-normal text-[#333333] text-sm md:gap-8 md:text-base max-w-md">
                  <div>
                    <p className="text-[#FF6633] text-[28px] font-bold leading-[36px] md:text-[40px] md:leading-[48px]">
                      {t("page.home.hero.stats.courses.value")}
                    </p>
                    <p className="text-xs md:text-base">{t("page.home.hero.stats.courses.label")}</p>
                  </div>
                  <div>
                    <p className="text-[#FF6633] text-[28px] font-bold leading-[36px] md:text-[40px] md:leading-[48px]">
                      {t("page.home.hero.stats.students.value")}
                    </p>
                    <p className="text-xs md:text-base">{t("page.home.hero.stats.students.label")}</p>
                  </div>
                  <div>
                    <p className="text-[#FF6633] text-[28px] font-bold leading-[36px] md:text-[40px] md:leading-[48px]">
                      {t("page.home.hero.stats.teachers.value")}
                    </p>
                    <p className="text-xs md:text-base">{t("page.home.hero.stats.teachers.label")}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>


        <div className="mt-4 md:mt-0 md:flex-1 flex items-center justify-center relative">
          <div className="relative w-full max-w-[618px] aspect-[618/452] flex items-center justify-center">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                <img
                  src={slide.imageSrc}
                  alt={`Hero slide ${slide.id}`}
                  className="w-full h-full object-contain"
                />


                {slide.id === 2 && (
                  <>

                    <div className="absolute top-16 -right-4 md:top-20 md:-right-8 lg:top-24 lg:-right-12 bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.1)] p-3 md:p-4 hidden md:flex items-center gap-3 md:gap-4 z-20">

                      <div className="flex -space-x-2 shrink-0">
                        <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                          <img
                            src="/images/figma/Frame 2147227180.png"
                            alt="Student 1"

                            className="object-cover"

                          />
                        </div>
                        <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                          <img
                            src="/images/figma/Frame 2147227180.png"
                            alt="Student 2"

                            className="object-cover"

                          />
                        </div>
                        <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                          <img
                            src="/images/figma/Frame 2147227180.png"
                            alt="Student 3"

                            className="object-cover"

                          />
                        </div>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <p className="text-sm md:text-base font-semibold text-[#3b3d48] leading-tight whitespace-nowrap">
                          {t("page.home.hero.overlay.studentsOnlineValue")}
                        </p>
                        <p className="text-xs md:text-sm text-[#8c92ac] leading-tight whitespace-nowrap">
                          {t("page.home.hero.overlay.studentsOnlineLabel")}
                        </p>
                      </div>
                    </div>


                    <div className="absolute bottom-16 -left-6 md:bottom-20 md:-left-4 lg:bottom-24 lg:-left-2 bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.1)] p-3 md:p-4 hidden md:flex items-center gap-3 md:gap-4 z-20">

                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#4162e7] flex items-center justify-center shrink-0">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 md:w-6 md:h-6"
                        >
                          <path
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      {/* Text */}
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm md:text-base font-semibold text-[#3b3d48] leading-tight">
                          {t("page.home.hero.overlay.registeredThisMonthValue")}
                        </p>
                        <p className="text-xs md:text-sm text-[#8c92ac] leading-tight">
                          {t("page.home.hero.overlay.registeredThisMonthLabel")}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      <div className="flex items-center justify-center gap-2 mt-2 mb-8 md:mb-12 lg:mb-16">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === index ? "bg-[#2E48E8] w-6" : "bg-[#D3D3D3] w-2"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>


      <section className="bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-16">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-6 md:gap-8">
          <div className="flex items-center justify-center gap-2">
            <p className="font-['Be Vietnam Pro',sans-serif] text-center text-xl font-medium text-[#3b3d48] md:text-2xl">
              {t("page.home.whyUs.title")}
            </p>
            <Logo variant="text" className="h-[32px]" />

          </div>

          <div className="grid gap-4 grid-cols-1 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 text-center shadow-sm flex flex-col gap-[18px]">
              <div className="max-w-full">
                <img
                  src="/images/landing-01.png"
                  alt={t("page.home.whyUs.expertInstructors.title")}
                  className=" min-h-[180px] mx-auto"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#3b3d48]">
                {t("page.home.whyUs.expertInstructors.title")}
              </h3>
              <p className="text-sm text-[#8c92ac]">
                {t("page.home.whyUs.expertInstructors.description")}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 text-center shadow-sm flex flex-col gap-[18px]">
              <div className="max-w-full">
                <img
                  src="/images/landing-02.png"
                  alt={t("page.home.whyUs.flexibleLearning.title")}

                  className=" min-h-[180px] mx-auto"
                />
              </div>
              <h3 className=" text-lg font-semibold text-[#3b3d48]">
                {t("page.home.whyUs.flexibleLearning.title")}
              </h3>
              <p className="text-sm text-[#8c92ac]">
                {t("page.home.whyUs.flexibleLearning.description")}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 text-center shadow-sm flex flex-col gap-[18px]">
              <div className="max-w-full">
                <img
                  src="/images/landing-03.png"
                  alt={t("page.home.whyUs.trustedPlatform.title")}
                  className=" min-h-[180px] mx-auto"
                />
              </div>
              <h3 className=" text-lg font-semibold text-[#3b3d48]">
                {t("page.home.whyUs.trustedPlatform.title")}
              </h3>
              <p className="text-sm text-[#8c92ac]">
                {t("page.home.whyUs.trustedPlatform.description")}
              </p>
            </div>
          </div>
        </div>
      </section>


      <section
        className="bg-[#fafafa] px-4 pb-12 sm:px-6 lg:px-16"
        id="landing-courses"
      >
        <div className="mx-auto max-w-[1520px]">
          <CourseSection />
        </div>

      </section>



      <section className="relative bg-white py-12 px-4 md:py-16 md:px-6 lg:py-20 lg:px-16 overflow-x-hidden mb-12 md:mb-16 lg:mb-20">
        {/* Geometric Patterns Background - SVG from Figma */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/images/CTAsectionbg.svg"
            alt="Background patterns"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex max-w-[896px] flex-col items-center gap-4 px-4 md:gap-5 md:px-6 lg:gap-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6633] px-4 py-2 md:gap-2 md:px-5 md:py-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.34106 1.87605C7.36962 1.72312 7.45077 1.58499 7.57045 1.4856C7.69014 1.3862 7.84081 1.33179 7.99639 1.33179C8.15196 1.33179 8.30264 1.3862 8.42232 1.4856C8.54201 1.58499 8.62316 1.72312 8.65172 1.87605L9.35239 5.58138C9.40215 5.84482 9.53017 6.08713 9.71974 6.2767C9.90931 6.46627 10.1516 6.59429 10.4151 6.64405L14.1204 7.34472C14.2733 7.37328 14.4114 7.45443 14.5108 7.57412C14.6102 7.6938 14.6647 7.84447 14.6647 8.00005C14.6647 8.15563 14.6102 8.3063 14.5108 8.42599C14.4114 8.54567 14.2733 8.62682 14.1204 8.65538L10.4151 9.35605C10.1516 9.40581 9.90931 9.53383 9.71974 9.7234C9.53017 9.91297 9.40215 10.1553 9.35239 10.4187L8.65172 14.1241C8.62316 14.277 8.54201 14.4151 8.42232 14.5145C8.30264 14.6139 8.15196 14.6683 7.99639 14.6683C7.84081 14.6683 7.69014 14.6139 7.57045 14.5145C7.45077 14.4151 7.36962 14.277 7.34106 14.1241L6.64039 10.4187C6.59062 10.1553 6.4626 9.91297 6.27304 9.7234C6.08347 9.53383 5.84115 9.40581 5.57772 9.35605L1.87239 8.65538C1.71946 8.62682 1.58133 8.54567 1.48193 8.42599C1.38254 8.3063 1.32812 8.15563 1.32812 8.00005C1.32812 7.84447 1.38254 7.6938 1.48193 7.57412C1.58133 7.45443 1.71946 7.37328 1.87239 7.34472L5.57772 6.64405C5.84115 6.59429 6.08347 6.46627 6.27304 6.2767C6.4626 6.08713 6.59062 5.84482 6.64039 5.58138L7.34106 1.87605Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.3359 1.33325V3.99992" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.6667 2.66675H12" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2.66927 14.6667C3.40565 14.6667 4.0026 14.0697 4.0026 13.3333C4.0026 12.597 3.40565 12 2.66927 12C1.93289 12 1.33594 12.597 1.33594 13.3333C1.33594 14.0697 1.93289 14.6667 2.66927 14.6667Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <p
              className="leading-[20px] text-white text-sm md:text-base font-medium"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {t("page.home.cta.badge")}
            </p>
          </div>

          {/* Heading */}
          <h2
            className="text-center font-bold text-[24px] leading-[32px] px-4 md:text-[32px] md:leading-[40px] lg:text-[40px] lg:leading-[48px]"
            style={{ fontFamily: "Arial, sans-serif", fontWeight: 700 }}
          >
            <span className="text-[#2E48E8]">
              {t("page.home.ctaBecomeTeacher.headingPart1")}
            </span>
            <span className="text-[#FA0605]">
              {t("page.home.ctaBecomeTeacher.headingPart2")}
            </span>
            <span className="text-[#2E48E8]">
              {t("page.home.ctaBecomeTeacher.headingPart3")}
            </span>
          </h2>

          {/* Description */}
          <p
            className="text-center text-[#3b3d48] text-base leading-[24px] max-w-full px-4 md:text-[16px] md:leading-[26px] md:max-w-[630px] lg:text-[18px] lg:leading-[28px]"
            style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
          >
            {t("page.home.ctaBecomeTeacher.description")}
          </p>

          {/* Button */}
          <button
            onClick={() => router.push(`/${locale}/become-teacher`)}
            className="bg-[#4162e7] flex items-center justify-center gap-2 h-[44px] px-6 py-2 rounded-lg hover:bg-[#3554d4] transition-colors cursor-pointer shadow-md"
          >
            <span
              className="text-sm font-semibold leading-[20px] text-white whitespace-nowrap"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 600 }}
            >
              {t("page.home.ctaBecomeTeacher.button")}
            </span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.0234 4.94165L17.0818 9.99998L12.0234 15.0583" stroke="#FAFAFA" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2.91406 10H16.9391" stroke="#FAFAFA" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>


          </button>
        </div>
      </section>

      {/* CONSULTATION FORM SECTION - Figma node 1899-79360 */}
      <section className="bg-white  px-4 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg bg-white">
            {/* Left - Illustration Panel */}
            <div className="relative w-full md:w-[40%] flex items-center justify-center min-h-[300px] md:min-h-[500px] bg-[#4163E7] overflow-hidden">
              <img
                src="/og-images/Frame.svg"
                alt="Consultation illustration"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right - Form Panel */}
            <div className="flex-1 bg-white p-6 md:p-8 lg:p-12 flex flex-col justify-center">
              {/* Title */}
              <h3
                className="text-[#0f172a] font-bold text-xl md:text-2xl lg:text-3xl leading-tight mb-6 md:mb-8"
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: 700,
                }}
              >
                {t("page.home.consultation.title")}
              </h3>

              {/* Form */}
              <form
                onSubmit={handleConsultationSubmit}
                className="flex flex-col gap-5 md:gap-6"
              >
                {/* Name Input */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-medium text-[#0f172a]"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {t("page.home.consultation.form.fullName")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("page.home.consultation.form.fullNamePlaceholder")}
                    className="h-[44px] rounded-lg border border-[#e5e7eb] bg-[#f8f8f8] px-4 text-sm text-[#0f172a] placeholder:text-[#9ca3af] focus:border-[#4162e7] focus:outline-none focus:ring-2 focus:ring-[#4162e7]/20"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                    value={consultationFormData.name}
                    onChange={(e) =>
                      setConsultationFormData({
                        ...consultationFormData,
                        name: e.target.value,
                      })
                    }
                    disabled={consultationLoading}
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(
                        t("page.home.consultation.form.requiredMessage")
                      );
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-medium text-[#0f172a]"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {t("page.home.consultation.form.email")}
                  </label>
                  <input
                    type="email"
                    placeholder={t("page.home.consultation.form.emailPlaceholder")}
                    className="h-[44px] rounded-lg border border-[#e5e7eb] bg-[#f8f8f8] px-4 text-sm text-[#0f172a] placeholder:text-[#9ca3af] focus:border-[#4162e7] focus:outline-none focus:ring-2 focus:ring-[#4162e7]/20 disabled:opacity-50"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                    value={consultationFormData.email}
                    onChange={(e) =>
                      setConsultationFormData({
                        ...consultationFormData,
                        email: e.target.value,
                      })
                    }
                    disabled={consultationLoading}
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(
                        t("page.home.consultation.form.requiredMessage")
                      );
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                </div>

                {/* Phone Input */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-medium text-[#0f172a]"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {t("page.home.consultation.form.phone")}
                  </label>
                  <input
                    type="tel"
                    placeholder={t("page.home.consultation.form.phonePlaceholder")}
                    className="h-[44px] rounded-lg border border-[#e5e7eb] bg-[#f8f8f8] px-4 text-sm text-[#0f172a] placeholder:text-[#9ca3af] focus:border-[#4162e7] focus:outline-none focus:ring-2 focus:ring-[#4162e7]/20 disabled:opacity-50"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                    value={consultationFormData.phone}
                    onChange={(e) =>
                      setConsultationFormData({
                        ...consultationFormData,
                        phone: e.target.value,
                      })
                    }
                    disabled={consultationLoading}
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(
                        t("page.home.consultation.form.requiredMessage")
                      );
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                </div>

                {/* Submit Button - Centered */}
                <div className="flex justify-center mt-2">
                  <button
                    type="submit"
                    disabled={consultationLoading}
                    className={`h-[44px] flex items-center justify-center gap-2 rounded-lg bg-[#4162e7] px-6 py-2 text-sm font-semibold text-white transition-colors shadow-md ${consultationLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3554d4]"}`}
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5 14.1667V10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10V14.1667" stroke="#C4CEF8" strokeWidth="1.2" />
                      <path d="M18.3359 12.9167V14.5834" stroke="#C4CEF8" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M1.66406 12.9167V14.5834" stroke="#C4CEF8" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M6.66667 11.5372C6.66667 10.9002 6.66667 10.5817 6.52105 10.3602C6.44778 10.2488 6.35051 10.1567 6.237 10.0913C6.01143 9.96127 5.70677 9.99131 5.09745 10.0514C4.07073 10.1526 3.55736 10.2032 3.18948 10.4804C3.00329 10.6206 2.84698 10.7994 2.73038 11.0056C2.5 11.4129 2.5 11.9496 2.5 13.023V14.3277C2.5 15.3904 2.5 15.9218 2.73498 16.3321C2.82293 16.4857 2.93317 16.6242 3.0618 16.7428C3.40544 17.0595 3.90703 17.1584 4.91023 17.3562C5.6162 17.4954 5.96918 17.565 6.2297 17.4184C6.32583 17.3643 6.4108 17.2911 6.47977 17.2028C6.66667 16.9637 6.66667 16.5898 6.66667 15.842V11.5372Z" stroke="#C4CEF8" strokeWidth="1.5" />
                      <path d="M13.3359 11.5372C13.3359 10.9002 13.3359 10.5817 13.4816 10.3602C13.5548 10.2488 13.6521 10.1567 13.7656 10.0913C13.9912 9.96127 14.2958 9.99131 14.9052 10.0514C15.9319 10.1526 16.4452 10.2032 16.8131 10.4804C16.9993 10.6206 17.1556 10.7994 17.2722 11.0056C17.5026 11.4129 17.5026 11.9496 17.5026 13.023V14.3277C17.5026 15.3904 17.5026 15.9218 17.2676 16.3321C17.1797 16.4857 17.0694 16.6242 16.9408 16.7428C16.5972 17.0595 16.0956 17.1584 15.0924 17.3562C14.3864 17.4954 14.0334 17.565 13.7729 17.4184C13.6768 17.3643 13.5918 17.2911 13.5228 17.2028C13.3359 16.9637 13.3359 16.5898 13.3359 15.842V11.5372Z" stroke="#C4CEF8" strokeWidth="1.5" />
                    </svg>

                    <span>{consultationLoading ? t("page.home.consultation.submitSending") : t("page.home.consultation.form.submit")}</span>
                    {!consultationLoading && (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.0234 4.94165L17.0818 9.99998L12.0234 15.0583" stroke="#FAFAFA" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2.91406 10H16.9391" stroke="#FAFAFA" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY EVENTS */}
      <CommunityEventsSection />
    </div>
  );
}
