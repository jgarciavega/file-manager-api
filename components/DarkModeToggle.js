"use client";

import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    let stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch (e) {
      stored = null;
    }

    const prefersDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", prefersDark);
    setDarkMode(prefersDark);

    const observer = new MutationObserver(() => {
      setDarkMode(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    const root = document.documentElement;
    root.classList.toggle("dark", newMode);

    try {
      localStorage.setItem("theme", newMode ? "dark" : "light");
    } catch (e) {}

    try {
      window.dispatchEvent(
        new CustomEvent("themechange", {
          detail: { theme: newMode ? "dark" : "light" },
        })
      );
    } catch (e) {}
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-[#19223a] hover:scale-110 transition border border-gray-300 dark:border-[#25304d]"
      aria-label="Cambiar tema"
      title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {darkMode ? (
        <FaSun className="text-yellow-400" />
      ) : (
        <FaMoon className="text-[#7bb0ff]" />
      )}
    </button>
  );
}
