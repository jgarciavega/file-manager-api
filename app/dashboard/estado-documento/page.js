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
  faFileAlt,
  faEye,
  faCheck,
  faTimes,
  faQuestionCircle,
  faFilter,
  faChartLine,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

// Componente de Tooltip reutilizable
const TooltipWrapper = ({ children, text, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg transition-opacity duration-300 ${
          position === 'top' ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2' :
          position === 'bottom' ? 'top-full mt-2 left-1/2 transform -translate-x-1/2' :
          position === 'left' ? 'right-full mr-2 top-1/2 transform -translate-y-1/2' :
          'left-full ml-2 top-1/2 transform -translate-y-1/2'
        }`}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
            'right-full top-1/2 -translate-y-1/2 -mr-1'
          }`}></div>
        </div>
      )}
    </div>
  );
};

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
    <div className={`min-h-screen transition-all duration-700 ${
      darkMode 
        ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Animación de fondo */}
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute top-20 left-20 w-64 h-64 ${
          darkMode ? "bg-blue-500" : "bg-purple-300"
        } rounded-full mix-blend-multiply filter blur-xl animate-blob`}></div>
        <div className={`absolute top-40 right-20 w-64 h-64 ${
          darkMode ? "bg-purple-500" : "bg-blue-300"
        } rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000`}></div>
        <div className={`absolute bottom-20 left-40 w-64 h-64 ${
          darkMode ? "bg-pink-500" : "bg-indigo-300"
        } rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000`}></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Modal de observaciones mejorado */}
        {modalObs.open && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className={`p-8 rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in ${
              darkMode 
                ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-slate-700" 
                : "bg-white border border-gray-200"
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${
                  darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"
                }`}>
                  <FontAwesomeIcon icon={faEye} />
                </div>
                <h2 className="font-bold text-xl">Observaciones del Documento</h2>
              </div>
              <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">{modalObs.text}</p>
              <button
                className="btn-professional btn-primary-pro w-full"
                onClick={() => setModalObs({ open: false, text: "" })}
              >
                <FontAwesomeIcon icon={faCheck} className="btn-icon" />
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Header reorganizado: Logo izquierda - Título centro - Controles derecha */}
        <div className={`px-12 py-6 border-b mb-8 ${
          darkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          <div className="w-full flex items-center">
            {/* Logo más a la izquierda */}
            <div className="absolute left-12">
              <Image 
                src={darkMode ? "/api-dark23.png" : "/api.jpg"}
                alt="Logo API BCS" 
                width={300} 
                height={105} 
                className="object-contain transition-opacity duration-300" 
              />
            </div>
            
            {/* Título al centro con estilo profesional */}
            <div className="w-full flex justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold drop-shadow-2xl wave-container">
                  <span style={{animationDelay: '0.1s'}}>E</span>
                  <span style={{animationDelay: '0.2s'}}>s</span>
                  <span style={{animationDelay: '0.3s'}}>t</span>
                  <span style={{animationDelay: '0.4s'}}>a</span>
                  <span style={{animationDelay: '0.5s'}}>d</span>
                  <span style={{animationDelay: '0.6s'}}>o</span>
                  <span style={{animationDelay: '0.7s'}} className="ml-3">d</span>
                  <span style={{animationDelay: '0.8s'}}>e</span>
                  <span style={{animationDelay: '0.9s'}} className="ml-3">D</span>
                  <span style={{animationDelay: '1.0s'}}>o</span>
                  <span style={{animationDelay: '1.1s'}}>c</span>
                  <span style={{animationDelay: '1.2s'}}>u</span>
                  <span style={{animationDelay: '1.3s'}}>m</span>
                  <span style={{animationDelay: '1.4s'}}>e</span>
                  <span style={{animationDelay: '1.5s'}}>n</span>
                  <span style={{animationDelay: '1.6s'}}>t</span>
                  <span style={{animationDelay: '1.7s'}}>o</span>
                  <span style={{animationDelay: '1.8s'}}>s</span>
                </h1>
                <div className="h-1 w-32 mx-auto mt-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                <div className="header-subtitle">
                  <FontAwesomeIcon icon={faChartLine} className="text-green-500 text-lg" />
                  <span className="font-medium">Panel de Control Archivístico</span>
                </div>
              </div>
            </div>

            {/* Controles del usuario a la derecha */}
            <div className="absolute right-12 flex items-center gap-6">
              {/* Toggle de modo oscuro */}
              <TooltipWrapper text={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-4 rounded-xl transition-all duration-300 hover:scale-110 theme-toggle ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-yellow-400" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                  title="Cambiar tema"
                >
                  <FontAwesomeIcon 
                    icon={darkMode ? faSun : faMoon} 
                    className="text-xl relative z-10" 
                  />
                </button>
              </TooltipWrapper>

              {/* Info del usuario */}
              <div className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 user-avatar-container ${
                darkMode 
                  ? "bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-gray-600" 
                  : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
              }`}>
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={user.avatar}
                    alt={`Avatar de ${user.name}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden lg:block pr-2 user-info-clean">
                  <p className={`text-base font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {user.name}
                  </p>
                  <div className={`flex items-center gap-2 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      user.position === "admin" ? "bg-green-500" : "bg-blue-500"
                    } animate-pulse`}></div>
                    <span className="capitalize">
                      {user.position === "admin" ? "Administrador" : user.position === "000" ? "Usuario" : user.position}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón regresar sin barra */}
        <div className="mb-8 px-6">
          <TooltipWrapper text="Regresar al panel principal">
            <Link
              href="/home"
              className="btn-professional btn-primary-pro"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="btn-icon" />
              <span>Volver al Inicio</span>
            </Link>
          </TooltipWrapper>
        </div>

        {/* Panel de filtros premium */}
        <div className={`mb-8 p-8 rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-700 ${
          darkMode 
            ? "bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80 border border-slate-600/50" 
            : "bg-white/80 border border-white/50"
        }`}>
          {/* Título de filtros */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-xl ${
              darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"
            }`}>
              <FontAwesomeIcon icon={faFilter} className="text-lg" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>Filtros de Búsqueda</h2>
              <p className="text-sm opacity-75">Refina tu búsqueda con los filtros disponibles</p>
            </div>
          </div>

          {/* Grid de filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Filtro Estado Documental */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium opacity-75">
                <FontAwesomeIcon icon={faFileAlt} />
                Estado Documental
              </label>
              <TooltipWrapper text="Filtra documentos por su estado actual en el proceso archivístico">
                <select 
                  value={filterStatus} 
                  onChange={e => setFilterStatus(e.target.value)} 
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                    darkMode 
                      ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                      : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <option value="">Todos los estados</option>
                  <option value="En trámite">En trámite</option>
                  <option value="Concluido">Concluido</option>
                  <option value="Bajo resguardo">Bajo resguardo</option>
                  <option value="Transferido">Transferido</option>
                  <option value="Histórico">Histórico</option>
                  <option value="Eliminado">Eliminado</option>
                </select>
              </TooltipWrapper>
            </div>

            {/* Filtro Vigencia */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium opacity-75">
                <FontAwesomeIcon icon={faChartLine} />
                Vigencia
              </label>
              <TooltipWrapper text="Filtra por el período de vigencia del documento según normativas">
                <select 
                  value={filterVigencia} 
                  onChange={e => setFilterVigencia(e.target.value)} 
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                    darkMode 
                      ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                      : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <option value="">Todas las vigencias</option>
                  {vigencias.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                </select>
              </TooltipWrapper>
            </div>

            {/* Filtro Responsable */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium opacity-75">
                <FontAwesomeIcon icon={faEye} />
                Responsable
              </label>
              <TooltipWrapper text="Filtra documentos por el responsable asignado de su custodia">
                <select 
                  value={filterResponsable} 
                  onChange={e => setFilterResponsable(e.target.value)} 
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                    darkMode 
                      ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                      : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <option value="">Todos los responsables</option>
                  {responsables.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                </select>
              </TooltipWrapper>
            </div>
          </div>

          {/* Barra de búsqueda premium */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className={`text-lg ${
                darkMode ? "text-blue-400" : "text-blue-500"
              }`} />
            </div>
            <TooltipWrapper text="Busca por folio, nombre de archivo o cualquier metadato del documento">
              <input
                type="text"
                placeholder="Buscar documentos por folio, nombre o contenido..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl text-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                  darkMode 
                    ? "bg-slate-700/50 text-white placeholder-gray-400 border border-slate-600 hover:bg-slate-600/50" 
                    : "bg-white text-gray-800 placeholder-gray-500 border border-gray-300 hover:bg-gray-50"
                }`}
              />
            </TooltipWrapper>
          </div>

          {/* Estadísticas y botones de acción */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Estadísticas rápidas - diseño mejorado similar a subir documento */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{filteredFiles.length}</div>
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Documentos</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-700 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {filteredFiles.filter(f => f.status === 'Concluido').length}
                </div>
                <div className="text-sm font-medium text-green-700 dark:text-green-300">Concluidos</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {filteredFiles.filter(f => f.status === 'En trámite').length}
                </div>
                <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">En trámite</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border border-purple-200 dark:border-purple-700 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {filteredFiles.filter(f => f.status === 'Histórico').length}
                </div>
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Históricos</div>
              </div>
            </div>

            {/* Botones de acción - diseño profesional */}
            <div className="flex flex-col lg:flex-row gap-4 lg:w-auto">
              <TooltipWrapper text="Limpiar todos los filtros aplicados">
                <button
                  onClick={() => {
                    setFilterStatus(''); setFilterVigencia(''); setFilterResponsable(''); setFilterAcceso(''); setFilterSoporte(''); setFilterJefatura('');
                  }}
                  className="btn-professional btn-secondary-pro"
                >
                  <FontAwesomeIcon icon={faTimes} className="btn-icon" />
                  <span>Limpiar Filtros</span>
                </button>
              </TooltipWrapper>

              <TooltipWrapper text="Exportar todos los documentos filtrados a formato Excel">
                <button
                  onClick={exportToCSV}
                  className="btn-professional btn-success-pro"
                >
                  <FontAwesomeIcon icon={faDownload} className="btn-icon" />
                  <span>Exportar Excel</span>
                </button>
              </TooltipWrapper>
            </div>
          </div>
        </div>

        {/* Tabla de documentos premium */}
        <div className={`rounded-3xl shadow-2xl backdrop-blur-sm overflow-hidden ${
          darkMode 
            ? "bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80 border border-slate-600/50" 
            : "bg-white/80 border border-white/50"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                darkMode ? "bg-gradient-to-r from-slate-700 to-slate-800" : "bg-gradient-to-r from-gray-50 to-gray-100"
              }`}>
                <tr>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileAlt} />
                      Folio
                    </div>
                  </th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Nombre</th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Serie documental</th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Jefatura/Dirección</th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Fecha</th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Vigencia</th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Nivel de acceso</th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Soporte</th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Ubicación</th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Responsable</th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Estado documental</th>
                  <th className={`px-6 py-4 text-left font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Observaciones</th>
                  <th className={`px-6 py-4 text-center font-semibold ${darkMode ? "text-blue-300" : "text-gray-700"}`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan="13" className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <div className="flex flex-col items-center gap-4">
                        <FontAwesomeIcon icon={faFileAlt} className="text-4xl opacity-50" />
                        <p className="text-lg font-medium">No se encontraron documentos</p>
                        <p className="text-sm opacity-75">Ajusta los filtros para mostrar más resultados</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map((file, index) => (
                    <tr key={file.id} className={`transition-all duration-300 hover:scale-[1.01] ${
                      darkMode ? "hover:bg-slate-700/50 border-b border-slate-600/30" : "hover:bg-blue-50/50 border-b border-gray-200/50"
                    } ${index % 2 === 0 ? (darkMode ? "bg-slate-800/30" : "bg-gray-50/30") : ""}`}>
                      
                      {/* Folio */}
                      <td className="px-6 py-4">
                        <span className={`font-mono text-sm font-semibold px-2 py-1 rounded-lg ${
                          darkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                        }`}>
                          #{file.id}
                        </span>
                      </td>
                      
                      {/* Nombre */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className={`font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {file.nombre}
                          </p>
                        </div>
                      </td>
                      
                      {/* Serie documental */}
                      <td className="px-6 py-4">
                        {user.position === "admin" ? (
                          <select
                            value={file.tipos_documentos_id}
                            className={`w-full px-3 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                              darkMode 
                                ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onChange={e => handleClasificacionChange(file.id, e.target.value)}
                          >
                            {tiposDocumentos.length > 0 ? tiposDocumentos.map((tipo) => (
                              <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
                            )) : <option value="">Cargando...</option>}
                          </select>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            darkMode ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700"
                          }`}>
                            {tiposDocumentos.find(t => t.id === file.tipos_documentos_id)?.tipo || "—"}
                          </span>
                        )}
                      </td>
                      
                      {/* Jefatura/Dirección */}
                      <td className="px-6 py-4">
                        {user.position === "admin" ? (
                          <select
                            value={file.jefatura_id}
                            className={`w-full px-3 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                              darkMode 
                                ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onChange={e => handleJefaturaChange(file.id, e.target.value)}
                          >
                            {jefaturas.length > 0 ? jefaturas.map((j) => (
                              <option key={j.id} value={j.id}>{j.nombre}</option>
                            )) : <option value="">Cargando...</option>}
                          </select>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            darkMode ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                          }`}>
                            {jefaturas.find(j => j.id === file.jefatura_id)?.nombre || "—"}
                          </span>
                        )}
                      </td>
                      
                      {/* Fecha */}
                      <td className="px-6 py-4">
                        <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {file.fecha_subida ? new Date(file.fecha_subida).toLocaleDateString() : "—"}
                        </span>
                      </td>

                      {/* Vigencia */}
                      <td className="px-6 py-4">
                        {user.position === "admin" ? (
                          <select
                            value={file.vigencia_id || ""}
                            className={`w-full px-3 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                              darkMode 
                                ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onChange={e => handleVigenciaChange(file.id, e.target.value)}
                          >
                            <option value="">—</option>
                            {vigencias.length > 0 ? vigencias.map((v) => (
                              <option key={v.id} value={v.id}>{v.nombre}</option>
                            )) : <option value="">Cargando...</option>}
                          </select>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            darkMode ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700"
                          }`}>
                            {vigencias.find(v => v.id === file.vigencia_id)?.nombre || "—"}
                          </span>
                        )}
                      </td>

                      {/* Nivel de Acceso */}
                      <td className="px-6 py-4">
                        {user.position === "admin" ? (
                          <select
                            value={file.acceso_id || ""}
                            className={`w-full px-3 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                              darkMode 
                                ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onChange={e => handleAccesoChange(file.id, e.target.value)}
                          >
                            <option value="">—</option>
                            {accesos.length > 0 ? accesos.map((a) => (
                              <option key={a.id} value={a.id}>{a.nombre}</option>
                            )) : <option value="">Cargando...</option>}
                          </select>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700"
                          }`}>
                            {accesos.find(a => a.id === file.acceso_id)?.nombre || "—"}
                          </span>
                        )}
                      </td>

                      {/* Soporte */}
                      <td className="px-6 py-4">
                        {user.position === "admin" ? (
                          <select
                            value={file.soporte_id || ""}
                            className={`w-full px-3 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                              darkMode 
                                ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onChange={e => handleSoporteChange(file.id, e.target.value)}
                          >
                            <option value="">—</option>
                            {soportes.length > 0 ? soportes.map((s) => (
                              <option key={s.id} value={s.id}>{s.nombre}</option>
                            )) : <option value="">Cargando...</option>}
                          </select>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            darkMode ? "bg-cyan-500/20 text-cyan-300" : "bg-cyan-100 text-cyan-700"
                          }`}>
                            {soportes.find(s => s.id === file.soporte_id)?.nombre || "—"}
                          </span>
                        )}
                      </td>

                      {/* Ubicación */}
                      <td className="px-6 py-4">
                        {user.position === "admin" ? (
                          <select
                            value={file.ubicacion_id || ""}
                            className={`w-full px-3 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                              darkMode 
                                ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onChange={e => handleUbicacionChange(file.id, e.target.value)}
                          >
                            <option value="">—</option>
                            {ubicaciones.length > 0 ? ubicaciones.map((u) => (
                              <option key={u.id} value={u.id}>{u.nombre}</option>
                            )) : <option value="">Cargando...</option>}
                          </select>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            darkMode ? "bg-pink-500/20 text-pink-300" : "bg-pink-100 text-pink-700"
                          }`}>
                            {ubicaciones.find(u => u.id === file.ubicacion_id)?.nombre || "—"}
                          </span>
                        )}
                      </td>

                      {/* Responsable */}
                      <td className="px-6 py-4">
                        {user.position === "admin" ? (
                          <select
                            value={file.responsable_id || ""}
                            className={`w-full px-3 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                              darkMode 
                                ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onChange={e => handleResponsableChange(file.id, e.target.value)}
                          >
                            <option value="">—</option>
                            {responsables.length > 0 ? responsables.map((r) => (
                              <option key={r.id} value={r.id}>{r.nombre}</option>
                            )) : <option value="">Cargando...</option>}
                          </select>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            darkMode ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {responsables.find(r => r.id === file.responsable_id)?.nombre || "—"}
                          </span>
                        )}
                      </td>

                      {/* Estado Documental */}
                      <td className="px-6 py-4">
                        {user.position === 'admin' ? (
                          <select
                            value={file.status}
                            onChange={e => handleStatusChange(file.id, e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:scale-105 ${
                              darkMode 
                                ? "bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50" 
                                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
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
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                            file.status === 'Concluido' 
                              ? (darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700")
                              : file.status === 'En trámite'
                              ? (darkMode ? "bg-yellow-500/20 text-yellow-300" : "bg-yellow-100 text-yellow-700")
                              : file.status === 'Histórico'
                              ? (darkMode ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700")
                              : (darkMode ? "bg-gray-500/20 text-gray-300" : "bg-gray-100 text-gray-700")
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              file.status === 'Concluido' ? "bg-green-500" :
                              file.status === 'En trámite' ? "bg-yellow-500" :
                              file.status === 'Histórico' ? "bg-purple-500" : "bg-gray-500"
                            } animate-pulse`}></div>
                            {file.status || "—"}
                          </span>
                        )}
                      </td>

                      {/* Observaciones */}
                      <td className="px-6 py-4">
                        <TooltipWrapper text="Ver observaciones completas">
                          <button
                            onClick={() => setModalObs({ open: true, text: file.observaciones || file.observations || file.resena || "Sin observaciones" })}
                            className="btn-professional btn-primary-pro !px-3 !py-1 !text-xs"
                          >
                            <FontAwesomeIcon icon={faEye} className="btn-icon !text-xs" />
                            Ver
                          </button>
                        </TooltipWrapper>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 justify-center">
                          <TooltipWrapper text="Descargar documento">
                            <button
                              onClick={() => handleDownload(file)}
                              className="btn-professional btn-success-pro !p-2 !min-w-0"
                            >
                              <FontAwesomeIcon icon={faDownload} className="btn-icon" />
                            </button>
                          </TooltipWrapper>

                          {user.position === "admin" && (
                            <TooltipWrapper text="Eliminar documento">
                              <button
                                onClick={() => handleDelete(file.id)}
                                className="btn-professional btn-danger-pro !p-2 !min-w-0"
                              >
                                <FontAwesomeIcon icon={faTrash} className="btn-icon" />
                              </button>
                            </TooltipWrapper>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}