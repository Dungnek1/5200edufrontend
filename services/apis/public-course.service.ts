import { http } from '../http';
import type { ApiResponse, PaginatedResponse } from "../http/types";
import type { Course, Review } from "@/types/course";
import { parseBackendResponse } from "../http/response-parser";
import teacherPublicService from "./teacher-public.service";

import { logger } from '@/lib/logger';

class PublicCourseService {
  private readonly baseUrl = "/public/packs";
  private teacherNameCache: Map<string, string> = new Map();

  async getFeaturedCourse(teacherId?: string): Promise<ApiResponse<Course>> {
    try {
      const params = new URLSearchParams();
      if (teacherId) {
        params.append('teacherId', teacherId);
      }
      const url = `${this.baseUrl}/featured/detail${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await http.get(url);
      return response.data;
    } catch (error) {
      logger.error('[PublicCourseService] Failed to fetch featured course:', error);
      throw error;
    }
  }


  // private async fetchTeacherNames(): Promise<void> {
  //   if (this.teacherNameCache.size > 0) return;

  //   try {
  //     const response = await teacherPublicService.getTeachers({ page: 1 });
  //     if (response.success && response.data?.data) {
  //       response.data.data.forEach((teacher: any) => {
  //         if (teacher.id && teacher.name) {
  //           this.teacherNameCache.set(teacher.id, teacher.name);
  //         }
  //       });
  //       logger.info(
  //         "[PublicCourseService] Cached teacher names:",
  //         this.teacherNameCache.size
  //       );
  //     }
  //   } catch (error) {
  //     logger.error(
  //       "[PublicCourseService] Failed to fetch teacher names:",
  //       error
  //     );
  //   }
  // }

  async getCourses(filters?: {
    page?: number;
    limit?: number;
    q?: string;
    categoryId?: string;
    categorySlug?: string;
    language?: string;
    teacherId?: string;
    categoryIds?: string[];
  }): Promise<ApiResponse<Course[]>> {


    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.q) params.append("q", filters.q);
    if (filters?.categoryId) params.append("categoryId", filters.categoryId);
    if (filters?.categorySlug)
      params.append("categorySlug", filters.categorySlug);
    if (filters?.language) params.append("language", filters.language);
    if (filters?.teacherId) params.append("teacherId", filters.teacherId);
    if (filters?.categoryIds) {
      if (Array.isArray(filters.categoryIds)) {
        filters.categoryIds.forEach(id => params.append("categoryIds", id));
      } else {
        params.append("categoryIds", filters.categoryIds);
      }
    }

    const queryParams = params.toString();
    const url = `${this.baseUrl}${queryParams ? `?${queryParams}` : ""}`;

    const response = await http.get(url);
    const resData = response.data;
    let courses: Course[] = [];
    let message: string | undefined = undefined;
    let success = true;

    if (!resData) {
      return { success: false, data: [] };
    }

    message = resData.message;

    if (Array.isArray(resData)) {
      courses = resData as Course[];
    } else if (resData.data && Array.isArray(resData.data)) {
      courses = resData.data as Course[];
    } else if (resData.data && resData.data.data && Array.isArray(resData.data.data)) {
      courses = resData.data.data as Course[];
    } else {
      courses = [];
    }

    return {
      success,
      message,
      data: courses,
    };
  }


  async getCourseBySlug(slug: string): Promise<ApiResponse<Course>> {


    const response = await http.get(`${this.baseUrl}/${slug}`);
    const rawData = parseBackendResponse<any>(response.data);


    return {
      success: true,
      data: rawData,
    };
  }


  async getCourse(id: string): Promise<ApiResponse<Course>> {
    return this.getCourseBySlug(id);
  }


  async getCourseReviews(id: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await http.get(`${this.baseUrl}/${id}/reviews`);
      const reviews = parseBackendResponse<any[]>(response.data);
      return {
        success: true,
        data: reviews || [],
      };
    } catch (error: any) {
      return {
        success: true,
        data: [
          {
            id: "1",
            userId: "user-001",
            userName: "Nguyễn Văn A",
            userAvatar: "https://i.pravatar.cc/150?img=1",
            rating: 5,
            comment:
              "Khóa học rất hay và bổ ích. Giảng viên giải thích dễ hiểu.",
            createdAt: "2026-01-01T00:00:00Z",
            helpful: 12,
          },
          {
            id: "2",
            userId: "user-002",
            userName: "Trần Thị B",
            userAvatar: "https://i.pravatar.cc/150?img=2",
            rating: 4,
            comment: "Nội dung tốt nhưng có thể cải thiện phần thực hành thêm.",
            createdAt: "2026-01-02T00:00:00Z",
            helpful: 8,
          },
          {
            id: "3",
            userId: "user-003",
            userName: "Lê Văn C",
            userAvatar: "https://i.pravatar.cc/150?img=3",
            rating: 5,
            comment: "Rất hài lòng với khóa học. Đã giới thiệu cho bạn bè.",
            createdAt: "2026-01-03T00:00:00Z",
            helpful: 15,
          },
        ],
      };
    }
  }

  async getCoursePreview(courseId: string): Promise<ApiResponse<Course>> {
    const response = await http.get(`/packs/${courseId}`);
    const course = parseBackendResponse<Course>(response.data);
    return {
      success: true,
      data: course,
    };
  }

  async getModules(courseId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await http.get(
        `/public/packs/${courseId}/modules`
      );
      const modules = parseBackendResponse<any[]>(response.data);
      return {
        success: true,
        data: modules || [],
      };
    } catch (error: any) {
      return {
        success: true,
        data: [],
      };
    }
  }

  async getModule(
    courseId: string,
    moduleId: string
  ): Promise<ApiResponse<any>> {
    const response = await http.get(
      `/public/packs/${courseId}/modules/${moduleId}`
    );
    const moduleResponse = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: moduleResponse,
    };
  }


  async getReviews(slug: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Review>>> {
    const response = await http.get(`${this.baseUrl}/${slug}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  }

  async getRelatedCourses(
    courseId: string,
    limit?: number
  ): Promise<ApiResponse<Course[]>> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit.toString());

      const response = await http.get(
        `/public/packs/${courseId}/related${params ? `?${params}` : ""}`
      );
      const rawData = parseBackendResponse<any>(response.data);

      return {
        success: true,
        data: rawData || [],
      };
    } catch (error: any) {
      return {
        success: true,
        data: [],
      };
    }
  }

  async getTeacherCourses(teacherId: string): Promise<ApiResponse<Course[]>> {
    const response = await http.get(`/public/packs/teacher/${teacherId}`);
    const rawData = parseBackendResponse<any>(response.data);



    return {
      success: true,
      data: rawData || [],
    };
  }
}

export default new PublicCourseService();
