import { http } from '../http';
import { parseBackendResponse } from "../http/response-parser";
import type { ApiResponse } from "../http/types";

export interface CartItemPayload {
  courseId: string;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  cartItems: CartItemPayload[];
  couponCodes?: string[];
}

export interface OrderResponse {
  id: string;
  status: string;
  totalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
}

class OrderService {
  private readonly baseUrl = "/orders";

  /**
   * POST /api/v1/orders/create
   * Tạo đơn hàng mới từ các khóa học trong giỏ hàng
   * 
   * @param payload - Thông tin đơn hàng cần tạo
   * @returns OrderResponse nếu thành công
   * 
   * Response codes:
   * - 201: Đơn hàng được tạo thành công
   * - 400: Dữ liệu không hợp lệ (giỏ hàng trống hoặc không hợp lệ)
   */
  async createOrder(payload: CreateOrderPayload): Promise<ApiResponse<OrderResponse>> {
    try {
      const response = await http.post(`${this.baseUrl}/create`, payload);
      const order = parseBackendResponse<OrderResponse>(response.data);

      return {
        success: true,
        data: order,
      };
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.error ||
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        "Có lỗi khi tạo đơn hàng";

      return {
        success: false,
        data: {} as OrderResponse,
        message: errorMessage,
      };
    }
  }
}

export default new OrderService();
