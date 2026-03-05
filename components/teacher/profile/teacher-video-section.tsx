"use client";

import { Play, Settings, Lock, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { featuredPackService } from "@/services/apis/featured-pack.service";

interface Module {
  number: number;
  title: string;
  description: string;
  duration: string;
  locked: boolean;
}

interface TeacherVideoSectionProps {
  teacherId?: string;
}

export function TeacherVideoSection({ teacherId }: TeacherVideoSectionProps) {
  const t = useTranslations("teacherCourseContent");
  const tCommon = useTranslations("common");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadFeaturedPack = async () => {
  //     try {
  //       setLoading(true);
  //       const packDetail =
  //         await featuredPackService.getFeaturedPackDetail(teacherId);

  //       if (packDetail && packDetail.sections) {
  //         const transformedModules =
  //           featuredPackService.transformSectionsToModules(packDetail.sections);
  //         setModules(transformedModules);
  //           "[TeacherVideoSection] Modules loaded:",
  //           transformedModules,
  //         );
  //       } else {
  //           "[TeacherVideoSection] No featured pack or sections found",
  //         );
  //         setModules([]);
  //       }
  //     } catch (error) {
  //         "[TeacherVideoSection] Error loading featured pack:",
  //         error,
  //       );
  //       setModules([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadFeaturedPack();
  // }, [teacherId]);

  return (
    <section className="bg-white py-4 sm:py-6 lg:py-8 overflow-x-hidden">
      {/* Mobile: Helpful Knowledge */}
      <div className="lg:hidden flex flex-col gap-4 sm:gap-5">
        <h2
          className="text-xl sm:text-2xl font-medium text-[#3b3d48] text-left"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("mobileHelpfulKnowledge")}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">{tCommon("loading")}</p>
          </div>
        ) : modules.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">{t("noModules")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {modules.map((module) => (
              <div
                key={module.number}
                className="bg-white border border-[#dbdde5] rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 text-left"
              >
                {/* Play Icon */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#4162e7] flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
                </div>

                {/* Title */}
                <p
                  className="flex-1 text-sm sm:text-base font-bold text-[#3b3d48] leading-5 sm:leading-6"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {t("episodeTitle", { number: module.number, title: module.title })}
                </p>

                {/* Chevron */}
                <ChevronDown className="w-5 h-5 text-[#3b3d48] flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Keep original design */}
      <div className="hidden lg:block bg-[#FAFAFA] px-[64px] py-[12px]">
        <h2
          className="text-2xl font-medium text-[#3b3d48] mb-5 text-center"
          style={{ fontFamily: "Roboto, sans-serif", lineHeight: "32px" }}
        >
          {t("featuredCourse")}
        </h2>

        <div className="flex gap-32 items-start justify-center">
          {/* Video Player - Takes remaining space */}
          <div
            className="bg-[#eceffd] h-[416px] rounded-[10px] overflow-hidden relative border-2 border-[#4162e7] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)]"
            style={{ width: "762px" }}
          >
            {/* Video Background with Logo Pattern */}
            <div className="absolute inset-0 bg-[#eceffd] flex items-center justify-center">
              {/* Main Logo - Center */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px]">
                <div className="w-full h-full bg-[#4162e7] rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">GV</span>
                </div>
              </div>
              {/* Decorative Logos - Corners */}
              <div className="absolute left-[calc(50%-244px)] top-[calc(50%-143.4px)] -translate-x-1/2 -translate-y-1/2 w-[66px] h-[66px] opacity-10">
                <div className="w-full h-full bg-[#4162e7] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">GV</span>
                </div>
              </div>
              <div className="absolute left-[calc(50%+243px)] top-[calc(50%-143.4px)] -translate-x-1/2 -translate-y-1/2 w-[66px] h-[66px] opacity-10">
                <div className="w-full h-full bg-[#4162e7] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">GV</span>
                </div>
              </div>
              <div className="absolute left-[calc(50%-244px)] top-[calc(50%+142.6px)] -translate-x-1/2 -translate-y-1/2 w-[66px] h-[66px] opacity-10">
                <div className="w-full h-full bg-[#4162e7] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">GV</span>
                </div>
              </div>
              <div className="absolute left-[calc(50%+243px)] top-[calc(50%+142.6px)] -translate-x-1/2 -translate-y-1/2 w-[66px] h-[66px] opacity-10">
                <div className="w-full h-full bg-[#4162e7] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">GV</span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <button className="bg-[#4162e7] rounded-full p-[15px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] hover:bg-[#3652d3] transition-colors">
                <Play className="w-[30px] h-[30px] text-white fill-white" />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.3)] h-12" />

            {/* Progress Bar */}
            <div className="absolute bottom-[27px] left-0 right-0 h-1 bg-[rgba(255,255,255,0.3)] rounded-full mx-0">
              <div
                className="absolute left-0 top-0 h-1 bg-[#4162e7] rounded-full"
                style={{ width: "152px" }}
              >
                <div className="absolute right-[-6px] top-[-4px] w-3 h-3 bg-white rounded-full shadow-sm" />
              </div>
            </div>

            {/* Time Display */}
            <div
              className="absolute bottom-[26px] left-4 flex gap-1 items-center text-white text-[10px] font-normal"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              <span className="leading-[14px]">04:23</span>
              <span className="leading-[14px]">/</span>
              <span className="leading-[14px]">12:45</span>
            </div>

            {/* Settings Icon */}
            <div className="absolute bottom-[25px] right-3">
              <Settings className="w-6 h-6 text-[#f4f4f7]" />
            </div>
          </div>

          {/* Modules List - Fixed width */}
          <div className="flex flex-col gap-2 w-[370px] flex-shrink-0">
            {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">{tCommon("loading")}</p>
          </div>
            ) : modules.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">{t("noModules")}</p>
              </div>
            ) : (
              modules.map((module) => (
                <div
                  key={module.number}
                  className="bg-[#f4f4f7] rounded-xl overflow-hidden"
                >
                  <div className="bg-white rounded-xl p-3 flex items-center gap-4">
                    {/* Left: Module Info */}
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <div className="flex gap-2 items-center flex-1 min-w-0">
                        <div className="flex flex-col gap-1 items-start flex-1 min-w-0">
                          {/* Title as Main Badge */}
                          <div className="flex gap-1 items-center">
                            {module.locked && (
                              <div className="bg-[#f5f5f5] rounded-full p-1">
                                <Lock className="w-4 h-4 text-[#575757]" />
                              </div>
                            )}
                            <div className="bg-[#4162e7] rounded px-2 py-[2px]">
                              <p
                                className="text-sm font-medium text-white leading-5"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                              >
                                {module.title}
                              </p>
                            </div>
                          </div>
                          {/* Description */}
                          {module.description && (
                            <p
                              className="text-sm text-[#3B3D48] font-bold leading-4 break-words"
                              style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                              {module.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Duration */}
                      <div className="flex flex-col items-start flex-shrink-0">
                        <p
                          className="text-sm font-normal text-[#7f859d] leading-5 whitespace-nowrap"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                          {module.duration}
                        </p>
                      </div>
                    </div>
                    {/* Right: Chevron */}
                    <ChevronDown className="w-5 h-5 text-[#3b3d48] flex-shrink-0" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
