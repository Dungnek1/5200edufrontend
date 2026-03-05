import { useState, useEffect, useCallback } from "react";
import { teacherPublicService, publicCourseService } from "@/services/apis";
import type { Course } from "@/types/course";
import { logger } from "@/lib/logger";
import { Teacher } from "@/types/teacher";

const ITEMS_PER_PAGE = 9;


interface UseTeachersPageResult {
  teachers: Teacher[];
  courses: Course[];
  loading: boolean;
  coursesLoading: boolean;
  selectedTeacherId: string | null;
  currentPage: number;
  totalPages: number;
  switchingTeacher: boolean;

  selectedTeacher: Teacher | undefined;

  setSelectedTeacher: (teacher: Teacher) => void;
  setSelectedTeacherId: (teacherId: string) => void;
  setCurrentPage: (page: number) => void;
  setSwitchingTeacher: (switching: boolean) => void;
}

export function useTeachersPage(): UseTeachersPageResult {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [switchingTeacher, setSwitchingTeacher] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const fetchTeachers = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const response = await teacherPublicService.getTeachers({
          page,
          limit: ITEMS_PER_PAGE,
        });

        if (response) {
          const rawData = (response as any).data?.data || (response as any).data || [];

          const mappedTeachers: Teacher[] = Array.isArray(rawData) ? rawData.map((t: any) => ({
            ...t,
            name: t.fullName || t.name,
            avatar: t.avatarUrl || t.avatar,
            education: t.educations || t.education || [],
          })) : [];

          setTeachers(mappedTeachers);

          const meta = (response as any).data?.meta || (response as any).meta || {};
          setTotalPages(meta.totalPages || 1);

          if (mappedTeachers.length > 0) {
            setSelectedTeacherId(prev => prev || mappedTeachers[0].id);
          }
        } else {
          setTeachers([]);
        }
      } catch (error) {
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchCourses = useCallback(async () => {
    try {
      setCoursesLoading(true);
      const response = await publicCourseService.getCourses({ page: 1 });

      if (response.success && response.data) {
        setCourses(response.data.slice(0, 8));
      } else {
        setCourses([]);
      }
    } catch (error) {
      logger.error("Failed to fetch courses:", error);
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers(currentPage);
  }, [currentPage, fetchTeachers]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);


  useEffect(() => {
    if (selectedTeacherId && teachers.length > 0) {
      const teacher = teachers.find(t => t.id === selectedTeacherId);
      if (teacher) {
        setSelectedTeacher(teacher);
        console.log("teacher that đôi ", teacher);
      }
    } else if (teachers.length > 0 && !selectedTeacher) {

      setSelectedTeacher(teachers[0]);
      setSelectedTeacherId(teachers[0].id);
    }
  }, [selectedTeacherId, teachers, selectedTeacher]);

  return {
    teachers,
    courses,
    loading,
    coursesLoading,
    selectedTeacher,
    selectedTeacherId,
    setSelectedTeacherId,
    currentPage,
    totalPages,
    switchingTeacher,
    setSelectedTeacher,
    setCurrentPage,
    setSwitchingTeacher,
  };
}
