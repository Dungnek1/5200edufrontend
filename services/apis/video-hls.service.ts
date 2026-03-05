import { http } from '../http';
import type { ApiResponse } from '../http/types';
import type { AxiosProgressEvent } from 'axios';
import { getMinIOUrl } from '@/config/minio.config';

/**
 * HLS Video Service
 * Handles HLS video uploads with automatic FFmpeg conversion and thumbnail extraction
 *
 * API Endpoints:
 * - POST /video-hls/{courseId}/modules/{moduleId}/upload - Upload video for HLS conversion
 * - GET /video-hls/hls/{videoId}/playlist - Get HLS playlist
 * - GET /video-hls/hls/{videoId}/{segmentName} - Get HLS segment
 */

export interface VideoHLSUploadResponse {
  videoUrl: string;
  hlsUrl?: string;
  thumbnailUrl?: string;
  videoDuration: number;
  videoResolution?: string;
  jobId: number;
  moduleId: string; // Use moduleId instead of videoId
  courseId: string;
  status: string;
  processingType: string;
}

export interface VideoHLSMetadata {
  videoId: string;
  duration: number;
  resolution: string;
  fps: number;
}

class VideoHLSService {
  /**
   * Upload video for HLS conversion
   * Automatically extracts metadata and generates thumbnail
   *
   * @param courseId - Course ID
   * @param moduleId - Module ID
   * @param file - Video file to upload
   * @param segmentDuration - Segment duration in seconds (2-30, default: 10)
   * @param onProgress - Progress callback
   * @param signal - Abort signal
   */
  async uploadVideo(
    courseId: string,
    moduleId: string,
    file: File,
    segmentDuration: number = 10,
    onProgress?: (progress: AxiosProgressEvent) => void,
    signal?: AbortSignal
  ): Promise<VideoHLSUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('segmentDuration', String(Math.max(2, Math.min(30, segmentDuration))));

    const url = `/video-hls/${courseId}/modules/${moduleId}/upload`;

    const response = await http.post<ApiResponse<VideoHLSUploadResponse>>(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress,
        signal,
      }
    );

    // Handle nested response structure from API wrapper
    const responseData = response.data;
    
    // API response has nested data: { success, message, data: { videoId, videoUrl, hlsUrl, ... } }
    const apiData = responseData?.data?.data || responseData?.data || responseData as any;
    
    return {
      ...apiData,
      videoUrl: getMinIOUrl(apiData?.videoUrl || ''),
      hlsUrl: getMinIOUrl(apiData?.hlsUrl || ''),
    };
  }

  /**
   * Get video metadata from server
   */
  async getVideoMetadata(videoId: string): Promise<VideoHLSMetadata> {
    const response = await http.get<ApiResponse<VideoHLSMetadata>>(
      `/video-hls/${videoId}/metadata`
    );
    return response.data?.data || (response.data as any);
  }

  /**
   * Get HLS playlist URL for a video
   */
  getPlaylistUrl(videoId: string): string {
    return `/video-hls/hls/${videoId}/playlist`;
  }

  /**
   * Get HLS segment URL for a video
   */
  getSegmentUrl(videoId: string, segmentName: string, courseId?: string): string {
    const params = courseId ? `?courseId=${courseId}` : '';
    return `/video-hls/hls/${videoId}/${segmentName}${params}`;
  }

  /**
   * Delete a video
   */
  async deleteVideo(videoId: string): Promise<void> {
    await http.delete(`/video-hls/${videoId}`);
  }
}

export default new VideoHLSService();
