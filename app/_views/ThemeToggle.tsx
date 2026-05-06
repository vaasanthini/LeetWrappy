'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'leetwrappy:theme';

type ThemeMode = 'light' | 'dark';

function applyTheme(next: ThemeMode) {
  document.documentElement.setAttribute('data-theme', next);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      applyTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: ThemeMode = prefersDark ? 'dark' : 'light';
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggleTheme() {
    const next: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed right-5 top-5 z-[60] w-9 h-9 rounded-full flex items-center justify-center transition-colors"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        color: 'var(--foreground)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
