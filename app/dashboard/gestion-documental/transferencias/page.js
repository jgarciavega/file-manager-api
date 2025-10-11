"use client";

import DashboardHeader from "@/components/DashboardHeader";
import BackToHomeButton from "@/components/BackToHomeButton";
import { useSession } from "next-auth/react";
import avatarMap from "@/lib/avatarMap";

import { useState } from "react";


export default function Transferencias() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const avatarUrl = email && avatarMap[email] ? avatarMap[email] : "/login.jpg";
  const [showHelp, setShowHelp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transferencias, setTransferencias] = useState([
    // Ejemplo inicial
    {
      id: 1,
      serie: "Contratos legales",
      subserie: "Convenios de colaboración",
      codigo: "LEG-02-01",
      descripcion: "Transferencia de convenios firmados en 2024",
      areaRemitente: "Jurídico",
      areaReceptora: "Archivo de concentración",
      responsableEntrega: "Lic. Juan Pérez",
      responsableRecepcion: "Arq. Ana López",
      fecha: "2025-09-17",
      soporte: "Físico",
      volumen: "2 cajas",
      estadoFisico: "Bueno",
      observaciones: "Ninguna",
      estatus: "Completada"
    }
  ]);
  const [form, setForm] = useState({
    serie: "",
    subserie: "",
    codigo: "",
    descripcion: "",
    areaRemitente: "",
    areaReceptora: "",
    responsableEntrega: "",
    responsableRecepcion: "",
    fecha: "",
    soporte: "",
    volumen: "",
    estadoFisico: "",
    observaciones: ""
  });
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Validación básica
    if (!form.serie || !form.codigo || !form.areaRemitente || !form.areaReceptora || !form.responsableEntrega || !form.responsableRecepcion || !form.fecha || !form.soporte) {
      setFormError("Todos los campos obligatorios deben ser llenados.");
      return;
    }
    setFormError("");
    setTransferencias([
      ...transferencias,
      {
        ...form,
        id: Date.now(),
        estatus: "Pendiente"
      }
    ]);
    setShowModal(false);
    setForm({
      serie: "",
      subserie: "",
      codigo: "",
      descripcion: "",
      areaRemitente: "",
      areaReceptora: "",
      responsableEntrega: "",
      responsableRecepcion: "",
      fecha: "",
      soporte: "",
      volumen: "",
      estadoFisico: "",
      observaciones: ""
    });
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#151a2c]">
      <DashboardHeader title="Transferencias" avatarUrl={avatarUrl} />
      <main className="p-6">
        <div className="mb-4">
          <BackToHomeButton />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100" title="Gestión de transferencias conforme a la Ley Estatal de Archivos de BCS">
          
          </h1>
          <button
            className="ml-2 p-1 rounded-full bg-gray-200 dark:bg-[#232b4a] hover:bg-blue-100 dark:hover:bg-[#25304d] border border-gray-300 dark:border-[#25304d] text-blue-700 dark:text-blue-200"
            title="¿Qué es una transferencia documental?"
            onClick={() => setShowHelp(true)}
            aria-label="Ayuda sobre transferencias"
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
                className="absolute top-2 right-2 text-gray-00 hover:text-gray-800"
                onClick={() => setShowHelp(false)}
                title="Cerrar ayuda"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-2 text-blue-900 dark:text-blue-200" title="Explicación de la transferencia documental conforme a la Ley Estatal de Archivos de BCS">¿Qué es una Transferencia Documental?</h2>
              <div className="text-gray-800 dark:text-gray-100 text-sm space-y-2">
                <p>
                  <strong>La transferencia documental</strong> es el proceso mediante el cual los documentos pasan del archivo de trámite al archivo de concentración o, posteriormente, al archivo histórico, conforme a los plazos y procedimientos establecidos en la Ley Estatal de Archivos de BCS.
                </p>
                <ul className="list-disc pl-5">
                  <li><strong>¿Para qué sirve?</strong> Permite asegurar la conservación, organización y resguardo adecuado de los documentos, garantizando su integridad, disponibilidad y consulta futura.</li>
                  <li><strong>¿Cuándo se realiza?</strong> Cuando los documentos han cumplido su vigencia administrativa y requieren ser resguardados por periodos mayores o definitivos, según el catálogo de disposición documental.</li>
                  <li><strong>¿Qué debe contener una transferencia?</strong> Relación detallada de los documentos transferidos (serie, subserie, código, descripción, fechas, volumen, soporte, estado físico), acta de transferencia firmada y registro de responsables y fecha de entrega/recepción.</li>
                  <li><strong>Importancia legal:</strong> Cumplir con la transferencia documental es obligatorio para todas las dependencias públicas y garantiza la transparencia, rendición de cuentas y protección del patrimonio documental.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {/* Botón para nueva transferencia */}
        <div className="mb-4 flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
            onClick={() => setShowModal(true)}
            title="Registrar una nueva transferencia documental"
          >
            Nueva Transferencia
          </button>
        </div>
        {/* Tabla de historial de transferencias */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border border-gray-400 bg-blue-200 dark:border-[#25304d] dark:bg-[#1a2036] border-collapse text-center">
            <thead className="bg-gray-400 dark:bg-[#232b4a]">
              <tr>
                <th className="px-2 py-2 border">Serie</th>
                <th className="px-2 py-2 border">Subserie</th>
                <th className="px-2 py-2 border">Código</th>
                <th className="px-2 py-2 border">Descripción</th>
                <th className="px-2 py-2 border">Área remitente</th>
                <th className="px-2 py-2 border">Área receptora</th>
                <th className="px-2 py-2 border">Responsable entrega</th>
                <th className="px-2 py-2 border">Responsable recepción</th>
                <th className="px-2 py-2 border">Fecha</th>
                <th className="px-2 py-2 border">Soporte</th>
                <th className="px-2 py-2 border">Volumen</th>
                <th className="px-2 py-2 border">Estado físico</th>
                <th className="px-2 py-2 border">Observaciones</th>
                <th className="px-2 py-2 border">Estatus</th>
              </tr>
            </thead>
            <tbody>
              {transferencias.map((t) => (
                <tr key={t.id} className="text-gray-900 dark:text-gray-100">
                  <td className="border px-2 py-1">{t.serie}</td>
                  <td className="border px-2 py-1">{t.subserie}</td>
                  <td className="border px-2 py-1">{t.codigo}</td>
                  <td className="border px-2 py-1">{t.descripcion}</td>
                  <td className="border px-2 py-1">{t.areaRemitente}</td>
                  <td className="border px-2 py-1">{t.areaReceptora}</td>
                  <td className="border px-2 py-1">{t.responsableEntrega}</td>
                  <td className="border px-2 py-1">{t.responsableRecepcion}</td>
                  <td className="border px-2 py-1">{t.fecha}</td>
                  <td className="border px-2 py-1">{t.soporte}</td>
                  <td className="border px-2 py-1">{t.volumen}</td>
                  <td className="border px-2 py-1">{t.estadoFisico}</td>
                  <td className="border px-2 py-1">{t.observaciones}</td>
                  <td className="border px-2 py-1">{t.estatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal para nueva transferencia */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#232b4a] p-8 rounded shadow-lg w-full max-w-2xl relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowModal(false)}
                title="Cerrar formulario de nueva transferencia"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100" title="Formulario para registrar una nueva transferencia documental">Registrar Nueva Transferencia</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-1 font-semibold">Serie documental*</label>
                  <input name="serie" value={form.serie} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: Contratos legales" required />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Subserie documental</label>
                  <input name="subserie" value={form.subserie} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: Convenios de colaboración" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Código*</label>
                  <input name="codigo" value={form.codigo} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: LEG-02-01" required />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Descripción</label>
                  <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" rows={2} placeholder="Breve descripción" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Área remitente*</label>
                  <input name="areaRemitente" value={form.areaRemitente} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: Jurídico" required />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Área receptora*</label>
                  <input name="areaReceptora" value={form.areaReceptora} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: Archivo de concentración" required />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Responsable de entrega*</label>
                  <input name="responsableEntrega" value={form.responsableEntrega} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Nombre completo" required />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Responsable de recepción*</label>
                  <input name="responsableRecepcion" value={form.responsableRecepcion} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Nombre completo" required />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Fecha de transferencia*</label>
                  <input name="fecha" type="date" value={form.fecha} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" required />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Soporte*</label>
                  <select name="soporte" value={form.soporte} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" required>
                    <option value="">Selecciona</option>
                    <option value="Físico">Físico</option>
                    <option value="Digital">Digital</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Volumen</label>
                  <input name="volumen" value={form.volumen} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Ej: 2 cajas, 5 carpetas" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Estado físico</label>
                  <input name="estadoFisico" value={form.estadoFisico} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" placeholder="Bueno, regular, etc." />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 font-semibold">Observaciones</label>
                  <textarea name="observaciones" value={form.observaciones} onChange={handleChange} className="w-full border rounded px-2 py-1 bg-white dark:bg-[#1a2036] text-gray-900 dark:text-gray-100" rows={2} placeholder="Observaciones adicionales" />
                </div>
                <div className="flex items-end md:col-span-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-4" title="Guardar la transferencia documental">
                    Guardar Transferencia
                  </button>
                </div>
                {formError && <div className="md:col-span-2 text-red-600 font-semibold mt-2">{formError}</div>}
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
