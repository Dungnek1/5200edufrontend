import { http } from '../http';
import type { ApiResponse } from '../http/types';
import type { SocialLink } from '@/types/teacher.types';
import { parseBackendResponse } from '../http/response-parser';

class SocialLinksService {
  /**
   * GET /api/v1/teacher-profile/social-links
   * List teacher social media links
   * Backend returns: { status: 'success', data: SocialLink[] }
   */
  async list(): Promise<ApiResponse<SocialLink[]>> {
    const response = await http.get('/teacher-profile/social-links');
    const links = parseBackendResponse<SocialLink[]>(response.data);
    return {
      success: true,
      data: links || [],
    };
  }

  /**
   * POST /api/v1/teacher-profile/social-links
   * Add new social media link
   * Backend returns: { status: 'success', message: '...', data: SocialLink }
   */
  async create(data: {
    platform: string;
    url: string;
  }): Promise<ApiResponse<SocialLink>> {
    const response = await http.post('/teacher-profile/social-links', data);
    const link = parseBackendResponse<SocialLink>(response.data);
    return {
      success: true,
      data: link,
    };
  }

  /**
   * PUT /api/v1/teacher-profile/social-links/{socialLinkId}
   * Update social media link
   * Backend returns: { status: 'success', message: '...', data: SocialLink }
   */
  async update(
    id: string,
    data: { url: string }
  ): Promise<ApiResponse<SocialLink>> {
    const response = await http.put(
      `/teacher-profile/social-links/${id}`,
      data
    );
    const link = parseBackendResponse<SocialLink>(response.data);
    return {
      success: true,
      data: link,
    };
  }

  /**
   * DELETE /api/v1/teacher-profile/social-links/{socialLinkId}
   * Delete social media link
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await http.delete(
      `/teacher-profile/social-links/${id}`
    );
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }
}

export default new SocialLinksService();
