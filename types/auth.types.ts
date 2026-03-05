export interface User {
  id: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  email: string;
  name: string;
  role: string;
  emailVerifiedAt: string;
  mustChangePassword: boolean;
  enableEmailOTP: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: string;
  };
  message: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface SendOTPRequest {
  email: string;
}



export interface AuthUser {
  id: string;
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  _sessionData?: {
    sessionId: string;
    refreshToken: string;
    expiresAt: string;
  };
}

