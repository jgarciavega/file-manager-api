"use client";

import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";


export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Lee el valor guardado y respeta la preferencia del sistema
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark =
      stored === "dark" ||
      stored === "midnight" ||
      (!stored && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(!!prefersDark);

    const root = document.documentElement;
    // Usar la clase dark para que Tailwind funcione
    root.classList.toggle("dark", !!prefersDark);
    // Clase semántica opcional (por si quieres variables CSS)
    root.classList.toggle("midnight", !!prefersDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    const root = document.documentElement;
    root.classList.toggle("dark", newMode);
    root.classList.toggle("midnight", newMode);

    // Guarda "midnight" cuando está oscuro (semántico), "light" cuando no
    localStorage.setItem("theme", newMode ? "midnight" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-[#19223a] hover:scale-110 transition border border-gray-300 dark:border-[#25304d]"
      aria-label="Cambiar tema"
      title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo midnight"}
    >
      {darkMode ? (
        <FaSun className="text-yellow-400" />
      ) : (
        <FaMoon className="text-[#7bb0ff]" />
      )}
    </button>
  );
}
