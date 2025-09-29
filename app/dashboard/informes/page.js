"use client";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/DashboardHeader';
import avatarMap from '../../../lib/avatarMap';
import BackToHomeButton from "../../../components/BackToHomeButton";
import FiltrosInformes from "./FiltrosInformes";
import TablaInformes from "./TablaInformes";
import FooterLegal from "./FooterLegal";

export default function InformesPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const readTheme = () => {
      try {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') return true;
        if (stored === 'light') return false;
      } catch (e) {}
      return root.classList.contains('dark') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    };

    setDarkMode(readTheme());

    const onThemeChange = (e) => {
      const t = e?.detail?.theme;
      if (t === 'dark') setDarkMode(true);
      else if (t === 'light') setDarkMode(false);
      else setDarkMode(root.classList.contains('dark'));
    };
    window.addEventListener('themechange', onThemeChange);

    const observer = new MutationObserver(() => setDarkMode(root.classList.contains('dark')));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('themechange', onThemeChange);
      observer.disconnect();
    };
  }, []);

  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const userAvatar = avatarMap[userEmail] || "/default-avatar.png";

  const [informes, setInformes] = useState([
    { fecha: "2025-07-12", usuario: "Jorge Vega", tipo: "Acceso", descripcion: "Consultó expediente 2025/001" },
    { fecha: "2025-07-11", usuario: "Lupita Pérez", tipo: "Descarga", descripcion: "Descargó documento confidencial" },
    { fecha: "2025-07-10", usuario: "María López", tipo: "Modificación", descripcion: "Actualizó metadatos del expediente 2024/210" },
    { fecha: "2025-07-09", usuario: "Carlos Méndez", tipo: "Eliminación", descripcion: "Eliminó versión obsoleta del documento 2019-abc" },
  ]);

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = informes.filter(ev =>
    (!dateStart || ev.fecha >= dateStart) &&
    (!dateEnd || ev.fecha <= dateEnd) &&
    (!userFilter || ev.usuario.toLowerCase().includes(userFilter.toLowerCase())) &&
    (!typeFilter || ev.tipo === typeFilter)
  );

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
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-grey-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>
      <DashboardHeader title="Informes" avatarUrl={userAvatar} />

      <div className="w-full flex mt-4">
        <div className="flex items-start">
          <BackToHomeButton />
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('openLegalModal'))}
            className="ml-3 inline-flex items-center justify-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-transparent dark:hover:bg-slate-800 transition"
            title="Aviso legal"
            aria-label="Abrir aviso legal"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-blue-700 dark:text-blue-300">
              <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18.2A8.2 8.2 0 1 1 12 3.8a8.2 8.2 0 0 1 0 16.4Zm0-12.2a1 1 0 0 1 1 1v3.5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Zm0 7.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 p-6 rounded-xl shadow-lg bg-blue/600 dark:bg-[#10172a]   dark:border-[#10172a]">
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

      <FooterLegal darkMode={darkMode} />
    </div>
  );
}
