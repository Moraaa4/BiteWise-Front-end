'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usersService } from '@/services/users.service';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const response = await usersService.register({ name, email, password });

    if (response.ok && response.data) {
      window.location.href = '/login';
    } else {
      setError(response.error || 'Error al crear la cuenta');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary rounded-lg text-white">
          <Image src="/icon.svg" alt="BiteWise" width={28} height={28} />
        </div>
        <h2 className="text-2xl font-bold text-[#111811]">BiteWise</h2>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 text-[#111811] dark:text-white">¡Crea tu cuenta!</h1>
      <p className="text-[#608562] dark:text-gray-300 mb-6">Únete para reducir el desperdicio de comida.</p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold block mb-2 dark:text-white">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-[#d6e1d6] dark:border-zinc-700 py-3 px-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
            placeholder="Tu nombre completo"
          />
        </div>

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
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <div className="px-4 text-sm text-gray-400">O continúa con</div>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <button className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg">
        <span className="font-semibold">Google</span>
      </button>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿Ya tienes cuenta? <Link href="/login" className="text-primary font-bold">Inicia sesión</Link>
      </p>
    </div>
  );
}
