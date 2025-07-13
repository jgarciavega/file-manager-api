"use client";
import Image from "next/image";
import { useState } from "react";
import BackToHomeButton from "./BackToHomeButton";

export default function AjustesPage() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>
      <div className={`sticky top-0 z-40 border-b flex items-center justify-between px-6 py-4 ${darkMode ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-blue-200"}`}>
        <Image src="/api-dark23.png" alt="API Logo" width={180} height={60} className="object-contain" priority />
        <h1 className="text-3xl font-extrabold text-center flex-1">Ajustes</h1>
        <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? "bg-slate-800 text-yellow-400" : "bg-gray-100 text-gray-600"}`}>{darkMode ? "🌞" : "🌙"}</button>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-6 rounded-xl shadow-lg bg-white/80 dark:bg-slate-900/80 border border-blue-100 dark:border-slate-800">
        <BackToHomeButton />
      </div>
    </div>
  );
}
