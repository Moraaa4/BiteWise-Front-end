'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { register } from '@/services/auth';

export default function RegisterPage() {
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

    const result = await register({ name, email, password });
    if (result.ok) {
      // Redirigir a login o dashboard
      window.location.href = '/login';
    } else {
      setError(result.message || 'Error en registro');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-white dark:bg-background-dark">
      {/* Left Side: Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/register-hero.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-background-dark p-8 md:p-16 lg:p-24 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-primary rounded-lg text-white">
            <Image src="/icon.png" alt="BiteWise" width={24} height={24} />
          </div>
          <h2 className="text-[#111811] dark:text-white text-2xl font-black tracking-tight">
            BiteWise
          </h2>
        </div>

        {/* Page Heading */}
        <div className="mb-10">
          <h1 className="text-[#111811] dark:text-white text-4xl font-black tracking-tight mb-3">
            Crea tu cuenta en 30s
          </h1>
          <p className="text-[#608562] dark:text-gray-400 text-lg">
            Únete a miles de personas que ya no desperdician comida.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[#111811] dark:text-gray-200 text-sm font-semibold">
              Nombre
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                person
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full rounded-xl border border-[#d6e1d6] dark:border-gray-700 bg-white dark:bg-gray-800/50 py-4 pl-12 pr-4 text-[#111811] dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[#111811] dark:text-gray-200 text-sm font-semibold">
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl border border-[#d6e1d6] dark:border-gray-700 bg-white dark:bg-gray-800/50 py-4 pl-12 pr-4 text-[#111811] dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[#111811] dark:text-gray-200 text-sm font-semibold">
              Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#d6e1d6] dark:border-gray-700 bg-white dark:bg-gray-800/50 py-4 pl-12 pr-4 text-[#111811] dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-[#43a047] disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/20 transition-all mt-4 tracking-wide"
          >
            {loading ? 'Creando...' : 'CREAR CUENTA'}
          </button>
        </form>

        {/* Social Login Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="px-4 text-gray-400 text-sm font-medium">O regístrate con</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {/* Google Button Only */}
        <button className="flex items-center justify-center gap-3 px-4 py-3 border border-[#d6e1d6] dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full">
          <svg className="size-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            ></path>
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            ></path>
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            ></path>
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            ></path>
          </svg>
          <span className="text-sm font-bold text-[#111811] dark:text-white">Google</span>
        </button>

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* Legal Links */}
        <div className="mt-auto pt-10 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
          <Link href="#" className="hover:text-primary">
            Términos de servicio
          </Link>
          <Link href="#" className="hover:text-primary">
            Política de privacidad
          </Link>
          <Link href="#" className="hover:text-primary">
            Cookies
          </Link>
        </div>
      </div>
    </div>
  );
}
