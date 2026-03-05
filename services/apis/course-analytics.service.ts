import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';


export interface EngagementData {
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  totalLessons: number;
  completedLessons: number;
  totalHoursWatched: number;
  last30DaysEnrollments: number;
  last30DaysCompletions: number;
}


export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  average: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}


export interface CourseStudentProgress {
  userId: string;
  userName: string;
  userAvatar?: string;
  email: string;
  enrolledAt: string;
  lastAccessedAt: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  completedAssignments: number;
  totalAssignments: number;
}

export interface StudentsResponse {
  students: CourseStudentProgress[];
  total: number;
  active: number;
  completed: number;
  averageProgress: number;
}


export interface AssignmentStats {
  totalAssignments: number;
  publishedAssignments: number;
  draftAssignments: number;
  totalSubmissions: number;
  pendingGrading: number;
  completedGrading: number;
  averageScore: number;
  submissionRate: number;
  onTimeSubmissionRate: number;
  assignments: {
    id: string;
    title: string;
    totalSubmissions: number;
    pendingGrading: number;
    averageScore: number;
    dueDate?: string;
  }[];
}

class CourseAnalyticsService {
  private readonly baseUrl = '/packs';

  async getEngagement(courseId: string): Promise<ApiResponse<EngagementData>> {
    const response = await http.get(
      `${this.baseUrl}/${courseId}/engagement`
    );
    const engagement = parseBackendResponse<EngagementData>(response.data);
    return {
      success: true,
      data: engagement,
    };
  }

  async getReviews(courseId: string): Promise<ApiResponse<ReviewsResponse>> {
    const response = await http.get(
      `${this.baseUrl}/${courseId}/reviews`
    );
    const reviews = parseBackendResponse<ReviewsResponse>(response.data);
    return {
      success: true,
      data: reviews,
    };
  }

  async getStudents(courseId: string): Promise<ApiResponse<StudentsResponse>> {
    const response = await http.get(
      `${this.baseUrl}/${courseId}/students`
    );
    const students = parseBackendResponse<StudentsResponse>(response.data);
    return {
      success: true,
      data: students,
    };
  }

  async getAssignmentStats(courseId: string): Promise<ApiResponse<AssignmentStats>> {
    const response = await http.get(
      `${this.baseUrl}/${courseId}/assignments/stats`
    );
    const stats = parseBackendResponse<AssignmentStats>(response.data);
    return {
      success: true,
      data: stats,
    };
  }
}

export default new CourseAnalyticsService();
