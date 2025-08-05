
"use client";
import BackToHomeButton from "../../../components/BackToHomeButton";
import Image from "next/image";
import DarkModeToggle from "../../admin/components/DarkModeToggle";

export default function SubseriesDocumentalesPage() {
  // Avatar fijo: blanca.jpeg
  const avatarSrc = "/blanca.jpeg";
  const userName = "Blanca Ramírez";
  const userEmail = "blanca@apibcs.com.mx";
  return (
    <div className="p-0 md:p-0 w-full dark:bg-slate-900 min-h-screen">
      {/* Header institucional */}
      <div className="flex items-center justify-between bg-white border-b border-blue-100 px-8 py-10 rounded-t-2xl shadow-sm w-full dark:bg-slate-800 dark:border-slate-700" style={{ minHeight: '180px' }}>
        {/* Logo pegado a la izquierda */}
        <div className="flex items-center" style={{ marginLeft: 0, paddingLeft: 0 }}>
          <Image src="/api-dark23.png" alt="Logo institucional" width={350} height={120} className="object-contain" style={{ marginLeft: 0, paddingLeft: 0 }} />
        </div>
        {/* Espacio entre logo y título */}
        <div style={{ flex: 0.2 }} />
        {/* Título */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{
              letterSpacing: '1px',
              background: 'linear-gradient(90deg, #3a5ba0 0%, #4f8edc 50%, #7ec8e3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              filter: 'drop-shadow(0 1px 2px #1e293b33)'
            }}
          >
            Subseries documentales
          </h1>
        </div>
        {/* Espacio entre título y avatar */}
        <div style={{ flex: .2 }} />
        {/* Avatar y DarkModeToggle (icono a la derecha del avatar, avatar primero) */}
        <div className="flex flex-col items-center" style={{ minWidth: 80 }}>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <Image src={avatarSrc} alt="Avatar" width={100} height={100} className="rounded-full border-2 border-blue-200 object-cover dark:border-slate-500" />
          </div>
          <span className="text-blue-900 font-semibold text-lg mt-2 dark:text-white">{userName}</span>
          <span className="text-blue-700 text-base dark:text-slate-300">{userEmail}</span>
        </div>
      </div>
      {/* Botón volver al inicio alineado abajo a la izquierda */}
      <div className="flex items-left mt-40 mb-2 mx-8">
        <BackToHomeButton />
      </div>
      {/* Acciones y contenido bajado */}
      <div className="flex justify-end items-center mb-4 mx-8 mt-2">
        <button
          className="bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow transition-all duration-200 dark:bg-slate-700 dark:text-white text-xl"
          style={{
            background: 'linear-gradient(90deg, #3a5ba0 0%, #4f8edc 100%)',
            border: 'none',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #4f8edc 0%, #3a5ba0 100%)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #3a5ba0 0%, #4f8edc 100%)';
          }}
        >
          + Nueva subserie documental
        </button>
      </div>
      {/* Tabla de subseries documentales */}
      <div className="overflow-x-auto bg-white rounded-3xl shadow border border-blue-100 mx-8 mt-2 dark:bg-slate-800 dark:border-slate-700">
        <table className="min-w-full divide-y divide-blue-100 text-lg dark:divide-slate-700">
          <thead className="bg-blue-50 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-base font-semibold text-blue-700 uppercase tracking-wider dark:text-slate-200">Clave</th>
              <th className="px-4 py-3 text-left text-base font-semibold text-blue-700 uppercase tracking-wider dark:text-slate-200">Nombre</th>
              <th className="px-4 py-3 text-left text-base font-semibold text-blue-700 uppercase tracking-wider dark:text-slate-200">Descripción</th>
              <th className="px-4 py-3 text-left text-base font-semibold text-blue-700 uppercase tracking-wider dark:text-slate-200">Serie documental</th>
              <th className="px-4 py-3 text-left text-base font-semibold text-blue-700 uppercase tracking-wider dark:text-slate-200">Área responsable</th>
              <th className="px-4 py-3 text-left text-base font-semibold text-blue-700 uppercase tracking-wider dark:text-slate-200">Vigencia</th>
              <th className="px-4 py-3 text-left text-base font-semibold text-blue-700 uppercase tracking-wider dark:text-slate-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Aquí irán los registros de subseries documentales */}
            <tr className="dark:hover:bg-slate-700">
              <td className="px-4 py-3 text-blue-900 text-lg dark:text-slate-100">SSD-001</td>
              <td className="px-4 py-3 text-blue-900 text-lg dark:text-slate-100">Subserie ejemplo</td>
              <td className="px-4 py-3 text-blue-900 text-lg dark:text-slate-100">Descripción de la subserie documental.</td>
              <td className="px-4 py-3 text-blue-900 text-lg dark:text-slate-100">Serie ejemplo</td>
              <td className="px-4 py-3 text-blue-900 text-lg dark:text-slate-100">Dirección General</td>
              <td className="px-4 py-3 text-blue-900 text-lg dark:text-slate-100">3 años</td>
              <td className="px-4 py-3">
                <button className="text-blue-700 hover:text-blue-900 font-semibold mr-2 text-lg dark:text-blue-300 dark:hover:text-white">Editar</button>
                <button className="text-red-600 hover:text-red-800 font-semibold text-lg dark:text-red-400 dark:hover:text-white">Eliminar</button>
              </td>
            </tr>
            {/* Si no hay datos, mostrar mensaje */}
            {/* <tr><td colSpan="7" className="text-center text-blue-400 py-8 text-lg dark:text-slate-400">No hay subseries documentales registradas.</td></tr> */}
          </tbody>
        </table>
      </div>
      {/* Leyenda legal tipo cintillo fijo al fondo */}
      <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', zIndex: 50 }}>
        <div className="w-full flex justify-center items-center">
          <p className="text-blue-800 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-t-lg shadow-sm mb-0 max-w-2xl text-center dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700">
            Las subseries documentales se gestionan conforme a la Ley de Archivos del Estado de Baja California Sur, permitiendo la organización y control de los documentos institucionales.
          </p>
        </div>
      </div>
    </div>
  );
}
// Archivo eliminado
