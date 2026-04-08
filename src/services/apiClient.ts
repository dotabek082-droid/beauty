const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async post<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: "Tarmoq xatosi. Iltimos, qayta urinib ko'ring.",
        },
      };
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: "Tarmoq xatosi. Iltimos, qayta urinib ko'ring.",
        },
      };
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
