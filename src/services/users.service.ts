import { createHttpClient } from './http.client';

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

const userClient = createHttpClient(process.env.NEXT_PUBLIC_USERS_API_URL || 'http://localhost:3001');

export const usersService = {
  async register(userData: UserRegisterRequest) {
    const response = await userClient.post<AuthResponse>('/api/users/register', userData);
    return response;
  },

  async login(credentials: UserLoginRequest) {
    const response = await userClient.post<AuthResponse>('/api/users/login', credentials);
    return response;
  },

  async getProfile(userId: string, token: string) {
    const response = await userClient.get<UserProfile>(`/api/users/${userId}`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async updateProfile(userId: string, userData: Partial<UserProfile>, token: string) {
    const response = await userClient.put<UserProfile>(`/api/users/${userId}`, userData, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getStats(token: string) {
    const response = await userClient.get<UserStats>('/api/users/stats', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },
};
