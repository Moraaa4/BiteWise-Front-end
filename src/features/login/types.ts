export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
  message?: string;
  token?: string;
}
