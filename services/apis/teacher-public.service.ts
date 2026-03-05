import { http } from '../http';
import type { ApiResponse, PaginatedResponse } from '../http/types';
import type { Instructor as InstructorType, InstructorFilters } from '@/types/instructor';
import type { Course } from '@/types/course';
import { parseBackendResponse } from '../http/response-parser';
import { packService } from './pack.service';

import { logger } from '@/lib/logger';
import { Teacher } from '@/types/teacher';


export type TeacherPublic = Teacher;

class TeacherPublicService {

  async getTeachers(
    filters?: InstructorFilters
  ): Promise<ApiResponse<TeacherPublic[]>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.minRating) params.append('minRating', filters.minRating.toString());

    const queryParams = params.toString();
    const url = `/public/teacher-profile${queryParams ? `?${queryParams}` : ''}`;

    const response = await http.get(url);
    return response.data;
  }


  async getTeacherById(id: string): Promise<ApiResponse<TeacherPublic>> {
    const response = await http.get(`/public/teacher-profile/${id}`);
    // API returns nested structure: { status, data: { data: {...} } }
    if (response.data?.data?.data) {
      return {
        success: response.data.status === 'success',
        data: response.data.data.data,
      };
    }
    return response.data;
  }


  async getTeacherCourses(teacherId: string): Promise<ApiResponse<Course[]>> {
    const response = await http.get(`/public/teacher/${teacherId}/courses`);
    const courses = parseBackendResponse<Course[]>(response.data);
    return {
      success: true,
      data: courses || [],
    };
  }

  /**
   * GET /public/teacher/:id/events
   * Get teacher's upcoming events/workshops (public)
   */
  async getTeacherEvents(teacherId: string): Promise<ApiResponse<any[]>> {
    const response = await http.get(`/public/teacher/${teacherId}/events`);
    const events = parseBackendResponse<any[]>(response.data);
    return {
      success: true,
      data: events || [],
    };
  }

  /**
   * GET /public/teacher/:id/certificates
   * Get teacher's public certificates
   */
  async getTeacherCertificates(teacherId: string): Promise<ApiResponse<any[]>> {
    const response = await http.get(`/public/teacher/${teacherId}/certificates`);
    const certificates = parseBackendResponse<any[]>(response.data);
    return {
      success: true,
      data: certificates || [],
    };
  }

  /**
   * GET /public/teacher/:id/educations
   * Get teacher's public education history
   */
  async getTeacherEducations(teacherId: string): Promise<ApiResponse<any[]>> {
    const response = await http.get(`/public/teacher/${teacherId}/educations`);
    const educations = parseBackendResponse<any[]>(response.data);
    return {
      success: true,
      data: educations || [],
    };
  }

  /**
   * GET /public/teacher/:id/gallery/albums
   * Get teacher's public gallery albums
   */
  async getTeacherGalleryAlbums(teacherId: string): Promise<ApiResponse<any[]>> {
    const response = await http.get(`/public/teacher/${teacherId}/gallery/albums`);
    const albums = parseBackendResponse<any[]>(response.data);
    return {
      success: true,
      data: albums || [],
    };
  }

  /**
   * GET /public/teacher/:id/gallery/albums/:albumId
   * Get teacher's public gallery album detail with images
   */
  async getTeacherGalleryAlbum(teacherId: string, albumId: string): Promise<ApiResponse<any>> {
    const response = await http.get(`/public/teacher/${teacherId}/gallery/albums/${albumId}`);
    const album = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: album,
    };
  }


  async getTeacherGalleryImages(teacherId: string): Promise<ApiResponse<any[]>> {
    const response = await http.get(`/public/teacher/${teacherId}/gallery/images`);

    return response.data;
  }


  async getTeacherGalleryImage(teacherId: string, imageId: string): Promise<ApiResponse<any>> {
    const response = await http.get(`/public/teacher/${teacherId}/gallery/images/${imageId}`);
    const image = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: image,
    };
  }

  /**
   * Get all reviews from all courses of a teacher
   * Aggregates reviews from all teacher's courses
   */
  async getTeacherReviews(teacherId: string): Promise<ApiResponse<any[]>> {
    try {
      const coursesResponse = await this.getTeacherCourses(teacherId);

      if (!coursesResponse.success || !coursesResponse.data || coursesResponse.data.length === 0) {
        logger.info('[TeacherPublicService] No courses found for teacher:', teacherId);
        return {
          success: true,
          data: [],
        };
      }

      const courses = coursesResponse.data;
      logger.info('[TeacherPublicService] Found courses for teacher:', courses.length);

      const reviewPromises = courses.map(async (course: Course) => {
        try {
          const courseIdStr = String(course.id);
          const reviewsResponse = await packService.getCourseReviews(courseIdStr);
          const reviewsWithCourseInfo = (reviewsResponse.data || []).map((review: any) => ({
            ...review,
            courseId: course.id,
            courseName: course.title,
            courseThumbnail: course.thumbnail ?? course.thumbnailUrl,
          }));
          return reviewsWithCourseInfo;
        } catch (error) {
          logger.warn(`[TeacherPublicService] Failed to get reviews for course ${course.id}:`, error);
          return [];
        }
      });

      const reviewsArrays = await Promise.all(reviewPromises);

      const allReviews = reviewsArrays.flat();

      logger.info('[TeacherPublicService] Total reviews found for teacher:', allReviews.length);

      return {
        success: true,
        data: allReviews,
      };
    } catch (error) {
      logger.error('[TeacherPublicService] Error getting teacher reviews:', error);
      return {
        success: false,
        data: [],
      };
    }
  }
}

export default new TeacherPublicService();
