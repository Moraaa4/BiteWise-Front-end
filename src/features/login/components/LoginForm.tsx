'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usersService } from '@/services/users.service';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const response = await usersService.login({ email, password });

    if (response.ok && response.data) {
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } else {
      setError(response.error || 'Credenciales inválidas');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary rounded-lg text-white">
          <Image src="/icon.svg" alt="BiteWise" width={28} height={28} />
        </div>
        <h2 className="text-2xl font-bold text-[#111811] dark:text-white">BiteWise</h2>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 text-[#111811] dark:text-white">¡Hola de nuevo!</h1>
      <p className="text-[#608562] dark:text-gray-300 mb-6">Entra para seguir reduciendo el desperdicio de comida.</p>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold block mb-2 dark:text-white">Correo electrónico</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="w-full rounded-lg border border-[#d6e1d6] dark:border-zinc-700 py-3 px-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold dark:text-white">Contraseña</label>
            <Link href="#" className="text-sm text-primary">¿Olvidaste tu contraseña?</Link>
          </div>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-lg border border-[#d6e1d6] dark:border-zinc-700 py-3 px-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-3 rounded-lg font-bold shadow-md hover:bg-emerald-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'INICIAR SESIÓN'}
        </button>
      </form>



      <div className="mt-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">¿No tienes cuenta? <Link href="/register" className="text-primary font-bold">Regístrate gratis</Link></p>
      </div>
    </div>
  );
}
