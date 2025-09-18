"use client";

import DashboardHeader from "../../components/DashboardHeader";
import BackToHomeButton from "../../../../components/BackToHomeButton";
import { useSession } from "next-auth/react";
import avatarMap from "../../../../lib/avatarMap";
import { useState } from "react";

export default function SubseriesDocumentales() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const avatarUrl = email && avatarMap[email] ? avatarMap[email] : "/login.jpg";
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSubserie, setSelectedSubserie] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  // Ejemplos ficticios

  const subseries = [
    {
      id: 1,
      codigo: "ADM-01-01",
      nombre: "Oficios recibidos",
      descripcion: "Oficios de trámite recibidos por la dependencia",
      serie: "Correspondencia recibida",
      area: "Archivo de trámite",
      vigencia: "3 años",
      soporte: "Físico",
      clasificacion: "Administrativa",
      disposicion: "Conservación",
      estatus: "Activa",
    },
    {
      id: 2,
      codigo: "LEG-02-01",
      nombre: "Convenios de colaboración",
      descripcion: "Convenios firmados con otras instituciones",
      serie: "Contratos legales",
      area: "Jurídico",
      vigencia: "8 años",
      soporte: "Digital",
      clasificacion: "Legal",
      disposicion: "Transferencia",
      estatus: "Activa",
    },
    {
      id: 3,
      codigo: "FIS-03-01",
      nombre: "Facturas electrónicas",
      descripcion: "Facturas emitidas en formato digital",
      serie: "Facturación",
      area: "Finanzas",
      vigencia: "6 años",
      soporte: "Digital",
      clasificacion: "Fiscal",
      disposicion: "Baja",
      estatus: "Inactiva",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#151a2c]">
      <DashboardHeader title="Subseries Documentales" avatarUrl={avatarUrl} />
      <main className="p-6">
        <div className="mb-4">
          <BackToHomeButton />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100" title="Gestión de subseries documentales conforme a la Ley Estatal de Archivos de BCS">
            Subseries Documentales
          </h1>
          <button
            className="ml-2 p-1 rounded-full bg-gray-200 dark:bg-[#232b4a] hover:bg-blue-100 dark:hover:bg-[#25304d] border border-gray-300 dark:border-[#25304d] text-blue-700 dark:text-blue-200"
            title="¿Cuál es la diferencia entre series y subseries documentales?"
            onClick={() => setShowHelp(true)}
            aria-label="Ayuda sobre subseries documentales"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
          </button>
        </div>
        {/* Modal de ayuda contextual */}
        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#232b4a] p-6 rounded shadow-lg w-full max-w-lg relative border border-blue-200 dark:border-blue-900">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowHelp(false)}
                title="Cerrar ayuda"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-2 text-blue-900 dark:text-blue-200">¿Diferencia entre Series y Subseries Documentales?</h2>
              <div className="text-gray-800 dark:text-gray-100 text-sm space-y-2">
                <p><strong>Serie documental:</strong> Conjunto de documentos agrupados por un mismo trámite, función o actividad. Ejemplo: <em>Contratos legales</em>.</p>
                <p><strong>Subserie documental:</strong> Subdivisión de una serie, con documentos de características o trámites específicos. Ejemplo: <em>Convenios de colaboración</em> dentro de <em>Contratos legales</em>.</p>
                <ul className="list-disc pl-5">
                  <li><strong>Serie</strong>: Organización general y control global.</li>
                  <li><strong>Subserie</strong>: Organización detallada y control específico.</li>
                </ul>
                <p className="mt-2"><strong>Utilidad:</strong> Facilitan el cumplimiento normativo, la búsqueda y la disposición final de los documentos conforme a la Ley Estatal de Archivos de BCS.</p>
              </div>
            </div>
          </div>
        )}
        {/* Botón para nueva subserie */}
        <div className="mb-4 flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
            onClick={() => setShowModal(true)}
            title="Registrar una nueva subserie documental"
          >
            Nueva Subserie Documental
          </button>
        </div>
        {/* Filtros de búsqueda */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100" placeholder="Buscar por nombre o código" title="Filtrar por nombre o código de la subserie" />
          <input className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100" placeholder="Serie documental" title="Filtrar por serie documental" />
          <input className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100" placeholder="Área responsable" title="Filtrar por área responsable" />
          <select className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100" title="Filtrar por soporte">
            <option value="">Soporte</option>
            <option value="Físico">Físico</option>
            <option value="Digital">Digital</option>
            <option value="Mixto">Mixto</option>
          </select>
        </div>
        {/* Tabla de subseries documentales */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-400 bg-blue-200 dark:border-[#25304d] dark:bg-[#1a2036] border-collapse text-center">
            <thead className="bg-gray-400 dark:bg-[#232b4a]">
              <tr>
                <th className="px-2 py-2 border" title="Código de la subserie documental">Código</th>
                <th className="px-2 py-2 border" title="Nombre de la subserie documental">Nombre</th>
                <th className="px-2 py-2 border" title="Descripción de la subserie documental">Descripción</th>
                <th className="px-2 py-2 border" title="Serie documental a la que pertenece">Serie</th>
                <th className="px-2 py-2 border" title="Área responsable de la subserie">Área</th>
                <th className="px-2 py-2 border" title="Vigencia documental conforme a la ley">Vigencia</th>
                <th className="px-2 py-2 border" title="Soporte documental">Soporte</th>
                <th className="px-2 py-2 border" title="Clasificación legal">Clasificación</th>
                <th className="px-2 py-2 border" title="Disposición final según la ley">Disposición Final</th>
                <th className="px-2 py-2 border" title="Estatus de la subserie">Estatus</th>
                <th className="px-2 py-2 border" title="Acciones disponibles">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subseries.map((s) => (
                <tr key={s.id} className="text-gray-900 dark:text-gray-100">
                  <td className="border px-2 py-1">{s.codigo}</td>
                  <td className="border px-2 py-1">{s.nombre}</td>
                  <td className="border px-2 py-1">{s.descripcion}</td>
                  <td className="border px-2 py-1">{s.serie}</td>
                  <td className="border px-2 py-1">{s.area}</td>
                  <td className="border px-2 py-1">{s.vigencia}</td>
                  <td className="border px-2 py-1">{s.soporte}</td>
                  <td className="border px-2 py-1">{s.clasificacion}</td>
                  <td className="border px-2 py-1">{s.disposicion}</td>
                  <td className="border px-2 py-1">{s.estatus}</td>
                  <td className="border px-2 py-1">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Ver detalles de la subserie"
                        className="text-blue-600 hover:text-blue-800 p-1"
                        onClick={() => { setSelectedSubserie(s); setShowDetailModal(true); }}
                        aria-label="Ver detalles"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        title="Editar subserie documental"
                        className="text-yellow-600 hover:text-yellow-800 p-1"
                        onClick={() => alert('Funcionalidad pendiente: editar subserie')}
                        aria-label="Editar subserie"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.212l-4.5 1.318 1.318-4.5 12.544-12.543z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal para nueva subserie */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#232b4a] p-8 rounded shadow-lg w-full max-w-2xl relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowModal(false)}
                title="Cerrar formulario de nueva subserie documental"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100" title="Formulario para registrar una nueva subserie documental">Registrar Nueva Subserie Documental</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold" title="Clave única que identifica la subserie documental en el catálogo institucional.">Código</label>
                  <input className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: ADM-01-01" title="Clave única de la subserie documental" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold" title="Nombre oficial que describe la agrupación documental específica.">Nombre</label>
                  <input className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: Oficios recibidos" title="Nombre de la subserie documental" />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 font-semibold" title="Descripción general del contenido y propósito de la subserie documental.">Descripción</label>
                  <textarea className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" rows={2} placeholder="Breve descripción" title="Descripción de la subserie documental" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold" title="Serie documental a la que pertenece esta subserie.">Serie documental</label>
                  <input className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: Correspondencia recibida" title="Serie documental relacionada" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold" title="Área o unidad administrativa responsable de la gestión de la subserie.">Área responsable</label>
                  <input className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: Archivo de trámite" title="Área responsable de la subserie" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold" title="Tiempo durante el cual la subserie debe conservarse según la normatividad.">Vigencia</label>
                  <input className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: 3 años" title="Vigencia documental" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold" title="Tipo de soporte en el que se resguarda la subserie: físico, digital o mixto.">Soporte</label>
                  <select className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" title="Selecciona el tipo de soporte documental">
                    <option value="">Selecciona</option>
                    <option value="Físico">Físico</option>
                    <option value="Digital">Digital</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold" title="Clasificación legal o administrativa de la subserie documental.">Clasificación</label>
                  <select className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" title="Selecciona la clasificación legal o administrativa">
                    <option value="">Selecciona</option>
                    <option value="Administrativa">Administrativa</option>
                    <option value="Legal">Legal</option>
                    <option value="Fiscal">Fiscal</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold" title="Destino final de la subserie documental conforme a la Ley Estatal de Archivos.">Disposición final</label>
                  <select className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" title="Selecciona la disposición final conforme a la ley">
                    <option value="">Selecciona</option>
                    <option value="Conservación">Conservación</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold" title="Estatus actual de la subserie documental en el sistema.">Estatus</label>
                  <select className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" title="Selecciona el estatus actual de la subserie">
                    <option value="">Selecciona</option>
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>
                <div className="flex items-end md:col-span-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-4" title="Guardar la subserie documental en el sistema">
                    Guardar Subserie
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal para ver detalles de la subserie */}
        {showDetailModal && selectedSubserie && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#232b4a] p-8 rounded shadow-lg w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowDetailModal(false)}
                title="Cerrar detalles de la subserie documental"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100" title="Detalles completos de la subserie documental">Detalles de la Subserie Documental</h2>
              <div className="space-y-2 text-gray-900 dark:text-gray-100">
                <div title="Código de la subserie documental"><strong>Código:</strong> {selectedSubserie.codigo}</div>
                <div title="Nombre de la subserie documental"><strong>Nombre:</strong> {selectedSubserie.nombre}</div>
                <div title="Descripción de la subserie documental"><strong>Descripción:</strong> {selectedSubserie.descripcion}</div>
                <div title="Serie documental a la que pertenece"><strong>Serie:</strong> {selectedSubserie.serie}</div>
                <div title="Área responsable de la subserie"><strong>Área responsable:</strong> {selectedSubserie.area}</div>
                <div title="Vigencia documental"><strong>Vigencia:</strong> {selectedSubserie.vigencia}</div>
                <div title="Soporte documental"><strong>Soporte:</strong> {selectedSubserie.soporte}</div>
                <div title="Clasificación legal"><strong>Clasificación:</strong> {selectedSubserie.clasificacion}</div>
                <div title="Disposición final"><strong>Disposición final:</strong> {selectedSubserie.disposicion}</div>
                <div title="Estatus de la subserie"><strong>Estatus:</strong> {selectedSubserie.estatus}</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
