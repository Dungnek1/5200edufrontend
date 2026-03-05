

import { User } from "@/types/auth.types";
import { http } from "../http";
import httpServer from "../http/http-server";
import type { ApiResponse } from "../http/types";

import { logger } from '@/lib/logger';
import axios from "axios";
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceType?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  refreshToken: string;
  sessionId: string;
  mustChangePassword: boolean;
  user: User;
}

interface SendOTPResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyLoginOtpRequest {
  sessionToken: string;
  otp: string;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}




class AuthService {
  /**
   * Get appropriate HTTP client based on execution context
   * - Server-side (typeof window === 'undefined'): Use httpServer with correct BE hostname
   * - Client-side: Use http with relative URLs or NEXT_PUBLIC_API_URL
   */
  private getHttpClient() {
    // If running on server-side (Next.js route handler), use server-side client
    if (typeof window === 'undefined') {
      return httpServer;
    }
    // If running on client-side (browser), use client-side client
    return http;
  }

  async register(
    registerDto: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await http.post<ApiResponse<AuthResponse>>(
        "/auth/register",
        registerDto
      );

      const data = response.data as any;
      // Backend may return 200 with error status for duplicate email, etc.
      if (data.success === false || data.status === 'error' || data.statusCode >= 400) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      return response.data;
    } catch (error: any) {
      if (error instanceof Error && !error.message.includes('status code')) {
        throw error;
      }
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again."
      );
    }
  }

  async verifyRegistrationOTP(
    email: string,
    otp: string
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await http.post<ApiResponse<AuthResponse>>(
        "/auth/verify-registration-otp",
        { email, otp }
      );

      const data = response.data as any;
      if (data.success === false || data.status === 'error' || data.statusCode >= 400) {
        throw new Error(data.message || "Verification failed. Please try again.");
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Verification failed. Please try again."
      );
    }
  }

  async resendRegistrationOTP(
    email: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await http.post<ApiResponse<any>>(
        "/auth/resend-registration-otp",
        { email }
      );

      const data = response.data as any;
      if (data.success === false || data.status === 'error' || data.statusCode >= 400) {
        throw new Error(data.message || "Failed to resend OTP. Please try again.");
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP. Please try again."
      );
    }
  }

  async login(loginDto: LoginRequest): Promise<any> {
    try {
      const httpClient = this.getHttpClient();
      const response = await httpClient.post<ApiResponse<AuthResponse>>("/auth/login", loginDto);

      return response;
    } catch (error: any) {
      logger.error("Login error:", error);
      throw new Error(error?.response?.data?.message || error?.message || "Login failed. Please try again.");
    }
  }



  async getCurrentUser(): Promise<ApiResponse<AuthResponse["user"]>> {
    const response = await http.get<ApiResponse<AuthResponse["user"]>>(
      "/auth/me"
    );
    return response.data;
  }

  async refreshToken(
    refreshToken: string
  ): Promise<
    ApiResponse<{
      refreshToken?: string;
      expiresAt?: string;
    }>
  > {
    const response = await http.post<
      ApiResponse<{
        refreshToken: string;
        expiresAt?: string;
      }>
    >("/auth/refresh", { refreshToken });
    return response.data;
  }

  async refreshTokenWithDbVerification(
    refreshToken: string
  ): Promise<ApiResponse<Record<string, unknown>>> {
    const response = await http.post<
      ApiResponse<Record<string, unknown>>
    >("/auth/refresh-with-db", { refreshToken });
    return response.data;
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<any>> {
    const response = await http.post<ApiResponse<any>>(
      "/auth/verify-email",
      data
    );
    return response.data;
  }

  async resendVerification(data: { email: string }): Promise<ApiResponse<any>> {
    const response = await http.post<ApiResponse<any>>(
      "/auth/resend-verification",
      data
    );
    return response.data;
  }

  async changePassword(
    data: ChangePasswordRequest
  ): Promise<ApiResponse<void>> {
    const response = await http.post<ApiResponse<void>>(
      "/auth/change-password",
      data
    );
    return response.data;
  }

  async forgotPassword(data: { email: string }): Promise<ApiResponse<any>> {
    const response = await http.post<ApiResponse<any>>("/auth/forgot-password", data);
    return response.data;
  }

  async verifyResetOtp(data: { email: string; otp: string }): Promise<ApiResponse<any>> {
    const response = await http.post<ApiResponse<any>>("/auth/verify-reset-otp", data);
    return response.data;
  }

  async resetPassword(data: { email: string; token: string; newPassword: string }): Promise<ApiResponse<any>> {
    const response = await http.post<ApiResponse<any>>("/auth/reset-password", data);
    return response.data;
  }


  storeSessionId(sessionId: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sessionId", sessionId);
    }
  }


  getSessionId(): string | null {
    if (typeof window === "undefined") return null;

    return sessionStorage.getItem("sessionId");
  }


  clearAuthData(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("sessionId");
  }


  static useCurrentUser() {
    throw new Error(
      "useCurrentUser should be used in React components with useSession hook"
    );
  }

  static useAccessToken() {
    throw new Error(
      "useAccessToken should be used in React components with useSession hook"
    );
  }

  static useIsAuthenticated() {
    throw new Error(
      "useIsAuthenticated should be used in React components with useSession hook"
    );
  }
}

export default new AuthService();
