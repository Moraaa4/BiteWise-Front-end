/**
 * Este archivo centraliza todas las llamadas a la API (Mock por ahora).
 * Cuando el backend esté listo, aquí se configurará axios/fetch con
 * el baseUrl correcto y los interceptores.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Función genérica para simular retardo de red
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    await delay(300); // Mock network latency
    
    // Simulación simple para devolver datos según el endpoint
    if (endpoint === '/recipes/suggested') {
      return [
        { id: 'r1', title: 'Pollo en salsa jitomate', time: '15min', img: '' },
        { id: 'r2', title: 'Arroz con verduras', time: '20min', img: '' },
        { id: 'r3', title: 'Tacos rápidos', time: '12min', img: '' },
      ] as any;
    }
    
    if (endpoint === '/inventory/ingredients') {
      return [
        { id: 'i1', name: 'Jitomate', qty: 4 },
        { id: 'i2', name: 'Pechuga pollo', qty: 2 },
        { id: 'i3', name: 'Cebolla', qty: 3 },
      ] as any;
    }
    
    throw new Error(`Endpoint not mocked for GET: ${endpoint}`);
  },

  async post<T, U>(endpoint: string, _body: U): Promise<T> {
    await delay(500); // Mock network latency
    
    if (endpoint === '/auth/login') {
      return { ok: true, message: 'Inicio de sesión exitoso (SOA Mock)', token: 'mock-token-123' } as any;
    }
    
    if (endpoint === '/auth/register') {
      return { ok: true, message: 'Registro exitoso (SOA Mock)' } as any;
    }
    
    throw new Error(`Endpoint not mocked for POST: ${endpoint}`);
  }
};
