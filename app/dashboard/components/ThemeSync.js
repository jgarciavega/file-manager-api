"use client";
import { useEffect } from "react";

export default function ThemeSync() {
  useEffect(() => {
    const root = document.documentElement;
    let userTheme = null;
    try { userTheme = localStorage.getItem("theme"); } catch (e) { userTheme = null; }

    // Si el usuario guardó una preferencia aplicarla; sino respetar la clase actual o la preferencia del sistema
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let finalTheme = null;
    if (userTheme === 'dark') finalTheme = 'dark';
    else if (userTheme === 'light') finalTheme = 'light';
    else if (root.classList.contains('dark') || prefersDark) finalTheme = 'dark';
    else finalTheme = 'light';

    if (finalTheme === 'dark') {
      root.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    } else {
      root.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch (e) {}
    }

    // Emitir evento para sincronizar componentes que escuchen 'themechange'
    try { window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: finalTheme } })); } catch (e) {}
  }, []);
  return null;
}
