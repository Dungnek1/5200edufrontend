"use client";

import { CourseCard } from '@/components/home/course-card';
import type { Course } from '@/types/course';

interface TeacherCoursesSectionProps {
  courses: Course[];
}

export function TeacherCoursesSection({ courses }: TeacherCoursesSectionProps) {
  return (
    <section className="overflow-x-hidden max-w-full">

      <h2
        className="text-xl sm:text-2xl lg:text-2xl font-medium text-[#3b3d48] mb-4 sm:mb-5 lg:mb-5"
        style={{ fontFamily: 'Roboto, sans-serif', lineHeight: '32px' }}
      >
        Khóa học
      </h2>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-5">
        {courses.map((course, index) => (
          <CourseCard key={course.id} course={course} cardIndex={index} />
        ))}
      </div>

    </section>
  );
}
