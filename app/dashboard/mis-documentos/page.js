"use client";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import BackToHomeButton from "@/components/BackToHomeButton";
import avatarMap from "../../../lib/avatarMap";
import { FileText, Shield, CheckCircle, Clock } from "lucide-react";

export default function MisDocumentosPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState({
    total: 0,
    vigentes: 0,
    vencidos: 0,
    publico: 0,
    confidencial: 0,
    restringido: 0,
  });

  // 🌙 Sincronizar el estado local de tema con la clase `dark` del root y con el evento global `themechange`
  useEffect(() => {
    const root = document.documentElement;
    const readStored = () => {
      try { return localStorage.getItem('theme'); } catch (e) { return null; }
    };

    const stored = readStored();
    if (stored === 'dark') {
      try { root.classList.add('dark'); } catch (e) {}
      setDarkMode(true);
    } else if (stored === 'light') {
      try { root.classList.remove('dark'); } catch (e) {}
      setDarkMode(false);
    }
    else setDarkMode(root.classList.contains('dark') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches));

    const readStoredTheme = () => {
      try { return localStorage.getItem('theme'); } catch (e) { return null; }
    };

    const onThemeChange = (e) => {
      // Prefer the explicit detail, fallback to localStorage (some emitters may not provide detail)
      let t = e?.detail?.theme;
      if (!t) t = readStoredTheme();
      if (t === 'dark') {
        try { root.classList.add('dark'); } catch (err) {}
        setDarkMode(true);
      } else if (t === 'light') {
        try { root.classList.remove('dark'); } catch (err) {}
        setDarkMode(false);
      } else {
        setDarkMode(root.classList.contains('dark'));
      }
    };
    window.addEventListener('themechange', onThemeChange);

    // Cross-tab sync: listen for storage events
    const onStorage = (ev) => {
      if (ev.key === 'theme') {
        const t = ev.newValue;
        if (t === 'dark') {
          try { root.classList.add('dark'); } catch (err) {}
          setDarkMode(true);
        } else if (t === 'light') {
          try { root.classList.remove('dark'); } catch (err) {}
          setDarkMode(false);
        }
      }
    };
    window.addEventListener('storage', onStorage);

    const observer = new MutationObserver(() => {
      setDarkMode(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('themechange', onThemeChange);
      window.removeEventListener('storage', onStorage);
      observer.disconnect();
    };
  }, []);

  // 🧠 Cargar usuario desde localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Error leyendo usuario del localStorage", err);
    }
  }, []);

  // 📡 Obtener documentos desde el backend
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/documentos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setDocumentos(data.data.documentos || []);
      } catch (err) {
        console.error("Error al cargar documentos:", err);
      }
    };
    fetchDocs();
  }, []);

  // 🧮 Calcular métricas para las cards
  useEffect(() => {
    if (!user) return;
    const userDocs = documentos.filter((doc) => doc.usuarios_id === user?.id);
    const total = userDocs.length;
    const vigentes = userDocs.filter((d) => d.estado_vigencia === "VIGENTE")
      .length;
    const vencidos = userDocs.filter((d) => d.estado_vigencia === "VENCIDO")
      .length;
    const publico = userDocs.filter((d) => d.nivel_acceso === "PUBLICO").length;
    const confidencial = userDocs.filter(
      (d) => d.nivel_acceso === "CONFIDENCIAL"
    ).length;
    const restringido = userDocs.filter(
      (d) => d.nivel_acceso === "RESTRINGIDO"
    ).length;

    setMetrics({ total, vigentes, vencidos, publico, confidencial, restringido });
  }, [documentos, user]);

  // 🎯 Filtrar documentos por usuario actual
  const filtered = documentos
    .filter((doc) => doc.usuarios_id === user?.id)
    .filter((doc) => {
      const matchSearch =
        !search ||
        doc.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        doc.descripcion?.toLowerCase().includes(search.toLowerCase());
      const matchType =
        !typeFilter || doc.mime?.toLowerCase().includes(typeFilter.toLowerCase());
      const matchAccess =
        !accessFilter ||
        doc.nivel_acceso?.toLowerCase() === accessFilter.toLowerCase();
      const matchDate =
        !dateFilter || doc.fecha_creacion?.startsWith(dateFilter.toString());
      return matchSearch && matchType && matchAccess && matchDate;
    });

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <DashboardHeader
        title="Mis Documentos"
        avatarUrl={avatarMap[user?.email] || "/default-avatar.png"}
      />

      <div className="w-full px-6 mt-4">
        <div className="flex justify-between items-center">
          <BackToHomeButton darkMode={darkMode} />
        </div>
      </div>

      {/* Contenedor principal ancho completo */}
      <div
        className={`w-full mt-10 p-10 rounded-2xl shadow-2xl ${
          darkMode ? "bg-slate-900" : "bg-white/80"
        } min-h-[700px]`}
      >
        {/* 🟦 Cards de totales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 w-full">
          <Card
            title="Total documentos"
            value={metrics.total}
            icon={<FileText className="h-6 w-6 text-blue-500" />}
          />
          <Card
            title="Vigentes"
            value={metrics.vigentes}
            icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          />
          <Card
            title="Vencidos"
            value={metrics.vencidos}
            icon={<Clock className="h-6 w-6 text-yellow-500" />}
          />
          <Card
            title="Público"
            value={metrics.publico}
            icon={<FileText className="h-6 w-6 text-blue-400" />}
          />
          <Card
            title="Confidencial"
            value={metrics.confidencial}
            icon={<Shield className="h-6 w-6 text-red-500" />}
          />
          <Card
            title="Restringido"
            value={metrics.restringido}
            icon={<Shield className="h-6 w-6 text-orange-500" />}
          />
        </div>

        {/* 🎛️ Barra de filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8 w-full">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 border-blue-300 dark:border-slate-700 text-blue-900 dark:text-white"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 border-blue-300 dark:border-slate-700 text-blue-900 dark:text-white"
          >
            <option value="">Tipo de archivo</option>
            <option value="pdf">PDF</option>
            <option value="word">Word (.docx)</option>
            <option value="sheet">Excel (.xlsx)</option>
          </select>

          <select
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 border-blue-300 dark:border-slate-700 text-blue-900 dark:text-white"
          >
            <option value="">Nivel de acceso</option>
            <option value="PUBLICO">Público</option>
            <option value="CONFIDENCIAL">Confidencial</option>
            <option value="RESTRINGIDO">Restringido</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 border-blue-300 dark:border-slate-700 text-blue-900 dark:text-white"
          />
        </div>

        {/* 🧾 Tabla */}
        <div className="overflow-x-auto rounded-2xl w-full">
          <table className="w-full text-lg border-collapse">
            <thead
              className={`${
                darkMode
                  ? "bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-blue-100"
                  : "bg-gradient-to-r from-blue-100 via-white to-blue-100 text-blue-900"
              }`}
            >
              <tr>
                <th className="px-6 py-4 border-b text-left font-semibold uppercase text-sm">
                  Nombre
                </th>
                <th className="px-6 py-4 border-b text-left font-semibold uppercase text-sm">
                  Descripción
                </th>
                <th className="px-6 py-4 border-b text-left font-semibold uppercase text-sm">
                  Nivel de acceso
                </th>
                <th className="px-6 py-4 border-b text-left font-semibold uppercase text-sm">
                  Fecha de subida
                </th>
                <th className="px-6 py-4 border-b text-left font-semibold uppercase text-sm">
                  Archivo
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    className={`transition-all ${
                      darkMode
                        ? idx % 2 === 0
                          ? "bg-slate-900"
                          : "bg-blue-900/40"
                        : idx % 2 === 0
                        ? "bg-white"
                        : "bg-blue-50/60"
                    }`}
                  >
                    <td className="px-6 py-3 border-b">{doc.nombre}</td>
                    <td className="px-6 py-3 border-b">{doc.descripcion}</td>
                    <td className="px-6 py-3 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          doc.nivel_acceso === "PUBLICO"
                            ? "bg-green-200 text-green-800"
                            : doc.nivel_acceso === "CONFIDENCIAL"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {doc.nivel_acceso}
                      </span>
                    </td>
                    <td className="px-6 py-3 border-b">
                      {new Date(doc.fecha_subida).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 border-b">
                      <a
                        href={`http://localhost:4000/${doc.ruta}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Ver documento
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-400 dark:text-gray-500 font-semibold"
                  >
                    No tienes documentos subidos aún.
                    <br />
                    <span className="text-sm text-gray-400 dark:text-gray-600">
                      Sube tu primer documento desde el dashboard.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------- Component Card ----------------
function Card({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 flex items-center justify-between border border-gray-200 dark:border-gray-700 w-full">
      <div>
        <p className="text-gray-500 dark:text-gray-300 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-full">{icon}</div>
    </div>
  );
}
