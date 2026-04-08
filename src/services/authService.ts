import { apiClient } from './apiClient';

// ============ Request Types ============

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  email?: string;
  birth_date?: string; // YYYY-MM-DD
  region_id?: number;
  district_id?: number;
  street_id?: number;
  home?: string;
  post_number?: string;
  latitude?: number;
  longitude?: number;
  // Extended fields for business owners
  business_name?: string;
  category?: string;
  subcategory?: string;
  role?: string;
  region_name?: string;
  district_name?: string;
  street_name?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

// ============ Response Types ============

export interface RegisterResponse {
  user_id: number;
  message: string;
  expires_in: number;
}

export interface LocationData {
  id: number;
  is_primary: boolean;
  home: string;
  post_number: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  created_by: number | null;
  updated_at: string | null;
  updated_by: number | null;
  deleted_at: string | null;
  deleted_by: number | null;
  delete_status: boolean;
  region: {
    id: number;
    name_uz: string;
    name_ru: string;
    name_en: string;
  };
  district: {
    id: number;
    name_uz: string;
    name_ru: string;
    name_en: string;
  };
  street: {
    id: number;
    name_uz: string;
    name_ru: string;
    name_en: string;
  };
}

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  birth_date: string;
  is_active: boolean;
  verified_at: string | null;
  created_at: string;
  created_by: number | null;
  updated_at: string | null;
  updated_by: number | null;
  deleted_at: string | null;
  deleted_by: number | null;
  delete_status: boolean;
  avatar: string | null;
  locations: LocationData[];
}

export interface VerifyOtpResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserData;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserData;
}

// ============ Auth Service ============

export const authService = {
  /**
   * Register a new client user
   * POST /api/auth/register
   */
  async register(data: RegisterRequest) {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  /**
   * Verify SMS OTP code
   * POST /api/auth/verify
   */
  async verifyOtp(data: VerifyOtpRequest) {
    return apiClient.post<VerifyOtpResponse>('/auth/verify', data);
  },

  /**
   * Login with phone + password
   * POST /api/auth/login
   */
  async login(data: LoginRequest) {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },
};
