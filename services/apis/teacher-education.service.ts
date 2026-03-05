import { http } from '../http';
import type { ApiResponse } from '../http/types';
import type { Education } from '@/types/teacher.types';
import { parseBackendResponse } from '../http/response-parser';

class TeacherEducationService {
  /**
   * GET /api/v1/teacher-profile/educations
   * List teacher educations
   * Backend returns: { status: 'success', data: Education[] }
   */
  async list(): Promise<ApiResponse<Education[]>> {
    const response = await http.get('/teacher-profile/educations');
    const educations = parseBackendResponse<Education[]>(response.data);
    return {
      success: true,
      data: educations || [],
    };
  }

  /**
   * POST /api/v1/teacher-profile/educations
   * Create new education
   * Backend returns: { status: 'success', message: '...', data: Education }
   */
  async create(data: {
    school: string;
    degree?: string;
    educationLevel?: string;
  }): Promise<ApiResponse<Education>> {
    const response = await http.post('/teacher-profile/educations', data);
    const education = parseBackendResponse<Education>(response.data);
    return {
      success: true,
      data: education,
    };
  }

  /**
   * PUT /api/v1/teacher-profile/educations/{educationId}
   * Update education
   * Backend returns: { status: 'success', message: '...', data: Education }
   */
  async update(
    id: string,
    data: {
      school?: string;
      degree?: string;
      educationLevel?: string;
    }
  ): Promise<ApiResponse<Education>> {
    const response = await http.put(
      `/teacher-profile/educations/${id}`,
      data
    );
    const education = parseBackendResponse<Education>(response.data);
    return {
      success: true,
      data: education,
    };
  }

  /**
   * DELETE /api/v1/teacher-profile/educations/{educationId}
   * Delete education
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await http.delete(
      `/teacher-profile/educations/${id}`
    );
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }
}

export default new TeacherEducationService();

