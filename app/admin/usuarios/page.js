"use client";
import { useEffect, useState } from "react";

const roles = ["admin", "revisor", "capturista"];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    rol: "capturista",
  });

  // 1️⃣ Al montar, traemos la lista
  useEffect(() => {
    fetch("/api/usuarios")
      .then((r) => r.json())
      .then((data) => setUsuarios(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Cargando usuarios…</div>;
  }

  // 2️⃣ Crear usuario via API
  const handleAgregar = async () => {
    if (!nuevoUsuario.nombre.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
      if (!res.ok) throw new Error("Falló creación");
      const creado = await res.json();
      setUsuarios((prev) => [...prev, creado]); // ✅ añadimos al state
      setNuevoUsuario({ nombre: "", rol: "capturista" });
    } catch (err) {
      console.error(err);
      alert("No se pudo agregar");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Cambiar rol via API
  const cambiarRol = async (id, rol) => {
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol }),
      });
      if (!res.ok) throw new Error();
      setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol } : u)));
    } catch {
      alert("Error actualizando rol");
    }
  };

  // 4️⃣ Eliminar usuario via API
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar?")) return;
    try {
      const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("No se pudo eliminar");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Gestión de Usuarios
      </h1>

      <div className="overflow-x-auto">
        <table
          className="
            min-w-full 
            border border-gray-400 bg-white 
            dark:border-gray-700 dark:bg-gray-800 
            border-collapse
          "
        >
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              {["ID", "Nombre", "Rol", "Acciones"].map((h) => (
                <th
                  key={h}
                  className="
                    px-4 py-2 
                    border border-gray-400 dark:border-gray-700 
                    text-left 
                    font-medium 
                    text-gray-700 dark:text-gray-300
                  "
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr
                key={u.id}
                className={`
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition
                  ${i % 2 === 0 ? "even:bg-gray-50 dark:even:bg-gray-700" : ""}
                `}
              >
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {u.id}
                </td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {u.nombre}
                </td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700">
                  <select
                    value={u.rol}
                    onChange={(e) => cambiarRol(u.id, e.target.value)}
                    className="
                      w-full 
                      bg-white dark:bg-gray-700 
                      border border-gray-300 dark:border-gray-600 
                      rounded px-2 py-1 
                      text-gray-800 dark:text-gray-100
                    "
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700">
                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Agregar Usuario
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            name="nombre"
            value={nuevoUsuario.nombre}
            onChange={(e) =>
              setNuevoUsuario((prev) => ({ ...prev, nombre: e.target.value }))
            }
            placeholder="Nombre"
            className="col-span-2 p-2 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          />
          <select
            name="rol"
            value={nuevoUsuario.rol}
            onChange={(e) =>
              setNuevoUsuario((prev) => ({ ...prev, rol: e.target.value }))
            }
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAgregar}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
