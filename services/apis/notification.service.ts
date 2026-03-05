import { http } from '../http';
import type { ApiResponse } from '../http/types';

export interface GetNotificationsParams {
    limit?: number;
    page?: number;
    isRead?: boolean;
    type?: string;
    locale?: 'en' | 'vi';
    format?: 'full' | 'compact';
}

class NotificationService {
    /**
     * GET /api/v1/notifications
     * Lấy danh sách thông báo dạng HTML render
     * Backend returns: { status: 'success', message: '', data: string[] }
     */
    async getNotifications(
        params: GetNotificationsParams = {},
    ): Promise<ApiResponse<string[]>> {
        const {
            limit = 5,
            page = 1,
            locale = 'vi',
            format = 'full',
            isRead,
            type,
        } = params;

        const query: Record<string, string> = {
            limit: String(limit),
            page: String(page),
            locale,
            format,
        };
        if (isRead !== undefined) query.isRead = String(isRead);
        if (type) query.type = type;

        const response = await http.get('/notifications', { params: query });
        const data: string[] = response.data?.data ?? [];

        return {
            success: true,
            data,
        };
    }
}

export default new NotificationService();
