import { http } from '../http';

import { logger } from '@/lib/logger';
export interface PackageFeature {
  id: string;
  packageId: string;
  content: string;
  sortOrder: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface Package {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  priceUnit: string;
  badgeText?: string | null;
  badgeType?: string | null;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: any;
  updatedAt?: any;
  features: PackageFeature[];
}

export interface PackagesResponse {
  status: string;
  message: string;
  data: {
    success: boolean;
    data: Package[];
  };
}

class PackagesService {
  private baseUrl = "/packages";

  /**
   * GET /api/v1/packages
   * Lấy danh sách packages với danh sách features của mỗi package (PUBLIC)
   */
  async getPackages(): Promise<Package[]> {
    try {
      const response = await http.get<PackagesResponse>(this.baseUrl);

      if (response.data?.status === "success" && response.data?.data?.data) {
        return response.data.data.data;
      }

      return [];
    } catch (error) {
      logger.error("Error fetching packages:", error);
      throw error;
    }
  }

  /**
   * GET /api/v1/packages/{id}
   * Lấy chi tiết package theo ID
   */
  async getPackageById(id: string): Promise<Package | null> {
    try {
      const response = await http.get<{
        status: string;
        data: Package;
      }>(`${this.baseUrl}/${id}`);

      if (response.data?.status === "success") {
        return response.data.data;
      }

      return null;
    } catch (error) {
      logger.error("Error fetching package by ID:", error);
      throw error;
    }
  }

  /**
   * Get packages by code
   */
  async getPackageByCode(code: string): Promise<Package | null> {
    try {
      const packages = await this.getPackages();
      return packages.find(pkg => pkg.code === code) || null;
    } catch (error) {
      logger.error("Error fetching package by code:", error);
      throw error;
    }
  }

  /**
   * Get first N packages
   */
  async getPackagesLimit(limit: number): Promise<Package[]> {
    try {
      const packages = await this.getPackages();
      return packages.slice(0, limit);
    } catch (error) {
      logger.error("Error fetching packages limit:", error);
      throw error;
    }
  }
}

export default new PackagesService();
