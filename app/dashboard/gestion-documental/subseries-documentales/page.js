
'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPlus } from '@fortawesome/free-solid-svg-icons';
import DashboardHeader from '../../components/DashboardHeader';
import BackToHomeButton from '@/components/BackToHomeButton';

const mockSubseries = [
  {
    clave: "SUB-001",
    nombre: "Contratos de Arrendamiento",
    serie: "Contratos y Convenios",
    area: "Jurídico",
    fechaApertura: "2021-01-01",
    fechaCierre: "",
    valor: "Legal",
    plazo: "3 años",
    destino: "Conservación Temporal",
    soporte: "Digital",
    estado: "Activa",
    responsable: "Lic. Ana Torres",
    observaciones: "Arrendamientos institucionales.",
    frecuencia: "Media",
    volumen: "2 carpetas",
    formato: "PDF, Word",
    ubicacion: "Archivo Central, Estante 5",
    antecedente: "SUB-000",
    subsecuente: "SUB-002",
    fundamento: "Art. 16 LEA-BCS"
  },
  {
    clave: "SUB-002",
    nombre: "Convenios de Colaboración",
    serie: "Contratos y Convenios",
    area: "Jurídico",
    fechaApertura: "2022-03-10",
    fechaCierre: "",
    valor: "Legal",
    plazo: "5 años",
    destino: "Conservación Permanente",
    soporte: "Digital",
    estado: "Activa",
    responsable: "Lic. Ana Torres",
    observaciones: "Convenios con otras instituciones.",
    frecuencia: "Baja",
    volumen: "1 carpeta",
    formato: "PDF",
    ubicacion: "Archivo Central, Estante 5",
    antecedente: "SUB-001",
    subsecuente: "",
    fundamento: "Art. 17 LEA-BCS"
  },
  // --- Nuevos registros de ejemplo ---
  {
    clave: "SUB-003",
    nombre: "Actas de Comité de Ética",
    serie: "Actas de Sesión",
    area: "Secretaría Técnica",
    fechaApertura: "2018-04-15",
    fechaCierre: "2023-04-15",
    valor: "Legal",
    plazo: "5 años",
    destino: "Conservación Permanente",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "Lic. Carmen Ruiz",
    observaciones: "Actas de reuniones del Comité de Ética.",
    frecuencia: "Baja",
    volumen: "1 carpeta",
    formato: "PDF, Word",
    ubicacion: "Secretaría Técnica, Estante 7",
    antecedente: "SUB-001",
    subsecuente: "SUB-004",
    fundamento: "Art. 21 LEA-BCS"
  },
  {
    clave: "SUB-004",
    nombre: "Informes de Auditoría",
    serie: "Informes Anuales",
    area: "Contraloría",
    fechaApertura: "2017-01-01",
    fechaCierre: "2022-12-31",
    valor: "Fiscal",
    plazo: "6 años",
    destino: "Baja Documental",
    soporte: "Digital",
    estado: "Cerrada",
    responsable: "C.P. Mario Gómez",
    observaciones: "Informes de auditoría interna y externa.",
    frecuencia: "Media",
    volumen: "2 carpetas",
    formato: "PDF, Excel",
    ubicacion: "Contraloría, Estante 3",
    antecedente: "SUB-003",
    subsecuente: "SUB-005",
    fundamento: "Art. 23 LEA-BCS"
  },
  {
    clave: "SUB-005",
    nombre: "Correspondencia Externa",
    serie: "Correspondencia Oficial",
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
    antecedente: "SUB-004",
    subsecuente: "",
    fundamento: "Art. 25 LEA-BCS"
  }
];

const columnas = [
  { key: 'clave', label: 'Clave', tooltip: 'Clave única de la subserie documental (LEA-BCS)' },
  { key: 'nombre', label: 'Nombre', tooltip: 'Nombre de la subserie documental' },
  { key: 'serie', label: 'Serie principal', tooltip: 'Serie documental a la que pertenece' },
  { key: 'area', label: 'Área responsable', tooltip: 'Área responsable de la gestión' },
  { key: 'fechaApertura', label: 'Fecha apertura', tooltip: 'Fecha de inicio de la subserie' },
  { key: 'fechaCierre', label: 'Fecha cierre', tooltip: 'Fecha de cierre (si aplica)' },
  { key: 'valor', label: 'Valor', tooltip: 'Valor documental (Legal, Administrativo, Fiscal, Histórico)' },
  { key: 'plazo', label: 'Plazo', tooltip: 'Plazo de conservación' },
  { key: 'destino', label: 'Destino', tooltip: 'Destino final según LEA-BCS' },
  { key: 'soporte', label: 'Soporte', tooltip: 'Soporte documental (físico/digital)' },
  { key: 'estado', label: 'Estado', tooltip: 'Estado actual de la subserie' },
  { key: 'responsable', label: 'Responsable', tooltip: 'Responsable de la subserie' },
  { key: 'frecuencia', label: 'Frecuencia de uso', tooltip: 'Frecuencia de consulta o uso de la subserie' },
  { key: 'volumen', label: 'Volumen', tooltip: 'Volumen documental (cajas, carpetas, digital, etc.)' },
  { key: 'formato', label: 'Formato', tooltip: 'Formato de los documentos (papel, digital, etc.)' },
  { key: 'ubicacion', label: 'Ubicación', tooltip: 'Ubicación física o digital de la subserie' },
  { key: 'antecedente', label: 'Subserie antecedente', tooltip: 'Subserie documental antecedente' },
  { key: 'subsecuente', label: 'Subserie subsecuente', tooltip: 'Subserie documental subsecuente' },
  { key: 'fundamento', label: 'Fundamento legal', tooltip: 'Fundamento legal de conservación o baja' },
  { key: 'observaciones', label: 'Observaciones', tooltip: 'Notas u observaciones relevantes' },
];

export default function SubseriesDocumentalesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [subseries, setSubseries] = useState(mockSubseries);
  const [form, setForm] = useState({
    clave: '', nombre: '', serie: '', area: '', fechaApertura: '', fechaCierre: '', valor: 'Legal', plazo: '', destino: '', soporte: 'Digital', estado: 'Activa', responsable: '', observaciones: '', frecuencia: '', volumen: '', formato: '', ubicacion: '', antecedente: '', subsecuente: '', fundamento: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubseries(prev => [...prev, form]);
    setShowModal(false);
    setForm({ clave: '', nombre: '', serie: '', area: '', fechaApertura: '', fechaCierre: '', valor: 'Legal', plazo: '', destino: '', soporte: 'Digital', estado: 'Activa', responsable: '', observaciones: '', frecuencia: '', volumen: '', formato: '', ubicacion: '', antecedente: '', subsecuente: '', fundamento: '' });
  };

  return (
    <div className={`${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'} min-h-screen transition-colors`}>
      <div className="p-8">
        <DashboardHeader title="Subseries documentales" darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />
        <div className="mt-4">
          <BackToHomeButton />
        </div>
      </div>
      <main className="w-screen mx-auto px-2 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          {/* Barra informativa */}
          <div className="p-0 flex-1">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleInfo} className="text-blue-400 dark:text-blue-200" />
              Subseries documentales (LEA-BCS)
            </h2>
            <ul className="text-gray-600 dark:text-gray-400 text-sm list-disc pl-5">
              <li>Clave, nombre, serie principal, área, fechas, valor, plazo, destino, soporte, estado, responsable, frecuencia, volumen, formato, ubicación, antecedentes, subsecuentes, fundamento legal y observaciones.</li>
            </ul>
          </div>
          <div className="flex flex-col items-end gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg transition-all" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="text-xl" />
              Nueva subserie
            </button>
          </div>
        </div>
        {/* Tabla de subseries documentales */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {columnas.map(col => (
                  <th key={col.key} className="px-6 py-4 text-left text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider group relative border-0 bg-transparent">
                    <span>{col.label}</span>
                    <span className="ml-1 cursor-pointer group-hover:opacity-100 opacity-90 transition-opacity" title={col.tooltip}>
                      <FontAwesomeIcon icon={faCircleInfo} className="text-blue-400 dark:text-blue-200 text-xs" />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subseries.map((sub, idx) => (
                <tr key={idx} className="transition-colors">
                  {columnas.map(col => (
                    <td key={col.key} className="px-6 py-3 text-base text-gray-800 dark:text-gray-100 whitespace-pre-line break-words border-0 bg-transparent">
                      {sub[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal de alta de subserie */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-blue-200 dark:border-slate-700 relative">
              <button className="absolute top-4 right-4 text-2xl text-blue-700 dark:text-blue-200 hover:text-red-500" onClick={() => setShowModal(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-6 text-blue-900 dark:text-white">Registrar nueva subserie documental</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-2 font-semibold" title="Clave única de la subserie documental (LEA-BCS)">Clave *</label>
                  <input type="text" placeholder="Ej: SUB-003" title="Clave única de la subserie documental (LEA-BCS)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.clave} onChange={e => setForm(f => ({ ...f, clave: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Nombre de la subserie documental">Nombre *</label>
                  <input type="text" placeholder="Ej: Actas de Comité" title="Nombre de la subserie documental" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Serie documental a la que pertenece">Serie principal *</label>
                  <input type="text" placeholder="Ej: Contratos y Convenios" title="Serie documental a la que pertenece" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.serie} onChange={e => setForm(f => ({ ...f, serie: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Área responsable de la gestión">Área responsable *</label>
                  <input type="text" placeholder="Ej: Secretaría Técnica" title="Área responsable de la gestión" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Fecha de inicio de la subserie">Fecha apertura *</label>
                  <input type="date" title="Fecha de inicio de la subserie" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.fechaApertura} onChange={e => setForm(f => ({ ...f, fechaApertura: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Fecha de cierre (si aplica)">Fecha cierre</label>
                  <input type="date" title="Fecha de cierre (si aplica)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" value={form.fechaCierre} onChange={e => setForm(f => ({ ...f, fechaCierre: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Valor documental (Legal, Administrativo, Fiscal, Histórico)">Valor *</label>
                  <select title="Valor documental (Legal, Administrativo, Fiscal, Histórico)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}>
                    <option value="Legal">Legal</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Fiscal">Fiscal</option>
                    <option value="Histórico">Histórico</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Plazo de conservación">Plazo *</label>
                  <input type="text" placeholder="Ej: 3 años" title="Plazo de conservación" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.plazo} onChange={e => setForm(f => ({ ...f, plazo: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Destino final según LEA-BCS">Destino *</label>
                  <input type="text" placeholder="Ej: Conservación Temporal" title="Destino final según LEA-BCS" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.destino} onChange={e => setForm(f => ({ ...f, destino: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Soporte documental (físico/digital)">Soporte *</label>
                  <select title="Soporte documental (físico/digital)" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.soporte} onChange={e => setForm(f => ({ ...f, soporte: e.target.value }))}>
                    <option value="Digital">Digital</option>
                    <option value="Físico">Físico</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Estado actual de la subserie">Estado *</label>
                  <select title="Estado actual de la subserie" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                    <option value="Activa">Activa</option>
                    <option value="Cerrada">Cerrada</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Responsable de la subserie">Responsable *</label>
                  <input type="text" placeholder="Ej: Lic. Ana Torres" title="Responsable de la subserie" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.responsable} onChange={e => setForm(f => ({ ...f, responsable: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Frecuencia de consulta o uso de la subserie">Frecuencia de uso *</label>
                  <input type="text" placeholder="Ej: Alta, Media, Baja" title="Frecuencia de consulta o uso de la subserie" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.frecuencia || ''} onChange={e => setForm(f => ({ ...f, frecuencia: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Volumen documental (cajas, carpetas, digital, etc.)">Volumen *</label>
                  <input type="text" placeholder="Ej: 2 carpetas" title="Volumen documental" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.volumen || ''} onChange={e => setForm(f => ({ ...f, volumen: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Formato de los documentos (papel, digital, etc.)">Formato *</label>
                  <input type="text" placeholder="Ej: PDF, Papel, Word" title="Formato de los documentos" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.formato || ''} onChange={e => setForm(f => ({ ...f, formato: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Ubicación física o digital de la subserie">Ubicación *</label>
                  <input type="text" placeholder="Ej: Archivo Central, Estante 5" title="Ubicación física o digital" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.ubicacion || ''} onChange={e => setForm(f => ({ ...f, ubicacion: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Subserie documental antecedente">Subserie antecedente</label>
                  <input type="text" placeholder="Ej: SUB-000" title="Subserie documental antecedente" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" value={form.antecedente || ''} onChange={e => setForm(f => ({ ...f, antecedente: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Subserie documental subsecuente">Subserie subsecuente</label>
                  <input type="text" placeholder="Ej: SUB-002" title="Subserie documental subsecuente" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" value={form.subsecuente || ''} onChange={e => setForm(f => ({ ...f, subsecuente: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-2 font-semibold" title="Fundamento legal de conservación o baja">Fundamento legal *</label>
                  <input type="text" placeholder="Ej: Art. 16 LEA-BCS" title="Fundamento legal de conservación o baja" className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800" required value={form.fundamento || ''} onChange={e => setForm(f => ({ ...f, fundamento: e.target.value }))} />
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
        <div className="p-0 text-blue-900 dark:text-blue-100 text-sm">
          Gestión profesional de subseries documentales conforme a la Ley de Archivos del Estado de Baja California Sur (LEA-BCS). Aquí puedes consultar, crear y administrar subseries con todos los metadatos archivísticos requeridos.
        </div>
      </footer>
    </div>
  );
}
