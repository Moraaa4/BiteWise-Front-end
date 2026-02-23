import type { LoginPayload, LoginResponse } from './types';

// Front-only stub for login. Replace with real API integration later.
export async function login(_payload: LoginPayload): Promise<LoginResponse> {
  await new Promise((res) => setTimeout(res, 500));
  return { ok: true, message: 'Inicio de sesión simulado (front-only)', token: 'mock-token' };
}
