"use client";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle({ className }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    let stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch (e) {
      stored = null;
    }
    if (stored === 'dark') {
      root.classList.add('dark');
      setIsDark(true);
    } else if (stored === 'light') {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (root.classList.contains('dark') || prefersDark) {
        root.classList.add('dark');
        setIsDark(true);
      } else {
        root.classList.remove('dark');
        setIsDark(false);
      }
    }

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    try { localStorage.setItem('theme', newMode ? 'dark' : 'light'); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newMode ? 'dark' : 'light' } })); } catch (e) {}
  };

  return (
    <button
      onClick={toggle}
      className={"p-2 rounded-full bg-gray-200 dark:bg-[#19223a] hover:scale-110 transition border border-gray-300 dark:border-[#25304d] " + (className || '')}
      aria-label="Cambiar tema"
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-[#7bb0ff]" />}
    </button>
  );
}
