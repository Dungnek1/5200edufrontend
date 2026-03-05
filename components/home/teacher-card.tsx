"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { TeacherPublic } from "@/services/apis/teacher-public.service";
import { useTranslations } from "next-intl";
import { getAvatarUrl } from "@/utils/media";

interface TeacherCardProps {
  teacher: TeacherPublic;
  teacherIndex?: number;
}

export function TeacherCard({ teacher, teacherIndex = 0 }: TeacherCardProps) {
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const t = useTranslations("page.teachers");

  return (
    <Link href={`/${locale}/teachers/${teacher.id}`}>
      <div
        className="bg-white rounded-lg overflow-hidden pb-3 flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
        style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.05)" }}
      >




        <img
          src={getAvatarUrl(teacher.avatarUrl)}
          alt={teacher.name || `Teacher ${teacher.id || teacherIndex}`}
          className="h-[200px] w-full object-cover object-top"



        />




        <div className="flex flex-col items-start px-[12px] py-[12px] gap-2">
          <p
            className="text-[16px] font-semibold text-[#3B3D48] w-full"
            style={{
              fontFamily: "Roboto, sans-serif",
              lineHeight: "24px",
            }}
          >
            {teacher.fullName || t("defaultName")}
          </p>
          <p
            className="text-sm font-normal text-[#63687A] w-full overflow-hidden line-clamp-3"
            style={{
              fontFamily: "Roboto, sans-serif",
              lineHeight: "20px",
              maxHeight: "60px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {teacher.bio || t("noBio")}
          </p>
        </div>
      </div>
    </Link>
  );
}
