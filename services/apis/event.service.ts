import { BlogDetailResponse, BlogItem, BlogsResponse, BlogType } from '@/types/blog';
import { http } from '../http';

import { logger } from '@/lib/logger';


class EventService {
  private baseUrl = "/public/blogs";

  async getEventsByType(type?: BlogType): Promise<BlogItem[]> {
    try {
      const response = await http.get<BlogsResponse>(this.baseUrl, {
        params: {
          type,
        },
      });

      if (response.data.data.blogs) {
        logger.info(`[EventService] Found ${response.data.data.blogs.length} blogs`);
        return response.data.data.blogs.map((blog: any) => ({
          ...blog,
          tags: blog.tags?.map((t: any) => t.tag?.name || t.tag || t) || []
        }));
      }
      return [];
    } catch (error: any) {
      throw error;
    }
  }

  async getEventBySlug(slug: string): Promise<BlogItem> {
    try {
      const response = await http.get<BlogDetailResponse>(
        `${this.baseUrl}/by-slug/${slug}`
      );

      if (response.data.data.data) {
        const blog = response.data.data.data as any;
        return {
          ...blog,
          tags: blog.tags?.map((t: any) => t.tag?.name || t.tag || t) || []
        };
      }
      throw new Error("Invalid response format");
    } catch (error: any) {
      throw error;
    }
  }
}

export default new EventService();
