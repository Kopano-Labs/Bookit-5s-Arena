'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const THEMES = {
  dark: {
    name: 'Dark',
    emoji: '🌙',
    bg: '#030712',
    text: '#f9fafb',
    accent: '#22c55e',
    card: '#111827',
    border: '#1f2937',
  },
  light: {
    name: 'Light',
    emoji: '☀️',
    bg: '#ffffff',
    text: '#111827',
    accent: '#16a34a',
    card: '#f9fafb',
    border: '#e5e7eb',
  },
  reading: {
    name: 'Reading',
    emoji: '📖',
    bg: '#fef3c7',
    text: '#451a03',
    accent: '#d97706',
    card: '#fffbeb',
    border: '#fde68a',
  },
  wild: {
    name: 'Wild',
    emoji: '🔥',
    bg: '#0f0a1e',
    text: '#e0d4ff',
    accent: '#a855f7',
    card: '#1a1130',
    border: '#4c1d95',
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('5s_theme');
    if (saved && THEMES[saved]) {
      setTheme(saved);
    } else {
      // Respect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('5s_theme', theme);
    const t = THEMES[theme];
    document.documentElement.style.setProperty('--bg-primary', t.bg);
    document.documentElement.style.setProperty('--text-primary', t.text);
    document.documentElement.style.setProperty('--accent', t.accent);
    document.documentElement.style.setProperty('--card-bg', t.card);
    document.documentElement.style.setProperty('--border', t.border);
  }, [theme]);

  const cycleTheme = () => {
    const keys = Object.keys(THEMES);
    const idx = keys.indexOf(theme);
    setTheme(keys[(idx + 1) % keys.length]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes: THEMES, current: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export { THEMES };
export default ThemeContext;
