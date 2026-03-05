import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';
import { packService } from './pack.service';

import { logger } from '@/lib/logger';
import { Course } from '@/types/course';
import type { Enrollment, EnrollmentListResponse, EnrolledCourse } from '@/types/enrollment';
import type { Assignment, SubmitAssignmentPayload, AssignmentSubmissionResponse } from '@/types/assignment';



class StudentCourseService {
  private readonly baseUrl = '/student';
  private readonly packsBaseUrl = '/packs';


  async getMyCourses(): Promise<ApiResponse<EnrolledCourse[]>> {
    try {
      const response = await http.get(`${this.baseUrl}/packs`);
      const parsed = parseBackendResponse<EnrollmentListResponse>(response.data);

      if (!parsed || !parsed.enrollments) {
        return {
          success: false,
          data: [],
        };
      }
      const enrolledCourses: EnrolledCourse[] = parsed.enrollments.map((enrollment: Enrollment) => ({
        ...enrollment.course,
        enrollment: {
          id: enrollment.id,
          progressPercent: enrollment.progressPercent,
          completedModules: enrollment.completedModules,
          totalModules: enrollment.totalModules,
          enrolledAt: enrollment.enrolledAt,
          completedAt: enrollment.completedAt,
        },
        progress: enrollment.progressPercent,
        lessonsDone: enrollment.completedModules,
        lessonsTotal: enrollment.totalModules,
      }));

      return {
        success: true,
        data: enrolledCourses,
      };
    } catch (error: any) {
      logger.error('Failed to fetch my courses:', error);
      return {
        success: false,
        data: [],
      };
    }
  }


  async getCourseDetailStudentBySlug(slug: string): Promise<ApiResponse<Course>> {
    const response = await http.get(`${this.baseUrl}/packs/${slug}`);

    return response.data;
  }

  async enrollCourse(courseId: string, orderItemId?: string): Promise<ApiResponse<void>> {
    try {
      const response = await http.post(
        `student/packs/${courseId}/enroll`,
        orderItemId ? { orderItemId } : {}
      );
      parseBackendResponse(response.data);

      if (response.status === 201) {
        return {
          success: true,
          data: undefined,
        };
      }

      if (response.status === 400) {
        return {
          success: false,
          data: undefined,
        };
      }

      return {
        success: false,
        data: undefined,
      };
    } catch (error: any) {
      logger.error('Enrollment error:', error);
      return {
        success: false,
        data: undefined,
      };
    }
  }


  async enrollFreeCourse(courseId: string) {
    try {
      await http.post(
        `student/packs/${courseId}/enroll-free`
      );

    } catch (error: any) {

      return {
        success: false,
        data: undefined,
      };
    }
  }

  async getProgress(courseId: string): Promise<ApiResponse<{
    progress: number;
    completedLessons: number;
    totalLessons: number;
    lastAccessed: string;
  }>> {
    const response = await http.get(`${this.baseUrl}/courses/${courseId}/progress`);
    const progress = parseBackendResponse<{
      progress: number;
      completedLessons: number;
      totalLessons: number;
      lastAccessed: string;
    }>(response.data);
    return {
      success: true,
      data: progress,
    };
  }


  /**
   * GET /api/v1/packs/:courseId/modules
   * Get all modules for enrolled course
   */
  async getModules(courseId: string): Promise<ApiResponse<any[]>> {
    const response = await packService.getModules(courseId);
    return {
      success: true,
      data: response.data || [],
    };
  }

  /**
   * GET /api/v1/packs/:courseId/modules/:moduleId
   * Get module detail for enrolled course
   */
  async getModule(courseId: string, moduleId: string): Promise<ApiResponse<any>> {
    const response = await packService.getModule(courseId, moduleId);
    return {
      success: true,
      data: response.data,
    };
  }

  /**
   * GET /api/v1/packs/:courseId/modules/:moduleId/lessons
   * Get lessons for a module
   * NOTE: This endpoint might not exist in backend yet - lessons might be in module data
   */
  async getLessons(courseId: string, moduleId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await packService.getLessons(courseId, moduleId);
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error: any) {
      logger.warn('⚠️ Lessons endpoint not found, trying to extract from module data');
      try {
        const moduleResponse = await packService.getModule(courseId, moduleId);
        const lessons = moduleResponse.data?.lessons || moduleResponse.data?.Lessons || [];
        return {
          success: true,
          data: lessons,
        };
      } catch (moduleError) {
        logger.error('❌ Failed to get lessons:', moduleError);
        return {
          success: false,
          data: [],
        };
      }
    }
  }

  /**
   * GET /api/v1/packs/:courseId/modules/:moduleId/lessons/:lessonId
   * Get lesson detail for enrolled student
   * NOTE: This endpoint might not exist in backend yet
   */
  async getLesson(courseId: string, moduleId: string, lessonId: string): Promise<ApiResponse<any>> {
    try {
      const response = await packService.getLesson(courseId, moduleId, lessonId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      logger.warn('⚠️ Lesson detail endpoint not found, trying to extract from module data');
      try {
        const moduleResponse = await packService.getModule(courseId, moduleId);
        const lessons = moduleResponse.data?.lessons || moduleResponse.data?.Lessons || [];
        const lesson = lessons.find((l: any) => l.id === lessonId || l._id === lessonId);

        if (!lesson) {
          throw new Error('Lesson not found');
        }

        return {
          success: true,
          data: lesson,
        };
      } catch (moduleError) {
        logger.error('❌ Failed to get lesson:', moduleError);
        return {
          success: false,
          data: null,
        };
      }
    }
  }


  /**
   * GET /api/v1/packs/:courseId/assignments/:assignmentId
   * Get assignment detail
   * This endpoint exists for teachers to view/edit assignments
   */
  async getAssignment(courseId: string, assignmentId: string): Promise<ApiResponse<any>> {
    try {
      const response = await http.get(`${this.packsBaseUrl}/${courseId}/assignments/${assignmentId}`);
      const assignment = parseBackendResponse<any>(response.data);
      return {
        success: true,
        data: assignment,
      };
    } catch (error: any) {
      logger.error('❌ Failed to get assignment:', error);
      return {
        success: false,
        data: null,
      };
    }
  }

  // async submitAssignment(
  //   courseId: string,
  //   assignmentId: string,
  //   data: {
  //     content?: string;
  //     fileUrls?: string[];
  //   }
  // ): Promise<ApiResponse<any>> {
  //   try {
  //     const response = await http.post(
  //       `${this.baseUrl}/packs/${courseId}/assignments/${assignmentId}/submit`,
  //       data
  //     );
  //     const result = parseBackendResponse<any>(response.data);
  //     return {
  //       success: true,
  //       data: result,
  //     };
  //   } catch (error: any) {
  //     logger.error('❌ Failed to submit assignment:', error);
  //     throw error;
  //   }
  // }

  async submitQuiz(courseId: string, quizId: string, answers: {
    questionId: string;
    selectedOption: string;
  }[]): Promise<ApiResponse<{
    score: number;
    totalPoints: number;
    passed: boolean;
    answers: any[];
  }>> {
    try {
      const response = await http.post(
        `${this.baseUrl}/packs/${courseId}/quizzes/${quizId}/submit`,
        { answers }
      );
      const result = parseBackendResponse<any>(response.data);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      logger.error('❌ Failed to submit quiz:', error);
      throw error;
    }
  }

  /**
   * GET /api/v1/packs/:courseId/assignments
   * Get assignments for a course
   * This endpoint is used by teachers, but students might also have access
   */
  async getAssignments(courseId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await http.get(`${this.packsBaseUrl}/${courseId}/assignments`);
      const assignments = parseBackendResponse<any[]>(response.data);
      return {
        success: true,
        data: assignments || [],
      };
    } catch (error: any) {
      logger.error('❌ Failed to get assignments:', error);
      return {
        success: false,
        data: [],
      };
    }
  }

  /**
   * POST /api/v1/student/packs/:courseId/lessons/:lessonId/complete
   * Mark lesson as complete
   * ⚠️ TODO: This endpoint might not exist yet in backend
   */
  async completeLesson(courseId: string, lessonId: string): Promise<ApiResponse<void>> {
    try {
      const response = await http.post(
        `${this.baseUrl}/packs/${courseId}/lessons/${lessonId}/complete`
      );
      parseBackendResponse(response.data);
      return {
        success: true,
        data: undefined,
      };
    } catch (error: any) {
      logger.error('❌ Failed to complete lesson:', error);
      return {
        success: false,
        data: undefined,
      };
    }
  }

  /**
   * GET /api/v1/packs/:courseId/modules/:moduleId/quiz
   * Get quiz for a module
   * Note: This endpoint might return quiz data within module data
   */
  async getQuiz(courseId: string, quizId: string): Promise<ApiResponse<any>> {
    try {
      const response = await http.get(`${this.packsBaseUrl}/${courseId}/modules/${quizId}`);
      const quiz = parseBackendResponse<any>(response.data);
      return {
        success: true,
        data: quiz,
      };
    } catch (error: any) {
      logger.error('❌ Failed to get quiz:', error);
      return {
        success: false,
        data: null,
      };
    }
  }

  async getAssignmentsBySection(
    courseId: string,
    sectionId: string
  ): Promise<ApiResponse<Assignment[]>> {
    try {
      const response = await http.get(
        `${this.baseUrl}/packs/${courseId}/sections/${sectionId}/assignments`
      );

      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch assignments:', error);
      return {
        success: false,
        data: [],
      };
    }
  }

  async submitAssignment(
    enrollmentId: string,
    payload: SubmitAssignmentPayload
  ): Promise<ApiResponse<AssignmentSubmissionResponse>> {
    try {
      const response = await http.post(
        `/student/enrollments/${enrollmentId}/assignments/submit`,
        payload
      );
      return response.data;
    } catch (error: any) {
      logger.error('Failed to submit assignment:', error);
      return {
        success: false,
        data: null as any,
      };
    }
  }

  /**
   * Get assignment attempt details
   */
  async getAssignmentAttempt(attemptId: string): Promise<ApiResponse<any>> {
    try {
      const response = await http.get(`/student/assignments/attempts/${attemptId}`);
      const parsed = parseBackendResponse<any>(response.data);
      // BE (pack-service) wraps with { success, data: attempt }
      // API Gateway wraps again with { status, data: { success, data: attempt } }
      // parseBackendResponse extracts outer → { success: true, data: attempt }
      // So we need to unwrap one more level if parsed has .data
      const attempt = parsed?.data ?? parsed;
      return {
        success: true,
        data: attempt,
      };
    } catch (error: any) {
      logger.error('Failed to fetch assignment attempt:', error);
      return {
        success: false,
        data: null,
      };
    }
  }

  /**
   * POST /api/v1/packs/:courseId/reviews
   * Create or update course review
   */
  async createOrUpdateReview(
    courseId: string,
    data: { rating: number; comment?: string }
  ): Promise<ApiResponse<any>> {
    try {
      const response = await http.post(`/packs/${courseId}/reviews`, data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
      };
    }
  }

  /**
   * GET /api/v1/packs/:courseId/reviews
   * Get my review for this course
   */
  async getMyReview(courseId: string): Promise<ApiResponse<any>> {
    try {
      const response = await http.get(`/packs/${courseId}/reviews`);
      const reviews = response.data?.data?.data || response.data?.data || [];

      // Filter to get only current user's review if needed
      // For now, return the first one assuming backend filters by user
      return {
        success: true,
        data: reviews[0] || null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
      };
    }
  }
}

export default new StudentCourseService();
