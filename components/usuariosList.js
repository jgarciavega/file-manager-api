import { useEffect, useState } from "react";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/usuarios")
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-600">Cargando usuarios...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{u.nombre}</td>
              <td className="py-2 px-4 border-b">{u.apellidos || <span className="text-gray-400 italic">Sin apellidos</span>}</td>
              <td className="py-2 px-4 border-b">{u.email}</td>
              <td className="py-2 px-4 border-b">
                {u.activo ? (
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">Activo</span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">Inactivo</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}