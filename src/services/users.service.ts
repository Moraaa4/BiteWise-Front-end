import { createHttpClient } from './http.client';

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
  weekly_budget?: number;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  weekly_budget?: number | string;
  created_at?: string;
}

export interface UserStats {
  total_clientes: number;
  listas_generadas: number;
  dinero_gestionado_mxn: number;
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: UserProfile;
}

export interface UpdateProfileRequest {
  name?: string;
  weekly_budget?: number;
}

const userClient = createHttpClient(process.env.NEXT_PUBLIC_API_USUARIOS || 'http://localhost:3001');

export const usersService = {
  async register(userData: UserRegisterRequest) {
    const response = await userClient.post<{ message: string; user: UserProfile }>('/api/users/register', userData);
    return response;
  },

  async login(credentials: UserLoginRequest) {
    const response = await userClient.post<AuthResponse>('/api/users/login', credentials);
    return response;
  },

  async getProfile(userId: string, token: string) {
    const response = await userClient.get<{ message: string; user: UserProfile }>(`/api/users/${userId}`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async updateProfile(userId: string, data: UpdateProfileRequest, token: string) {
    const response = await userClient.put<{ message: string; user: UserProfile }>(`/api/users/${userId}`, data, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getStats(token: string) {
    const response = await userClient.get<{ message: string; stats: UserStats }>('/api/users/stats', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },
};
