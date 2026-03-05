import { http } from '../http';
import type { Pack, PackFilters, PackReview } from "@/types/pack";

import { logger } from '@/lib/logger';
export interface PackResponse {
  data: Pack[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface SinglePackResponse {
  data: Pack;
}

class PackService {
  private baseUrl = "/packs";

  async getPacks(filters?: PackFilters): Promise<PackResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.level) params.append("level", filters.level);
    if (filters?.teacher) params.append("teacher", filters.teacher);
    if (filters?.priceRange) params.append("priceRange", filters.priceRange);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await http.get(`${this.baseUrl}?${params.toString()}`);
    return response.data;
  }

  async getPackById(id: string | number): Promise<SinglePackResponse> {
    const response = await http.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getFeaturedPackages(limit?: number): Promise<PackResponse> {
    const params = new URLSearchParams();
    params.append('featured', 'true');
    if (limit) params.append('limit', limit.toString());

    const response = await http.get(`${this.baseUrl}?${params.toString()}`);
    return response.data;
  }

  async getPacksByCategory(
    category: string,
    limit?: number
  ): Promise<PackResponse> {
    const params = new URLSearchParams();
    params.append("category", category);
    if (limit) params.append("limit", limit.toString());

    const response = await http.get(`${this.baseUrl}?${params.toString()}`);
    return response.data;
  }

  async getPacksByTeacher(
    teacherId: string | number,
    limit?: number
  ): Promise<PackResponse> {
    const params = new URLSearchParams();
    params.append("teacherId", teacherId.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await http.get(`${this.baseUrl}?${params.toString()}`);
    return response.data;
  }

  async searchPacks(
    query: string,
    filters?: Omit<PackFilters, "search">
  ): Promise<PackResponse> {
    const params = new URLSearchParams();
    params.append("search", query);

    if (filters?.category) params.append("category", filters.category);
    if (filters?.level) params.append("level", filters.level);
    if (filters?.teacher) params.append("teacher", filters.teacher);
    if (filters?.priceRange) params.append("priceRange", filters.priceRange);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await http.get(
      `${this.baseUrl}/search?${params.toString()}`
    );
    return response.data;
  }

  async getPackCategories(): Promise<{ data: string[] }> {
    const response = await http.get(`${this.baseUrl}/categories`);
    return response.data;
  }

  async getPackLevels(): Promise<{ data: string[] }> {
    const response = await http.get(`${this.baseUrl}/levels`);
    return response.data;
  }

  async getPackTeachers(): Promise<{
    data: Array<{ id: string; name: string; avatar?: string; title?: string }>;
  }> {
    const response = await http.get(`${this.baseUrl}/teachers`);
    return response.data;
  }

  async getPackReviews(
    packId: string | number,
    page?: number,
    limit?: number
  ): Promise<{ data: PackReview[]; total: number }> {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await http.get(
      `${this.baseUrl}/${packId}/reviews?${params.toString()}`
    );
    return response.data;
  }

  async purchasePack(
    packId: string | number
  ): Promise<{ data: { enrollmentId: string; status: string } }> {
    const response = await http.post(`${this.baseUrl}/${packId}/purchase`);
    return response.data;
  }

  async addPackReview(
    packId: string | number,
    review: {
      rating: number;
      comment: string;
    }
  ): Promise<{ data: PackReview }> {
    const response = await http.post(
      `${this.baseUrl}/${packId}/reviews`,
      review
    );
    return response.data;
  }

  async checkPackOwnership(
    packId: string | number
  ): Promise<{
    data: {
      isOwner: boolean;
      enrollment?: {
        id: string | number;
        packId: string | number;
        userId: string | number;
        purchasedAt: string;
        status: "active" | "expired" | "revoked";
        expiresAt?: string;
        certificate?: { id: string; issuedAt: string; url: string };
      };
    };
  }> {
    const response = await http.get(`${this.baseUrl}/${packId}/ownership`);
    return response.data;
  }

  async getMyPacks(filters?: PackFilters): Promise<PackResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await http.get(
      `${this.baseUrl}/my-packs?${params.toString()}`
    );
    return response.data;
  }


  /**
   * GET /api/v1/packs/{courseId}/modules
   * Get all modules for a course
   */
  async getModules(courseId: string): Promise<{ data: any[] }> {
    const response = await http.get(`${this.baseUrl}/${courseId}/modules`);
    return response.data;
  }

  /**
   * GET /api/v1/packs/{courseId}/modules/{moduleId}
   * Get module detail
   */
  async getModule(courseId: string, moduleId: string): Promise<{ data: any }> {
    const response = await http.get(`${this.baseUrl}/${courseId}/modules/${moduleId}`);
    return response.data;
  }

  /**
   * GET /api/v1/packs/{courseId}/modules/{moduleId}/lessons
   * Get lessons for a module (if exists)
   * Note: This endpoint might not exist in backend yet
   */
  async getLessons(courseId: string, moduleId: string): Promise<{ data: any[] }> {
    try {
      const response = await http.get(`${this.baseUrl}/${courseId}/modules/${moduleId}/lessons`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        logger.warn('⚠️ Lessons endpoint not found, module might contain lessons directly');
        return { data: [] };
      }
      throw error;
    }
  }

  /**
   * GET /api/v1/packs/{courseId}/modules/{moduleId}/lessons/{lessonId}
   * Get lesson detail (if exists)
   * Note: This endpoint might not exist in backend yet
   */
  async getLesson(courseId: string, moduleId: string, lessonId: string): Promise<{ data: any }> {
    try {
      const response = await http.get(`${this.baseUrl}/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        logger.warn('⚠️ Lesson detail endpoint not found');
        throw new Error('Lesson not found');
      }
      throw error;
    }
  }

  /**
   * GET /api/v1/packs/{courseId}/modules/{moduleId}/documents
   * Get documents for a module
   */
  async getModuleDocuments(courseId: string, moduleId: string): Promise<{ data: any[] }> {
    const response = await http.get(`${this.baseUrl}/${courseId}/modules/${moduleId}/documents`);
    return response.data;
  }

  /**
   * GET /api/v1/packs/{courseId}/engagement
   * Get engagement statistics for a course
   */
  async getEngagement(courseId: string): Promise<{ data: any }> {
    const response = await http.get(`${this.baseUrl}/${courseId}/engagement`);
    return response.data;
  }

  /**
   * GET /api/v1/packs/{courseId}/reviews
   * Get reviews for a course with user details
   */
  async getCourseReviews(courseId: string): Promise<{ data: any[] }> {
    const response = await http.get(`${this.baseUrl}/${courseId}/reviews`);

    const raw: any = response.data;

    let reviews: any[] = [];
    if (Array.isArray(raw?.data)) {
      reviews = raw.data;
    } else if (Array.isArray(raw?.data?.data)) {
      reviews = raw.data.data;
    } else if (Array.isArray(raw?.data?.data?.data)) {
      reviews = raw.data.data.data;
    }

    return { data: reviews };
  }

  /**
   * GET /api/v1/packs/{courseId}/assignments/stats
   * Get assignment statistics for a course
   */
  async getAssignmentStats(courseId: string): Promise<{ data: any }> {
    const response = await http.get(`${this.baseUrl}/${courseId}/assignments/stats`);
    return response.data;
  }

  /**
   * GET /api/v1/packs/{courseId}/students
   * Get list of students enrolled in a course
   */
  async getCourseStudents(courseId: string): Promise<{ data: any[] }> {
    const response = await http.get(`${this.baseUrl}/${courseId}/students`);
    return response.data;
  }
}

export const packService = new PackService();
