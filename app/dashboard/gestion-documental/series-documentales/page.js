

'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPlus } from '@fortawesome/free-solid-svg-icons';
import DashboardHeader from '../../components/DashboardHeader';
import BackToHomeButton from '@/components/BackToHomeButton';

const mockSeries = [
  {
    clave: "SER-001",
    nombre: "Contratos y Convenios",
    area: "Jurídico",
    fechaApertura: "2020-01-01",
    fechaCierre: "",
    valor: "Legal",
    plazo: "5 años",
    destino: "Conservación Permanente",
    soporte: "Digital",
    estado: "Activa",
    responsable: "Lic. Ana Torres",
    observaciones: "Incluye todos los contratos institucionales.",
    frecuencia: "Alta",
    volumen: "10 cajas",
    formato: "PDF, Word",
    ubicacion: "Archivo Central, Estante 2",
    antecedente: "SER-000",
    subsecuente: "SER-010",
    fundamento: "Art. 15 LEA-BCS"
  },
  {
    clave: "SER-002",
    nombre: "Recursos Humanos",
    area: "Recursos Humanos",
    fechaApertura: "2018-05-10",
    fechaCierre: "2023-05-10",
    valor: "Administrativo",
    plazo: "10 años",
    destino: "Baja Documental",
    soporte: "Físico",
    estado: "Cerrada",
    responsable: "Mtra. Sofía Méndez",
    observaciones: "Documentación de personal y nómina.",
    frecuencia: "Media",
    volumen: "5 carpetas",
    formato: "Papel",
    ubicacion: "RH, Estante 1",
    antecedente: "",
    subsecuente: "",
    fundamento: "Art. 20 LEA-BCS"
  },
  {
    clave: "SER-003",
    nombre: "Inventarios de Bienes",
    area: "Patrimonio",
    fechaApertura: "2015-03-15",
    fechaCierre: "2021-03-15",
    valor: "Fiscal",
    plazo: "6 años",
    destino: "Baja Documental",
    soporte: "Físico",
    estado: "Cerrada",
    responsable: "Ing. Mario López",
    observaciones: "Inventarios y control de activos fijos.",
    frecuencia: "Baja",
    volumen: "2 cajas",
    formato: "Excel, Papel",
    ubicacion: "Patrimonio, Estante 3",
    antecedente: "",
    subsecuente: "",
    fundamento: "Art. 22 LEA-BCS"
  },
  {
    clave: "SER-004",
    nombre: "Correspondencia Oficial",
    area: "Secretaría",
    fechaApertura: "2019-07-01",
    fechaCierre: "",
    valor: "Administrativo",
    plazo: "3 años",
    destino: "Conservación Temporal",
    soporte: "Digital",
    estado: "Activa",
    responsable: "Lic. Laura Pérez",
    observaciones: "Oficios y comunicaciones institucionales.",
    frecuencia: "Alta",
    volumen: "1 caja",
    formato: "PDF",
    ubicacion: "Secretaría, Estante 4",
    antecedente: "",
    subsecuente: "",
    fundamento: "Art. 18 LEA-BCS"
  },
  {
    clave: "SER-005",
    nombre: "Proyectos Especiales",
    area: "Planeación",
    fechaApertura: "2022-01-10",
    fechaCierre: "",
    valor: "Histórico",
    plazo: "Permanente",
    destino: "Conservación Permanente",
    soporte: "Digital",
    estado: "Activa",
    responsable: "Mtro. Juan García",
    observaciones: "Documentos de proyectos estratégicos.",
    frecuencia: "Baja",
    volumen: "Digital",
    formato: "PDF, Imágenes",
    ubicacion: "Archivo Digital",
    antecedente: "SER-002",
    subsecuente: "",
    fundamento: "Art. 25 LEA-BCS"
  },
  // --- Nuevos registros de ejemplo ---
  {
    clave: "SER-006",
    nombre: "Actas de Sesión",
    area: "Secretaría Técnica",
    fechaApertura: "2017-02-01",
    fechaCierre: "2022-12-31",
    valor: "Legal",
    plazo: "7 años",
    destino: "Conservación Permanente",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "Lic. Carmen Ruiz",
    observaciones: "Actas de sesiones ordinarias y extraordinarias.",
    frecuencia: "Media",
    volumen: "3 carpetas",
    formato: "PDF, Word",
    ubicacion: "Secretaría Técnica, Estante 6",
    antecedente: "SER-001",
    subsecuente: "SER-007",
    fundamento: "Art. 30 LEA-BCS"
  },
  {
    clave: "SER-007",
    nombre: "Informes Anuales",
    area: "Dirección General",
    fechaApertura: "2016-01-01",
    fechaCierre: "2021-12-31",
    valor: "Administrativo",
    plazo: "5 años",
    destino: "Baja Documental",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "Dr. Luis Mendoza",
    observaciones: "Informes de actividades y resultados anuales.",
    frecuencia: "Baja",
    volumen: "2 carpetas",
    formato: "PDF",
    ubicacion: "Dirección, Estante 8",
    antecedente: "SER-006",
    subsecuente: "SER-008",
    fundamento: "Art. 32 LEA-BCS"
  },
  {
    clave: "SER-008",
    nombre: "Correspondencia Externa",
    area: "Comunicación Social",
    fechaApertura: "2019-03-01",
    fechaCierre: "",
    valor: "Administrativo",
    plazo: "3 años",
    destino: "Conservación Temporal",
    soporte: "Físico",
    estado: "Activa",
    responsable: "Lic. Paola Díaz",
    observaciones: "Cartas y oficios enviados a otras instituciones.",
    frecuencia: "Alta",
    volumen: "1 caja",
    formato: "Papel",
    ubicacion: "Comunicación, Estante 2",
    antecedente: "SER-004",
    subsecuente: "",
    fundamento: "Art. 35 LEA-BCS"
  },
  // --- Ejemplos adicionales ---
  {
    clave: "SER-009",
    nombre: "Dictámenes Técnicos",
    area: "Dirección Técnica",
    fechaApertura: "2018-09-01",
    fechaCierre: "2023-09-01",
    valor: "Técnico",
    plazo: "8 años",
    destino: "Conservación Permanente",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "Ing. Patricia Salas",
    observaciones: "Dictámenes y reportes técnicos de proyectos.",
    frecuencia: "Media",
    volumen: "4 carpetas",
    formato: "PDF, Word",
    ubicacion: "Dirección Técnica, Estante 5",
    antecedente: "SER-003",
    subsecuente: "SER-010",
    fundamento: "Art. 40 LEA-BCS"
  },
  {
    clave: "SER-010",
    nombre: "Resoluciones Administrativas",
    area: "Administración",
    fechaApertura: "2015-06-01",
    fechaCierre: "2020-06-01",
    valor: "Administrativo",
    plazo: "5 años",
    destino: "Baja Documental",
    soporte: "Físico",
    estado: "Cerrada",
    responsable: "Lic. Ernesto Ríos",
    observaciones: "Resoluciones y sanciones administrativas.",
    frecuencia: "Baja",
    volumen: "2 cajas",
    formato: "Papel",
    ubicacion: "Administración, Estante 7",
    antecedente: "SER-002",
    subsecuente: "SER-011",
    fundamento: "Art. 45 LEA-BCS"
  },
  {
    clave: "SER-011",
    nombre: "Informes de Auditoría",
    area: "Órgano Interno de Control",
    fechaApertura: "2017-04-01",
    fechaCierre: "2022-04-01",
    valor: "Fiscal",
    plazo: "10 años",
    destino: "Conservación Permanente",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "C.P. Gabriela Torres",
    observaciones: "Informes y resultados de auditorías internas y externas.",
    frecuencia: "Media",
    volumen: "6 carpetas",
    formato: "PDF, Excel",
    ubicacion: "OIC, Estante 9",
    antecedente: "SER-010",
    subsecuente: "",
    fundamento: "Art. 50 LEA-BCS"
  }
];

const columnas = [
  { key: 'clave', label: 'Clave', tooltip: 'Clave única de la serie documental (LEA-BCS)' },
  { key: 'nombre', label: 'Nombre', tooltip: 'Nombre de la serie documental' },
  { key: 'area', label: 'Área responsable', tooltip: 'Área responsable de la gestión' },
  { key: 'fechaApertura', label: 'Fecha apertura', tooltip: 'Fecha de inicio de la serie' },
  { key: 'fechaCierre', label: 'Fecha cierre', tooltip: 'Fecha de cierre (si aplica)' },
  { key: 'valor', label: 'Valor', tooltip: 'Valor documental (Legal, Administrativo, Fiscal, Histórico)' },
  { key: 'plazo', label: 'Plazo', tooltip: 'Plazo de conservación' },
  { key: 'destino', label: 'Destino', tooltip: 'Destino final según LEA-BCS' },
  { key: 'soporte', label: 'Soporte', tooltip: 'Soporte documental (físico/digital)' },
  { key: 'estado', label: 'Estado', tooltip: 'Estado actual de la serie' },
  { key: 'responsable', label: 'Responsable', tooltip: 'Responsable de la serie' },
  { key: 'frecuencia', label: 'Frecuencia de uso', tooltip: 'Frecuencia de consulta o uso de la serie' },
  { key: 'volumen', label: 'Volumen', tooltip: 'Volumen documental (cajas, carpetas, digital, etc.)' },
  { key: 'formato', label: 'Formato', tooltip: 'Formato de los documentos (papel, digital, etc.)' },
  { key: 'ubicacion', label: 'Ubicación', tooltip: 'Ubicación física o digital de la serie' },
  { key: 'antecedente', label: 'Serie antecedente', tooltip: 'Serie documental antecedente' },
  { key: 'subsecuente', label: 'Serie subsecuente', tooltip: 'Serie documental subsecuente' },
  { key: 'fundamento', label: 'Fundamento legal', tooltip: 'Fundamento legal de conservación o baja' },
  { key: 'observaciones', label: 'Observaciones', tooltip: 'Notas u observaciones relevantes' },
];

export default function SeriesDocumentalesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [series, setSeries] = useState(mockSeries);
  const [form, setForm] = useState({
    clave: '', nombre: '', area: '', fechaApertura: '', fechaCierre: '', valor: 'Legal', plazo: '', destino: '', soporte: 'Digital', estado: 'Activa', responsable: '', observaciones: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSeries(prev => [...prev, form]);
    setShowModal(false);
    setForm({ clave: '', nombre: '', area: '', fechaApertura: '', fechaCierre: '', valor: 'Legal', plazo: '', destino: '', soporte: 'Digital', estado: 'Activa', responsable: '', observaciones: '' });
  };

  return (
    <div className={`${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'} min-h-screen transition-colors`}>
      <div className="p-8">
          <DashboardHeader title="Series documentales" darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />
        <div className="mt-4">
          <BackToHomeButton />
        </div>
      </div>
      <main className="w-screen mx-auto px-2 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="p-0 flex-1">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleInfo} className="text-blue-400 dark:text-blue-200" />
              Series documentales (LEA-BCS)
            </h2>
            <ul className="text-gray-600 dark:text-gray-400 text-sm list-disc pl-5">
              <li>Clave única, nombre, área responsable, fechas, valor, plazo, destino, soporte, estado, responsable y observaciones.</li>
            </ul>
          </div>
          <div className="flex flex-col items-end gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg transition-all" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="text-xl" />
              Nueva serie
            </button>
          </div>
        </div>
        {/* Tabla de series documentales */}
        <div className="overflow-x-auto">
          <table className={`w-full ${darkMode ? 'rounded-2xl shadow-lg border border-slate-700 bg-slate-800 divide-y divide-slate-700' : 'bg-transparent border-0 shadow-none'} `}>
            <thead>
              <tr>
                {columnas.map(col => (
                  <th key={col.key} className="px-6 py-4 text-left text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider group relative">
                    <span>{col.label}</span>
                    <span className="ml-1 cursor-pointer group-hover:opacity-100 opacity-90 transition-opacity" title={col.tooltip}>
                      <FontAwesomeIcon icon={faCircleInfo} className="text-blue-400 dark:text-blue-200 text-xs" />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-slate-800' : 'bg-transparent'} divide-y divide-blue-50 dark:divide-slate-700`}>
              {series.map((serie, idx) => (
                <tr key={idx} className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                  {columnas.map(col => (
                    <td key={col.key} className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line break-words">
                      {serie[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal de alta de serie */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-blue-200 dark:border-slate-700 relative">
              <button className="absolute top-4 right-4 text-2xl text-blue-700 dark:text-blue-200 hover:text-red-500" onClick={() => setShowModal(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-6 text-blue-900 dark:text-white">Registrar nueva serie documental</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                {/* Clave */}
                <div>
                  <label className="block mb-2 font-semibold" title="Clave única de la serie documental (LEA-BCS)">Clave *</label>
                  <input type="text" placeholder="Ej: SER-006" title="Clave única de la serie documental (LEA-BCS)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.clave} onChange={e => setForm(f => ({ ...f, clave: e.target.value }))} />
                </div>
                {/* Nombre */}
                <div>
                  <label className="block mb-2 font-semibold" title="Nombre de la serie documental">Nombre *</label>
                  <input type="text" placeholder="Ej: Actas de Sesión" title="Nombre de la serie documental" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                </div>
                {/* Área responsable */}
                <div>
                  <label className="block mb-2 font-semibold" title="Área responsable de la gestión">Área responsable *</label>
                  <input type="text" placeholder="Ej: Secretaría Técnica" title="Área responsable de la gestión" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} />
                </div>
                {/* Fecha apertura */}
                <div>
                  <label className="block mb-2 font-semibold" title="Fecha de inicio de la serie">Fecha apertura *</label>
                  <input type="date" title="Fecha de inicio de la serie" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.fechaApertura} onChange={e => setForm(f => ({ ...f, fechaApertura: e.target.value }))} />
                </div>
                {/* Fecha cierre */}
                <div>
                  <label className="block mb-2 font-semibold" title="Fecha de cierre (si aplica)">Fecha cierre</label>
                  <input type="date" title="Fecha de cierre (si aplica)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" value={form.fechaCierre} onChange={e => setForm(f => ({ ...f, fechaCierre: e.target.value }))} />
                </div>
                {/* Valor */}
                <div>
                  <label className="block mb-2 font-semibold" title="Valor documental (Legal, Administrativo, Fiscal, Histórico)">Valor *</label>
                  <select title="Valor documental (Legal, Administrativo, Fiscal, Histórico)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}>
                    <option value="Legal">Legal</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Fiscal">Fiscal</option>
                    <option value="Histórico">Histórico</option>
                  </select>
                </div>
                {/* Plazo */}
                <div>
                  <label className="block mb-2 font-semibold" title="Plazo de conservación">Plazo *</label>
                  <input type="text" placeholder="Ej: 5 años" title="Plazo de conservación" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.plazo} onChange={e => setForm(f => ({ ...f, plazo: e.target.value }))} />
                </div>
                {/* Destino */}
                <div>
                  <label className="block mb-2 font-semibold" title="Destino final según LEA-BCS">Destino *</label>
                  <input type="text" placeholder="Ej: Conservación Permanente" title="Destino final según LEA-BCS" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.destino} onChange={e => setForm(f => ({ ...f, destino: e.target.value }))} />
                </div>
                {/* Soporte */}
                <div>
                  <label className="block mb-2 font-semibold" title="Soporte documental (físico/digital)">Soporte *</label>
                  <select title="Soporte documental (físico/digital)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.soporte} onChange={e => setForm(f => ({ ...f, soporte: e.target.value }))}>
                    <option value="Digital">Digital</option>
                    <option value="Físico">Físico</option>
                  </select>
                </div>
                {/* Estado */}
                <div>
                  <label className="block mb-2 font-semibold" title="Estado actual de la serie">Estado *</label>
                  <select title="Estado actual de la serie" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                    <option value="Activa">Activa</option>
                    <option value="Cerrada">Cerrada</option>
                  </select>
                </div>
                {/* Responsable */}
                <div>
                  <label className="block mb-2 font-semibold" title="Responsable de la serie">Responsable *</label>
                  <input type="text" placeholder="Ej: Lic. Ana Torres" title="Responsable de la serie" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.responsable} onChange={e => setForm(f => ({ ...f, responsable: e.target.value }))} />
                </div>
                {/* Frecuencia de uso */}
                <div>
                  <label className="block mb-2 font-semibold" title="Frecuencia de consulta o uso de la serie">Frecuencia de uso *</label>
                  <input type="text" placeholder="Ej: Alta, Media, Baja" title="Frecuencia de consulta o uso de la serie" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.frecuencia || ''} onChange={e => setForm(f => ({ ...f, frecuencia: e.target.value }))} />
                </div>
                {/* Volumen */}
                <div>
                  <label className="block mb-2 font-semibold" title="Volumen documental (cajas, carpetas, digital, etc.)">Volumen *</label>
                  <input type="text" placeholder="Ej: 10 cajas, 5 carpetas" title="Volumen documental (cajas, carpetas, digital, etc.)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.volumen || ''} onChange={e => setForm(f => ({ ...f, volumen: e.target.value }))} />
                </div>
                {/* Formato */}
                <div>
                  <label className="block mb-2 font-semibold" title="Formato de los documentos (papel, digital, etc.)">Formato *</label>
                  <input type="text" placeholder="Ej: PDF, Papel, Word" title="Formato de los documentos (papel, digital, etc.)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.formato || ''} onChange={e => setForm(f => ({ ...f, formato: e.target.value }))} />
                </div>
                {/* Ubicación */}
                <div>
                  <label className="block mb-2 font-semibold" title="Ubicación física o digital de la serie">Ubicación *</label>
                  <input type="text" placeholder="Ej: Archivo Central, Estante 2" title="Ubicación física o digital de la serie" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.ubicacion || ''} onChange={e => setForm(f => ({ ...f, ubicacion: e.target.value }))} />
                </div>
                {/* Serie antecedente */}
                <div>
                  <label className="block mb-2 font-semibold" title="Serie documental antecedente">Serie antecedente</label>
                  <input type="text" placeholder="Ej: SER-000" title="Serie documental antecedente" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" value={form.antecedente || ''} onChange={e => setForm(f => ({ ...f, antecedente: e.target.value }))} />
                </div>
                {/* Serie subsecuente */}
                <div>
                  <label className="block mb-2 font-semibold" title="Serie documental subsecuente">Serie subsecuente</label>
                  <input type="text" placeholder="Ej: SER-010" title="Serie documental subsecuente" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" value={form.subsecuente || ''} onChange={e => setForm(f => ({ ...f, subsecuente: e.target.value }))} />
                </div>
                {/* Fundamento legal */}
                <div>
                  <label className="block mb-2 font-semibold" title="Fundamento legal de conservación o baja">Fundamento legal *</label>
                  <input type="text" placeholder="Ej: Art. 15 LEA-BCS" title="Fundamento legal de conservación o baja" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.fundamento || ''} onChange={e => setForm(f => ({ ...f, fundamento: e.target.value }))} />
                </div>
                {/* Observaciones */}
                <div className="md:col-span-2">
                  <label className="block mb-2 font-semibold" title="Notas u observaciones relevantes">Observaciones</label>
                  <textarea placeholder="Notas adicionales..." title="Notas u observaciones relevantes" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" rows={2} value={form.observaciones} onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))} />
                </div>
                {/* Botones */}
                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                  <button type="button" className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold">Registrar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <div className="h-16" />
      <footer className="max-w-7xl mx-auto px-4 pb-12 mt-16">
        <div className="bg-blue-50 dark:bg-slate-900 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-xl shadow text-blue-900 dark:text-blue-100 text-sm">
          Gestión profesional de series documentales conforme a la Ley de Archivos del Estado de Baja California Sur (LEA-BCS). Aquí puedes consultar, crear y administrar series con todos los metadatos archivísticos requeridos.
        </div>
      </footer>
    </div>
  );
}
