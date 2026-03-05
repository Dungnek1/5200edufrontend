"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import eventService from "@/services/apis/event.service";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogItem } from "@/types/blog";

export function CommunityEventsSection() {
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const t = useTranslations();
  const [events, setEvents] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEventsByType();
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
      <section className="bg-[#fafafa] mt-10 py-12 px-4 sm:px-6 lg:px-16 overflow-x-hidden">
        <div className="mx-auto max-w-[1520px]">
          <h2 className="font-medium text-[#3b3d48] text-xl md:text-2xl mb-4 sm:mb-5 lg:mb-5">
            {t("page.home.events.title")}
          </h2>

          {/* Desktop skeleton */}
          <div className="hidden lg:flex lg:gap-5 lg:items-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 bg-white border border-[#dbdde5] rounded-xl overflow-hidden">
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

          {/* Mobile skeleton */}
          <div className="lg:hidden flex flex-col gap-4 sm:gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-[#dbdde5] rounded-xl overflow-hidden">
                <Skeleton className="w-full aspect-[271/162]" />
                <div className="p-3 flex flex-col gap-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="bg-[#fafafa] mt-10 py-12  px-4 sm:px-6 lg:px-16 overflow-x-hidden">
        <div className="mx-auto max-w-[1520px]">
          <h2 className="font-medium text-[#3b3d48] text-xl md:text-2xl mb-4 sm:mb-5 lg:mb-5">
            {t("page.home.events.title")}
          </h2>
          <p className="text-center text-[#8c92ac]">
            {t("page.home.events.noEvents")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fafafa] mt-10 py-12 px-4 sm:px-6 lg:px-16 overflow-x-hidden">
      <div className="mx-auto max-w-[1520px]">
        <h2 className="font-medium text-[#3b3d48] text-xl md:text-2xl mb-4 sm:mb-5 lg:mb-5">
          {t("page.home.events.title")}
        </h2>


        <div className="lg:hidden flex flex-col gap-4 sm:gap-5">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/${locale}/event/${event.slug}`}
              className="bg-white border border-[#dbdde5] rounded-xl overflow-hidden shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-lg transition-shadow"
            >

              <div className="relative w-full aspect-[271/162]">
                <img
                  src={`${process.env.NEXT_PUBLIC_MINIO}/${event.thumbnailUrl}`}
                  alt={event.title}

                  className="object-cover"

                />
              </div>


              <div className="px-[12px] pb-[12px] flex flex-col gap-[4px]">
                <p
                  className="text-base sm:text-lg font-medium text-[#3b3d48] leading-5 sm:leading-7 line-clamp-2"
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

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/${locale}/event/${event.slug}`}
              className="bg-white border border-[#dbdde5] rounded-xl overflow-hidden shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-lg transition-shadow relative h-full"
            >
              {/* Event Image */}
              <div className="relative w-full aspect-[271/162] ">
                <img
                  src={`${process.env.NEXT_PUBLIC_MINIO}/${event.thumbnailUrl}`}
                  alt={event.title}

                  className="object-cover h-[200px] "

                />

                {event.category && (
                  <div className="absolute left-[11px] top-[11px]">
                    <span className="inline-flex items-center justify-center rounded-full bg-[#4162e7] px-3 py-[2px] text-[14px] leading-5 text-white font-normal">
                      {event.category.name}
                    </span>
                  </div>
                )}
              </div>


              <div className="px-[12px] pb-[12px] flex flex-col gap-[4px]">
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
      </div>
    </section>
  );
}
