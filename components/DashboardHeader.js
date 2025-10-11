"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ThemeToggle from '@/components/ThemeToggle'

export default function DashboardHeader({ title = "Dashboard", avatarUrl }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // Inicializar desde localStorage, si existe, sino desde la clase actual o preferencia CSS
    let stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch (e) {
      stored = null;
    }
    if (stored === "dark") {
      root.classList.add("dark");
      setIsDark(true);
    } else if (stored === "light") {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      // Si no hay preferencia guardada, respetar la clase actual o la preferencia del sistema
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
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    // Guardar la preferencia de forma consistente: 'dark' o 'light'
    try {
      localStorage.setItem("theme", newMode ? "dark" : "light");
    } catch (e) {
      // localStorage puede fallar en entornos restringidos; ignorar silenciosamente
    }
    // Emitir evento global para sincronizar otras vistas de forma inmediata
    try {
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newMode ? 'dark' : 'light' } }));
    } catch (e) {
      // Entornos muy restrictivos pueden fallar; no bloquear
    }
  };

  return (
  <header className="w-full flex items-center justify-between py-4 px-6 bg-white dark:bg-slate-900">
      {/* Logo a la izquierda */}
      <div className="flex items-center gap-2 min-w-[48px]">
        <Image
          src={isDark ? "/api-dark23.png" : "/api_logos.jpg"}
          alt="Logo"
          width={200}
          height={90}
          className="rounded"
          priority
        />
      </div>

      {/* Título centrado */}
      <div className="flex-1 flex justify-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      </div>

      {/* Botón de tema y avatar a la derecha */}
      <div className="flex items-center gap-4 min-w-[90px] justify-end">
        <ThemeToggle />

        {/* Use a plain <img> for avatar so we can handle onError fallback reliably */}
        <img
          src={avatarUrl || "/login.jpg"}
          alt="Avatar"
          width={56}
          height={56}
          onError={(e) => { e.currentTarget.src = '/login.jpg'; }}
          className="rounded-full object-cover w-14 h-14"
        />
      </div>
    </header>
  );
}
