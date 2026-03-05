import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';

export interface StudentSocialLinks {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
}

/**
 * Student Profile Types
 * Based on backend API: /api/v1/student-profile
 */
export interface StudentProfile {
  id: string;
  userId: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  interests?: string;
  learningGoals?: string;
  preferredLanguages?: string;
  schoolName?: string;
  socialLinks?: StudentSocialLinks | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStudentProfileRequest {
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  bio?: string | null;
  interests?: string | null;
  learningGoals?: string | null;
  preferredLanguages?: string | null;
  schoolName?: string | null;
  socialLinks?: StudentSocialLinks | null;
}

/**
 * Student Profile Service
 * Handles student profile operations
 */
class StudentProfileService {
  private readonly baseUrl = '/student-profile';

  /**
   * GET /student-profile
   * Get current student's profile
   * Backend returns: { status: 'success', message: '...', data: StudentProfile }
   */
  async getProfile(): Promise<ApiResponse<StudentProfile>> {
    const response = await http.get(this.baseUrl);
    const profile = parseBackendResponse<StudentProfile>(response.data);
    return {
      success: true,
      data: profile,
    };
  }

  /**
   * POST /student-profile
   * Create student profile
   * Backend returns: { status: 'success', message: '...', data: StudentProfile }
   */
  async createProfile(data: UpdateStudentProfileRequest): Promise<ApiResponse<StudentProfile>> {
    const response = await http.post(this.baseUrl, data);
    const profile = parseBackendResponse<StudentProfile>(response.data);
    return {
      success: true,
      data: profile,
    };
  }

  /**
   * PUT /student-profile
   * Update student profile
   * Backend returns: { status: 'success', message: '...', data: StudentProfile }
   */
  async updateProfile(data: UpdateStudentProfileRequest): Promise<ApiResponse<StudentProfile>> {
    const response = await http.put(this.baseUrl, data);
    const profile = parseBackendResponse<StudentProfile>(response.data);
    return {
      success: true,
      data: profile,
    };
  }



  /**
   * DELETE /student-profile
   * Delete student profile
   * Backend returns: { status: 'success', message: '...' }
   */
  async deleteProfile(): Promise<ApiResponse<void>> {
    const response = await http.delete(this.baseUrl);
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }
}

export default new StudentProfileService();
