

'use client';
import { useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import BackToHomeButton from '../../../../components/BackToHomeButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPlus } from '@fortawesome/free-solid-svg-icons';

const mockExpedientes = [
  {
    numero: 'API-2025-100-0001',
    nombre: 'Expediente de Contratos',
    serie: 'Contratos',
    subserie: 'Arrendamientos',
    valor: 'Legal',
    plazo: '5 años',
    destino: 'Conservación Permanente',
    soporte: 'Original Digital',
    estado: 'Activo',
  },
  {
    numero: 'API-2025-200-0002',
    nombre: 'Expediente de Personal',
    serie: 'Recursos Humanos',
    subserie: 'Expedientes de empleados',
    valor: 'Administrativo',
    plazo: '10 años',
    destino: 'Baja Documental',
    soporte: 'Original Físico',
    estado: 'Cerrado',
  },
  {
    numero: 'API-2025-300-0003',
    nombre: 'Expediente de Proyectos',
    serie: 'Planeación',
    subserie: 'Proyectos estratégicos',
    valor: 'Administrativo',
    plazo: '3 años',
    destino: 'Transferencia a Archivo Histórico',
    soporte: 'Digitalización de Original Físico',
    estado: 'En revisión',
  },
  {
    numero: 'API-2025-400-0004',
    nombre: 'Expediente Jurídico',
    serie: 'Jurídico',
    subserie: 'Demandas',
    valor: 'Legal',
    plazo: '15 años',
    destino: 'Conservación Permanente',
    soporte: 'Original Físico',
    estado: 'Activo',
  },
  {
    numero: 'API-2025-500-0005',
    nombre: 'Expediente de Auditoría',
    serie: 'Contraloría',
    subserie: 'Auditorías internas',
    valor: 'Fiscal',
    plazo: '10 años',
    destino: 'Baja Documental',
    soporte: 'Original Digital',
    estado: 'Cerrado',
  },
  // --- Ejemplos adicionales ---
  {
    numero: 'API-2025-600-0006',
    nombre: 'Expediente de Licitaciones',
    serie: 'Adquisiciones',
    subserie: 'Licitaciones públicas',
    valor: 'Legal',
    plazo: '6 años',
    destino: 'Transferencia a Archivo Histórico',
    soporte: 'Original Físico',
    estado: 'Activo',
  },
  {
    numero: 'API-2025-700-0007',
    nombre: 'Expediente de Correspondencia',
    serie: 'Comunicación Social',
    subserie: 'Correspondencia recibida',
    valor: 'Administrativo',
    plazo: '2 años',
    destino: 'Baja Documental',
    soporte: 'Digitalización de Original Físico',
    estado: 'Cerrado',
  },
  {
    numero: 'API-2025-800-0008',
    nombre: 'Expediente de Proveedores',
    serie: 'Finanzas',
    subserie: 'Contratos con proveedores',
    valor: 'Fiscal',
    plazo: '5 años',
    destino: 'Conservación Permanente',
    soporte: 'Original Digital',
    estado: 'En revisión',
  },
];

const columnas = [
  { key: 'numero', label: 'Núm. Expediente', tooltip: 'Clave única generada conforme a la LEA-BCS' },
  { key: 'nombre', label: 'Nombre', tooltip: 'Nombre descriptivo del expediente' },
  { key: 'serie', label: 'Serie', tooltip: 'Serie documental (LEA-BCS)' },
  { key: 'subserie', label: 'Subserie', tooltip: 'Subserie documental (LEA-BCS)' },
  { key: 'valor', label: 'Valor', tooltip: 'Valor documental (Administrativo, Legal, Fiscal, Histórico)' },
  { key: 'plazo', label: 'Plazo', tooltip: 'Plazo de conservación' },
  { key: 'destino', label: 'Destino', tooltip: 'Destino final según LEA-BCS' },
  { key: 'soporte', label: 'Soporte', tooltip: 'Soporte documental (físico/digital)' },
  { key: 'estado', label: 'Estado', tooltip: 'Estado actual del expediente' },
];

export default function ExpedientesPage() {
  const [darkMode, setDarkMode] = useState(false);


  return (
    <div className={`${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'} min-h-screen transition-colors`}>
      <div className="p-8">
        <DashboardHeader title="Expedientes" darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />
        <div className="mt-4">
          <BackToHomeButton />
        </div>
      </div>
      <main className="w-screen mx-auto px-2 md:px-8 py-8">
        {/* Tarjeta resumen y acción */}
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8`}>
          <div className="p-0 flex-1">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleInfo} className="text-blue-400 dark:text-blue-200" />
              Expedientes (LEA-BCS)
            </h2>
            <ul className="text-gray-600 dark:text-gray-400 text-sm list-disc pl-5">
              <li>Clave única, serie y subserie documental</li>
              <li>Valor documental, plazo de conservación y destino final</li>
              <li>Soporte documental y estado</li>
            </ul>
          </div>
          <div className="flex flex-col items-end gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg transition-all">
              <FontAwesomeIcon icon={faPlus} className="text-xl" />
              Nuevo expediente
            </button>
          </div>
        </div>

        {/* Tabla de expedientes */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                {columnas.map(col => (
                  <th key={col.key} className="px-4 py-3 text-left text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider group relative border-0 bg-transparent">
                    <span>{col.label}</span>
                    <span className="ml-1 cursor-pointer group-hover:opacity-100 opacity-90 transition-opacity" title={col.tooltip}>
                      <FontAwesomeIcon icon={faCircleInfo} className="text-blue-400 dark:text-blue-200 text-xs" />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockExpedientes.map(exp => (
                <tr key={exp.numero} className="transition-colors">
                  {columnas.map(col => (
                    <td key={col.key} className="px-4 py-3 text-base text-gray-800 dark:text-gray-100 whitespace-nowrap border-0 bg-transparent">
                      {exp[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {/* Leyenda informativa al pie, más abajo */}
      <div className="h-16" />
      <footer className="max-w-7xl mx-auto px-4 pb-12 mt-16">
        <div className="p-0 text-blue-900 dark:text-blue-100 text-sm">
          Gestión profesional de expedientes conforme a la Ley de Archivos del Estado de Baja California Sur (LEA-BCS). Aquí puedes consultar, crear y administrar expedientes con todos los metadatos archivísticos requeridos.
        </div>
      </footer>
    </div>
  );
}
