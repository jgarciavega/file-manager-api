"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import BackToHomeButton from "../../../components/BackToHomeButton";
import FiltrosInformes from "./FiltrosInformes";
import TablaInformes from "./TablaInformes";
import FooterLegal from "./FooterLegal";

export default function InformesPage() {
  // Detecta modo oscuro global leyendo la clase 'dark' en <html>
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const checkDark = () => setDarkMode(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  // Datos de ejemplo
  const [informes, setInformes] = useState([
    { fecha: "2025-07-12", usuario: "Jorge Vega", tipo: "Acceso", descripcion: "Consultó expediente 2025/001" },
    { fecha: "2025-07-11", usuario: "Lupita Pérez", tipo: "Descarga", descripcion: "Descargó documento confidencial" },
  ]);
  // Filtros (puedes expandir lógica real después)
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  // Filtrado simple
  const filtered = informes.filter(ev =>
    (!dateStart || ev.fecha >= dateStart) &&
    (!dateEnd || ev.fecha <= dateEnd) &&
    (!userFilter || ev.usuario.toLowerCase().includes(userFilter.toLowerCase())) &&
    (!typeFilter || ev.tipo === typeFilter)
  );

  // Feedback visual para exportación
  const [exportMsg, setExportMsg] = useState("");
  const exportCSV = () => {
    if (filtered.length === 0) {
      setExportMsg("No hay datos para exportar.");
      setTimeout(() => setExportMsg(""), 2500);
      return;
    }
    try {
      const headers = ["Fecha", "Usuario", "Tipo de Informe", "Descripción"];
      const rows = filtered.map(ev => [ev.fecha, ev.usuario, ev.tipo, ev.descripcion]);
      const csv = headers.join(",") + "\n" + rows.map(r => r.map(x => `"${x}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `informes_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportMsg("Exportación exitosa. Archivo CSV generado.");
      setTimeout(() => setExportMsg(""), 2500);
    } catch (e) {
      setExportMsg("Error al exportar. Intente de nuevo.");
      setTimeout(() => setExportMsg(""), 2500);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>
      {/* Header premium institucional */}
      <div className={`sticky top-0 z-40 border-b flex items-center justify-between px-6 py-4 ${darkMode ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-blue-200"}`}>
        {/* Logo institucional a la izquierda */}
        <div className="flex items-center gap-6 min-w-[300px]">
          <Image src="/api-dark23.png" alt="API Logo" width={240} height={90} className="object-contain" priority />
        </div>
        {/* Título */}
        <h1
          className="flex-1 text-5xl md:text-6xl font-extrabold text-center tracking-tight relative group select-none"
          style={{ letterSpacing: '0.01em', lineHeight: 1.1 }}
        >
          <span
            className="inline-block bg-gradient-to-r from-blue-700 via-cyan-400 to-green-400 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-move transition-transform duration-300 group-hover:scale-105"
            style={{
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textFillColor: 'transparent',
            }}
          >
            Informes
          </span>
          <span className="block h-1 w-1/2 mx-auto mt-2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-green-300 opacity-80 animate-underline-move group-hover:scale-x-110 transition-transform duration-300"></span>
          <style jsx>{`
            .animate-gradient-move {
              animation: gradient-move 3.5s ease-in-out infinite alternate;
            }
            @keyframes gradient-move {
              0% { background-position: 0% 50%; }
              100% { background-position: 100% 50%; }
            }
            .animate-underline-move {
              animation: underline-move 2.2s cubic-bezier(0.4,0,0.2,1) infinite alternate;
            }
            @keyframes underline-move {
              0% { transform: scaleX(0.85); opacity: 0.7; }
              60% { transform: scaleX(1.1); opacity: 1; }
              100% { transform: scaleX(1); opacity: 0.85; }
            }
          `}</style>
        </h1>
        {/* Botón sol/luna para alternar modo global */}
        <div className="flex items-center justify-end min-w-[60px] gap-5">
          <button
            type="button"
            onClick={() => {
              const isDark = document.documentElement.classList.contains('dark');
              if (isDark) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                try { window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: 'light' } })); } catch (e) {}
              } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                try { window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: 'dark' } })); } catch (e) {}
              }
              setDarkMode(!isDark);
            }}
            className={`p-4 rounded-xl text-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 hover:-translate-y-1 shadow-lg hover:shadow-xl ${darkMode ? "bg-slate-800 text-yellow-400 hover:bg-slate-700 hover:text-yellow-300 hover:shadow-yellow-400/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600 hover:shadow-blue-400/30"}`}
            title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            tabIndex={0}
            aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-2xl transition-all duration-300 hover:scale-125" />
          </button>
          <Image src="/blanca.jpeg" alt="Avatar" width={64} height={64} className="rounded-full border-4 border-blue-400 shadow-xl object-cover" />
        </div>
      </div>

      {/* Botón volver pegado al borde izquierdo debajo del header */}
      <div className="w-full flex mt-4">
        <div className="flex items-start">
          <BackToHomeButton />
        </div>
      </div>

      {/* Filtros y tabla modularizados */}
      <div className="max-w-7xl mx-auto mt-8 p-6 rounded-xl shadow-lg bg-blue/600 dark:bg-[#10172a] border border-blue-600 dark:border-[#10172a]">
        <FiltrosInformes
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          userFilter={userFilter}
          setUserFilter={setUserFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          exportCSV={exportCSV}
          darkMode={darkMode}
        />
        {exportMsg && (
          <div className={`my-2 px-4 py-2 rounded-lg text-center font-semibold text-sm transition-all duration-300 ${exportMsg.includes('exitosa') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`} role="alert" aria-live="polite">
            {exportMsg}
          </div>
        )}
        <TablaInformes filtered={filtered} darkMode={darkMode} />
      </div>

      {/* Aviso legal modularizado */}
      <FooterLegal darkMode={darkMode} />
    </div>
  );
}
