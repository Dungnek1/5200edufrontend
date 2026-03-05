
import type { ApiResponse } from "../http/types";
import { parseBackendResponse } from "../http/response-parser";
import { http } from '../http';

/**
 * Category type
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Category Service (Public)
 * GET /api/v1/categories - Public category listing
 */
class CategoryService {
  private readonly baseUrl = "/categories";

  /**
   * GET /categories
   * Get public category list
   */
  async getCategories(search?: string): Promise<ApiResponse<Category[]>> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const queryParams = params.toString();
    const url = `${this.baseUrl}${queryParams ? `?${queryParams}` : ""}`;

    const response = await http.get(url);
    const categories = parseBackendResponse<Category[]>(response.data);

    return {
      success: true,
      data: categories || [],
    };
  }

  /**
   * GET /categories/:id
   * Get category detail
   */
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await http.get(`${this.baseUrl}/${id}`);
    const category = parseBackendResponse<Category>(response.data);

    return {
      success: true,
      data: category,
    };
  }
}

export default new CategoryService();
