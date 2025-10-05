"use client";

import { useState, useEffect } from "react";
import BackToHomeButton from "../../../components/BackToHomeButton";
import DashboardHeader from "@/components/DashboardHeader";
import avatarMap from "../../../lib/avatarMap";
import NEXT_PUBLIC_API_URL from "@/config";

export default function BitacoraPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [bitacora, setBitacora] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // 🌙 Detectar modo oscuro
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    setDarkMode(stored === "dark" || root.classList.contains("dark"));

    const observer = new MutationObserver(() =>
      setDarkMode(root.classList.contains("dark"))
    );
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // 🧠 Obtener usuario desde localStorage
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Error leyendo usuario del localStorage", err);
    }
  }, []);

  // 📡 Obtener bitácora
  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${NEXT_PUBLIC_API_URL}/bitacora`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setBitacora(data.data.registros || []);
      } catch (error) {
        console.error("Error al obtener bitácora:", error);
      }
    };
    fetchBitacora();
  }, []);

  // 🔍 Filtrar registros del usuario actual
  const filtered = bitacora
    .filter((item) => user && item.usuario_id === user.id)
    .filter((item) => {
      const matchSearch =
        !search ||
        item.descripcion?.toLowerCase().includes(search.toLowerCase());
      const matchType =
        !typeFilter ||
        item.accion?.toLowerCase().includes(typeFilter.toLowerCase());
      const matchDate =
        !dateFilter ||
        (item.fecha_inicio &&
          item.fecha_inicio.startsWith(dateFilter.toString()));
      return matchSearch && matchType && matchDate;
    });

  const exportCSV = () => {
    const headers = ["Fecha", "Acción", "Descripción", "IP"];
    const rows = filtered.map((ev) => [
      new Date(ev.fecha_inicio).toLocaleDateString(),
      ev.accion,
      ev.descripcion,
      ev.ip,
    ]);
    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.map((x) => `"${x}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bitacora_usuario_${user?.id || "actual"}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // 🧾 Render
  return (
    <div
      className={`min-h-screen transition-all duration-300 ${darkMode
        ? "bg-slate-900 text-white"
        : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"
        }`}
    >
      <DashboardHeader
        title={"Bitácora"}
        avatarUrl={avatarMap[user?.email] || "/default-avatar.png"}
      />

      <div className="w-full px-8 mt-4 flex justify-between items-center">
        <BackToHomeButton darkMode={darkMode} />
      </div>

      {/* Contenedor principal ancho */}
      <div
        className={`w-full mt-10 px-10 py-8 rounded-2xl shadow-2xl ${darkMode ? "bg-slate-900" : "bg-white/90"
          }`}
      >
        {/* FILTROS */}
        <div className="flex flex-wrap gap-4 mb-8 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-xs mb-1 font-semibold opacity-70">
                Buscar descripción
              </label>
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`px-3 py-2 rounded-xl border text-sm shadow-sm transition-all focus:ring-2 focus:ring-blue-400 ${darkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-blue-200 text-gray-800"
                  }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1 font-semibold opacity-70">
                Filtrar por fecha
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={`px-3 py-2 rounded-xl border text-sm shadow-sm transition-all focus:ring-2 focus:ring-blue-400 ${darkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-blue-200 text-gray-800"
                  }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1 font-semibold opacity-70">
                Tipo de acción
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-3 py-2 rounded-xl border text-sm shadow-sm transition-all focus:ring-2 focus:ring-blue-400 ${darkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-blue-200 text-gray-800"
                  }`}
              >
                <option value="">Mostrar Todos</option>
                <option value="subida">Subida</option>
                <option value="eliminacion">Eliminación</option>
                <option value="actualizacion">Actualización</option>
                <option value="descarga">Descarga</option>
                <option value="revision">Revisión</option>
                <option value="login">Login</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowModal(true)}
              title="Aviso legal"
              className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 shadow-sm hover:scale-105 transition"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                className="text-blue-600 dark:text-blue-400"
              >
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 6h-2v-4h2v4Z"
                />
              </svg>
            </button>
            <button
              onClick={exportCSV}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow hover:from-blue-700 hover:to-green-600 transition-all"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full text-base table-fixed border-collapse">
            <thead
              className={
                darkMode
                  ? "bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-blue-100"
                  : "bg-gradient-to-r from-blue-100 via-white to-blue-100 text-blue-900"
              }
            >
              <tr>
                <th className="px-6 py-4 border-b font-semibold uppercase tracking-wider text-left">
                  Fecha
                </th>
                <th className="px-6 py-4 border-b font-semibold uppercase tracking-wider text-left">
                  Acción
                </th>
                <th className="px-6 py-4 border-b font-semibold uppercase tracking-wider text-left">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((ev, idx) => (
                  <tr
                    key={ev.id}
                    className={`transition-all duration-150 ${darkMode
                      ? idx % 2 === 0
                        ? "bg-slate-900"
                        : "bg-blue-900"
                      : idx % 2 === 0
                        ? "bg-white"
                        : "bg-blue-50/60"
                      }`}
                  >
                    <td className="px-6 py-4 border-b text-left">
                      {new Date(ev.fecha_inicio).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 border-b text-left">{ev.accion}</td>
                    <td className="px-6 py-4 border-b text-left">
                      {ev.descripcion}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-400 dark:text-gray-500 font-semibold"
                  >
                    No tienes actividad registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL AVISO LEGAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-10 w-[90%] max-w-2xl p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Aviso legal — Bitácora
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">
              <p>
                Esta bitácora registra y almacena todas las acciones realizadas
                en el sistema conforme a la LES-BCS. El acceso y manejo de la
                información está restringido y auditado.
              </p>
              <p className="mt-3 text-xs text-gray-500">
                Al continuar está aceptando las políticas de uso y
                confidencialidad.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
