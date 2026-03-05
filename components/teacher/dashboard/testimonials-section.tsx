"use client";

import { Star, ChevronLeft, ChevronRight, PlusCircle, MinusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardTestimonialsSectionProps {
  testimonialsRef: React.RefObject<HTMLDivElement | null>;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  scrollTestimonials: (direction: "left" | "right") => void;
}

export function DashboardTestimonialsSection({ testimonialsRef, isPaused, setIsPaused, scrollTestimonials }: DashboardTestimonialsSectionProps) {
  const t = useTranslations("teacher.dashboard");

  const testimonials = t.raw("testimonials.items") as Array<{ name: string; role: string; comment: string }>;

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-20 xl:py-[40px]">
      <div className="w-full flex flex-col gap-4 sm:gap-6 lg:gap-[32px]">
        <div className=" text-center flex flex-col gap-[12px]">
          <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[30px] leading-7 sm:leading-8 md:leading-[40px] lg:leading-[45px] font-medium text-[#0f172a]" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {t("testimonials.title")}
          </h2>
          <p className="text-sm sm:text-base lg:text-base leading-5 sm:leading-6 md:leading-7 text-[#0f172a] px-4 sm:px-0" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
            {t("testimonials.description")}
          </p>
        </div>

        <div ref={testimonialsRef} className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-xl sm:rounded-2xl lg:rounded-2xl border border-[#f4f4f7] p-3 sm:p-4 lg:p-4 relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] lg:w-[350px]">
              <div className="absolute right-0 top-8 sm:top-[38px] lg:top-[38px] w-[50px] h-[50px] sm:w-[61px] sm:h-[61px] lg:w-[61px] lg:h-[61px] pointer-events-none">
                <img src="/images/figma/Icon.svg" alt="" className="w-full h-full object-contain opacity-20" style={{ filter: "brightness(0) saturate(100%) invert(30%) sepia(95%) saturate(2000%) hue-rotate(220deg) brightness(0.9) contrast(1.2)" }} />
              </div>
              <div className="flex gap-0.5 sm:gap-1 lg:gap-1 mb-3 sm:mb-4 lg:mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 fill-[#FF9500] text-[#FF9500]" />
                ))}
              </div>
              <p className="text-sm sm:text-base lg:text-base leading-5 sm:leading-6 lg:leading-6 text-[#3b3d48] mb-3 sm:mb-4 lg:mb-4 h-[100px] sm:h-[120px] md:h-[130px] lg:h-[130px]" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                &ldquo;{testimonial.comment}&rdquo;
              </p>
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-3 pt-3 sm:pt-4 lg:pt-4 border-t border-[#f3f4f6]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-14 lg:h-14 rounded-full bg-[#4162e7] flex-shrink-0 relative">
                  <div className="absolute -bottom-0.5 sm:-bottom-1 lg:-bottom-1 -right-0.5 sm:-right-1 lg:-right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 rounded-full flex items-center justify-center">
                    {/* Reuse verified badge from teachers team card */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask id="verified-badge-dashboard" fill="white">
                        <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" />
                      </mask>
                      <path
                        d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
                        fill="url(#paint0_linear_verified_dashboard)"
                      />
                      <path
                        d="M10 20V18C5.58172 18 2 14.4183 2 10H0H-2C-2 16.6274 3.37258 22 10 22V20ZM20 10H18C18 14.4183 14.4183 18 10 18V20V22C16.6274 22 22 16.6274 22 10H20ZM10 0V2C14.4183 2 18 5.58172 18 10H20H22C22 3.37258 16.6274 -2 10 -2V0ZM10 0V-2C3.37258 -2 -2 3.37258 -2 10H0H2C2 5.58172 5.58172 2 10 2V0Z"
                        fill="white"
                        mask="url(#verified-badge-dashboard)"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.024 7.17567C14.1364 7.28819 14.1996 7.44077 14.1996 7.59987C14.1996 7.75897 14.1364 7.91156 14.024 8.02407L9.22396 12.8241C9.11144 12.9366 8.95885 12.9997 8.79976 12.9997C8.64066 12.9997 8.48807 12.9366 8.37556 12.8241L5.97556 10.4241C5.86626 10.3109 5.80578 10.1593 5.80715 10.002C5.80852 9.84471 5.87162 9.69423 5.98286 9.58298C6.09411 9.47174 6.2446 9.40863 6.40192 9.40727C6.55923 9.4059 6.71079 9.46638 6.82396 9.57567L8.79976 11.5515L13.1756 7.17567C13.2881 7.06319 13.4407 7 13.5998 7C13.7589 7 13.9114 7.06319 14.024 7.17567Z"
                        fill="white"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_verified_dashboard"
                          x1="0"
                          y1="0"
                          x2="20"
                          y2="20"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#4162E7" />
                          <stop offset="1" stopColor="#AD46FF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm sm:text-base lg:text-base font-bold text-[#101828]" style={{ fontFamily: "Arial, sans-serif", fontWeight: 700 }}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs sm:text-sm lg:text-sm text-[#3b3d48]" style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
