import { STORAGE_KEYS, APP_ROUTES, EXTERNAL_URLS, DEV_PORTS } from '@/config/constants';

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
  ok: boolean;
}

export class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 30000; // Aumentado a 30s para mitigar cold starts en Render
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = this.baseURL ? `${this.baseURL}${endpoint}` : endpoint;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      const isProductionService = url.includes(EXTERNAL_URLS.PRODUCTION_DOMAIN);

      if (!response.ok && response.status === 401) {
        console.warn(`[HttpClient] 401 detectado en: ${url}. Verificando origen...`);

        // Si el error de sesión viene de nuestros servicios descentralizados, limpiamos
        if (isProductionService || url.includes(`:${DEV_PORTS.USERS}`)) {
          if (typeof window !== 'undefined') {
            console.log("[HttpClient] Limpiando sesión completa por seguridad...");
            localStorage.clear(); // Limpieza total por seguridad en errores 401 críticos
            window.location.href = APP_ROUTES.LOGIN;
          }
        }
      }

      return {
        data,
        status: response.status,
        ok: response.ok,
        error: response.ok
          ? undefined
          : (data as Record<string, unknown>)?.error as string || 'Request failed',
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        return {
          status: 408,
          ok: false,
          error: 'Request timeout',
        };
      }

      return {
        status: 0,
        ok: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export const createHttpClient = (baseURL: string) => new HttpClient({ baseURL });
export const apiClient = new HttpClient();
export const externalClient = (baseURL: string) => new HttpClient({ baseURL });