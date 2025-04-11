"use client";
import React from "react";

export default function AdminHome() {
  const resumen = {
    total: 128,
    revision: 15,
    aprobados: 97,
    rechazados: 16,
  };

  const ultimosDocumentos = [
    {
      folio: "DOC-001",
      nombre: "Informe Trimestral",
      clasificacion: "Informe",
      fecha: "2025-04-09",
      estado: "Aprobado",
    },
    {
      folio: "DOC-002",
      nombre: "Oficio Externo",
      clasificacion: "Oficio",
      fecha: "2025-04-09",
      estado: "En revisión",
    },
    {
      folio: "DOC-003",
      nombre: "Circular Interna",
      clasificacion: "Circular",
      fecha: "2025-04-08",
      estado: "Rechazado",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Título */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Panel del Administrador
        </h1>
        <p className="text-base text-gray-700 dark:text-gray-400">
          Bienvenido al sistema de gestión documental.
        </p>
      </div>

      {/* Tarjetas con bordes fuertes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total de Documentos",
            value: resumen.total,
            color: "text-blue-500",
          },
          {
            label: "En Revisión",
            value: resumen.revision,
            color: "text-yellow-500",
          },
          {
            label: "Aprobados",
            value: resumen.aprobados,
            color: "text-green-500",
          },
          {
            label: "Rechazados",
            value: resumen.rechazados,
            color: "text-red-500",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#1f2937] border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-6 shadow-md transition"
          >
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {card.label}
            </h3>
            <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tabla con bordes visibles */}
      <div className="bg-white dark:bg-[#1f2937] border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Últimos Documentos Subidos
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th className="px-4 py-2 rounded-l-lg">Folio</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Clasificación</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2 rounded-r-lg">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ultimosDocumentos.map((doc, idx) => (
                <tr
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                >
                  <td className="px-4 py-2">{doc.folio}</td>
                  <td className="px-4 py-2">{doc.nombre}</td>
                  <td className="px-4 py-2">{doc.clasificacion}</td>
                  <td className="px-4 py-2">{doc.fecha}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      doc.estado === "Aprobado"
                        ? "text-green-500"
                        : doc.estado === "En revisión"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {doc.estado}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
