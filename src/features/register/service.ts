import type { RegisterPayload, RegisterResponse } from './types';

// Front-only stub for the register flow (cascarón).
// The real API will be integrated later by the user.
export async function register(_payload: RegisterPayload): Promise<RegisterResponse> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 600));

  // Return a mock successful response — front shell only
  return { ok: true, message: 'Registro simulado (front-only)' };
}

