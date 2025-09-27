"use client";

import DashboardHeader from "@/components/DashboardHeader";
import BackToHomeButton from "@/components/BackToHomeButton";
import { useSession } from "next-auth/react";
import avatarMap from "@/lib/avatarMap";
import { useState } from "react";

export default function VersionesDocumentales() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const avatarUrl = email && avatarMap[email] ? avatarMap[email] : "/login.jpg";
  const [showHelp, setShowHelp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  // Ejemplo de historial de versiones
  const [versiones, setVersiones] = useState([
    {
      id: 1,
      documento: "Contrato de arrendamiento.pdf",
      version: "1.0",
      fecha: "2025-09-01",
      responsable: "Lic. Juan Pérez",
      motivo: "Versión original",
      vigente: false
    },
    {
      id: 2,
      documento: "Contrato de arrendamiento.pdf",
      version: "1.1",
      fecha: "2025-09-10",
      responsable: "Lic. Juan Pérez",
      motivo: "Corrección de cláusula 3",
      vigente: true
    }
  ]);
  const [form, setForm] = useState({
    documento: "",
    version: "",
    fecha: "",
    responsable: "",
    motivo: ""
  });
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.documento || !form.version || !form.fecha || !form.responsable || !form.motivo) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }
    setFormError("");
    setVersiones([
      ...versiones,
      {
        ...form,
        id: Date.now(),
        vigente: false
      }
    ]);
    setShowModal(false);
    setForm({ documento: "", version: "", fecha: "", responsable: "", motivo: "" });
  }

  function handleVerDetalle(version) {
    setSelectedVersion(version);
    setShowDetailModal(true);
  }

  function handleRestaurar(id) {
    setVersiones(versiones.map(v => ({ ...v, vigente: v.id === id })));
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#151a2c]">
      <DashboardHeader title="Versiones Documentales" avatarUrl={avatarUrl} />
      <main className="p-6">
        <div className="mb-4">
          <BackToHomeButton />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100" title="Control de versiones documentales conforme a la Ley Estatal de Archivos de BCS">
            Versiones Documentales
          </h1>
          <button
            className="ml-2 p-1 rounded-full bg-gray-200 dark:bg-[#232b4a] hover:bg-blue-100 dark:hover:bg-[#25304d] border border-gray-300 dark:border-[#25304d] text-blue-700 dark:text-blue-200"
            title="¿Qué es el control de versiones documentales?"
            onClick={() => setShowHelp(true)}
            aria-label="Ayuda sobre versiones documentales"
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
              <h2 className="text-lg font-bold mb-2 text-blue-900 dark:text-blue-200" title="Explicación del control de versiones documentales conforme a la Ley Estatal de Archivos de BCS">¿Qué es el control de versiones documentales?</h2>
              <div className="text-gray-800 dark:text-gray-100 text-sm space-y-2">
                <p>
                  <strong>El control de versiones documentales</strong> es el proceso que permite registrar, consultar y gestionar todas las modificaciones realizadas a un documento a lo largo de su ciclo de vida institucional.
                </p>
                <ul className="list-disc pl-5">
                  <li><strong>¿Para qué sirve?</strong> Garantiza la integridad, autenticidad y trazabilidad de los documentos, permitiendo recuperar versiones anteriores y cumplir con auditorías o revisiones legales.</li>
                  <li><strong>¿Qué debe contener?</strong> Registro de cada versión con fecha, responsable, motivo del cambio y vínculo a la versión anterior.</li>
                  <li><strong>Importancia legal:</strong> El control de versiones es obligatorio para asegurar la transparencia, la rendición de cuentas y la protección del patrimonio documental conforme a la Ley Estatal de Archivos de BCS.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {/* Botón para nueva versión */}
        <div className="mb-4 flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
            onClick={() => setShowModal(true)}
            title="Registrar una nueva versión documental"
          >
            Nueva Versión
          </button>
        </div>
        {/* Tabla de historial de versiones */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-400 bg-blue-200 dark:border-[#25304d] dark:bg-[#1a2036] border-collapse text-center">
            <thead className="bg-gray-400 dark:bg-[#232b4a]">
              <tr>
                <th className="px-2 py-2 border">Documento</th>
                <th className="px-2 py-2 border">Versión</th>
                <th className="px-2 py-2 border">Fecha</th>
                <th className="px-2 py-2 border">Responsable</th>
                <th className="px-2 py-2 border">Motivo</th>
                <th className="px-2 py-2 border">Vigente</th>
                <th className="px-2 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {versiones.map((v) => (
                <tr key={v.id} className="text-gray-900 dark:text-gray-100">
                  <td className="border px-2 py-1">{v.documento}</td>
                  <td className="border px-2 py-1">{v.version}</td>
                  <td className="border px-2 py-1">{v.fecha}</td>
                  <td className="border px-2 py-1">{v.responsable}</td>
                  <td className="border px-2 py-1">{v.motivo}</td>
                  <td className="border px-2 py-1">{v.vigente ? "Sí" : "No"}</td>
                  <td className="border px-2 py-1">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Ver detalles de la versión"
                        className="text-blue-600 hover:text-blue-800 p-1"
                        onClick={() => handleVerDetalle(v)}
                        aria-label="Ver detalles"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        title="Restaurar esta versión como vigente"
                        className="text-green-600 hover:text-green-800 p-1"
                        onClick={() => handleRestaurar(v.id)}
                        aria-label="Restaurar versión"
                        type="button"
                        disabled={v.vigente}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15M19.5 4.5v6.75a2.25 2.25 0 01-2.25 2.25H10.5" />
                        </svg>
                      </button>
                      <button
                        title="Descargar versión"
                        className="text-gray-600 hover:text-gray-900 p-1"
                        onClick={() => alert('Funcionalidad pendiente: descarga de versión')}
                        aria-label="Descargar versión"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-3-3m3 3l3-3m-6 5.25V19.5A2.25 2.25 0 0012 21.75h0a2.25 2.25 0 002.25-2.25v-1.25" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal para nueva versión */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#232b4a] p-8 rounded shadow-lg w-full max-w-2xl relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowModal(false)}
                title="Cerrar formulario de nueva versión documental"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100" title="Formulario para registrar una nueva versión documental">Registrar Nueva Versión</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-1 font-semibold">Documento*</label>
                  <input name="documento" value={form.documento} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: Contrato de arrendamiento.pdf" required />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Versión*</label>
                  <input name="version" value={form.version} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: 1.1" required />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Fecha*</label>
                  <input name="fecha" type="date" value={form.fecha} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" required />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Responsable*</label>
                  <input name="responsable" value={form.responsable} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Nombre completo" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 font-semibold">Motivo del cambio*</label>
                  <textarea name="motivo" value={form.motivo} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" rows={2} placeholder="Describe el motivo de la nueva versión" required />
                </div>
                <div className="flex items-end md:col-span-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-4" title="Guardar la versión documental">
                    Guardar Versión
                  </button>
                </div>
                {formError && <div className="md:col-span-2 text-red-600 font-semibold mt-2">{formError}</div>}
              </form>
            </div>
          </div>
        )}
        {/* Modal para ver detalles de la versión */}
        {showDetailModal && selectedVersion && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#232b4a] p-8 rounded shadow-lg w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowDetailModal(false)}
                title="Cerrar detalles de la versión documental"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100" title="Detalles completos de la versión documental">Detalles de la Versión Documental</h2>
              <div className="space-y-2 text-gray-900 dark:text-gray-100">
                <div title="Nombre del documento"><strong>Documento:</strong> {selectedVersion.documento}</div>
                <div title="Versión del documento"><strong>Versión:</strong> {selectedVersion.version}</div>
                <div title="Fecha de la versión"><strong>Fecha:</strong> {selectedVersion.fecha}</div>
                <div title="Responsable de la versión"><strong>Responsable:</strong> {selectedVersion.responsable}</div>
                <div title="Motivo del cambio"><strong>Motivo:</strong> {selectedVersion.motivo}</div>
                <div title="¿Es la versión vigente?"><strong>Vigente:</strong> {selectedVersion.vigente ? "Sí" : "No"}</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
