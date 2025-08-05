
'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPlus } from '@fortawesome/free-solid-svg-icons';
import DashboardHeader from '../../components/DashboardHeader';
import BackToHomeButton from '@/components/BackToHomeButton';

const mockTransferencias = [
  {
    folio: "TRF-001",
    fecha: "2024-01-15",
    tipo: "Primaria",
    serie: "Contratos y Convenios",
    subserie: "Contratos de Arrendamiento",
    volumen: "2 cajas",
    soporte: "Digital",
    responsable: "Lic. Ana Torres",
    destinatario: "Archivo Central",
    estado: "Enviada",
    observaciones: "Transferencia de contratos vencidos.",
    fundamento: "Art. 40 LEA-BCS"
  },
  {
    folio: "TRF-002",
    fecha: "2024-03-10",
    tipo: "Secundaria",
    serie: "Recursos Humanos",
    subserie: "Expedientes de Personal",
    volumen: "5 carpetas",
    soporte: "Físico",
    responsable: "Mtra. Sofía Méndez",
    destinatario: "Archivo General",
    estado: "Recibida",
    observaciones: "Expedientes de personal dados de baja.",
    fundamento: "Art. 41 LEA-BCS"
  },
  // --- Ejemplos adicionales ---
  {
    folio: "TRF-003",
    fecha: "2024-04-20",
    tipo: "Primaria",
    serie: "Inventarios de Bienes",
    subserie: "Inventario de Equipo de Cómputo",
    volumen: "1 caja",
    soporte: "Digital",
    responsable: "Ing. Mario López",
    destinatario: "Archivo Central",
    estado: "Enviada",
    observaciones: "Inventario anual de equipo de cómputo.",
    fundamento: "Art. 42 LEA-BCS"
  },
  {
    folio: "TRF-004",
    fecha: "2024-05-15",
    tipo: "Secundaria",
    serie: "Correspondencia Oficial",
    subserie: "Oficios de Salida",
    volumen: "3 carpetas",
    soporte: "Físico",
    responsable: "Lic. Laura Pérez",
    destinatario: "Archivo General",
    estado: "Recibida",
    observaciones: "Oficios enviados durante el primer semestre.",
    fundamento: "Art. 43 LEA-BCS"
  },
  {
    folio: "TRF-005",
    fecha: "2024-06-10",
    tipo: "Primaria",
    serie: "Proyectos Especiales",
    subserie: "Proyectos de Innovación",
    volumen: "2 carpetas",
    soporte: "Digital",
    responsable: "Mtro. Juan García",
    destinatario: "Archivo Central",
    estado: "Enviada",
    observaciones: "Transferencia de proyectos concluidos.",
    fundamento: "Art. 44 LEA-BCS"
  }
];

const columnas = [
  { key: 'folio', label: 'Folio', tooltip: 'Folio único de la transferencia' },
  { key: 'fecha', label: 'Fecha', tooltip: 'Fecha de la transferencia' },
  { key: 'tipo', label: 'Tipo', tooltip: 'Tipo de transferencia (Primaria/Secundaria)' },
  { key: 'serie', label: 'Serie', tooltip: 'Serie documental transferida' },
  { key: 'subserie', label: 'Subserie', tooltip: 'Subserie documental transferida' },
  { key: 'volumen', label: 'Volumen', tooltip: 'Volumen documental transferido' },
  { key: 'soporte', label: 'Soporte', tooltip: 'Soporte documental (físico/digital)' },
  { key: 'responsable', label: 'Responsable', tooltip: 'Responsable de la transferencia' },
  { key: 'destinatario', label: 'Destinatario', tooltip: 'Archivo o área que recibe' },
  { key: 'estado', label: 'Estado', tooltip: 'Estado de la transferencia' },
  { key: 'fundamento', label: 'Fundamento legal', tooltip: 'Fundamento legal de la transferencia' },
  { key: 'observaciones', label: 'Observaciones', tooltip: 'Notas u observaciones relevantes' },
];

export default function TransferenciasPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transferencias, setTransferencias] = useState(mockTransferencias);
  const [form, setForm] = useState({
    folio: '', fecha: '', tipo: 'Primaria', serie: '', subserie: '', volumen: '', soporte: 'Digital', responsable: '', destinatario: '', estado: 'Enviada', fundamento: '', observaciones: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTransferencias(prev => [...prev, form]);
    setShowModal(false);
    setForm({ folio: '', fecha: '', tipo: 'Primaria', serie: '', subserie: '', volumen: '', soporte: 'Digital', responsable: '', destinatario: '', estado: 'Enviada', fundamento: '', observaciones: '' });
  };

  return (
    <div className={`${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'} min-h-screen transition-colors`}>
      <div className="p-8">
        <DashboardHeader title="Transferencias documentales" darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />
        <div className="mt-4">
          <BackToHomeButton />
        </div>
      </div>
      <main className="w-screen mx-auto px-2 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="p-0 flex-1">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleInfo} className="text-blue-400 dark:text-blue-200" />
              Transferencias documentales (LEA-BCS)
            </h2>
            <ul className="text-gray-600 dark:text-gray-400 text-sm list-disc pl-5">
              <li>Folio, fecha, tipo, serie, subserie, volumen, soporte, responsable, destinatario, estado, fundamento legal y observaciones.</li>
            </ul>
          </div>
          <div className="flex flex-col items-end gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg transition-all" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="text-xl" />
              Nueva transferencia
            </button>
          </div>
        </div>
        {/* Tabla de transferencias documentales */}
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
              {transferencias.map((trf, idx) => (
                <tr key={idx} className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                  {columnas.map(col => (
                    <td key={col.key} className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line break-words">
                      {trf[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal de alta de transferencia */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-blue-200 dark:border-slate-700 relative">
              <button className="absolute top-4 right-4 text-2xl text-blue-700 dark:text-blue-200 hover:text-red-500" onClick={() => setShowModal(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-6 text-blue-900 dark:text-white">Registrar nueva transferencia documental</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-2 font-semibold" title="Folio único de la transferencia">Folio *</label>
                  <input type="text" placeholder="Ej: TRF-003" title="Folio único de la transferencia" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.folio} onChange={e => setForm(f => ({ ...f, folio: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Fecha de la transferencia">Fecha *</label>
                  <input type="date" title="Fecha de la transferencia" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Tipo de transferencia (Primaria/Secundaria)">Tipo *</label>
                  <select title="Tipo de transferencia (Primaria/Secundaria)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Serie documental transferida">Serie *</label>
                  <input type="text" placeholder="Ej: Contratos y Convenios" title="Serie documental transferida" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.serie} onChange={e => setForm(f => ({ ...f, serie: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Subserie documental transferida">Subserie *</label>
                  <input type="text" placeholder="Ej: Contratos de Arrendamiento" title="Subserie documental transferida" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.subserie} onChange={e => setForm(f => ({ ...f, subserie: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Volumen documental transferido">Volumen *</label>
                  <input type="text" placeholder="Ej: 2 cajas" title="Volumen documental transferido" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.volumen} onChange={e => setForm(f => ({ ...f, volumen: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Soporte documental (físico/digital)">Soporte *</label>
                  <select title="Soporte documental (físico/digital)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.soporte} onChange={e => setForm(f => ({ ...f, soporte: e.target.value }))}>
                    <option value="Digital">Digital</option>
                    <option value="Físico">Físico</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Responsable de la transferencia">Responsable *</label>
                  <input type="text" placeholder="Ej: Lic. Ana Torres" title="Responsable de la transferencia" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.responsable} onChange={e => setForm(f => ({ ...f, responsable: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Archivo o área que recibe">Destinatario *</label>
                  <input type="text" placeholder="Ej: Archivo Central" title="Archivo o área que recibe" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.destinatario} onChange={e => setForm(f => ({ ...f, destinatario: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Estado de la transferencia">Estado *</label>
                  <select title="Estado de la transferencia" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                    <option value="Enviada">Enviada</option>
                    <option value="Recibida">Recibida</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Fundamento legal de la transferencia">Fundamento legal *</label>
                  <input type="text" placeholder="Ej: Art. 40 LEA-BCS" title="Fundamento legal de la transferencia" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.fundamento} onChange={e => setForm(f => ({ ...f, fundamento: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 font-semibold" title="Notas u observaciones relevantes">Observaciones</label>
                  <textarea placeholder="Notas adicionales..." title="Notas u observaciones relevantes" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" rows={2} value={form.observaciones} onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))} />
                </div>
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
          Gestión profesional de transferencias documentales conforme a la Ley de Archivos del Estado de Baja California Sur (LEA-BCS). Aquí puedes consultar, crear y administrar transferencias con todos los metadatos archivísticos requeridos.
        </div>
      </footer>
    </div>
  );
}
