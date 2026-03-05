import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';

/**
 * Teacher Students Service
 * Handles TEACHER'S students management (students enrolled in teacher's courses)
 *
 * NOTE: This is NOT for student role users - it's for teachers to manage their students
 */

export interface TeacherStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  enrolledCourse: {
    id: string;
    title: string;
    duration: string;
    modules: number;
    assignments: number;
  };
  overallProgress: number;
  completedAssignments: number;
  totalAssignments: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'completed';
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  overallProgress: number;
  modules: {
    id: string;
    moduleNumber: string;
    title: string;
    status: 'completed' | 'pending-grading' | 'in-progress' | 'not-started';
    assignments?: number;
    grade?: string;
  }[];
}

export interface StudentStats {
  totalStudents: number;
  completionRate: number;
  pendingGrading: number;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  module: string;
  courseName: string;
  totalSubmitted: number;
  pendingGrading: number;
}

class TeacherStudentsService {
  private readonly baseUrl = '/packs/teacher';

  async getTeacherStudents(params?: {
    search?: string;
    page?: number;
    limit?: number;
    completionStatus?: 'completed' | 'in-progress' | 'not-started' | 'all';
    sortBy?: 'progress' | 'name' | 'enrolledAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<Record<string, unknown>[]> & { meta?: { total: number } }> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('q', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.completionStatus) queryParams.append('completionStatus', params.completionStatus);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    try {
      const response = await http.get(`${this.baseUrl}/students${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
      const raw = response.data ?? null;

      // Luôn trích mảng danh sách (hỗ trợ nhiều cấu trúc backend)
      let list: Record<string, unknown>[] = [];
      if (Array.isArray(raw)) {
        list = raw;
      } else if (raw && typeof raw === 'object') {
        const r = raw as Record<string, unknown>;
        if (Array.isArray(r.data)) list = r.data;
        else if (r.data && typeof r.data === 'object' && Array.isArray((r.data as Record<string, unknown>).data)) {
          list = (r.data as Record<string, unknown>).data as Record<string, unknown>[];
        }
      }

      const meta = raw && typeof raw === 'object' ? (raw as Record<string, unknown>).meta ?? (raw as Record<string, unknown>).pagination : undefined;
      const total = meta && typeof meta === 'object' && 'total' in meta ? Number((meta as { total?: number }).total) : undefined;

      return {
        success: true,
        data: list,
        ...(typeof total === 'number' && !Number.isNaN(total) && { meta: { total } }),
      };
    } catch (error) {
      return {
        success: false,
        data: [],
      };
    }
  }

  async getTeacherStats(): Promise<ApiResponse<StudentStats>> {
    try {
      const response = await http.get(`${this.baseUrl}/stats`);
      const data = response.data?.data || response.data;

      return {
        success: true,
        data: data || { totalStudents: 0, completionRate: 0, pendingGrading: 0 },
      };
    } catch (error) {
      return {
        success: false,
        data: { totalStudents: 0, completionRate: 0, pendingGrading: 0 },
      };
    }
  }

  async getTeacherAssignments(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ data: TeacherAssignment[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    try {
      const response = await http.get(`${this.baseUrl}/assignments${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
      const data = response.data?.data || response.data;

      return {
        success: true,
        data: data || { data: [], pagination: { total: 0, pages: 0 } },
      };
    } catch (error) {
      return {
        success: false,
        data: { data: [], pagination: { total: 0, pages: 0 } },
      };
    }
  }

  /**
   * GET /teacher/students/:studentId/progress
   * Get detailed progress of a specific student
   */
  async getStudentProgress(studentId: string, courseId: string): Promise<ApiResponse<StudentProgress>> {
    const response = await http.get(`/teacher/students/${studentId}/progress?courseId=${courseId}`);
    const progress = parseBackendResponse<StudentProgress>(response.data);

    return {
      success: true,
      data: progress,
    };
  }

  /**
   * GET /teacher/students/:studentId
   * Get detailed info of a specific student
   */
  async getStudentDetail(studentId: string): Promise<ApiResponse<TeacherStudent>> {
    const response = await http.get(`/teacher/students/${studentId}`);
    const student = parseBackendResponse<TeacherStudent>(response.data);

    return {
      success: true,
      data: student,
    };
  }

  /**
   * POST /teacher/students/:studentId/grade
   * Grade student assignment
   */
  async gradeAssignment(
    studentId: string,
    assignmentId: string,
    data: {
      score: number;
      feedback?: string;
    }
  ): Promise<ApiResponse<{ success: boolean }>> {
    const response = await http.post(
      `/teacher/students/${studentId}/assignments/${assignmentId}/grade`,
      data
    );

    return {
      success: true,
      data: response.data,
    };
  }
}

const teacherStudentsService = new TeacherStudentsService();
export default teacherStudentsService;