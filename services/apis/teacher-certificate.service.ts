import { http } from '../http';
import type { ApiResponse } from '../http/types';
import type { Certificate, CreateCertificateDto, UpdateCertificateDto } from '@/types/teacher.types';
import { parseBackendResponse } from '../http/response-parser';

import { logger } from '@/lib/logger';
interface BackendCertificate {
  id: string;
  name: string;      // Backend uses 'name', frontend uses 'title'
  fileUrl?: string;  // Backend uses 'fileUrl', frontend uses 'imageUrl'
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
  description?: string;
  category?: string;
}

function mapCertificate(cert: BackendCertificate): Certificate {
  return {
    id: cert.id,
    title: cert.name || '',
    imageUrl: cert.fileUrl || null,
    issuer: cert.issuer || null,
    issueDate: cert.issueDate || null,
    credentialUrl: cert.credentialUrl || null,
    description: cert.description || null,
    category: cert.category || null,
  };
}

class TeacherCertificateService {
  /**
   * GET /api/v1/teacher-certificates
   * List teacher certificates
   * Backend returns: { status: 'success', data: Certificate[] }
   */
  async list(): Promise<ApiResponse<Certificate[]>> {
    const response = await http.get('/teacher-certificates');
    const certificates = parseBackendResponse<BackendCertificate[]>(response.data);
    return {
      success: true,
      data: (certificates || []).map(mapCertificate),
    };
  }

  /**
   * GET /api/v1/teacher-certificates/{id}
   * Get certificate by ID
   * Backend returns: { status: 'success', data: Certificate }
   */
  async get(id: string): Promise<ApiResponse<Certificate>> {
    const response = await http.get(`/teacher-certificates/${id}`);
    const certificate = parseBackendResponse<BackendCertificate>(response.data);
    return {
      success: true,
      data: mapCertificate(certificate),
    };
  }

  /**
   * POST /api/v1/teacher-certificates
   * Create new certificate
   * Backend returns: { status: 'success', message: '...', data: Certificate }
   * Note: Backend expects { name } but frontend sends { title }
   */
  async create(data: CreateCertificateDto): Promise<ApiResponse<Certificate>> {
    const backendData: any = {
      title: data.title,
    };
    backendData.issuer = data.issuer !== undefined ? (data.issuer || null) : null;
    backendData.issueDate = data.issueDate !== undefined ? (data.issueDate || null) : null;
    backendData.credentialUrl = data.credentialUrl !== undefined ? (data.credentialUrl || null) : null;
    backendData.description = data.description !== undefined ? (data.description || null) : null;
    backendData.category = data.category !== undefined ? (data.category || null) : null;

    logger.info('📤 [Certificate Create] Payload:', JSON.stringify(backendData, null, 2));

    const response = await http.post('/teacher-certificates', backendData);
    const certificate = parseBackendResponse<BackendCertificate>(response.data);


    return {
      success: true,
      data: mapCertificate(certificate),
    };
  }

  /**
   * PUT /api/v1/teacher-certificates/{id}
   * Update certificate
   * Backend returns: { status: 'success', message: '...', data: Certificate }
   * Note: Backend expects { name } but frontend sends { title }
   */
  async update(
    id: string,
    data: UpdateCertificateDto
  ): Promise<ApiResponse<Certificate>> {
    const backendData: any = {};
    if (data.title !== undefined) backendData.name = data.title;
    if (data.issuer !== undefined) backendData.issuer = data.issuer === '' ? null : data.issuer;
    if (data.issueDate !== undefined) backendData.issueDate = data.issueDate === '' ? null : data.issueDate;
    if (data.credentialUrl !== undefined) backendData.credentialUrl = data.credentialUrl === '' ? null : data.credentialUrl;
    if (data.description !== undefined) backendData.description = data.description === '' ? null : data.description;
    if (data.category !== undefined) backendData.category = data.category === '' ? null : data.category;


    const response = await http.put(
      `/teacher-certificates/${id}`,
      backendData
    );
    const certificate = parseBackendResponse<BackendCertificate>(response.data);
    return {
      success: true,
      data: mapCertificate(certificate),
    };
  }

  /**
   * DELETE /api/v1/teacher-certificates/{id}
   * Delete certificate
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await http.delete(`/teacher-certificates/${id}`);
    parseBackendResponse(response.data);
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * POST /api/v1/teacher-certificates/{id}/image
   * Upload certificate image
   * Content-Type: multipart/form-data
   * Backend returns: { status: 'success', message: '...', data: Certificate }
   * Note: Backend returns 'fileUrl', frontend expects 'imageUrl'
   */
  async uploadImage(
    id: string,
    file: File
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('image', file); // Changed from 'file' to 'image'

    const response = await http.post(
      `/teacher-certificates/${id}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const certificate = parseBackendResponse<BackendCertificate>(response.data);
    return {
      success: true,
      data: { imageUrl: certificate.fileUrl || '' },
    };
  }
}

export default new TeacherCertificateService();

