"use client";

import BackToHomeButton from "@/components/BackToHomeButton";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/DashboardHeader";
import avatarMap from "@/lib/avatarMap";
import { useState } from "react";

export default function PrestamosDocumento() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const avatarUrl = email && avatarMap[email] ? avatarMap[email] : "/login.jpg";
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);

  // Ejemplos ficticios
  const prestamos = [
    {
      id: 1,
      documento: "Acta de nacimiento",
      solicitante: "Juan Pérez",
      fechaPrestamo: "2025-09-10",
      fechaDevolucion: "2025-09-17",
      estado: "Prestado",
      observaciones: "Urgente",
    },
    {
      id: 2,
      documento: "Expediente 2023-01",
      solicitante: "María López",
      fechaPrestamo: "2025-08-20",
      fechaDevolucion: "2025-09-05",
      estado: "Devuelto",
      observaciones: "Sin observaciones",
    },
    {
      id: 3,
      documento: "Contrato arrendamiento",
      solicitante: "Luis García",
      fechaPrestamo: "2025-09-01",
      fechaDevolucion: "2025-09-15",
      estado: "Vencido",
      observaciones: "Pendiente devolución",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#151a2c]">
      <DashboardHeader title="Préstamos de Documento" avatarUrl={avatarUrl} />
      <main className="p-6">
        <div className="mb-2">
          <span title="Volver al inicio del módulo">
            <BackToHomeButton />
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" title="Gestión de préstamos de documentos conforme a la Ley Estatal de Archivos de BCS">
          Préstamos de Documento
        </h1>
        {/* Botón para nuevo préstamo */}
        <div className="mb-4 flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
            onClick={() => setShowModal(true)}
            title="Registrar un nuevo préstamo de documento"
          >
            Nuevo Préstamo
          </button>
        </div>
        {/* Filtros de búsqueda */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100"
            placeholder="Buscar por documento o expediente"
            title="Filtrar por nombre de documento o expediente"
          />
          <input
            className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100"
            placeholder="Solicitante"
            title="Filtrar por nombre del solicitante"
          />
          <select
            className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100"
            title="Filtrar por estado del préstamo"
          >
            <option value="">Estado</option>
            <option value="prestado">Prestado</option>
            <option value="devuelto">Devuelto</option>
            <option value="vencido">Vencido</option>
          </select>
          <input
            type="date"
            className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100"
            placeholder="Fecha préstamo"
            title="Filtrar por fecha de préstamo"
          />
          <input
            type="date"
            className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100"
            placeholder="Fecha devolución"
            title="Filtrar por fecha de devolución"
          />
        </div>
        {/* Tabla de préstamos */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-900 bg-blue-200 dark:border-[#25304d] dark:bg-[#1a2036] border-collapse text-center">
            <thead className="bg-gray-400 dark:bg-[#111e52]">
              <tr>
                <th className="px-4 py-2 border" title="Identificador único del préstamo">ID</th>
                <th className="px-4 py-2 border" title="Nombre del documento o expediente prestado">Documento/Expediente</th>
                <th className="px-4 py-2 border" title="Nombre del solicitante del préstamo">Solicitante</th>
                <th className="px-4 py-2 border" title="Fecha en que se realizó el préstamo">Fecha Préstamo</th>
                <th className="px-4 py-2 border" title="Fecha en que debe devolverse el documento">Fecha Devolución</th>
                <th className="px-4 py-2 border" title="Estado actual del préstamo">Estado</th>
                <th className="px-4 py-2 border" title="Observaciones relevantes sobre el préstamo">Observaciones</th>
                <th className="px-4 py-2 border" title="Acciones disponibles para el préstamo">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((p) => (
                <tr key={p.id} className="text-gray-900 dark:text-gray-100">
                  <td className="border px-2 py-1">{p.id}</td>
                  <td className="border px-2 py-1">{p.documento}</td>
                  <td className="border px-2 py-1">{p.solicitante}</td>
                  <td className="border px-2 py-1">{p.fechaPrestamo}</td>
                  <td className="border px-2 py-1">{p.fechaDevolucion}</td>
                  <td className="border px-2 py-1">{p.estado}</td>
                  <td className="border px-2 py-1">{p.observaciones}</td>
                  <td className="border px-2 py-1">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Ver detalles del préstamo"
                        className="text-blue-600 hover:text-blue-800 p-1"
                        onClick={() => { setSelectedPrestamo(p); setShowDetailModal(true); }}
                        aria-label="Ver detalles"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      {p.estado !== "Devuelto" && (
                        <button
                          title="Marcar como devuelto"
                          className="text-green-600 hover:text-green-800 p-1"
                          onClick={() => alert('Funcionalidad pendiente: marcar como devuelto')}
                          aria-label="Marcar como devuelto"
                          type="button"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal para nuevo préstamo */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#232b4a] p-8 rounded shadow-lg w-full max-w-2xl relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowModal(false)}
                title="Cerrar formulario de nuevo préstamo"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100" title="Formulario para registrar un nuevo préstamo de documento">Registrar Nuevo Préstamo</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Documento/Expediente</span>
                  <label className="block mb-1" title="Documento o expediente a prestar">Nombre</label>
                  <input className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" title="Nombre del documento o expediente" placeholder="Ej: Acta, Expediente" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Solicitante</span>
                  <label className="block mb-1" title="Nombre del solicitante">Nombre</label>
                  <input className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" title="Nombre del solicitante" placeholder="Ej: Juan Pérez" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Fecha de Préstamo</span>
                  <label className="block mb-1" title="Fecha en que se realiza el préstamo">Fecha</label>
                  <input type="date" className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" title="Selecciona la fecha de préstamo" placeholder="Fecha" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Fecha de Devolución</span>
                  <label className="block mb-1" title="Fecha en que debe devolverse el documento">Fecha</label>
                  <input type="date" className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" title="Selecciona la fecha de devolución" placeholder="Fecha" />
                </div>
                <div className="md:col-span-2">
                  <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Observaciones</span>
                  <label className="block mb-1" title="Observaciones adicionales sobre el préstamo">Detalles</label>
                  <textarea className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" rows={2} title="Agrega observaciones relevantes" placeholder="Opcional" />
                </div>
                <div className="flex items-end md:col-span-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-4" title="Guardar el nuevo préstamo">
                    Guardar Préstamo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal para ver detalles del préstamo */}
        {showDetailModal && selectedPrestamo && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#232b4a] p-8 rounded shadow-lg w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowDetailModal(false)}
                title="Cerrar detalles"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Detalles del Préstamo</h2>
              <div className="space-y-2 text-gray-900 dark:text-gray-100">
                <div><strong>ID:</strong> {selectedPrestamo.id}</div>
                <div><strong>Documento/Expediente:</strong> {selectedPrestamo.documento}</div>
                <div><strong>Solicitante:</strong> {selectedPrestamo.solicitante}</div>
                <div><strong>Fecha de Préstamo:</strong> {selectedPrestamo.fechaPrestamo}</div>
                <div><strong>Fecha de Devolución:</strong> {selectedPrestamo.fechaDevolucion}</div>
                <div><strong>Estado:</strong> {selectedPrestamo.estado}</div>
                <div><strong>Observaciones:</strong> {selectedPrestamo.observaciones}</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
