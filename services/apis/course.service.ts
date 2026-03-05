import { Course } from '@/types/course';
import { http } from '../http';
import type { ApiResponse, PaginatedResponse } from '../http/types';



export interface CreateCourseRequest {
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  categoryId: string;
}

class CourseService {
  async getCourses(
    page = 1,
    pageSize = 10,
    filters?: {
      categoryId?: string;
      level?: string;
      search?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Course>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.level && { level: filters.level }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await http.get<ApiResponse<PaginatedResponse<Course>>>(
      `/courses?${params.toString()}`
    );
    return response.data;
  }

  async getCourseBySlug(slug: string): Promise<ApiResponse<Course>> {
    const response = await http.get<ApiResponse<Course>>(`/courses/${slug}`);
    return response.data;
  }

  async createCourse(data: CreateCourseRequest): Promise<ApiResponse<Course>> {
    const response = await http.post<ApiResponse<Course>>('/courses', data);
    return response.data;
  }

  async updateCourse(id: string, data: Partial<CreateCourseRequest>): Promise<ApiResponse<Course>> {
    const response = await http.put<ApiResponse<Course>>(`/courses/${id}`, data);
    return response.data;
  }

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(`/courses/${id}`);
    return response.data;
  }

  async enrollCourse(courseId: string): Promise<ApiResponse<void>> {
    const response = await http.post<ApiResponse<void>>(`/courses/${courseId}/enroll`);
    return response.data;
  }

  async getMyCourses(): Promise<ApiResponse<Course[]>> {
    const response = await http.get<ApiResponse<Course[]>>('/courses/my-courses');
    return response.data;
  }
}

export default new CourseService();
