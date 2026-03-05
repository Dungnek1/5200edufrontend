
import type { ApiResponse } from '../http/types';
import type { TeacherProfile, CreateProfileDto, UpdateProfileDto } from '@/types/teacher.types';
import { parseBackendResponse } from '../http/response-parser';
import { http } from '../http';

class TeacherProfileService {
  /**
   * GET /api/v1/teacher-profile
   * Get teacher profile for authenticated user
   * Backend returns: { status: 'success', message: '...', data: TeacherProfile }
   */
  async get(): Promise<ApiResponse<TeacherProfile>> {
    const response = await http.get('/teacher-profile');
    const profile = parseBackendResponse<TeacherProfile>(response.data);
    return {
      success: true,
      data: profile,
    };
  }

  /**
   * POST /api/v1/teacher-profile
   * Create teacher profile (first time)
   * Backend returns: { status: 'success', message: '...', data: TeacherProfile }
   */
  async create(data: CreateProfileDto): Promise<ApiResponse<TeacherProfile>> {
    const response = await http.post('/teacher-profile', data);
    const profile = parseBackendResponse<TeacherProfile>(response.data);
    return {
      success: true,
      data: profile,
    };
  }

  /**
   * PUT /api/v1/teacher-profile
   * Update teacher profile
   * Backend returns: { status: 'success', message: '...', data: TeacherProfile }
   */
  async update(data: UpdateProfileDto): Promise<ApiResponse<TeacherProfile>> {
    const response = await http.put('/teacher-profile', data);
    const profile = parseBackendResponse<TeacherProfile>(response.data);
    return {
      success: true,
      data: profile,
    };
  }

  /**
   * POST /api/v1/users/avatar
   * Upload teacher avatar (using user endpoint)
   * Content-Type: multipart/form-data
   * Backend returns: { status: 'success', message: '...', data: { avatarUrl: string } }
   *
   * ⚠️ Note: Using /users/avatar endpoint instead of teacher-specific endpoint
   * TODO: Backend should implement POST /api/v1/teacher-profile/avatar for teacher-specific avatar upload
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await http.post(
      '/users/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const profile = parseBackendResponse<{ avatarUrl?: string }>(response.data);
    return {
      success: true,
      data: { imageUrl: profile.avatarUrl || '' },
    };
  }
}

export default new TeacherProfileService();
