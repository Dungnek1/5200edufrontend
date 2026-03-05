import { http } from '../http';

import { logger } from '@/lib/logger';
export interface ConsultationRequest {
  fullName: string;
  email: string;
  phone: string;
}

export interface ConsultationResponse {
  status: string;
  message: string;
  data?: any;
}

class ConsultationService {
  private baseUrl = "/advisories";

  async submitConsultation(data: ConsultationRequest): Promise<ConsultationResponse> {
    try {
      const response = await http.post<ConsultationResponse>(
        this.baseUrl,
        {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
        }
      );
      return response.data;
    } catch (error) {
      logger.error("Error submitting consultation:", error);
      throw error;
    }
  }
}

export default new ConsultationService();
