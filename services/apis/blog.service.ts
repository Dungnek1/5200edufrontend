import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';

export interface Blog {
    id: string;
    title: string;
    slug: string;
    subtitle?: string;
    thumbnailUrl?: string;
    content: string;
    categoryId?: string;
    type?: 'HOITHAO' | 'OFFLINE' | 'CONGDONG';
    status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
    authorUserId: string;
    tagIds?: string[];
    createdAt: string;
    updatedAt: string;
    tags: string[];
}

export interface CreateBlogPayload {
    title: string;
    slug: string;
    subtitle?: string;
    thumbnail?: File;
    content: string;
    categoryId?: string;
    type?: 'HOITHAO' | 'OFFLINE' | 'CONGDONG';
    tagIds?: string[];
}

export interface UpdateBlogPayload {
    title?: string;
    slug?: string;
    subtitle?: string;
    thumbnail?: string;
    content?: string;
    tagIds?: string[];
}

/**
 * Blog Service
 * Handle blog operations
 */
class BlogService {
    /**
     * Create a new blog
     * POST /blogs
     */
    async createBlog(payload: CreateBlogPayload): Promise<ApiResponse<Blog>> {
        const formData = new FormData();

        formData.append('title', payload.title);
        formData.append('slug', payload.slug);

        if (payload.subtitle) {
            formData.append('subtitle', payload.subtitle);
        }

        if (payload.thumbnail) {
            formData.append('thumbnail', payload.thumbnail);
        }

        formData.append('content', payload.content);

        if (payload.categoryId) {
            formData.append('categoryId', payload.categoryId);
        }

        if (payload.type) {
            formData.append('type', payload.type);
        }

        if (payload.tagIds && payload.tagIds.length > 0) {
            formData.append('tagIds', JSON.stringify(payload.tagIds));
        }

        const response = await http.post('/blogs', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const blog = parseBackendResponse<Blog>(response.data);
        return {
            success: true,
            data: blog,
        };
    }

    /**
     * Update a blog
     * PATCH /blogs/:blogId
     */
    async updateBlog(
        blogId: string,
        payload: UpdateBlogPayload
    ): Promise<ApiResponse<Blog>> {
        const formData = new FormData();

        if (payload.title) {
            formData.append('title', payload.title);
        }

        if (payload.slug) {
            formData.append('slug', payload.slug);
        }

        if (payload.subtitle) {
            formData.append('subtitle', payload.subtitle);
        }

        if (payload.thumbnail) {
            formData.append('thumbnail', payload.thumbnail);
        }

        if (payload.content) {
            formData.append('content', payload.content);
        }

        if (payload.tagIds !== undefined) {
            formData.append('tagIds', JSON.stringify(payload.tagIds));
        }

        const response = await http.patch(`/blogs/${blogId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const blog = parseBackendResponse<Blog>(response.data);
        return {
            success: true,
            data: blog,
        };
    }

    /**
     * Publish a blog
     * POST /blogs/:blogId/publish
     */
    async publishBlog(blogId: string): Promise<ApiResponse<Blog>> {
        const response = await http.post(`/blogs/${blogId}/publish`);
        const blog = parseBackendResponse<Blog>(response.data);
        return {
            success: true,
            data: blog,
        };
    }

    /**
     * Unpublish a blog (revert to DRAFT)
     * POST /blogs/:blogId/unpublish
     */
    async unpublishBlog(blogId: string): Promise<ApiResponse<Blog>> {
        const response = await http.post(`/blogs/${blogId}/unpublish`);
        const blog = parseBackendResponse<Blog>(response.data);
        return { success: true, data: blog };
    }

    /**
     * Hide a blog
     * POST /blogs/:blogId/hide
     */
    async hideBlog(blogId: string): Promise<ApiResponse<Blog>> {
        const response = await http.post(`/blogs/${blogId}/hide`);
        const blog = parseBackendResponse<Blog>(response.data);
        return { success: true, data: blog };
    }

    async getMyBlogs(params?: {
        page?: number;
        limit?: number;
        status?: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
    }): Promise<ApiResponse<{ blogs: Blog[]; total: number }>> {
        const response = await http.get('/blogs/my/blogs', { params });
        const data = parseBackendResponse<{ blogs: Blog[]; total: number }>(
            response.data
        );
        return {
            success: true,
            data,
        };
    }


    async deleteBlog(blogId: string): Promise<ApiResponse<void>> {
        const response = await http.delete(`/blogs/${blogId}`);
        parseBackendResponse(response.data);
        return {
            success: true,
            data: undefined,
        };
    }
}

export const blogService = new BlogService();
