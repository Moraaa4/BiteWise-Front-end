'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usersService } from '@/services/users.service';
import { APP_ROUTES, VALIDATION_MESSAGES, UI_TEXT } from '@/config/constants';
import TermsModal from './TermsModal';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [weeklyBudget, setWeeklyBudget] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.length > 20) {
      setError(VALIDATION_MESSAGES.NAME_MAX_LENGTH);
      setLoading(false);
      return;
    }

    // Show terms modal instead of proceeding directly
    setShowTermsModal(true);
  };

  const handleTermsAccepted = async () => {
    setLoading(true);
    setError('');

    const budgetNum = weeklyBudget ? parseFloat(weeklyBudget) : undefined;

    try {
      const response = await usersService.register({
        name,
        email,
        password,
        weekly_budget: budgetNum
      });

      if (response.ok && response.data) {
        window.location.href = APP_ROUTES.LOGIN;
      } else {
        setError(response.error || VALIDATION_MESSAGES.GENERIC_ERROR);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error al procesar el registro. Por favor intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
          <Image src="/icon.svg" alt="BiteWise" width={40} height={40} priority unoptimized className="dark:invert dark:brightness-200" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold leading-none text-[#111811] dark:text-white">BiteWise</h2>
          <p className="text-xs text-[#6c7f6d] dark:text-gray-400">Cocina Inteligente</p>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 text-[#111811] dark:text-white">{UI_TEXT.REGISTER.TITLE}</h1>
      <p className="text-[#608562] dark:text-gray-300 mb-6">{UI_TEXT.REGISTER.SUBTITLE}</p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-sm font-semibold block mb-2 dark:text-white">{UI_TEXT.REGISTER.NAME_LABEL}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-[#d6e1d6] dark:border-zinc-700 py-3 px-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              placeholder={UI_TEXT.REGISTER.NAME_PLACEHOLDER}
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2 dark:text-white">{UI_TEXT.REGISTER.BUDGET_LABEL}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                value={weeklyBudget}
                onChange={(e) => setWeeklyBudget(e.target.value.replace(/[^0-9.]/g, ''))}
                type="text"
                className="w-full rounded-lg border border-[#d6e1d6] dark:border-zinc-700 py-3 pl-8 pr-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                placeholder={UI_TEXT.REGISTER.BUDGET_PLACEHOLDER}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-2 dark:text-white">{UI_TEXT.REGISTER.EMAIL_LABEL}</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="w-full rounded-lg border border-[#d6e1d6] dark:border-zinc-700 py-3 px-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
            placeholder={UI_TEXT.REGISTER.EMAIL_PLACEHOLDER}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold dark:text-white">{UI_TEXT.REGISTER.PASSWORD_LABEL}</label>
          </div>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-lg border border-[#d6e1d6] dark:border-zinc-700 py-3 px-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              placeholder={UI_TEXT.REGISTER.PASSWORD_PLACEHOLDER}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword ? UI_TEXT.REGISTER.HIDE_PASSWORD : UI_TEXT.REGISTER.SHOW_PASSWORD}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-3 rounded-lg font-bold shadow-md hover:bg-emerald-600 transition-all disabled:opacity-50"
        >
          {loading ? UI_TEXT.REGISTER.SUBMIT_LOADING : UI_TEXT.REGISTER.SUBMIT_BUTTON}
        </button>
      </form>

      {/* Se ha eliminado la opción de Google a petición del usuario */}

      <p className="mt-6 text-center text-sm text-gray-500">
        {UI_TEXT.REGISTER.LOGIN_LINK}<Link href={APP_ROUTES.LOGIN} className="text-primary font-bold">{UI_TEXT.REGISTER.LOGIN_ACTION}</Link>
      </p>

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onAccept={handleTermsAccepted}
        onClose={() => setShowTermsModal(false)}
        error={error}
        loading={loading}
      />
    </div>
  );
}
