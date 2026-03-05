import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';

export interface NotificationSettings {
  studentSubmission?: {
    email: boolean;
    inApp: boolean;
  };
  pendingGrading?: {
    email: boolean;
    inApp: boolean;
  };
  courseCompletion?: {
    email: boolean;
    inApp: boolean;
  };
}

class NotificationSettingsService {
  /**
   * GET /api/v1/notifications/settings
   * Get notification settings
   * Backend returns: { status: 'success', data: NotificationSettings }
   */
  async get(): Promise<ApiResponse<NotificationSettings>> {
    const response = await http.get('/notifications/settings');
    const settings = parseBackendResponse<NotificationSettings>(response.data);
    return {
      success: true,
      data: settings,
    };
  }

  /**
   * PUT /api/v1/notifications/settings
   * Update notification settings
   * Backend returns: { status: 'success', message: '...', data: NotificationSettings }
   */
  async update(data: NotificationSettings): Promise<ApiResponse<NotificationSettings>> {
    const response = await http.put('/notifications/settings', data);
    const settings = parseBackendResponse<NotificationSettings>(response.data);
    return {
      success: true,
      data: settings,
    };
  }
}

export default new NotificationSettingsService();

