import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Home,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import DOMPurify from "isomorphic-dompurify";
import eventService from "@/services/apis/event.service";
import { BlogItem } from "@/types/blog";

interface EventDetailsProps {
  event: BlogItem | null;
  isPreview?: boolean;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, isPreview = false }) => {
  const router = useRouter();
  const t = useTranslations("course");
  const tEvent = useTranslations("event");
  const locale = useLocale();
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [relatedEvents, setRelatedEvents] = useState<BlogItem[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);


  useEffect(() => {
    if (!event) return;

    const fetchRelatedEvents = async () => {
      try {
        setLoadingRelated(true);
        const otherTypes: Array<"HOITHAO" | "OFFLINE" | "CONGDONG"> = [
          "HOITHAO",
          "OFFLINE",
          "CONGDONG",
        ];
        const currentType = event.type as "HOITHAO" | "OFFLINE" | "CONGDONG";

        const typesToFetch = otherTypes.filter((type) => type !== currentType);
        const allResults: BlogItem[] = [];

        for (const type of typesToFetch) {
          try {
            const result = await eventService.getEventsByType(type);
            allResults.push(...result);
          } catch (err) {
            // Error fetching events
          }
        }

        const filtered = allResults
          .filter((item) => item.id !== event.id)
          .slice(0, 4);

        setRelatedEvents(filtered);
      } catch (err) {
        // Error fetching related events
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedEvents();
  }, [event]);

  if (!event) {
    return (
      <div className="bg-white text-gray-800 font-sans">
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">{tEvent("notFound")}</p>
        </div>
      </div>
    );
  }

  const handleRelatedEventClick = (slug: string) => {
    router.push(`/event/${slug}`);
  };

  return (
    <div className="bg-[#FAFAFA] text-gray-800 font-sans">

      <main className="w-full py-6 px-4 sm:py-8 sm:px-8 md:py-10 md:px-12 lg:py-[32px] lg:px-[64px]">

        {!isPreview && (
          <nav className="flex items-center text-xs sm:text-sm text-gray-500 space-x-2 overflow-x-auto whitespace-nowrap mb-4 sm:mb-6">
            <a href="#" className="hover:text-indigo-600 flex items-center">
              <Home size={14} className="mr-1" />
            </a>
            <ChevronRight size={12} />
            <a href="/events" className="hover:text-indigo-600">
              {tEvent("breadcrumbCommunityEvents")}
            </a>
            <ChevronRight size={12} />
            <span className="text-gray-900 truncate max-w-[200px] sm:max-w-md">
              {event.title}
            </span>
          </nav>
        )}

        <div className="max-w-5xl mx-auto flex flex-col gap-[12px]">


          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-[12px] text-xs sm:text-sm text-gray-600">

            <p className='bg-[#0A0BD9] px-[8px] py-[4px] rounded-[16px] text-white text-[12px]'>
              {event.type === 'CONGDONG'
                ? tEvent("badge.community")
                : event.type === 'HOITHAO'
                  ? tEvent("badge.seminar")
                  : tEvent("badge.offline")}
            </p>
            <div className="flex items-center">
              <span className="mr-1">{tEvent("writtenBy")}:</span>
              <a
                href={event.creator?.id ? `/${locale}/teachers/${event.creator.id}` : "#"}
                className="text-indigo-600 font-medium hover:underline cursor-pointer"
                onClick={(e) => {
                  if (event.creator?.id) {
                    e.preventDefault();
                    router.push(`/${locale}/teachers/${event.creator.id}`);
                  }
                }}
              >
                {event.creator?.fullName || "Admin"}
              </a>
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>
                {new Date(event.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
          {event.tags && event.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {event.tags.map((tag: any, idx: any) => (
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


          <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-10 lg:mb-12 shadow-sm">
            <img
              src={event.thumbnailUrl?.startsWith("data:") || event.thumbnailUrl?.startsWith("http") ? event.thumbnailUrl : `${process.env.NEXT_PUBLIC_MINIO}/${event.thumbnailUrl}`}
              alt={event.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>



          <article className="prose prose-slate max-w-none text-gray-700 leading-relaxed space-y-6">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(event.content || "")
              }}
              className="text-gray-700"
            />
          </article>

          {/* <div className="border-t border-gray-200 my-8 sm:my-10 lg:my-12"></div> */}
        </div>
      </main>


      {!isPreview && <section className="w-full  px-4 sm:px-6 lg:px-16 py-[32px]">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 lg:mb-10">
          {tEvent("relatedEvents")}
        </h2>

        {loadingRelated ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : relatedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {relatedEvents.map((item) => {

              return (
                <div
                  key={item.id}
                  onClick={() => handleRelatedEventClick(item.slug)}
                  className="group flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
                >

                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl">
                    <img
                      src={`${process.env.NEXT_PUBLIC_MINIO}/${item.thumbnailUrl}`}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 left-3">
                      <span
                        className="bg-[#0A0BD9] text-white text-xs sm:text-sm rounded-full shadow-sm tracking-wide flex items-center justify-center px-3 py-1"
                      >
                        {item.category?.name || t("course.defaultCategory")}
                      </span>
                    </div>

                  </div>


                  <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
                    <h3 className="text-gray-900 font-semibold text-sm sm:text-base leading-snug line-clamp-2 mb-3 min-h-[2.5rem]">
                      {item.title}
                    </h3>
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


                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            {tEvent("noRelatedEvents")}
          </p>
        )}
      </section>}
    </div>
  );
};

export default EventDetails;
