import { http } from '../http';
import type { ApiResponse } from '../http/types';
import type { Course } from '@/types/course';
import { parseBackendResponse } from '../http/response-parser';

/**
 * Course response type
 */
export interface CourseResponse {
  success: boolean;
  data: Course;
  message?: string;
}

/**
 * My Courses Response
 */
export interface MyCoursesResponse {
  success: boolean;
  data: Course[];
  total: number;
}

/**
 * Publish request types
 */
export interface SchedulePublishRequest {
  scheduledAt: string; // ISO datetime string
}

/**
 * Teacher Course Service
 * Handles course management for teachers
 */
class TeacherCourseService {
  private readonly baseUrl = '/packs';

  /**
   * GET /packs/my
   * Get all courses for current teacher
   * Backend returns: { status: 'success', message: '...', data: { data: Course[], meta: {...}, ... } }
   * @param status - Optional status filter: 'DRAFT', 'PUBLISHED', 'UPCOMING', 'ARCHIVED'
   */
  async listCourses(status?: string): Promise<ApiResponse<Course[]>> {
    const params = status ? { status } : {};
    const response = await http.get(`${this.baseUrl}/my`, { params });
    console.log("response gốc", response.data);
    const backendData = parseBackendResponse<{ data: Course[]; meta: { total: number; page: number; limit: number } }>(response.data);
    return {
      success: true,
      //@ts-ignore
      data: Array.isArray(backendData) ? backendData : [],
    };
  }

  /**
   * GET /packs/:courseId
   * Get course details by ID
   * Backend returns: { status: 'success', data: Course }
   */
  async getCourse(courseId: string): Promise<ApiResponse<Course>> {
    const response = await http.get(`${this.baseUrl}/${courseId}`);
    const course = parseBackendResponse<Course>(response.data);
    return {
      success: true,
      data: course,
    };
  }

  /**
   * POST /packs
   * Create a new course
   * Backend returns: { status: 'success', message: '...', data: Course }
   */
  async createCourse(data: {
    title: string;
    price?: number;
    description?: string;
    categoryIds?: string[];
    language?: string;
    learningOutcomes?: string[];
  }): Promise<ApiResponse<Course>> {
    const response = await http.post(this.baseUrl, data);
    const course = parseBackendResponse<Course>(response.data);
    return {
      success: true,
      data: course,
    };
  }

  /**
   * PUT /packs/:courseId
   * Update course details
   * Backend returns: { status: 'success', message: '...', data: Course }
   */
  async updateCourse(courseId: string, data: Partial<Course>): Promise<ApiResponse<Course>> {
    const response = await http.put(`${this.baseUrl}/${courseId}`, data);
    const course = parseBackendResponse<Course>(response.data);
    return {
      success: true,
      data: course,
    };
  }

  /**
   * POST /packs/:courseId/thumbnail
   * Upload course thumbnail
   * Backend returns: { status: 'success', message: '...', data: Course }
   */
  async uploadCourseImage(courseId: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await http.post(
      `${this.baseUrl}/${courseId}/thumbnail`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const course = parseBackendResponse<Course>(response.data);
    return {
      success: true,
      data: { imageUrl: course.thumbnailUrl || '' },
    };
  }



  /**
   * POST /packs/:courseId/schedule-publish
   * Schedule course for future publishing
   * Backend returns: { status: 'success', message: '...', data: any }
   */
  async schedulePublish(courseId: string, data: SchedulePublishRequest): Promise<ApiResponse<void>> {
    const response = await http.post(
      `${this.baseUrl}/${courseId}/schedule-publish`,
      data
    );
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }


  /**
   * Unpublish a course (workaround - uses update endpoint)
   * ⚠️ Backend doesn't have dedicated unpublish endpoint yet
   * Workaround: Update status to DRAFT
   */
  async unpublishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return this.updateCourse(courseId, { status: 'DRAFT' });
  }

  /**
   * DELETE /packs/:courseId
   * Delete a course
   */
  async deleteCourse(courseId: string): Promise<ApiResponse<void>> {
    const response = await http.delete(`${this.baseUrl}/${courseId}`);
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * POST /packs/:courseId/modules
   * Create a new module
   * Backend returns: { status: 'success', message: '...', data: Module }
   */
  async createModule(courseId: string, data: {
    title: string;
    description?: string;
    sortOrder?: number;
  }): Promise<ApiResponse<any>> {
    const response = await http.post(
      `${this.baseUrl}/${courseId}/modules`,
      data
    );
    const module = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: module,
    };
  }

  /**
   * PUT /packs/:courseId/modules/:moduleId
   * Update module details
   */
  async updateModule(
    courseId: string,
    moduleId: string,
    data: {
      title?: string;
      description?: string;
      sortOrder?: number;
    }
  ): Promise<ApiResponse<any>> {
    const response = await http.put(
      `${this.baseUrl}/${courseId}/modules/${moduleId}`,
      data
    );
    const module = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: module,
    };
  }

  /**
   * PATCH /packs/:courseId/modules/:moduleId/settings
   * Update module settings (minFinish, targetSection)
   */
  async updateModuleSettings(
    courseId: string,
    moduleId: string,
    data: {
      minFinsish?: number | null;
      targetSection?: string[] | null;
    }
  ): Promise<ApiResponse<any>> {
    const response = await http.patch(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/settings`,
      data
    );
    const module = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: module,
    };
  }

  /**
   * DELETE /packs/:courseId/modules/:moduleId
   * Delete a module
   */
  async deleteModule(courseId: string, moduleId: string): Promise<ApiResponse<void>> {
    const response = await http.delete(
      `${this.baseUrl}/${courseId}/modules/${moduleId}`
    );
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * DELETE /packs/:courseId/modules/:moduleId/video
   * Delete module video
   */
  async deleteModuleVideo(courseId: string, moduleId: string): Promise<ApiResponse<void>> {
    const response = await http.delete(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/video`
    );
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }


  /**
   * PUT /packs/:courseId/modules/reorder
   * Reorder modules
   * ⚠️ TODO: Backend endpoint doesn't exist yet
   */
  async reorderModules(courseId: string, moduleIds: string[]): Promise<ApiResponse<void>> {
    try {
      const response = await http.put(
        `${this.baseUrl}/${courseId}/modules/reorder`,
        { moduleIds }
      );
      parseBackendResponse(response.data);
      return {
        success: true,
        data: undefined,
      };
    } catch (error: any) {
      logger.warn('⚠️ reorderModules endpoint not implemented yet:', error.message);
      throw error;
    }
  }


  /**
   * Backend architecture: Modules have videos directly
   * Frontend was assuming: Modules contain Lessons, Lessons have videos
   *
   * Backend has: PUT /packs/:courseId/modules/:moduleId/video
   * Frontend was calling: POST /packs/:courseId/modules/:moduleId/lessons (NOT EXISTS)
   *
   * These methods are DISABLED until backend implements lesson CRUD
   * OR frontend refactors to use module-based approach
   */

  /**
   * POST /packs/:courseId/modules/:moduleId/lessons
   * Create a new lesson
   * ⚠️ TODO: Backend endpoint doesn't exist. Architecture mismatch with backend.
   * Backend uses: Module with video directly, not Lesson-based approach
   */
  async createLesson(courseId: string, moduleId: string, data: {
    title: string;
    description?: string;
    videoUrl?: string;
    duration?: number;
    isFree?: boolean;
    sortOrder?: number;
  }): Promise<ApiResponse<any>> {
    logger.warn('⚠️ createLesson endpoint not implemented. Backend uses module-based architecture.');
    throw new Error('Lesson CRUD not supported - use module-based approach instead');
  }

  /**
   * PUT /packs/:courseId/modules/:moduleId/lessons/:lessonId
   * Update a lesson
   * ⚠️ TODO: Backend endpoint doesn't exist. Architecture mismatch.
   */
  async updateLesson(courseId: string, moduleId: string, lessonId: string, data: {
    title?: string;
    description?: string;
    videoUrl?: string;
    duration?: number;
    isFree?: boolean;
    sortOrder?: number;
  }): Promise<ApiResponse<any>> {
    logger.warn('⚠️ updateLesson endpoint not implemented. Backend uses module-based architecture.');
    throw new Error('Lesson CRUD not supported - use module-based approach instead');
  }

  /**
   * DELETE /packs/:courseId/modules/:moduleId/lessons/:lessonId
   * Delete a lesson
   * ⚠️ TODO: Backend endpoint doesn't exist. Architecture mismatch.
   */
  async deleteLesson(courseId: string, moduleId: string, lessonId: string): Promise<ApiResponse<void>> {
    logger.warn('⚠️ deleteLesson endpoint not implemented. Backend uses module-based architecture.');
    throw new Error('Lesson CRUD not supported - use module-based approach instead');
  }

  /**
   * POST /packs/:courseId/modules/:moduleId/lessons/:lessonId/video
   * Upload lesson video
   * ⚠️ Use: PUT /packs/:courseId/modules/:moduleId/video instead
   */
  async uploadLessonVideo(
    courseId: string,
    moduleId: string,
    lessonId: string,
    file: File
  ): Promise<ApiResponse<{ videoUrl: string }>> {
    logger.warn('⚠️ uploadLessonVideo not supported. Use setModuleVideo() instead.');
    throw new Error('Lesson video upload not supported - use module video instead');
  }

  /**
   * PUT /packs/:courseId/modules/:moduleId/video
   * Set video for module (BACKEND SUPPORTED)
   * This is the CORRECT way to handle video content
   */
  async setModuleVideo(
    courseId: string,
    moduleId: string,
    videoUrl: string
  ): Promise<ApiResponse<void>> {
    const response = await http.put(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/video`,
      { videoUrl }
    );
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * POST /packs/:courseId/modules/:moduleId/lessons/:lessonId/documents
   * Upload lesson documents
   * ⚠️ Use: POST /packs/:courseId/modules/:moduleId/document instead
   */
  async uploadLessonDocuments(
    courseId: string,
    moduleId: string,
    lessonId: string,
    files: File[]
  ): Promise<ApiResponse<{ documents: Array<{ id: string; url: string; name: string }> }>> {
    logger.warn('⚠️ uploadLessonDocuments not supported. Use uploadModuleDocument() instead.');
    throw new Error('Lesson documents not supported - use module documents instead');
  }

  /**
   * DELETE /packs/:courseId/modules/:moduleId/lessons/:lessonId/documents/:documentId
   * Delete lesson document
   * ⚠️ Use module documents instead
   */
  async deleteLessonDocument(
    courseId: string,
    moduleId: string,
    lessonId: string,
    documentId: string
  ): Promise<ApiResponse<void>> {
    logger.warn('⚠️ deleteLessonDocument not supported. Use deleteModuleDocument() instead.');
    throw new Error('Lesson documents not supported - use module documents instead');
  }

  /**
   * GET /packs/:courseId/modules/:moduleId/documents
   * Get module documents
   * Backend returns: { status: 'success', data: Document[] }
   */
  async getModuleDocuments(courseId: string, moduleId: string): Promise<ApiResponse<any[]>> {
    const response = await http.get(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/documents`
    );
    const documents = parseBackendResponse<any[]>(response.data);
    return {
      success: true,
      data: documents || [],
    };
  }

  /**
   * GET /packs/:courseId/modules/:moduleId/documents/download
   * Download all module documents as ZIP
   */
  async downloadModuleDocuments(courseId: string, moduleId: string): Promise<Blob> {
    const response = await http.get(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/documents/download`,
      {
        responseType: 'blob'
      }
    );
    return response.data;
  }

  /**
   * DELETE /packs/:courseId/modules/:moduleId/documents/:documentId
   * Delete module document
   */
  async deleteModuleDocument(
    courseId: string,
    moduleId: string,
    documentId: string
  ): Promise<ApiResponse<void>> {
    const response = await http.delete(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/documents/${documentId}`
    );
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * GET /packs/:courseId/assignments
   * Get course assignments
   * Backend returns: { status: 'success', data: Assignment[] }
   */
  async getAssignments(courseId: string): Promise<ApiResponse<any[]>> {
    const response = await http.get(
      `${this.baseUrl}/${courseId}/assignments`
    );
    const assignments = parseBackendResponse<any[]>(response.data);
    return {
      success: true,
      data: assignments || [],
    };
  }

  /**
   * POST /packs/:courseId/assignments
   * Create assignment
   * Backend returns: { status: 'success', message: '...', data: Assignment }
   */
  async createAssignment(courseId: string, data: {
    title: string;
    description?: string;
    dueDate?: string;
    totalPoints?: number;
  }): Promise<ApiResponse<any>> {
    const response = await http.post(
      `${this.baseUrl}/${courseId}/assignments`,
      data
    );
    const assignment = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: assignment,
    };
  }

  /**
   * GET /packs/:courseId/assignments/:assignmentId
   * Get assignment details
   * Backend returns: { status: 'success', message: '...', data: Assignment }
   */
  async getAssignment(courseId: string, assignmentId: string): Promise<ApiResponse<any>> {
    const response = await http.get(
      `${this.baseUrl}/${courseId}/assignments/${assignmentId}`
    );
    const assignment = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: assignment,
    };
  }

  /**
   * PUT /packs/:courseId/assignments/:assignmentId
   * Update assignment
   * Backend returns: { status: 'success', message: '...', data: Assignment }
   */
  async updateAssignment(courseId: string, assignmentId: string, data: {
    title?: string;
    description?: string;
    dueDate?: string;
    totalPoints?: number;
  }): Promise<ApiResponse<any>> {
    const response = await http.put(
      `${this.baseUrl}/${courseId}/assignments/${assignmentId}`,
      data
    );
    const assignment = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: assignment,
    };
  }

  /**
   * DELETE /packs/:courseId/assignments/:assignmentId
   * Delete assignment
   */
  async deleteAssignment(courseId: string, assignmentId: string): Promise<ApiResponse<void>> {
    const response = await http.delete(
      `${this.baseUrl}/${courseId}/assignments/${assignmentId}`
    );
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * POST /packs/:courseId/modules/:moduleId/quiz
   * Create quiz assignment for module
   * Backend returns: { status: 'success', message: '...', data: Assignment }
   */
  async createQuiz(
    courseId: string,
    moduleId: string,
    data: {
      title: string;
      instructions?: string;
      passScore?: number;
      timeLimitSeconds?: number;
      questions: Array<{
        prompt: string;
        points?: number;
        options: Array<{
          text: string;
          isCorrect: boolean;
        }>;
      }>;
    }
  ): Promise<ApiResponse<any>> {
    const response = await http.post(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/quiz`,
      data
    );
    const assignment = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: assignment,
    };
  }

  /**
   * GET /packs/:courseId/modules/:moduleId/quizzes
   * Get all quizzes for a module
   */
  async getModuleQuizzes(courseId: string, moduleId: string): Promise<ApiResponse<any[]>> {
    const response = await http.get(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/quizzes`
    );
    const quizzes = parseBackendResponse<any[]>(response.data);
    return {
      success: true,
      data: quizzes || [],
    };
  }

  /**
   * GET /packs/:courseId/modules/:moduleId/quiz/:quizId
   * Get quiz details
   */
  async getQuiz(courseId: string, moduleId: string, quizId: string): Promise<ApiResponse<any>> {
    const response = await http.get(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/quiz/${quizId}`
    );
    const quiz = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: quiz,
    };
  }

  /**
   * PUT /packs/:courseId/modules/:moduleId/quiz/:quizId
   * Update quiz
   */
  async updateQuiz(
    courseId: string,
    moduleId: string,
    quizId: string,
    data: {
      title?: string;
      instructions?: string;
      passScore?: number;
      timeLimitSeconds?: number;
      questions?: Array<{
        prompt: string;
        points?: number;
        options: Array<{
          text: string;
          isCorrect: boolean;
        }>;
      }>;
    }
  ): Promise<ApiResponse<any>> {
    const response = await http.put(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/quiz/${quizId}`,
      data
    );
    const quiz = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: quiz,
    };
  }

  /**
   * DELETE /packs/:courseId/modules/:moduleId/quiz/:quizId
   * Delete quiz
   */
  async deleteQuiz(courseId: string, moduleId: string, quizId: string): Promise<ApiResponse<void>> {
    const response = await http.delete(
      `${this.baseUrl}/${courseId}/modules/${moduleId}/quiz/${quizId}`
    );
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }
  /**
   * POST /packs/:courseId/publish-now
   * Publish course immediately
   */
  async publishCourse(courseId: string): Promise<ApiResponse<void>> {
    const response = await http.post<ApiResponse<void>>(
      `${this.baseUrl}/${courseId}/publish-now`
    );
    return response.data;
  }

  /**
   * GET /teacher/categories
   * Get list of course categories for teachers
   */
  async getCategories(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
  }>>> {
    const response = await http.get('/teacher/categories');

    const categoriesData = parseBackendResponse<any[]>(response.data);

    const categories = Array.isArray(categoriesData)
      ? categoriesData.map(c => ({
        ...c,
        id: c.id || c._id, // Handle MongoDB _id
        name: c.name || 'Unnamed Category',
        slug: c.slug || '',
        sortOrder: c.sortOrder || 0
      }))
      : [];


    return {
      success: true,
      data: categories,
    };
  }

  /**
   * GET /categories
   * Get public list of course categories (fallback if teacher endpoint returns empty)
   */
  async getPublicCategories(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
  }>>> {
    const response = await http.get('/categories');

    const categoriesData = parseBackendResponse<any[]>(response.data);

    const categories = Array.isArray(categoriesData)
      ? categoriesData.map(c => ({
        ...c,
        id: c.id || c._id, // Handle MongoDB _id
        name: c.name || 'Unnamed Category',
        slug: c.slug || '',
        sortOrder: c.sortOrder || 0
      }))
      : [];

    return {
      success: true,
      data: categories,
    };
  }

  /**
   * GET /categories/:id
   * Get category detail by ID or slug
   */
  async getCategory(id: string): Promise<ApiResponse<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
  }>> {
    const response = await http.get(`/categories/${id}`);
    const category = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: {
        id: category.id || category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: category.sortOrder || 0,
      },
    };
  }

  /**
   * GET /tags
   * Get list of available tags
   */
  async getTags(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    slug: string;
  }>>> {
    const response = await http.get('public/tags');
    const tagsData = parseBackendResponse<any[]>(response.data);
    const tags = Array.isArray(tagsData)
      ? tagsData.map(t => ({
        id: t.id || t._id,
        name: t.name || '',
        slug: t.slug || '',
      }))
      : [];
    return {
      success: true,
      data: tags,
    };
  }

  /**
   * GET /packs/coupons
   * Get list of available coupons for teacher
   */
  async getCoupons(): Promise<ApiResponse<Array<{
    id: string;
    code: string;
    description?: string;
    discountValue: number;
    discountType: string;
  }>>> {
    const response = await http.get(`${this.baseUrl}/coupons`);
    const couponsData = parseBackendResponse<any[]>(response.data);
    const coupons = Array.isArray(couponsData)
      ? couponsData
      : [];
    return {
      success: true,
      data: coupons,
    };
  }

  /**
   * POST /packs/coupons
   * Create a new coupon
   */
  async createCoupon(data: {
    code: string;
    discountValue: number;
    discountType: string;
    description?: string;
  }): Promise<ApiResponse<any>> {
    const response = await http.post(`${this.baseUrl}/coupons`, data);
    const coupon = parseBackendResponse<any>(response.data);
    return {
      success: true,
      data: coupon,
    };
  }

  /**
   * POST /packs/coupons/assign
   * Assign coupon to course
   */
  async assignCouponToCourse(courseId: string, couponId: string): Promise<ApiResponse<void>> {
    const response = await http.post(`${this.baseUrl}/coupons/assign`, {
      courseId,
      couponId,
    });
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * GET /courses/:courseId/stats
   * Get course statistics
   */
  async getCourseStats(courseId: string): Promise<ApiResponse<{
    totalStudents: number;
    gradedAssignments: number;
    averageCompletion: number;
    revenue: number;
  }>> {
    const response = await http.get(`/packs/${courseId}/stats`);
    return response.data;
  }

  /**
   * GET /courses/:courseId/enrollments
   * Get course enrollments with pagination
   */
  async getCourseEnrollments(courseId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>> {
    const response = await http.get(`/packs/${courseId}/enrollments`, {
      params: { page, limit },
    });
    return {
      success: true,
      data: response.data,
    };
  }


  async getCourseEngagement(courseId: string, days: number = 7): Promise<ApiResponse<{
    dailyStats: Array<{
      date: string;
      newEnrollments: number;
      activeStudents: number;
      averageProgress: number;
    }>;
    summary: {
      totalNewEnrollments: number;
      totalActiveStudents: number;
      progressGrowth: number;
    };
  }>> {
    const response = await http.get(`/packs/${courseId}/engagement`, {
      params: { days },
    });
    return response.data;
  }

  async getCourseReviews(courseId: string, limit: number = 2): Promise<ApiResponse<{
    data: Array<{
      id: string;
      rating: number;
      comment: string | null;
      createdAt: string;
      student: {
        id: string;
        fullName: string;
        avatarUrl: string | null;
      };
    }>;
  }>> {
    const response = await http.get(`/packs/${courseId}/reviews`, {
      params: { limit },
    });
    return response.data;
  }
}

export default new TeacherCourseService();
