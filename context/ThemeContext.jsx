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
    glow: 'rgba(34,197,94,0.4)',
  },
  light: {
    name: 'Light',
    emoji: '☀️',
    bg: '#f8fafc',
    text: '#0f172a',
    accent: '#16a34a',
    card: '#ffffff',
    border: '#e2e8f0',
    glow: 'rgba(22,163,74,0.2)',
  },
  crazy: {
    name: 'Crazy',
    emoji: '🔥',
    bg: '#000000',
    text: '#ffffff',
    accent: '#a855f7',
    card: '#0f172a',
    border: '#a855f7',
    glow: 'rgba(168,85,247,0.8)',
    animation: 'pulse-neon',
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('5s_theme');
    if (saved && THEMES[saved]) {
      setTheme(saved);
    } else {
      // Force 'dark' as the absolute default for the "God-Mode" aesthetic
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('5s_theme', theme);
    const t = THEMES[theme];
    
    // Sync theme class to html element for Tailwind/CSS scoping
    const html = document.documentElement;
    html.classList.remove('dark', 'light', 'crazy');
    html.classList.add(theme);

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
