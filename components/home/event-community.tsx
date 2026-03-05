import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BlogItem, BlogType } from "@/types/blog";
import eventService from "@/services/apis/event.service";

interface EventSection {
  id: string;
  title: string;
  items: BlogItem[];
  type: BlogType;
}

export const EventCard: React.FC<{ item: BlogItem }> = ({ item }) => {
  const router = useRouter();
  const t = useTranslations("course");


  const handleCardClick = () => {
    router.push(`/event/${item.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
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

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <h3 className="text-gray-900 font-semibold text-sm sm:text-base leading-snug line-clamp-2 mb-3 min-h-[2.5rem]">
          {item.title}
        </h3>
        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {item.tags.slice(0, 3).map((tag: any, idx: any) => (
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
};

const EventCommunity: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const t = useTranslations();
  const tCourse = useTranslations("course");
  const [sections, setSections] = useState<EventSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const [hoithaoData, oflineData, congdongData] = await Promise.all([
          eventService.getEventsByType("HOITHAO"),
          eventService.getEventsByType("OFFLINE"),
          eventService.getEventsByType("CONGDONG"),
        ]);

        setSections([
          {
            id: "tech-seminars",
            title: t("page.events.techSeminars"),
            items: hoithaoData,
            type: "HOITHAO",
          },
          {
            id: "offline-courses",
            title: t("page.events.offlineCourses"),
            items: oflineData,
            type: "OFFLINE",
          },
          {
            id: "community",
            title: t("page.events.community"),
            items: congdongData,
            type: "CONGDONG",
          },
        ]);
      } catch (err) {
        setError(t("page.events.noEventsFound"));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loadingData")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t("common.reloadPage")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full py-6 px-4 sm:py-8 sm:px-8 md:py-10 md:px-12 lg:py-[32px] lg:px-[64px] flex flex-col gap-[20px]"
      style={{ backgroundColor: "#FAFAFA" }}
    >

      <Breadcrumb
        items={[{ label: t("page.home.events.title") }]}
        locale={locale}
      />


      <h1 className="text-[30px] font-bold text-[#3B3D48] ">
        {t("page.home.events.title")}
      </h1>


      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        {sections.map((section) => (
          <section key={section.id}
            className='flex flex-col gap-[20px]'
          >
            <h2 className="text-[24px] font-bold text-[#3B3D48]">
              {section.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
              {section.items.map((item) => (
                <EventCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default EventCommunity;
