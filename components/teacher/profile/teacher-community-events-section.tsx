"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import eventService from "@/services/apis/event.service";

import { Skeleton } from "@/components/ui/skeleton";
import { BlogItem } from "@/types/blog";

export function TeacherCommunityEventsSection() {
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const t = useTranslations();
  const [events, setEvents] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEventsByType("HOITHAO");
        setEvents(data.slice(0, 4));
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="  overflow-x-hidden">
        <h2
          className="text-xl sm:text-2xl lg:text-2xl font-medium text-[#3b3d48] mb-4 sm:mb-5 lg:mb-5"
          style={{ fontFamily: "Roboto, sans-serif", lineHeight: "32px" }}
        >
          {t("page.home.events.title")}
        </h2>


        <div className="hidden lg:flex lg:gap-5 lg:items-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1  border border-[#dbdde5] rounded-xl overflow-hidden">
              <Skeleton className="w-full aspect-[271/162]" />
              <div className="p-3 flex flex-col gap-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="lg:hidden flex flex-col gap-4 sm:gap-5">
          {[1, 2].map((i) => (
            <div key={i} className=" border border-[#dbdde5] rounded-xl overflow-hidden">
              <Skeleton className="w-full aspect-[271/162]" />
              <div className="p-3 flex flex-col gap-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="overflow-x-hidden">
        <h2
          className="text-xl sm:text-2xl lg:text-2xl font-medium text-[#3b3d48] mb-4 sm:mb-5 lg:mb-5"
          style={{ fontFamily: "Roboto, sans-serif", lineHeight: "32px" }}
        >
          {t("page.home.events.title")}
        </h2>
        <p className="text-center text-[#8c92ac]">
          {t("page.home.events.noEvents")}
        </p>
      </section>
    );
  }

  return (
    <section className=" overflow-x-hidden">

      <h2
        className="text-xl sm:text-2xl lg:text-2xl font-medium text-[#3b3d48] mb-4 sm:mb-5 lg:mb-5"
        style={{ fontFamily: "Roboto, sans-serif", lineHeight: "32px" }}
      >
        {t("page.home.events.title")}
      </h2>


      <div className="lg:hidden flex flex-col gap-4 sm:gap-5">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/${locale}/event/${event.slug}`}
            className="border border-[#dbdde5] rounded-xl overflow-hidden shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-lg transition-shadow"
          >

            <div className="relative w-full aspect-[271/162]">
              <img
                src={`${process.env.NEXT_PUBLIC_MINIO}/${event.thumbnailUrl}`}
                alt={event.title}

                className="object-cover h-full w-full"
              />
            </div>


            <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
              <p
                className="text-base sm:text-lg font-medium text-[#3b3d48] leading-5 sm:leading-7 line-clamp-2"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {event.title}
              </p>


              <div className="flex flex-col gap-1.5 sm:gap-2">
                {event.category && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#8c92ac]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span
                      className="text-xs sm:text-sm font-normal text-[#8c92ac]"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {event.category.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#8c92ac]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span
                    className="text-xs sm:text-sm font-normal text-[#8c92ac]"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {event.createdAt ? new Date(event.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "short" }) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>


      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/${locale}/event/${event.slug}`}
            className="border border-[#dbdde5] rounded-xl overflow-hidden shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-lg transition-shadow relative h-full"
          >

            <div className="relative w-full aspect-[271/162]">
              <img
                src={`${process.env.NEXT_PUBLIC_MINIO}/${event.thumbnailUrl}`}
                alt={event.title}

                className="object-cover h-full w-full"

              />

              {event.category && (
                <div className="absolute left-[11px] top-[11px]">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#4162e7] px-3 py-[2px] text-[14px] leading-5 text-white font-normal">
                    {event.category.name}
                  </span>
                </div>
              )}
            </div>


            <div className="p-3 flex flex-col gap-1">
              <p
                className="text-lg font-medium text-[#3b3d48] leading-7 line-clamp-2 max-h-[60px] overflow-hidden"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {event.title}
              </p>

              {event.tags && event.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {event.tags.slice(0, 3).map((tag: any, idx: any) => (
                    <div
                      key={idx}
                      className="bg-[#8c92ac] px-2 py-0.5 rounded-full"
                    >
                      <p
                        className="text-white text-xs leading-4 font-normal"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {tag}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}

      </div>
    </section>
  );
}
