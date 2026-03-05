import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';

/**
 * Upload Service
 * Handle file uploads to backend
 */
class UploadService {
  /**
   * Upload course thumbnail
   * POST /packs/:courseId/thumbnail
   * Backend returns: { status: 'success', message: '...', data: Course }
   */
  async uploadCourseThumbnail(
    courseId: string,
    file: File
  ): Promise<ApiResponse<{ thumbnailUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await http.post(
      `/packs/${courseId}/thumbnail`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const course = parseBackendResponse<{ thumbnailUrl?: string }>(response.data);
    return {
      success: true,
      data: { thumbnailUrl: course.thumbnailUrl || '' },
    };
  }

  /**
   * Upload module document
   * POST /packs/:courseId/modules/:moduleId/document
   * Backend returns: { status: 'success', message: '...', data: Document }
   */
  async uploadModuleDocument(
    courseId: string,
    moduleId: string,
    file: File
  ): Promise<ApiResponse<{
    documentId: string;
    fileName: string;
    documentUrl: string;
    fileSize: number;
    mimeType: string;
  }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await http.post(
      `/packs/${courseId}/modules/${moduleId}/document`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const document = parseBackendResponse<{
      documentId: string;
      fileName: string;
      documentUrl: string;
      fileSize: number;
      mimeType: string;
    }>(response.data);
    return {
      success: true,
      data: document,
    };
  }

  /**
   * Get module documents list
   * GET /packs/:courseId/modules/:moduleId/documents
   * Backend returns: { status: 'success', data: Document[] }
   */
  async getModuleDocuments(
    courseId: string,
    moduleId: string
  ): Promise<ApiResponse<Array<{
    id: string;
    documentId: string;
    fileName: string;
    documentUrl: string;
    fileSize: string;
    mimeType: string;
    createdAt: string;
  }>>> {
    const response = await http.get(
      `/packs/${courseId}/modules/${moduleId}/documents`
    );
    const documents = parseBackendResponse<Array<{
      id: string;
      documentId: string;
      fileName: string;
      documentUrl: string;
      fileSize: string;
      mimeType: string;
      createdAt: string;
    }>>(response.data);
    return {
      success: true,
      data: documents || [],
    };
  }

  async getModulePublicDocuments(
    courseId: string,
    moduleId: string
  ): Promise<ApiResponse<Array<{
    id: string;
    documentId: string;
    fileName: string;
    documentUrl: string;
    fileSize: string;
    mimeType: string;
    createdAt: string;
  }>>> {
    const response = await http.get(
      `/public/packs/${courseId}/modules/${moduleId}/documents`
    );
    const documents = parseBackendResponse<Array<{
      id: string;
      documentId: string;
      fileName: string;
      documentUrl: string;
      fileSize: string;
      mimeType: string;
      createdAt: string;
    }>>(response.data);
    return {
      success: true,
      data: documents || [],
    };
  }
  /**
   * Delete module document
   * DELETE /packs/:courseId/modules/:moduleId/documents/:documentId
   */
  async deleteModuleDocument(
    courseId: string,
    moduleId: string,
    documentId: string
  ): Promise<ApiResponse<void>> {
    const response = await http.delete(
      `/packs/${courseId}/modules/${moduleId}/documents/${documentId}`
    );
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * Get document preview URL
   * GET /packs/:courseId/modules/:moduleId/documents/view?documentUrl=...
   * Backend returns: { status: 'success', data: { previewUrl, documentUrl, fileName } }
   */
  async getDocumentPreviewUrl(
    courseId: string,
    moduleId: string,
    documentUrl: string
  ): Promise<ApiResponse<{
    previewUrl: string;
    documentUrl: string;
    fileName: string;
  }>> {
    const response = await http.get(
      `/packs/${courseId}/modules/${moduleId}/documents/view`,
      {
        params: { documentUrl },
      }
    );
    const preview = parseBackendResponse<{
      previewUrl: string;
      documentUrl: string;
      fileName: string;
    }>(response.data);
    return {
      success: true,
      data: preview,
    };
  }

  /**
   * Upload avatar (for user profile)
   * POST /users/me/avatar
   * Backend returns: { status: 'success', message: '...', data: { avatarUrl: string } }
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await http.post(
      '/users/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const result = parseBackendResponse<{ avatarUrl: string }>(response.data);
    return {
      success: true,
      data: result,
    };
  }

  /**
   * Upload teacher profile avatar
   * PUT /teacher-profile/avatar
   * Backend returns: { status: 'success', message: '...', data: TeacherProfile }
   */
  async uploadTeacherAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await http.put(
      '/teacher-profile/avatar',
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
      data: { avatarUrl: profile.avatarUrl || '' },
    };
  }
}

export default new UploadService();
