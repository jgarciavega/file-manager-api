"use client";
export default function ReportsCard({ title, count, lastUpdate, hasUploadButton }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600">Total: {count}</p>
      <p className="text-gray-500">Última actualización: {lastUpdate}</p>
      {hasUploadButton && <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">Subir</button>}
    </div>
  );
}
