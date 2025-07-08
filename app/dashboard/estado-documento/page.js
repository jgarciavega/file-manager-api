'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import avatarMap from "../../../lib/avatarMap";
import admMap from "../../../lib/admMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTrash,
  faMoon,
  faSun,
  faSearch,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function EstadoDocumentoPage() {
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name || "Usuario",
    email: session?.user?.email,
    avatar: avatarMap[session?.user?.email] || "/default-avatar.png",
    position: admMap[session?.user?.email] || "000",
  };

  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalObs, setModalObs] = useState({ open: false, text: "" });
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [jefaturas, setJefaturas] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [vigencias, setVigencias] = useState([]);
  const [accesos, setAccesos] = useState([]);
  const [soportes, setSoportes] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [catalogosError, setCatalogosError] = useState(false);

  // Filtros avanzados
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVigencia, setFilterVigencia] = useState('');
  const [filterResponsable, setFilterResponsable] = useState('');
  const [filterAcceso, setFilterAcceso] = useState('');
  const [filterSoporte, setFilterSoporte] = useState('');
  const [filterJefatura, setFilterJefatura] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("/api/documentos");
        const data = await res.json();
        setUploadedFiles(data);
      } catch (error) {
        alert("Error al cargar documentos");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    // Cargar catálogos desde la API
    const fetchCatalogos = async () => {
      try {
        const [tiposRes, jefaturasRes, responsablesRes, vigenciasRes, accesosRes, soportesRes, ubicacionesRes] = await Promise.all([
          fetch('/api/catalogos/series-documentales'),
          fetch('/api/catalogos/jefaturas'),
          fetch('/api/catalogos/responsables'),
          fetch('/api/catalogos/vigencias'),
          fetch('/api/catalogos/accesos'),
          fetch('/api/catalogos/soportes'),
          fetch('/api/catalogos/ubicaciones'),
        ]);
        setTiposDocumentos(await tiposRes.json());
        setJefaturas(await jefaturasRes.json());
        setResponsables(await responsablesRes.json());
        setVigencias(await vigenciasRes.json());
        setAccesos(await accesosRes.json());
        setSoportes(await soportesRes.json());
        setUbicaciones(await ubicacionesRes.json());
        setCatalogosError(false);
      } catch (error) {
        setCatalogosError(true);
      }
    };
    fetchCatalogos();
  }, []);

  const handleObsClick = (obs) => {
    if (obs) setModalObs({ open: true, text: obs });
  };

  const handleStatusChange = async (id, newStatus) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, status: newStatus } : file
          )
        );
      } else {
        alert('No se pudo actualizar el estado');
      }
    } catch (error) {
      alert('Error de red al actualizar el estado');
    }
  };

  const handleClasificacionChange = async (id, newTipoId) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipos_documentos_id: Number(newTipoId) }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, tipos_documentos_id: Number(newTipoId) } : file
          )
        );
      } else {
        alert('No se pudo actualizar la clasificación');
      }
    } catch (error) {
      alert('Error de red al actualizar la clasificación');
    }
  };

  const handleJefaturaChange = async (id, newJefaturaId) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jefatura_id: Number(newJefaturaId) }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, jefatura_id: Number(newJefaturaId) } : file
          )
        );
      } else {
        alert('No se pudo actualizar la jefatura/dirección');
      }
    } catch (error) {
      alert('Error de red al actualizar la jefatura/dirección');
    }
  };

  const handleVigenciaChange = async (id, newVigenciaId) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vigencia_id: Number(newVigenciaId) }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, vigencia_id: Number(newVigenciaId) } : file
          )
        );
      } else {
        alert('No se pudo actualizar la vigencia');
      }
    } catch (error) {
      alert('Error de red al actualizar la vigencia');
    }
  };

  const handleAccesoChange = async (id, newAccesoId) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceso_id: Number(newAccesoId) }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, acceso_id: Number(newAccesoId) } : file
          )
        );
      } else {
        alert('No se pudo actualizar el nivel de acceso');
      }
    } catch (error) {
      alert('Error de red al actualizar el nivel de acceso');
    }
  };

  const handleSoporteChange = async (id, newSoporteId) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soporte_id: Number(newSoporteId) }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, soporte_id: Number(newSoporteId) } : file
          )
        );
      } else {
        alert('No se pudo actualizar el soporte');
      }
    } catch (error) {
      alert('Error de red al actualizar el soporte');
    }
  };

  const handleUbicacionChange = async (id, newUbicacionId) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ubicacion_id: Number(newUbicacionId) }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, ubicacion_id: Number(newUbicacionId) } : file
          )
        );
      } else {
        alert('No se pudo actualizar la ubicación');
      }
    } catch (error) {
      alert('Error de red al actualizar la ubicación');
    }
  };

  const handleResponsableChange = async (id, newResponsableId) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responsable_id: Number(newResponsableId) }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, responsable_id: Number(newResponsableId) } : file
          )
        );
      } else {
        alert('No se pudo actualizar el responsable');
      }
    } catch (error) {
      alert('Error de red al actualizar el responsable');
    }
  };

  const handleDownload = (file) => {
    // Abre la descarga en una nueva pestaña/ventana
    window.open(`/api/documentos/${file.id}/download`, '_blank');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este archivo? Esta acción no se puede deshacer.")) return;
    try {
      const res = await fetch(`/api/documentos/${id}/delete`, { method: 'DELETE' });
      if (res.ok) {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
        alert('Archivo eliminado correctamente.');
      } else {
        alert('No se pudo eliminar el archivo.');
      }
    } catch (error) {
      alert('Error de red al eliminar el archivo.');
    }
  };

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = [
      'Folio', 'Nombre', 'Serie documental', 'Jefatura/Dirección', 'Fecha', 'Vigencia', 'Nivel de acceso', 'Soporte', 'Ubicación', 'Responsable', 'Estado documental', 'Observaciones'
    ];
    const rows = filteredFiles.map(file => [
      file.id,
      file.nombre,
      tiposDocumentos.find(t => t.id === file.tipos_documentos_id)?.tipo || '',
      jefaturas.find(j => j.id === file.jefatura_id)?.nombre || '',
      file.fecha_subida ? new Date(file.fecha_subida).toLocaleDateString() : '',
      vigencias.find(v => v.id === file.vigencia_id)?.nombre || '',
      accesos.find(a => a.id === file.acceso_id)?.nombre || '',
      soportes.find(s => s.id === file.soporte_id)?.nombre || '',
      ubicaciones.find(u => u.id === file.ubicacion_id)?.nombre || '',
      responsables.find(r => r.id === file.responsable_id)?.nombre || '',
      file.status || '',
      file.observaciones || file.observations || file.resena || ''
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(val => `"${(val ?? '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'estado_documentos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredFiles = uploadedFiles.filter(
    (file) => {
      const matchesText =
        (file.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.usuarios?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus ? file.status === filterStatus : true;
      const matchesVigencia = filterVigencia ? file.vigencia_id === Number(filterVigencia) : true;
      const matchesResponsable = filterResponsable ? file.responsable_id === Number(filterResponsable) : true;
      const matchesAcceso = filterAcceso ? file.acceso_id === Number(filterAcceso) : true;
      const matchesSoporte = filterSoporte ? file.soporte_id === Number(filterSoporte) : true;
      const matchesJefatura = filterJefatura ? file.jefatura_id === Number(filterJefatura) : true;
      return matchesText && matchesStatus && matchesVigencia && matchesResponsable && matchesAcceso && matchesSoporte && matchesJefatura;
    }
  );

  if (loading) {
    return (
      <div className={`p-10 text-center ${darkMode ? "bg-[#0d1b2a] text-white min-h-screen" : ""}`}>
        Cargando documentos...
      </div>
    );
  }

  if (catalogosError) {
    return (
      <div className={`p-10 text-center ${darkMode ? "bg-[#0d1b2a] text-white min-h-screen" : "bg-gray-50 text-gray-900 min-h-screen"}`}>
        <div className="mb-4 text-red-600 font-bold">Error al cargar los catálogos oficiales. Intenta recargar la página.</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 transition-all ${darkMode ? "bg-[#0d1b2a] text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Modal de observaciones */}
      {modalObs.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`p-6 rounded shadow-lg max-w-md w-full ${darkMode ? "bg-[#1a2b3c] text-white" : "bg-white"}`}>
            <h2 className="font-bold mb-2">Observaciones</h2>
            <p className="mb-4">{modalObs.text}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setModalObs({ open: false, text: "" })}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`flex justify-between items-start mb-6 p-4 rounded-lg shadow-xl ${darkMode ? "bg-[#16213e]" : "bg-white"}`}>
        {/* Logo institucional */}
        <div className="flex items-center gap-6">
      
          <Image
            src={darkMode ? "/api-dark23.png" : "/api.jpg"}
            alt="Logo API BCS"
            width={350}
            height={90}
            className="rounded-md"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-2 mr-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`text-xl ${darkMode ? "text-yellow-300" : "text-gray-700"} hover:text-black dark:hover:text-white transition`}
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>

          <div className="flex items-center gap-3">
            <Image
              src={user.avatar}
              alt={`Avatar de ${user.name}`}
              width={60}
              height={60}
              className="rounded-full border-2 border-white"
            />
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
              {user.name}
            </p>
          </div>
        </div>
      </div>

      {/* Botón regresar */}
      <div className="mb-6">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al Inicio
        </Link>
      </div>

      {/* Título, filtros y buscador */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className={`text-3xl font-bold text-center md:text-left ${darkMode ? "text-blue-300" : "text-blue-600"}`}>Estado de Documentos</h1>
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className={`flex flex-wrap gap-3 mb-2 p-3 rounded-lg border ${darkMode ? "bg-[#1a2b3c] border-gray-700" : "bg-gray-100 border-gray-300"}`}>
            <select aria-label="Filtrar por estado documental" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={`px-2 py-1 rounded border text-sm focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-[#0d1b2a] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}>
              <option value="">Estado documental</option>
              <option value="En trámite">En trámite</option>
              <option value="Concluido">Concluido</option>
              <option value="Bajo resguardo">Bajo resguardo</option>
              <option value="Transferido">Transferido</option>
              <option value="Histórico">Histórico</option>
              <option value="Eliminado">Eliminado</option>
            </select>
            <select aria-label="Filtrar por vigencia" value={filterVigencia} onChange={e => setFilterVigencia(e.target.value)} className={`px-2 py-1 rounded border text-sm focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-[#0d1b2a] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}>
              <option value="">Vigencia</option>
              {vigencias.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
            </select>
            <select aria-label="Filtrar por responsable" value={filterResponsable} onChange={e => setFilterResponsable(e.target.value)} className={`px-2 py-1 rounded border text-sm focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-[#0d1b2a] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}>
              <option value="">Responsable</option>
              {responsables.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
            <select aria-label="Filtrar por acceso" value={filterAcceso} onChange={e => setFilterAcceso(e.target.value)} className={`px-2 py-1 rounded border text-sm focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-[#0d1b2a] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}>
              <option value="">Acceso</option>
              {accesos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            <select aria-label="Filtrar por soporte" value={filterSoporte} onChange={e => setFilterSoporte(e.target.value)} className={`px-2 py-1 rounded border text-sm focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-[#0d1b2a] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}>
              <option value="">Soporte</option>
              {soportes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
            <select aria-label="Filtrar por jefatura" value={filterJefatura} onChange={e => setFilterJefatura(e.target.value)} className={`px-2 py-1 rounded border text-sm focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-[#0d1b2a] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}>
              <option value="">Jefatura/Dirección</option>
              {jefaturas.map(j => <option key={j.id} value={j.id}>{j.nombre}</option>)}
            </select>
            <button
              onClick={() => {
                setFilterStatus(''); setFilterVigencia(''); setFilterResponsable(''); setFilterAcceso(''); setFilterSoporte(''); setFilterJefatura('');
              }}
              className={`px-3 py-1 rounded text-xs font-semibold border ${darkMode ? "bg-[#24304a] text-white border-gray-700 hover:bg-[#1a2b3c]" : "bg-gray-200 text-gray-700 border-gray-400 hover:bg-gray-300"}`}
              aria-label="Limpiar filtros"
            >Limpiar filtros</button>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow text-sm flex items-center gap-2"
              aria-label="Exportar a Excel"
            >
              <FontAwesomeIcon icon={faDownload} /> Exportar a Excel
            </button>
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar documentos"
                className={`w-full px-4 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-[#1a2b3c] text-white border-gray-700 placeholder-gray-400"
                    : "bg-white text-gray-800 border-gray-400"
                }`}
              />
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faSearch}
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                />
              </span>
            </div>
            <span className={`ml-2 text-xs font-semibold ${darkMode ? "text-blue-200" : "text-blue-700"}`}>{filteredFiles.length} resultado{filteredFiles.length === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      {/* Tabla de documentos */}
      <div className={`shadow-xl rounded-lg p-6 border ${darkMode ? "bg-[#16213e] border-gray-700" : "bg-white border-gray-200"}`}>
        <table className="w-full table-auto text-sm border-collapse">
          <thead className={darkMode ? "bg-[#1a2b3c]" : "bg-gray-100"}>
            <tr>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Folio</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Nombre</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Serie documental</th>
              {/* <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Subserie</th> */}
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Jefatura/Dirección</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Fecha</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Vigencia</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Nivel de acceso</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Soporte</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Ubicación</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Responsable</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Estado documental</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Observaciones</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan="8" className={`text-center p-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              filteredFiles.map((file) => (
                <tr key={file.id} className={`${darkMode ? "hover:bg-[#24304a]" : "hover:bg-blue-50"} transition`}>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{file.id}</td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{file.nombre}</td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    <select
                      value={file.tipos_documentos_id}
                      disabled={user.position !== "admin"}
                      className={`w-full px-2 py-1 rounded-md ${darkMode ? "bg-[#1a2b3c] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}
                      onChange={user.position === "admin"
                        ? (e) => handleClasificacionChange(file.id, e.target.value)
                        : undefined}
                    >
                      {tiposDocumentos.length > 0 ? tiposDocumentos.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
                      )) : <option value="">Cargando...</option>}
                    </select>
                  </td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    <select
                      value={file.jefatura_id}
                      disabled={user.position !== "admin"}
                      className={`w-full px-2 py-1 rounded-md ${darkMode ? "bg-[#1a2b3c] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}
                      onChange={user.position === "admin"
                        ? (e) => handleJefaturaChange(file.id, e.target.value)
                        : undefined}
                    >
                      {jefaturas.length > 0 ? jefaturas.map((j) => (
                        <option key={j.id} value={j.id}>{j.nombre}</option>
                      )) : <option value="">Cargando...</option>}
                    </select>
                  </td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{file.fecha_subida ? new Date(file.fecha_subida).toLocaleDateString() : ""}</td>
                  {/* Vigencia */}
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    {user.position === "admin" ? (
                      <select
                        value={file.vigencia_id || ""}
                        className={`w-full px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-400 font-medium ${darkMode ? "bg-[#1a2b3c] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}
                        onChange={e => handleVigenciaChange(file.id, e.target.value)}
                      >
                        <option value="">—</option>
                        {vigencias.length > 0 ? vigencias.map((v) => (
                          <option key={v.id} value={v.id}>{v.nombre}</option>
                        )) : <option value="">Cargando...</option>}
                      </select>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                        {vigencias.find(v => v.id === file.vigencia_id)?.nombre || "—"}
                      </span>
                    )}
                  </td>
                  {/* Acceso */}
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    {user.position === "admin" ? (
                      <select
                        value={file.acceso_id || ""}
                        className={`w-full px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-400 font-medium ${darkMode ? "bg-[#1a2b3c] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}
                        onChange={e => handleAccesoChange(file.id, e.target.value)}
                      >
                        <option value="">—</option>
                        {accesos.length > 0 ? accesos.map((a) => (
                          <option key={a.id} value={a.id}>{a.nombre}</option>
                        )) : <option value="">Cargando...</option>}
                      </select>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200">
                        {accesos.find(a => a.id === file.acceso_id)?.nombre || "—"}
                      </span>
                    )}
                  </td>
                  {/* Soporte */}
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    {user.position === "admin" ? (
                      <select
                        value={file.soporte_id || ""}
                        className={`w-full px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-400 font-medium ${darkMode ? "bg-[#1a2b3c] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}
                        onChange={e => handleSoporteChange(file.id, e.target.value)}
                      >
                        <option value="">—</option>
                        {soportes.length > 0 ? soportes.map((s) => (
                          <option key={s.id} value={s.id}>{s.nombre}</option>
                        )) : <option value="">Cargando...</option>}
                      </select>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200">
                        {soportes.find(s => s.id === file.soporte_id)?.nombre || "—"}
                      </span>
                    )}
                  </td>
                  {/* Ubicación */}
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    {user.position === "admin" ? (
                      <select
                        value={file.ubicacion_id || ""}
                        className={`w-full px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-400 font-medium ${darkMode ? "bg-[#1a2b3c] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}
                        onChange={e => handleUbicacionChange(file.id, e.target.value)}
                      >
                        <option value="">—</option>
                        {ubicaciones.length > 0 ? ubicaciones.map((u) => (
                          <option key={u.id} value={u.id}>{u.nombre}</option>
                        )) : <option value="">Cargando...</option>}
                      </select>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200">
                        {ubicaciones.find(u => u.id === file.ubicacion_id)?.nombre || "—"}
                      </span>
                    )}
                  </td>
                  {/* Responsable */}
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    {user.position === "admin" ? (
                      <select
                        value={file.responsable_id || ""}
                        className={`w-full px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-400 font-medium ${darkMode ? "bg-[#1a2b3c] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}
                        onChange={e => handleResponsableChange(file.id, e.target.value)}
                      >
                        <option value="">—</option>
                        {responsables.length > 0 ? responsables.map((r) => (
                          <option key={r.id} value={r.id}>{r.nombre}</option>
                        )) : <option value="">Cargando...</option>}
                      </select>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-pink-50 dark:bg-pink-900 text-pink-700 dark:text-pink-200">
                        {responsables.find(r => r.id === file.responsable_id)?.nombre || "—"}
                      </span>
                    )}
                  </td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    {user.position === 'admin' ? (
                      <select
                        value={file.status}
                        onChange={e => handleStatusChange(file.id, e.target.value)}
                        className={`w-full px-2 py-1 rounded-md font-semibold text-xs ${
                          darkMode
                            ? 'bg-[#1a2b3c] text-white border-gray-700'
                            : 'bg-white text-gray-800 border-gray-400'
                        }`}
                      >
                        <option value="En trámite">En trámite</option>
                        <option value="Concluido">Concluido</option>
                        <option value="Bajo resguardo">Bajo resguardo</option>
                        <option value="Transferido">Transferido</option>
                        <option value="Histórico">Histórico</option>
                        <option value="Eliminado">Eliminado</option>
                      </select>
                    ) : (
                      <span
                        className={[
                          "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold",
                          file.status === "En trámite"
                            ? darkMode
                              ? "bg-blue-900 text-blue-200"
                              : "bg-blue-100 text-blue-700"
                            : file.status === "Concluido"
                            ? darkMode
                              ? "bg-green-900 text-green-200"
                              : "bg-green-100 text-green-700"
                            : file.status === "Bajo resguardo"
                            ? darkMode
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-yellow-100 text-yellow-700"
                            : file.status === "Transferido"
                            ? darkMode
                              ? "bg-purple-900 text-purple-200"
                              : "bg-purple-100 text-purple-700"
                            : file.status === "Histórico"
                            ? darkMode
                              ? "bg-gray-800 text-gray-200"
                              : "bg-gray-200 text-gray-700"
                            : file.status === "Eliminado"
                            ? darkMode
                              ? "bg-red-900 text-red-200"
                              : "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                        ].join(" ")}
                      >
                        {file.status}
                      </span>
                    )}
                  </td>
                  <td
                    className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"} text-center`}
                  >
                    {(file.observaciones || file.observations || file.resena) ? (
                      <span
                        className="inline-flex items-center gap-1 cursor-pointer group"
                        title="Ver observación"
                        onClick={() => handleObsClick(file.observaciones || file.observations || file.resena || "")}
                      >
                        <FontAwesomeIcon icon="comment-dots" className="text-blue-400 group-hover:text-blue-600 dark:text-blue-300 dark:group-hover:text-blue-200 transition" />
                        <span className="sr-only">Ver observación</span>
                        <span className="ml-1 text-xs text-blue-500 dark:text-blue-200 font-semibold bg-blue-50 dark:bg-blue-900 rounded px-2 py-0.5">Obs.</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        title="Sin observación"
                      >
                        <FontAwesomeIcon icon="comment-dots" />
                        <span className="ml-1 text-xs font-semibold">—</span>
                      </span>
                    )}
                  </td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"} flex justify-center gap-4`}>
                    {user.position === 'admin' && (
                      <>
                        <button className="text-blue-400 dark:text-blue-300 text-lg" onClick={() => handleDownload(file)}>
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                        <button className="text-red-500 dark:text-red-400 text-lg" onClick={() => handleDelete(file.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}