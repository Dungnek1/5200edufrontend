"use client";

import { CourseCard } from '@/components/home/course-card';
import type { Course } from '@/types/course';

interface CourseDetailRelatedProps {
  courses: Course[];
}

import { useTranslations } from 'next-intl';

export function CourseDetailRelated({ courses }: CourseDetailRelatedProps) {
  const t = useTranslations();

  return (
    <section className="bg-white py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col gap-5 w-full">
        <h2
          className="text-xl sm:text-2xl lg:text-2xl font-medium text-[#3b3d48] leading-tight sm:leading-8 lg:leading-8"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {t("course.relatedCourses")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.slice(0, 4).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
