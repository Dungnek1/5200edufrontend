"use client";

import { useState, useEffect, useCallback } from "react";
import { TeacherCard } from "@/components/home/teacher-card";
import { teacherPublicService, type TeacherPublic } from "@/services/apis";
import { useTranslations } from "next-intl";

export function TeacherSection() {
  const t = useTranslations();
  const [teachers, setTeachers] = useState<TeacherPublic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await teacherPublicService.getTeachers({
        page: 1,
        limit: 4,
      });

      if (response.data) {
        //@ts-ignore
        setTeachers(response.data.data || []);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return (
    <section className="bg-[#FAFAFA]">
      {/* Section Header */}
      <h2
        className="text-xl sm:text-2xl md:text-[24px] font-semibold text-[#3b3d48] text-left mb-4 sm:mb-5 md:mb-[20px]"
        style={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 600,
          lineHeight: "32px",
        }}
      >
        {t("page.home.topInstructors")}
      </h2>

      {/* Teachers Grid - 4 columns */}
      {loading ? (
        <div className="flex gap-[20px]">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-white rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : teachers.length > 0 ? (
        <div className="grid grid-cols-1 gap-[20px]
                sm:grid-cols-2
                lg:grid-cols-4">
          {teachers.map((teacher, index) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              teacherIndex={index}
            />
          ))}
        </div>

      ) : null}
    </section>
  );
}
