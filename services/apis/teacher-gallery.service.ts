import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';

/**
 * Teacher Gallery Service
 * Handles teacher gallery (albums and images) management
 *
 * Endpoints:
 * - /teacher-gallery/albums - CRUD for albums
 * - /teacher-gallery/images - CRUD for images
 * - /teacher-gallery/images/reorder - Reorder images
 */

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  sortOrder: number;
  isPublic: boolean;
  images: GalleryImage[];
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  albumId?: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  sortOrder: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlbumParams {
  title: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateAlbumParams {
  title?: string;
  description?: string;
  coverImage?: string;
  isPublic?: boolean;
  sortOrder?: number;
}

export interface CreateImageParams {
  albumId?: string;
  title: string;
  description?: string;
  imageUrl: string;
  isPublic?: boolean;
}

export interface UpdateImageParams {
  title?: string;
  description?: string;
  sortOrder?: number;
  isPublic?: boolean;
}

class TeacherGalleryService {
  private readonly baseUrl = '/teacher-gallery';


  /**
   * GET /teacher-gallery/albums
   * Get all albums for current teacher
   */
  async getAlbums(): Promise<ApiResponse<GalleryAlbum[]>> {
    const response = await http.get(`${this.baseUrl}/albums`);
    const albums = parseBackendResponse<GalleryAlbum[]>(response.data);
    return {
      success: true,
      data: albums || [],
    };
  }

  /**
   * GET /teacher-gallery/albums/:id
   * Get album detail with images
   */
  async getAlbum(albumId: string): Promise<ApiResponse<GalleryAlbum>> {
    const response = await http.get(`${this.baseUrl}/albums/${albumId}`);
    const album = parseBackendResponse<GalleryAlbum>(response.data);
    return {
      success: true,
      data: album,
    };
  }

  /**
   * POST /teacher-gallery/albums
   * Create new album
   */
  async createAlbum(params: CreateAlbumParams): Promise<ApiResponse<GalleryAlbum>> {
    const response = await http.post(`${this.baseUrl}/albums`, params);
    const album = parseBackendResponse<GalleryAlbum>(response.data);
    return {
      success: true,
      data: album,
    };
  }

  /**
   * PUT /teacher-gallery/albums/:id
   * Update album
   */
  async updateAlbum(albumId: string, params: UpdateAlbumParams): Promise<ApiResponse<GalleryAlbum>> {
    const response = await http.put(`${this.baseUrl}/albums/${albumId}`, params);
    const album = parseBackendResponse<GalleryAlbum>(response.data);
    return {
      success: true,
      data: album,
    };
  }

  /**
   * DELETE /teacher-gallery/albums/:id
   * Delete album
   */
  async deleteAlbum(albumId: string): Promise<ApiResponse<void>> {
    const response = await http.delete(`${this.baseUrl}/albums/${albumId}`);
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }


  /**
   * GET /teacher-gallery/images
   * Get all images (optionally filter by album)
   */
  async getImages(albumId?: string): Promise<ApiResponse<GalleryImage[]>> {
    const params = albumId ? `?albumId=${albumId}` : '';
    const response = await http.get(`${this.baseUrl}/images${params}`);
    const images = parseBackendResponse<GalleryImage[]>(response.data);
    return {
      success: true,
      data: images || [],
    };
  }

  /**
   * GET /teacher-gallery/images/:id
   * Get image detail
   */
  async getImage(imageId: string): Promise<ApiResponse<GalleryImage>> {
    const response = await http.get(`${this.baseUrl}/images/${imageId}`);
    const image = parseBackendResponse<GalleryImage>(response.data);
    return {
      success: true,
      data: image,
    };
  }

  /**
   * POST /teacher-gallery/images
   * Upload new image (multipart/form-data)
   * Body: image (file), albumId?, caption?
   */
  async uploadImageFile(
    file: File,
    options?: { albumId?: string; caption?: string }
  ): Promise<ApiResponse<GalleryImage>> {
    const formData = new FormData();
    formData.append('image', file);
    if (options?.albumId) formData.append('albumId', options.albumId);
    if (options?.caption) formData.append('caption', options.caption);

    const response = await http.post(`${this.baseUrl}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const image = parseBackendResponse<GalleryImage>(response.data);
    return {
      success: true,
      data: image,
    };
  }

  /**
   * POST /teacher-gallery/images (JSON body - for backward compatibility)
   * Upload new image metadata
   */
  async createImage(params: CreateImageParams): Promise<ApiResponse<GalleryImage>> {
    const response = await http.post(`${this.baseUrl}/images`, params);
    const image = parseBackendResponse<GalleryImage>(response.data);
    return {
      success: true,
      data: image,
    };
  }

  /**
   * PUT /teacher-gallery/images/:id
   * Update image
   */
  async updateImage(imageId: string, params: UpdateImageParams): Promise<ApiResponse<GalleryImage>> {
    const response = await http.put(`${this.baseUrl}/images/${imageId}`, params);
    const image = parseBackendResponse<GalleryImage>(response.data);
    return {
      success: true,
      data: image,
    };
  }

  /**
   * DELETE /teacher-gallery/images/:id
   * Delete image
   */
  async deleteImage(imageId: string): Promise<ApiResponse<void>> {
    const response = await http.delete(`${this.baseUrl}/images/${imageId}`);
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * POST /teacher-gallery/images/reorder
   * Reorder images
   */
  async reorderImages(imageIds: string[]): Promise<ApiResponse<void>> {
    const response = await http.post(`${this.baseUrl}/images/reorder`, { imageIds });
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }
}

export default new TeacherGalleryService();
