import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';
import { validateVideoFile } from '@/utils/video-validation';

import { logger } from '@/lib/logger';
/**
 * Video Upload Service
 * Handles multipart video upload to backend/MinIO using presigned URLs
 *
 * Flow:
 * 1. createUploadSession() - Get sessionId, presigned URLs
 * 2. uploadPart() - Upload each chunk to MinIO directly
 * 3. completeUpload() - Finalize multipart upload
 * 4. setModuleVideo() - Link video to module
 * 5. uploadVideoThumbnail() - Optional thumbnail upload
 */

export interface UploadSession {
  sessionId: string;
  uploadId: string;
  bucket: string;
  objectKey: string;
  chunkSizeBytes: number;
  totalParts: number;
}

export interface UploadPart {
  partNumber: number;
  etag: string;
}

export interface VideoUploadProgress {
  sessionId: string;
  uploadedBytes: number;
  totalBytes: number;
  currentPart: number;
  totalParts: number;
  speed: number; // bytes/sec
}

export interface UploadVideoParams {
  filename: string;
  contentType: string;
  totalSizeBytes: number;
  chunkSizeBytes?: number;
  moduleId?: string;
}

class VideoUploadService {
  private readonly defaultChunkSize = 8 * 1024 * 1024; // 8MB
  private readonly minMultipartSize = 5 * 1024 * 1024; // 5MB - minimum for multipart
  private readonly maxFileSize = 500 * 1024 * 1024; // 500MB
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // ms

  /**
   * Calculate optimal chunk size based on file size
   * - < 5MB: Direct upload (no multipart)
   * - < 100MB: 10MB chunks
   * - 100MB-1GB: 20MB chunks
   * - > 1GB: 50MB chunks
   */
  private calculateChunkSize(fileSize: number): number {
    const MB = 1024 * 1024;
    const GB = 1024 * MB;

    if (fileSize < this.minMultipartSize) {
      return fileSize; // Direct upload for small files
    } else if (fileSize < 100 * MB) {
      return 10 * MB;
    } else if (fileSize < GB) {
      return 20 * MB;
    } else {
      return 50 * MB;
    }
  }

  /**
   * Create upload session for multipart upload
   * POST /api/v1/videos/upload-sessions
   */
  async createUploadSession(params: UploadVideoParams): Promise<ApiResponse<UploadSession>> {
    try {
      if (params.totalSizeBytes > this.maxFileSize) {
        throw new Error(`File size ${(params.totalSizeBytes / 1024 / 1024).toFixed(1)}MB exceeds limit of ${this.maxFileSize / 1024 / 1024}MB`);
      }

      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
      if (!allowedTypes.includes(params.contentType)) {
        throw new Error(`Content type ${params.contentType} not supported. Allowed: ${allowedTypes.join(', ')}`);
      }

      const chunkSize = params.chunkSizeBytes || this.calculateChunkSize(params.totalSizeBytes);

      const response = await http.post('/videos/upload-sessions', {
        filename: params.filename,
        contentType: params.contentType || 'video/mp4',
        totalSizeBytes: params.totalSizeBytes,
        chunkSizeBytes: chunkSize,
        moduleId: params.moduleId,
      });

      const session = parseBackendResponse<UploadSession>(response.data);
      return {
        success: true,
        data: session,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[VideoUploadService] createUploadSession error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to create upload session');
    }
  }

  /**
   * Direct upload for small videos (< 5MB)
   * Uses single presigned URL without multipart
   */
  private async uploadDirect(
    file: File,
    params: UploadVideoParams,
    onProgress?: (progress: VideoUploadProgress) => void,
    signal?: AbortSignal
  ): Promise<{ videoUrl: string; moduleId?: string }> {
    let sessionId = '';
    const startTime = Date.now();

    try {
      if (signal?.aborted) {
        throw new Error('Upload cancelled by user');
      }

      const sessionResponse = await this.createUploadSession({
        ...params,
        totalSizeBytes: file.size,
        chunkSizeBytes: file.size, // Single chunk
      });

      if (!sessionResponse.success || !sessionResponse.data) {
        throw new Error('Failed to create upload session');
      }

      const session = sessionResponse.data;
      sessionId = session.sessionId;

      const presignedUrl = await this.getPartUploadUrl(sessionId, 1);

      const { etag } = await this.uploadPartToMinIO(presignedUrl, file);

      if (onProgress) {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const speed = file.size / elapsedSeconds;
        onProgress({
          sessionId,
          uploadedBytes: file.size,
          totalBytes: file.size,
          currentPart: 1,
          totalParts: 1,
          speed,
        });
      }

      const completeResponse = await this.completeUpload(sessionId, [{ partNumber: 1, etag }]);

      if (!completeResponse.success || !completeResponse.data) {
        throw new Error('Failed to complete upload');
      }

      return {
        videoUrl: completeResponse.data.videoUrl,
        moduleId: completeResponse.data.moduleId,
      };
    } catch (error: any) {
      if (sessionId) {
        await this.abortUpload(sessionId);
      }
      throw error;
    }
  }

  /**
   * Get presigned URL for uploading a part
   * POST /api/v1/videos/upload-sessions/{sessionId}/parts?partNumber=N
   */
  async getPartUploadUrl(sessionId: string, partNumber: number): Promise<string> {
    try {
      const response = await http.post(
        `/videos/upload-sessions/${sessionId}/parts`,
        {},
        { params: { partNumber } }
      );

      const data = parseBackendResponse<{ uploadUrl: string }>(response.data);

      return data.uploadUrl;
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.warn(`[VideoUploadService] getPartUploadUrl error for part ${partNumber}:`, safeError?.substring(0, 50));
      throw new Error(safeError || `Failed to get upload URL for part ${partNumber}`);
    }
  }

  /**
   * Upload part directly to MinIO via presigned URL
   * Uses native fetch API to avoid Authorization header being added by http interceptor
   * MinIO presigned URL includes all auth info in URL parameters - extra headers break signature
   */
  async uploadPartToMinIO(
    presignedUrl: string,
    chunk: Blob,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<{ etag: string }> {
    let lastError: any = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const reader = chunk.stream().getReader();
        const uploadStream = new ReadableStream({
          async start(controller) {
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                controller.enqueue(value);
              }
            } finally {
              controller.close();
            }
          },
        });

        const response = await fetch(presignedUrl, {
          method: 'PUT',
          body: chunk, // Send blob directly
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`MinIO returned ${response.status}: ${errorText.substring(0, 200)}`);
        }

        const etag = response.headers.get('etag') || response.headers.get('ETag');
        if (!etag) {
          throw new Error('No ETag returned from MinIO');
        }

        return { etag: etag.replace(/"/g, '') }; // Remove quotes
      } catch (error: any) {
        lastError = error;
        logger.warn(`[VideoUploadService] Upload attempt ${attempt}/${this.maxRetries} failed:`, error.message);

        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }

    throw new Error(`Failed to upload part after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Complete multipart upload and get video URL
   * POST /api/v1/videos/upload-sessions/{sessionId}/complete
   */
  async completeUpload(
    sessionId: string,
    parts: UploadPart[],
    moduleId?: string
  ): Promise<ApiResponse<{ videoUrl: string; moduleId?: string }>> {
    try {
      const sortedParts = parts.sort((a, b) => a.partNumber - b.partNumber);

      const response = await http.post(
        `/videos/upload-sessions/${sessionId}/complete`,
        {
          parts: sortedParts,
          moduleId: moduleId
        }
      );

      const result = parseBackendResponse<{ videoUrl: string; moduleId?: string }>(response.data);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[VideoUploadService] completeUpload error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to complete upload');
    }
  }

  /**
   * Set video URL for a module
   * PUT /api/v1/packs/{courseId}/modules/{moduleId}/video
   */
  async setModuleVideo(
    courseId: string,
    moduleId: string,
    videoUrl: string,
    thumbnailUrl?: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await http.put(
        `/packs/${courseId}/modules/${moduleId}/video`,
        { videoUrl, thumbnailUrl }
      );

      parseBackendResponse(response.data);
      return {
        success: true,
        data: undefined,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[VideoUploadService] setModuleVideo error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to set module video');
    }
  }

  /**
   * Upload video thumbnail (optional)
   * POST /api/v1/packs/{courseId}/modules/{moduleId}/video/thumbnail
   */
  async uploadVideoThumbnail(
    courseId: string,
    moduleId: string,
    file: File
  ): Promise<ApiResponse<{ thumbnailUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await http.post(
        `/packs/${courseId}/modules/${moduleId}/video/thumbnail`,
        formData
      );

      const result = parseBackendResponse<{ thumbnailUrl: string }>(response.data);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[VideoUploadService] uploadVideoThumbnail error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to upload thumbnail');
    }
  }

  /**
   * Get upload session status
   * GET /api/v1/videos/upload-sessions/{sessionId}
   */
  async getUploadSession(sessionId: string): Promise<ApiResponse<UploadSession & { status: string }>> {
    try {
      const response = await http.get(`/videos/upload-sessions/${sessionId}`);
      const session = parseBackendResponse<UploadSession & { status: string }>(response.data);
      return {
        success: true,
        data: session,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[VideoUploadService] getUploadSession error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to get upload session');
    }
  }

  /**
   * Abort upload session (cleanup)
   * DELETE /api/v1/videos/upload-sessions/{sessionId}
   */
  async abortUpload(sessionId: string): Promise<void> {
    try {
      await http.delete(`/videos/upload-sessions/${sessionId}`);
    } catch (error: any) {
      logger.warn('[VideoUploadService] abortUpload failed');
    }
  }

  /**
   * Full upload flow with progress tracking
   * Uploads a video file in chunks using multipart upload
   */
  async uploadVideo(
    file: File,
    params: UploadVideoParams,
    onProgress?: (progress: VideoUploadProgress) => void,
    signal?: AbortSignal
  ): Promise<{ videoUrl: string; moduleId?: string }> {
    if (file.size < this.minMultipartSize) {
      logger.info(`[VideoUploadService] Using direct upload for small file: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return this.uploadDirect(file, params, onProgress, signal);
    }

    logger.info(`[VideoUploadService] Using multipart upload for file: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    const startTime = Date.now();
    let uploadedBytes = 0;
    const uploadedParts: UploadPart[] = [];
    let sessionId = '';

    try {
      if (signal?.aborted) {
        throw new Error('Upload cancelled by user');
      }

      const validation = await validateVideoFile(file);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid video file');
      }

      const sessionResponse = await this.createUploadSession({
        ...params,
        totalSizeBytes: file.size,
      });

      if (!sessionResponse.success || !sessionResponse.data) {
        throw new Error('Failed to create upload session');
      }

      const session = sessionResponse.data;
      sessionId = session.sessionId;
      const chunkSize = session.chunkSizeBytes;
      const totalParts = session.totalParts;

      logger.info(`[VideoUploadService] Upload session created: ${totalParts} parts, ${(chunkSize / 1024 / 1024).toFixed(2)}MB per part`);

      const BATCH_SIZE = 5;
      for (let batchStart = 1; batchStart <= totalParts; batchStart += BATCH_SIZE) {
        if (signal?.aborted) {
          await this.abortUpload(sessionId);
          throw new Error('Upload cancelled by user');
        }

        const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, totalParts);
        const batchPromises = [];

        for (let partNumber = batchStart; partNumber <= batchEnd; partNumber++) {
          const start = (partNumber - 1) * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);

          const uploadPromise = (async () => {
            const presignedUrl = await this.getPartUploadUrl(sessionId, partNumber);

            const { etag } = await this.uploadPartToMinIO(presignedUrl, chunk);

            return { partNumber, etag, chunkSize: end - start };
          })();

          batchPromises.push(uploadPromise);
        }

        const batchResults = await Promise.all(batchPromises);

        for (const result of batchResults) {
          uploadedParts.push({
            partNumber: result.partNumber,
            etag: result.etag
          });
          uploadedBytes += result.chunkSize;
        }

        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const speed = uploadedBytes / elapsedSeconds;

        if (onProgress) {
          onProgress({
            sessionId,
            uploadedBytes,
            totalBytes: file.size,
            currentPart: batchEnd,
            totalParts,
            speed,
          });
        }

        logger.info(`[VideoUploadService] Batch ${Math.ceil(batchStart / BATCH_SIZE)}/${Math.ceil(totalParts / BATCH_SIZE)} complete - ${(uploadedBytes / 1024 / 1024).toFixed(2)}MB / ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      }

      logger.info(`[VideoUploadService] All parts uploaded, completing...`);
      const completeResponse = await this.completeUpload(sessionId, uploadedParts, params.moduleId);

      if (!completeResponse.success || !completeResponse.data) {
        throw new Error('Failed to complete upload');
      }

      logger.info(`[VideoUploadService] Upload complete: ${completeResponse.data.videoUrl}`);
      return {
        videoUrl: completeResponse.data.videoUrl,
        moduleId: completeResponse.data.moduleId,
      };
    } catch (error: any) {
      if (sessionId) {
        await this.abortUpload(sessionId);
      }
      throw error;
    }
  }
}

export default new VideoUploadService();
