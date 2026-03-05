import { http } from '../http';
import type { ApiResponse, PaginatedResponse } from '../http/types';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  enableEmailOTP?: boolean;
}

class UserService {
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await http.get<ApiResponse<User>>('/users/me');
    return response.data;
  }

  async updateProfile(data: UpdateUserRequest): Promise<ApiResponse<User>> {
    const response = await http.patch<ApiResponse<User>>('/users/me', data);
    return response.data;
  }

  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await http.post<ApiResponse<any>>('/users/me/avatar', formData);
    return response.data;
  }

  async getUsers(page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<User>>> {
    const response = await http.get<ApiResponse<PaginatedResponse<User>>>(
      `/users?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await http.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  }
}

export default new UserService();
