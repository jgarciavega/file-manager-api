"use client";
import { useEffect } from "react";

export default function ThemeSync() {
  useEffect(() => {
    const userTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // Compatibilidad: aceptar 'midnight' guardado en versiones antiguas
    if (userTheme === "dark" || userTheme === "midnight" || (!userTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return null;
}
