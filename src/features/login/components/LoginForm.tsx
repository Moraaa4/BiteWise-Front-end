'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usersService } from '@/services/users.service';
import { STORAGE_KEYS, APP_ROUTES, UI_TEXT } from '@/config/constants';

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
      // Proactive cleanup before setting new user data
      localStorage.clear(); // Nuclear option for clean login

      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER_ID, response.data.user.id);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
      localStorage.setItem(STORAGE_KEYS.LOGIN_TS, Date.now().toString());

      window.location.href = APP_ROUTES.DASHBOARD;
    } else {
      setError(response.error || 'Credenciales inválidas');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
          <Image src="/icon.svg" alt="BiteWise" width={40} height={40} priority unoptimized className="dark:invert dark:brightness-200" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold leading-none text-[#111811] dark:text-white">BiteWise</h2>
          <p className="text-xs text-[#6c7f6d] dark:text-gray-400">Cocina Inteligente</p>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 text-[#111811] dark:text-white">{UI_TEXT.LOGIN.TITLE}</h1>
      <p className="text-[#608562] dark:text-gray-300 mb-6">{UI_TEXT.LOGIN.SUBTITLE}</p>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold block mb-2 dark:text-white">{UI_TEXT.LOGIN.EMAIL_LABEL}</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="w-full rounded-lg border border-[#d6e1d6] dark:border-zinc-700 py-3 px-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
            placeholder={UI_TEXT.LOGIN.EMAIL_PLACEHOLDER}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold dark:text-white">{UI_TEXT.LOGIN.PASSWORD_LABEL}</label>
            <Link href="#" className="text-sm text-primary">{UI_TEXT.LOGIN.FORGOT_PASSWORD}</Link>
          </div>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-lg border border-[#d6e1d6] dark:border-zinc-700 py-3 px-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              placeholder={UI_TEXT.LOGIN.PASSWORD_PLACEHOLDER}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword ? UI_TEXT.LOGIN.HIDE_PASSWORD : UI_TEXT.LOGIN.SHOW_PASSWORD}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-3 rounded-lg font-bold shadow-md hover:bg-emerald-600 transition-all disabled:opacity-50"
        >
          {loading ? UI_TEXT.LOGIN.SUBMIT_LOADING : UI_TEXT.LOGIN.SUBMIT_BUTTON}
        </button>
      </form>



      <div className="mt-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">{UI_TEXT.LOGIN.REGISTER_LINK}<Link href={APP_ROUTES.REGISTER} className="text-primary font-bold">{UI_TEXT.LOGIN.REGISTER_ACTION}</Link></p>
      </div>
    </div>
  );
}
