import type { LoginPayload, LoginResponse } from './types';
import { apiClient } from '@/services/apiClient';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  // Llama a la capa de API descentralizada
  return await apiClient.post<LoginResponse, LoginPayload>('/auth/login', payload);
}
