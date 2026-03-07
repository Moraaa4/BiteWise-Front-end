'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const current = theme === 'system' ? systemTheme : theme;
  return (
    <button
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-lg hover:scale-110 transition-all"
    >
      {current === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
