import { 
  User, 
  SignInDto, 
  SignUpDto, 
  ForgotPasswordDto, 
  AuthResponse, 
  SignUpResponse, 
  Statistics,
  ApiError 
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'Network error occurred',
        statusCode: response.status,
      }));
      throw error;
    }
    return response.json();
  }

  // Authentication endpoints
  async signIn(credentials: SignInDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async signUp(userData: SignUpDto): Promise<SignUpResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse<SignUpResponse>(response);
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // User management endpoints
  async getPendingUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/pending`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User[]>(response);
  }

  async approveUser(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/approve`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse<void>(response);
  }

  async rejectUser(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/reject`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse<void>(response);
  }

  async getUserProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  // Statistics endpoints
  async getStatistics(): Promise<Statistics[]> {
    const response = await fetch(`${API_BASE_URL}/statistics`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Statistics[]>(response);
  }
}

export const apiService = new ApiService();
