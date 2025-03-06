// app/dashboard/components/ReportsCard.js
export default function ReportsCard({ title, count, lastUpdate }) {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-bold">{title}</h3>
      <p>{count} archivos</p>
      <p>Última actualización: {lastUpdate}</p>
    </div>
  );
}
