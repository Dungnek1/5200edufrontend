import { CourseCard } from "@/components/home/course-card";
import type { Course } from "@/types/course";

interface TeachersPageCoursesSectionProps {
  courses: Course[];
  loading: boolean;
  title: string;
  noCoursesLabel: string;
}

export function TeachersPageCoursesSection({
  courses,
  loading,
  title,
  noCoursesLabel,
}: TeachersPageCoursesSectionProps) {
  return (
    <div className="bg-white pb-12">
      <div className="flex flex-col gap-4 sm:gap-5">
        <p
          className="text-xl sm:text-2xl font-medium text-[#3b3d48] leading-[28px] sm:leading-[32px]"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {title}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="aspect-[271/162] bg-gray-200 animate-pulse"></div>
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 sm:h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {courses.map((course, index) => (
              <div key={course.id}>
                <CourseCard
                  course={course}
                  cardIndex={index}
                  showOverlay={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 sm:py-12 bg-[#f9f9fb] rounded-xl">
            <p className="text-sm sm:text-base text-[#8c92ac]">
              {noCoursesLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
