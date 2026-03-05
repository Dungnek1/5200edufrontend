import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';

import { logger } from '@/lib/logger';
/**
 * Document Service
 * Handles course module documents (PDFs, slides, etc.)
 *
 * Endpoints:
 * - GET /api/v1/packs/{courseId}/modules/{moduleId}/documents - List documents
 * - GET /api/v1/packs/{courseId}/modules/{moduleId}/documents/{docId}/download - Download
 * - GET /api/v1/packs/{courseId}/modules/{moduleId}/documents/{docId}/view - Preview/View
 */

export type DocumentType = 'PDF' | 'SLIDES' | 'DOC' | 'OTHER';

export interface Document {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  type: DocumentType;
  fileUrl: string;
  fileSize: number; // bytes
  pages?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadParams {
  title: string;
  description?: string;
  type: DocumentType;
  file: File;
}

export interface CreateDocumentParams {
  title: string;
  description?: string;
  type: DocumentType;
  fileUrl: string;
  fileSize: number;
  pages?: number;
}

class DocumentService {
  /**
   * List all documents for a module
   * GET /api/v1/packs/{courseId}/modules/{moduleId}/documents
   */
  async listDocuments(
    courseId: string,
    moduleId: string
  ): Promise<ApiResponse<Document[]>> {
    try {
      const response = await http.get(
        `/packs/${courseId}/modules/${moduleId}/documents`
      );

      const data = parseBackendResponse<Document[]>(response.data);
      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[DocumentService] listDocuments error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to list documents');
    }
  }

  /**
   * Get single document details
   * GET /api/v1/packs/{courseId}/modules/{moduleId}/documents/{docId}
   */
  async getDocument(
    courseId: string,
    moduleId: string,
    docId: string
  ): Promise<ApiResponse<Document>> {
    try {
      const response = await http.get(
        `/packs/${courseId}/modules/${moduleId}/documents/${docId}`
      );

      const data = parseBackendResponse<Document>(response.data);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[DocumentService] getDocument error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to get document');
    }
  }

  /**
   * Create/upload document for a module
   * POST /api/v1/packs/{courseId}/modules/{moduleId}/documents
   */
  async createDocument(
    courseId: string,
    moduleId: string,
    params: DocumentUploadParams
  ): Promise<ApiResponse<Document>> {
    try {
      const formData = new FormData();
      formData.append('title', params.title);
      formData.append('type', params.type);
      formData.append('file', params.file);

      if (params.description) {
        formData.append('description', params.description);
      }

      const response = await http.post(
        `/packs/${courseId}/modules/${moduleId}/documents`,
        formData,
      );

      const data = parseBackendResponse<Document>(response.data);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[DocumentService] createDocument error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to create document');
    }
  }

  /**
   * Update document metadata
   * PUT /api/v1/packs/{courseId}/modules/{moduleId}/documents/{docId}
   */
  async updateDocument(
    courseId: string,
    moduleId: string,
    docId: string,
    params: Partial<CreateDocumentParams>
  ): Promise<ApiResponse<Document>> {
    try {
      const response = await http.put(
        `/packs/${courseId}/modules/${moduleId}/documents/${docId}`,
        params
      );

      const data = parseBackendResponse<Document>(response.data);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[DocumentService] updateDocument error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to update document');
    }
  }

  /**
   * Delete document
   * DELETE /api/v1/packs/{courseId}/modules/{moduleId}/documents/{docId}
   */
  async deleteDocument(
    courseId: string,
    moduleId: string,
    docId: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await http.delete(
        `/packs/${courseId}/modules/${moduleId}/documents/${docId}`
      );

      parseBackendResponse(response.data);
      return {
        success: true,
        data: undefined,
      };
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[DocumentService] deleteDocument error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to delete document');
    }
  }

  /**
   * Get download URL for a document
   * GET /api/v1/packs/{courseId}/modules/{moduleId}/documents/{docId}/download
   *
   * Returns file attachment for download
   */
  async downloadDocument(
    courseId: string,
    moduleId: string,
    docId: string
  ): Promise<Blob> {
    try {
      const response = await http.get(
        `/packs/${courseId}/modules/${moduleId}/documents/${docId}/download`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[DocumentService] downloadDocument error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to download document');
    }
  }

  /**
   * Get download URL for direct link (e.g., for <a> tag href)
   */
  getDownloadUrl(courseId: string, moduleId: string, docId: string): string {
    return `${http.defaults.baseURL}/packs/${courseId}/modules/${moduleId}/documents/${docId}/download`;
  }

  /**
   * Get view/preview URL for a document
   * GET /api/v1/packs/{courseId}/modules/{moduleId}/documents/{docId}/view
   *
   * Returns inline preview (for embedding in iframe or PDF viewer)
   */
  async viewDocument(
    courseId: string,
    moduleId: string,
    docId: string
  ): Promise<Blob> {
    try {
      const response = await http.get(
        `/packs/${courseId}/modules/${moduleId}/documents/${docId}/view`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error: any) {
      const safeError = error.response?.data?.message || error.message;
      logger.error('[DocumentService] viewDocument error:', safeError?.substring(0, 100));
      throw new Error(safeError || 'Failed to view document');
    }
  }

  /**
   * Get view URL for direct link (e.g., for iframe src)
   */
  getViewUrl(courseId: string, moduleId: string, docId: string): string {
    return `${http.defaults.baseURL}/packs/${courseId}/modules/${moduleId}/documents/${docId}/view`;
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

export default new DocumentService();
