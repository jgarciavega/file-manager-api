"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaSun, FaMoon } from "react-icons/fa";

export default function DashboardHeader({ title = "Dashboard", avatarUrl }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

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
    document.documentElement.classList.toggle("midnight", newMode);
    localStorage.setItem("theme", newMode ? "midnight" : "light");
  };

  return (
    <header className="w-full flex items-center justify-between py-4 px-6 bg-white dark:bg-[#151a2c] border-b border-gray-300 dark:border-[#25304d]">
      {/* Logo a la izquierda */}
      <div className="flex items-center gap-2 min-w-[48px]">
        <Image
          src={isDark ? "/api-dark23.png" : "/api_logos.jpg"}
          alt="Logo"
          width={140}
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
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-[#19223a] hover:scale-110 transition border border-gray-300 dark:border-[#25304d]"
          aria-label="Cambiar tema"
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo midnight"}
        >
          {isDark ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-[#7bb0ff]" />
          )}
        </button>

        <Image
          src={avatarUrl || "/login.jpg"}
          alt="Avatar"
          width={56}
          height={56}
          className="rounded-full border border-gray-400 dark:border-gray-600 shadow-md"
        />
      </div>
    </header>
  );
}
