"use client";
export default function PendingDocumentsCard({ title, count, lastUpdate }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600">Total: {count}</p>
      <p className="text-gray-500">Última actualización: {lastUpdate}</p>
    </div>
  );
}
