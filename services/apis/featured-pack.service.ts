

/**
 * Featured Pack Service
 * Handles API calls for featured/highlighted course packs
 */

import { http } from "../http";

export interface Section {
  id: string;
  courseId: string;
  title: string;
  description: string;
  sortOrder: number;
  createdAt: any;
  updatedAt: any;
  createdBy: string;
  updatedBy: string | null;
  minFinsish: number;
  lessons: any[];
  documents: any[];
  _count: {
    lessons: number;
    documents: number;
  };
}

export interface FeaturedPackDetail {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  learningOutcomes: string[];
  language: string;
  level: string;
  thumbnailUrl: string;
  status: string;
  featured: string;
  ownerTeacherId: string;
  createdByRole: string;
  price: number;
  originPrice: number;
  currency: string;
  feeMode: string;
  selectedFeePlanId: string | null;
  publishedAt: any;
  scheduledPublishAt: string | null;
  createdAt: any;
  updatedAt: any;
  createdBy: string;
  updatedBy: string | null;
  sections: Section[];
}

export interface FeaturedPackResponse {
  status: string;
  message: string;
  data: {
    status: string;
    data: {
      success: boolean;
      data: FeaturedPackDetail;
    };
  };
}

class FeaturedPackService {
  private baseUrl = "/public/packs/featured";

  /**
   * GET /public/packs/featured/detail
   * Get featured pack detail for a specific teacher or all teachers
   * @param teacherId - Optional teacher ID. If not provided, gets featured pack of all teachers
   * @returns Featured pack with sections/modules
   */
  async getFeaturedPackDetail(teacherId?: string): Promise<FeaturedPackDetail | null> {
    try {
      const params = new URLSearchParams();
      if (teacherId) {
        params.append("teacherId", teacherId);
      }

      const queryString = params.toString();
      const url = `${this.baseUrl}/detail${queryString ? `?${queryString}` : ""}`;


      const response = await http.get(url);

      const responseData = response.data;

      if (!responseData?.data?.data?.data) {
        return null;
      }

      const packDetail: FeaturedPackDetail = responseData.data.data.data;

      return packDetail;
    } catch (error: any) {
      return null;
    }
  }

  /**
   * Transform sections to module format for UI
   * @param sections - Array of sections from API
   * @returns Array of modules formatted for the component
   */
  transformSectionsToModules(sections: Section[]) {
    if (!sections || !Array.isArray(sections)) {
      return [];
    }

    return sections.map((section, index) => ({
      number: index + 1,
      title: section.title || `Module ${index + 1}`,
      description: section.description || "",
      duration: `${section._count?.lessons || 0} min`,
      locked: false,
    }));
  }
}

export const featuredPackService = new FeaturedPackService();
