
'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPlus } from '@fortawesome/free-solid-svg-icons';
import DashboardHeader from '../../components/DashboardHeader';
import BackToHomeButton from '@/components/BackToHomeButton';

const mockVersiones = [
  {
    clave: "VER-001",
    nombre: "Contrato Marco v1",
    area: "Jurídico",
    fechaApertura: "2020-01-01",
    fechaCierre: "2020-12-31",
    valor: "Legal",
    plazo: "5 años",
    destino: "Conservación Permanente",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "Lic. Ana Torres",
    observaciones: "Primera versión del contrato marco.",
    frecuencia: "Alta",
    volumen: "1 archivo",
    formato: "PDF",
    ubicacion: "Archivo Central, Estante 2",
    antecedente: "",
    subsecuente: "VER-002",
    fundamento: "Art. 15 LEA-BCS"
  },
  {
    clave: "VER-002",
    nombre: "Contrato Marco v2",
    area: "Jurídico",
    fechaApertura: "2021-01-01",
    fechaCierre: "2021-12-31",
    valor: "Legal",
    plazo: "5 años",
    destino: "Conservación Permanente",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "Lic. Ana Torres",
    observaciones: "Segunda versión del contrato marco.",
    frecuencia: "Alta",
    volumen: "1 archivo",
    formato: "PDF",
    ubicacion: "Archivo Central, Estante 2",
    antecedente: "VER-001",
    subsecuente: "",
    fundamento: "Art. 15 LEA-BCS"
  },
  // --- Ejemplos adicionales ---
  {
    clave: "VER-003",
    nombre: "Manual de Procedimientos v1",
    area: "Administración",
    fechaApertura: "2019-03-01",
    fechaCierre: "2020-03-01",
    valor: "Administrativo",
    plazo: "3 años",
    destino: "Baja Documental",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "Lic. Ernesto Ríos",
    observaciones: "Primera versión del manual de procedimientos.",
    frecuencia: "Media",
    volumen: "1 archivo",
    formato: "PDF, Word",
    ubicacion: "Administración, Estante 1",
    antecedente: "",
    subsecuente: "VER-004",
    fundamento: "Art. 20 LEA-BCS"
  },
  {
    clave: "VER-004",
    nombre: "Manual de Procedimientos v2",
    area: "Administración",
    fechaApertura: "2020-04-01",
    fechaCierre: "2021-04-01",
    valor: "Administrativo",
    plazo: "3 años",
    destino: "Baja Documental",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "Lic. Ernesto Ríos",
    observaciones: "Segunda versión del manual de procedimientos.",
    frecuencia: "Media",
    volumen: "1 archivo",
    formato: "PDF, Word",
    ubicacion: "Administración, Estante 1",
    antecedente: "VER-003",
    subsecuente: "VER-005",
    fundamento: "Art. 20 LEA-BCS"
  },
  {
    clave: "VER-005",
    nombre: "Informe de Auditoría v1",
    area: "Órgano Interno de Control",
    fechaApertura: "2022-01-01",
    fechaCierre: "2022-12-31",
    valor: "Fiscal",
    plazo: "10 años",
    destino: "Conservación Permanente",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "C.P. Gabriela Torres",
    observaciones: "Informe de auditoría interna anual.",
    frecuencia: "Baja",
    volumen: "1 archivo",
    formato: "PDF, Excel",
    ubicacion: "OIC, Estante 3",
    antecedente: "",
    subsecuente: "",
    fundamento: "Art. 50 LEA-BCS"
  },
  // --- Más ejemplos ---
  {
    clave: "VER-006",
    nombre: "Política de Seguridad v1",
    area: "Tecnologías de la Información",
    fechaApertura: "2020-05-01",
    fechaCierre: "2021-05-01",
    valor: "Administrativo",
    plazo: "4 años",
    destino: "Baja Documental",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "Ing. Mario López",
    observaciones: "Primera versión de la política de seguridad informática.",
    frecuencia: "Media",
    volumen: "1 archivo",
    formato: "PDF",
    ubicacion: "TI, Estante 2",
    antecedente: "",
    subsecuente: "VER-007",
    fundamento: "Art. 33 LEA-BCS"
  },
  {
    clave: "VER-007",
    nombre: "Política de Seguridad v2",
    area: "Tecnologías de la Información",
    fechaApertura: "2021-06-01",
    fechaCierre: "2022-06-01",
    valor: "Administrativo",
    plazo: "4 años",
    destino: "Baja Documental",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "Ing. Mario López",
    observaciones: "Segunda versión de la política de seguridad informática.",
    frecuencia: "Media",
    volumen: "1 archivo",
    formato: "PDF",
    ubicacion: "TI, Estante 2",
    antecedente: "VER-006",
    subsecuente: "VER-008",
    fundamento: "Art. 33 LEA-BCS"
  },
  {
    clave: "VER-008",
    nombre: "Reglamento Interno v1",
    area: "Recursos Humanos",
    fechaApertura: "2018-01-01",
    fechaCierre: "2019-01-01",
    valor: "Legal",
    plazo: "5 años",
    destino: "Conservación Permanente",
    soporte: "Físico",
    estado: "Cerrada",
    responsable: "Mtra. Sofía Méndez",
    observaciones: "Primera versión del reglamento interno de trabajo.",
    frecuencia: "Baja",
    volumen: "1 carpeta",
    formato: "Papel",
    ubicacion: "RH, Estante 4",
    antecedente: "",
    subsecuente: "",
    fundamento: "Art. 10 LEA-BCS"
  }
];

const columnas = [
  { key: 'clave', label: 'Clave', tooltip: 'Clave única de la versión documental (LEA-BCS)' },
  { key: 'nombre', label: 'Nombre', tooltip: 'Nombre de la versión documental' },
  { key: 'area', label: 'Área responsable', tooltip: 'Área responsable de la gestión' },
  { key: 'fechaApertura', label: 'Fecha apertura', tooltip: 'Fecha de inicio de la versión' },
  { key: 'fechaCierre', label: 'Fecha cierre', tooltip: 'Fecha de cierre (si aplica)' },
  { key: 'valor', label: 'Valor', tooltip: 'Valor documental (Legal, Administrativo, Fiscal, Histórico)' },
  { key: 'plazo', label: 'Plazo', tooltip: 'Plazo de conservación' },
  { key: 'destino', label: 'Destino', tooltip: 'Destino final según LEA-BCS' },
  { key: 'soporte', label: 'Soporte', tooltip: 'Soporte documental (físico/digital)' },
  { key: 'estado', label: 'Estado', tooltip: 'Estado actual de la versión' },
  { key: 'responsable', label: 'Responsable', tooltip: 'Responsable de la versión' },
  { key: 'frecuencia', label: 'Frecuencia de uso', tooltip: 'Frecuencia de consulta o uso de la versión' },
  { key: 'volumen', label: 'Volumen', tooltip: 'Volumen documental (archivos, digital, etc.)' },
  { key: 'formato', label: 'Formato', tooltip: 'Formato de los documentos (papel, digital, etc.)' },
  { key: 'ubicacion', label: 'Ubicación', tooltip: 'Ubicación física o digital de la versión' },
  { key: 'antecedente', label: 'Versión antecedente', tooltip: 'Versión documental antecedente' },
  { key: 'subsecuente', label: 'Versión subsecuente', tooltip: 'Versión documental subsecuente' },
  { key: 'fundamento', label: 'Fundamento legal', tooltip: 'Fundamento legal de conservación o baja' },
  { key: 'observaciones', label: 'Observaciones', tooltip: 'Notas u observaciones relevantes' },
];

export default function VersionesDocumentalesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [versiones, setVersiones] = useState(mockVersiones);
  const [form, setForm] = useState({
    clave: '', nombre: '', area: '', fechaApertura: '', fechaCierre: '', valor: 'Legal', plazo: '', destino: '', soporte: 'Digital', estado: 'Activa', responsable: '', observaciones: '', frecuencia: '', volumen: '', formato: '', ubicacion: '', antecedente: '', subsecuente: '', fundamento: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setVersiones(prev => [...prev, form]);
    setShowModal(false);
    setForm({ clave: '', nombre: '', area: '', fechaApertura: '', fechaCierre: '', valor: 'Legal', plazo: '', destino: '', soporte: 'Digital', estado: 'Activa', responsable: '', observaciones: '', frecuencia: '', volumen: '', formato: '', ubicacion: '', antecedente: '', subsecuente: '', fundamento: '' });
  };

  return (
    <div className={`${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'} min-h-screen transition-colors`}>
      <div className="p-8">
        <DashboardHeader title="Versiones documentales" darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />
        <div className="mt-4">
          <BackToHomeButton />
        </div>
      </div>
      <main className="w-screen mx-auto px-2 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="p-0 flex-1">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleInfo} className="text-blue-400 dark:text-blue-200" />
              Versiones documentales (LEA-BCS)
            </h2>
            <ul className="text-gray-600 dark:text-gray-400 text-sm list-disc pl-5">
              <li>Clave, nombre, área responsable, fechas, valor, plazo, destino, soporte, estado, responsable, frecuencia, volumen, formato, ubicación, antecedente, subsecuente, fundamento legal y observaciones.</li>
            </ul>
          </div>
          <div className="flex flex-col items-end gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg transition-all" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="text-xl" />
              Nueva versión
            </button>
          </div>
        </div>
        {/* Tabla de versiones documentales */}
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
              {versiones.map((ver, idx) => (
                <tr key={idx} className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                  {columnas.map(col => (
                    <td key={col.key} className="px-6 py-3 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line break-words">
                      {ver[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal de alta de versión */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-blue-200 dark:border-slate-700 relative">
              <button className="absolute top-4 right-4 text-2xl text-blue-700 dark:text-blue-200 hover:text-red-500" onClick={() => setShowModal(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-6 text-blue-900 dark:text-white">Registrar nueva versión documental</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                {/* Campos del formulario, igual que en las otras secciones */}
                {columnas.map(col => (
                  col.key !== 'observaciones' ? (
                    <div key={col.key}>
                      <label className="block mb-2 font-semibold" title={col.tooltip}>{col.label}{['clave','nombre','area','fechaApertura','valor','plazo','destino','soporte','estado','responsable','frecuencia','volumen','formato','ubicacion','fundamento'].includes(col.key) ? ' *' : ''}</label>
                      <input
                        type={col.key.includes('fecha') ? 'date' : 'text'}
                        placeholder={col.label}
                        title={col.tooltip}
                        className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                        required={['clave','nombre','area','fechaApertura','valor','plazo','destino','soporte','estado','responsable','frecuencia','volumen','formato','ubicacion','fundamento'].includes(col.key)}
                        value={form[col.key] || ''}
                        onChange={e => setForm(f => ({ ...f, [col.key]: e.target.value }))}
                      />
                    </div>
                  ) : null
                ))}
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
          Gestión profesional de versiones documentales conforme a la Ley de Archivos del Estado de Baja California Sur (LEA-BCS). Aquí puedes consultar, crear y administrar versiones con todos los metadatos archivísticos requeridos.
        </div>
      </footer>
    </div>
  );
}
