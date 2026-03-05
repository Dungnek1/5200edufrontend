"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventDetails from "@/components/home/event-details";
import eventService from "@/services/apis/event.service";

import { logger } from '@/lib/logger';
import { BlogItem } from "@/types/blog";
import { useTranslations } from "next-intl";
interface EventDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const tEvents = useTranslations("page.events");
  const tErrors = useTranslations("errors");
  const [slug, setSlug] = useState<string | null>(null);
  const [event, setEvent] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (err) {
        logger.error("Failed to resolve params:", err);
        setError(tErrors("somethingWentWrong"));
        setLoading(false);
      }
    })();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventService.getEventBySlug(slug);
        setEvent(data);
      } catch (err) {
        logger.error("Failed to fetch event detail:", err);
        setError(tErrors("somethingWentWrong"));
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{tEvents("loadingDetails")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {tCommon("back")}
          </button>
        </div>
      </div>
    );
  }

  return <EventDetails event={event} />;
}
