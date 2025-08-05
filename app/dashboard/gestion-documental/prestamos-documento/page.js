
'use client';

import { useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import BackToHomeButton from '../../../../components/BackToHomeButton';

const mockPrestamos = [
  {
    id: 1,
    expediente: 'API-2025-100-0001',
    documento: 'Contrato de Arrendamiento',
    areaSolicitante: 'Jurídico',
    tipoPrestamo: 'Físico',
    medioEntrega: 'Personal',
    registroDevoluciones: 'Sin incidencias',
    usuario: 'Juan Pérez',
    fechaPrestamo: '2025-08-01',
    fechaDevolucion: '2025-08-10',
    responsable: 'Lic. Ana Torres',
    estado: 'Activo',
    observaciones: 'Uso temporal para auditoría.'
  },
  {
    id: 2,
    expediente: 'API-2025-200-0002',
    documento: 'Expediente de Personal',
    areaSolicitante: 'Recursos Humanos',
    tipoPrestamo: 'Consulta',
    medioEntrega: 'Correo electrónico',
    registroDevoluciones: 'Devuelto completo',
    usuario: 'María López',
    fechaPrestamo: '2025-07-20',
    fechaDevolucion: '2025-07-25',
    responsable: 'Lic. Ana Torres',
    estado: 'Devuelto',
    observaciones: 'Consulta de datos laborales.'
  },
  {
    id: 3,
    expediente: 'API-2025-300-0003',
    documento: 'Proyecto Estratégico',
    areaSolicitante: 'Planeación',
    tipoPrestamo: 'Digital',
    medioEntrega: 'Mensajería interna',
    registroDevoluciones: 'Sin incidencias',
    usuario: 'Carlos Ramírez',
    fechaPrestamo: '2025-08-02',
    fechaDevolucion: '2025-08-12',
    responsable: 'Ing. Sofía Méndez',
    estado: 'Activo',
    observaciones: 'Revisión para planeación anual.'
  },
  {
    id: 4,
    expediente: 'API-2025-400-0004',
    documento: 'Demanda Laboral',
    areaSolicitante: 'Jurídico',
    tipoPrestamo: 'Físico',
    medioEntrega: 'Personal',
    registroDevoluciones: 'Pendiente de devolución',
    usuario: 'Luis García',
    fechaPrestamo: '2025-07-28',
    fechaDevolucion: '2025-08-05',
    responsable: 'Lic. Ana Torres',
    estado: 'Vencido',
    observaciones: 'Pendiente de devolución.'
  },
  {
    id: 5,
    expediente: 'API-2025-500-0005',
    documento: 'Auditoría Interna',
    areaSolicitante: 'Contraloría',
    tipoPrestamo: 'Consulta',
    medioEntrega: 'Correo electrónico',
    registroDevoluciones: 'Devuelto completo',
    usuario: 'Patricia Ruiz',
    fechaPrestamo: '2025-07-15',
    fechaDevolucion: '2025-07-22',
    responsable: 'C.P. Mario Pérez',
    estado: 'Devuelto',
    observaciones: 'Auditoría fiscal anual.'
  }
];

const columnas = [
  { key: 'expediente', label: 'Núm. Expediente' },
  { key: 'documento', label: 'Documento' },
  { key: 'areaSolicitante', label: 'Área solicitante' },
  { key: 'tipoPrestamo', label: 'Tipo de préstamo' },
  { key: 'medioEntrega', label: 'Medio de entrega' },
  { key: 'registroDevoluciones', label: 'Registro de devoluciones' },
  { key: 'usuario', label: 'Solicitante' },
  { key: 'fechaPrestamo', label: 'Fecha Préstamo' },
  { key: 'fechaDevolucion', label: 'Fecha Devolución' },
  { key: 'responsable', label: 'Responsable' },
  { key: 'estado', label: 'Estado' },
  { key: 'observaciones', label: 'Observaciones' }
];

export default function PrestamosDocumentoPage() {
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [prestamos, setPrestamos] = useState(mockPrestamos);
  const [form, setForm] = useState({
    expediente: '',
    documento: '',
    areaSolicitante: '',
    tipoPrestamo: 'Físico',
    medioEntrega: 'Personal',
    registroDevoluciones: '',
    usuario: '',
    fechaPrestamo: '',
    fechaDevolucion: '',
    responsable: '',
    estado: 'Activo',
    observaciones: ''
  });

  return (
    <div className={`${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'} min-h-screen transition-colors`}>
      <div className="p-8">
        <DashboardHeader title="Préstamos documentales" darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />
        <div className="mt-4">
          <BackToHomeButton />
        </div>
      </div>
      <main className="w-screen mx-auto px-2 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="p-0 flex-1">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-2 flex items-center gap-2">
              Préstamos documentales (LEA-BCS)
            </h2>
            <ul className="text-gray-600 dark:text-gray-400 text-sm list-disc pl-5">
              <li>Registro de préstamos y devoluciones de expedientes/documentos</li>
              <li>Control de usuarios solicitantes y responsables</li>
              <li>Observancia de plazos y estados conforme a la ley</li>
            </ul>
          </div>
          <div className="flex flex-col items-end gap-4">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg transition-all"
              onClick={() => setShowModal(true)}
            >
              Nuevo préstamo
            </button>
          </div>
        </div>

        {/* Tabla de préstamos */}
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full">
            <thead>
              <tr>
                {columnas.map(col => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-left text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider align-middle whitespace-normal max-w-[220px] border-0 bg-transparent"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prestamos.map(prestamo => (
                <tr key={prestamo.id} className="transition-colors">
                  {columnas.map(col => (
                    <td
                      key={col.key}
                      className="px-6 py-3 text-base text-gray-800 dark:text-gray-100 align-top whitespace-pre-line max-w-[220px] break-words border-0 bg-transparent"
                      style={{ verticalAlign: 'top' }}
                    >
                      {prestamo[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de alta de préstamo */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-blue-200 dark:border-slate-700 relative">
              <button className="absolute top-4 right-4 text-2xl text-blue-700 dark:text-blue-200 hover:text-red-500" onClick={() => setShowModal(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-6 text-blue-900 dark:text-white">Registrar nuevo préstamo</h3>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                onSubmit={e => {
                  e.preventDefault();
                  setPrestamos(prev => [
                    ...prev,
                    {
                      id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                      ...form
                    }
                  ]);
                  setShowModal(false);
                  setForm({
                    expediente: '',
                    documento: '',
                    areaSolicitante: '',
                    tipoPrestamo: 'Físico',
                    medioEntrega: 'Personal',
                    registroDevoluciones: '',
                    usuario: '',
                    fechaPrestamo: '',
                    fechaDevolucion: '',
                    responsable: '',
                    estado: 'Activo',
                    observaciones: ''
                  });
                }}
              >
                <div>
                  <label className="block mb-2 font-semibold">Núm. Expediente *</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    placeholder="Ej: API-2025-100-0001"
                    required
                    value={form.expediente}
                    onChange={e => setForm(f => ({ ...f, expediente: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Documento *</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    placeholder="Nombre del documento"
                    required
                    value={form.documento}
                    onChange={e => setForm(f => ({ ...f, documento: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Área solicitante *</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    placeholder="Ej: Recursos Humanos"
                    required
                    value={form.areaSolicitante}
                    onChange={e => setForm(f => ({ ...f, areaSolicitante: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Usuario solicitante *</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    placeholder="Nombre completo"
                    required
                    value={form.usuario}
                    onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Tipo de préstamo *</label>
                  <select
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    required
                    value={form.tipoPrestamo}
                    onChange={e => setForm(f => ({ ...f, tipoPrestamo: e.target.value }))}
                  >
                    <option value="Físico">Físico</option>
                    <option value="Digital">Digital</option>
                    <option value="Consulta">Consulta</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Medio de entrega *</label>
                  <select
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    required
                    value={form.medioEntrega}
                    onChange={e => setForm(f => ({ ...f, medioEntrega: e.target.value }))}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Correo electrónico">Correo electrónico</option>
                    <option value="Mensajería interna">Mensajería interna</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Fecha de préstamo *</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    required
                    value={form.fechaPrestamo}
                    onChange={e => setForm(f => ({ ...f, fechaPrestamo: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Fecha de devolución *</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    required
                    value={form.fechaDevolucion}
                    onChange={e => setForm(f => ({ ...f, fechaDevolucion: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Responsable *</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    placeholder="Responsable del área"
                    required
                    value={form.responsable}
                    onChange={e => setForm(f => ({ ...f, responsable: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Estado *</label>
                  <select
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    required
                    value={form.estado}
                    onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Devuelto">Devuelto</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 font-semibold">Registro de devoluciones</label>
                  <textarea
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    rows={2}
                    placeholder="Detalle de devoluciones parciales o incidencias"
                    value={form.registroDevoluciones}
                    onChange={e => setForm(f => ({ ...f, registroDevoluciones: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 font-semibold">Observaciones</label>
                  <textarea
                    className="w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800"
                    rows={2}
                    placeholder="Detalles adicionales"
                    value={form.observaciones}
                    onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))}
                  />
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
          Control profesional de préstamos y devoluciones conforme a la Ley de Archivos del Estado de Baja California Sur (LEA-BCS).
        </div>
      </footer>
    </div>
  );
}
