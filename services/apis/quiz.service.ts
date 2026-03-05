
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';
import { http } from '../http';

import { logger } from '@/lib/logger';

export type AssignmentType = 'QUIZ' | 'ESSAY';

export interface QuestionOption {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id?: string;
  prompt: string;
  explanation?: string;
  points: number; // Điểm cho mỗi câu hỏi
  options: QuestionOption[];
}

export interface EssayPrompt {
  rubric?: string; // Tiêu chí chấm điểm
  minWords?: number; // Số từ tối thiểu
  maxWords?: number; // Số từ tối đa
}

export interface CreateQuizParams {
  type: 'QUIZ';
  title: string;
  instructions?: string;
  timeLimitSeconds: number; // Thời gian làm bài (giây) - default 1800 (30 phút)
  passScore?: number; // Số điểm tối thiểu để pass
  questions: QuizQuestion[];
}

export interface CreateEssayParams {
  type: 'ESSAY';
  title: string;
  instructions?: string;
  essayPrompt: EssayPrompt;
}

export interface CreateAssignmentParams {
  sectionId?: string;
  type: AssignmentType;
  title: string;
  instructions?: string;
  timeLimitSeconds?: number; // For Quiz
  passScore?: number; // For Quiz
  questions?: QuizQuestion[]; // For Quiz
  essayPrompt?: EssayPrompt; // For Essay
}

export interface Assignment {
  id: string;
  type: AssignmentType;
  title: string;
  instructions?: string;
  timeLimitSeconds?: number;
  passScore?: number;
  isPublished?: boolean;
  questions?: QuizQuestion[];
  essayPrompt?: EssayPrompt;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAssignmentParams {
  title?: string;
  instructions?: string;
  timeLimitSeconds?: number;
  passScore?: number;
  isPublished?: boolean;
  questions?: QuizQuestion[];
  essayPrompt?: EssayPrompt;
}

class QuizService {
  private readonly defaultTimeLimit = 30 * 60; // 30 minutes in seconds

  /**
   * Create assignment (Quiz or Essay)
   * POST /api/v1/packs/{courseId}/assignments
   */
  async createAssignment(
    courseId: string,

    params: CreateAssignmentParams,
  ): Promise<ApiResponse<Assignment>> {
    try {
      const response = await http.post(
        `/packs/${courseId}/assignments`,
        params
      );

      const assignment = parseBackendResponse<Assignment>(response.data);
      return {
        success: true,
        data: assignment,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[QuizService] createAssignment error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to create assignment');
    }
  }

  /**
   * Get assignment detail
   * GET /api/v1/packs/{courseId}/assignments/{assignmentId}
   */
  async getAssignment(
    courseId: string,
    assignmentId: string
  ): Promise<ApiResponse<Assignment>> {
    try {
      const response = await http.get(
        `/packs/${courseId}/assignments/${assignmentId}`
      );

      const assignment = parseBackendResponse<Assignment>(response.data);
      return {
        success: true,
        data: assignment,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[QuizService] getAssignment error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to get assignment');
    }
  }

  /**
   * Update assignment
   * PUT /api/v1/packs/{courseId}/assignments/{assignmentId}
   */
  async updateAssignment(
    courseId: string,
    assignmentId: string,
    params: UpdateAssignmentParams
  ): Promise<ApiResponse<Assignment>> {
    try {
      const response = await http.put(
        `/packs/${courseId}/assignments/${assignmentId}`,
        params
      );

      const assignment = parseBackendResponse<Assignment>(response.data);
      return {
        success: true,
        data: assignment,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[QuizService] updateAssignment error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to update assignment');
    }
  }

  /**
   * Delete assignment
   * DELETE /api/v1/packs/{courseId}/assignments/{assignmentId}
   */
  async deleteAssignment(
    courseId: string,
    assignmentId: string
  ): Promise<ApiResponse<void>> {
    try {
      await http.delete(
        `/packs/${courseId}/assignments/${assignmentId}`
      );

      return {
        success: true,
        data: undefined,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[QuizService] deleteAssignment error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to delete assignment');
    }
  }

  /**
   * List assignments for a course
   * GET /api/v1/packs/{courseId}/assignments
   */
  async listAssignments(
    courseId: string
  ): Promise<ApiResponse<Assignment[]>> {
    try {
      const response = await http.get(
        `/packs/${courseId}/assignments`
      );

      const assignments = parseBackendResponse<Assignment[]>(response.data);
      return {
        success: true,
        data: assignments,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[QuizService] listAssignments error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to list assignments');
    }
  }

  /**
   * Helper: Format seconds to readable time
   * 1800 -> "30 phút"
   */
  formatTimeLimit(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours} giờ ${remainingMinutes} phút`
        : `${hours} giờ`;
    }
    return `${minutes} phút`;
  }

  /**
   * Helper: Convert minutes to seconds
   * 30 -> 1800
   */
  minutesToSeconds(minutes: number): number {
    return minutes * 60;
  }

  /**
   * Helper: Convert seconds to minutes
   * 1800 -> 30
   */
  secondsToMinutes(seconds: number): number {
    return Math.floor(seconds / 60);
  }

  /**
   * Helper: Calculate total quiz points
   */
  calculateTotalPoints(questions: QuizQuestion[]): number {
    return questions.reduce((total, q) => total + (q.points || 0), 0);
  }

  /**
   * Helper: Validate quiz questions
   * Returns error message if invalid, null if valid
   */
  validateQuizQuestions(questions: QuizQuestion[]): string | null {
    if (!questions || questions.length === 0) {
      return 'Vui lòng thêm ít nhất một câu hỏi';
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.prompt || q.prompt.trim() === '') {
        return `Câu hỏi ${i + 1}: Thiếu nội dung câu hỏi`;
      }

      if (!q.options || q.options.length < 2) {
        return `Câu hỏi ${i + 1}: Cần ít nhất 2 phương án`;
      }

      const hasCorrectAnswer = q.options.some(opt => opt.isCorrect);
      if (!hasCorrectAnswer) {
        return `Câu hỏi ${i + 1}: Chưa chọn đáp án đúng`;
      }

      if (q.points <= 0) {
        return `Câu hỏi ${i + 1}: Điểm phải lớn hơn 0`;
      }
    }

    return null; // Valid
  }

  /**
   * Helper: Validate essay prompt
   */
  validateEssayPrompt(essayPrompt: EssayPrompt): string | null {
    if (essayPrompt.minWords !== undefined && essayPrompt.minWords < 0) {
      return 'Số từ tối thiểu không được âm';
    }

    if (essayPrompt.maxWords !== undefined && essayPrompt.maxWords < 0) {
      return 'Số từ tối đa không được âm';
    }

    if (
      essayPrompt.minWords !== undefined &&
      essayPrompt.maxWords !== undefined &&
      essayPrompt.minWords > essayPrompt.maxWords
    ) {
      return 'Số từ tối thiểu không được lớn hơn số từ tối đa';
    }

    return null; // Valid
  }
}

export default new QuizService();
