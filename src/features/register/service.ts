import type { RegisterPayload, RegisterResponse } from './types';
import { apiClient } from '@/services/apiClient';

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  // Llama a la capa de API descentralizada
  return await apiClient.post<RegisterResponse, RegisterPayload>('/auth/register', payload);
}
