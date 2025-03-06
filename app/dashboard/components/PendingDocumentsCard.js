// app/dashboard/components/PendingDocumentsCard.js
export default function PendingDocumentsCard({ title, count, lastUpdate }) {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-bold">{title}</h3>
      <p>{count} documentos pendientes</p>
      <p>Última actualización: {lastUpdate}</p>
    </div>
  );
}

