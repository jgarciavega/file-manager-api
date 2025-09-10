"use client";
import { useEffect, useState } from "react";
import NEXT_PUBLIC_API_URL from "@/config";


export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    rol: "",
    activo: 1,
  });

  // 1️⃣ Al montar, traemos la lista
  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_URL}/usuarios/view`)
      .then((r) => r.json())
      .then((data) => {

        setUsuarios(data.data.usuarios);
      })
      .catch((err) => {
        console.error('Error cargando usuarios:', err);
        setUsuarios([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_URL}/roles`)
      .then((r) => r.json())
      .then((data) => {
        setRoles(data.data.roles);
      })
      .catch((err) => {
        console.error('Error cargando roles:', err);
        setRoles([]);
      })
      .finally(() => setLoading(false));
  }, []);



  if (loading) {
    return <div className="p-6 text-center">Cargando usuarios…</div>;
  }

  // 2️⃣ Crear usuario via API
  const handleAgregar = async () => {
    if (!nuevoUsuario.nombre.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }

    try {
      const res = await fetch(`${NEXT_PUBLIC_API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsuarios((prev) => (Array.isArray(prev) ? [...prev, data.data.usuario] : [data.data.usuario]));
      setNuevoUsuario({ nombre: "", rol: "capturista" });
    } catch (error) {
      console.error('Error agregando usuario:', error);
      alert("Error agregando usuario");
    }
  }

  // // 3️⃣ Cambiar rol via API
  // const cambiarRol = async (id, rol) => {
  //   try {
  //     const res = await fetch(`/api/usuarios/${id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ rol }),
  //     });
  //     if (!res.ok) throw new Error();
  //     setUsuarios((prev) => (Array.isArray(prev) ? prev.map((u) => (u.id === id ? { ...u, rol } : u)) : prev));
  //   } catch {
  //     alert("Error actualizando rol");
  //   }
  // };

  // 4️⃣ Eliminar usuario via API
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar?")) return;
    try {
      const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsuarios((prev) => (Array.isArray(prev) ? prev.filter((u) => u.id !== id) : prev));
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
            border-collapse text-center
          "
        >
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              {["ID", "Nombre(s)", "Apellido(s)", "Correo", "Rol", "Estatus", "Acciones"].map((h) => (
                <th
                  key={h}
                  className="
                    px-4 py-2 
                    border border-gray-400 dark:border-gray-700 
                    text-center 
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
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {u.apellidos}
                </td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {u.email}
                </td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {u.roles}
                </td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {u.activo === 1 ? (
                    <span className="text-green-600 italic">Activo</span>
                  ) : (
                    <span className="text-gray-500 italic">Inactivo</span>
                  )}
                </td>
                <td className="flex justify-center py-2 border border-gray-400 dark:border-gray-700">
                  <a
                    onClick={() => eliminarUsuario(u.id)}
                    className="text-white bg-yellow-900 px-2 rounded cursor-pointer mr-2"
                  >
                    Editar
                  </a>
                  <a
                    onClick={() => eliminarUsuario(u.id)}
                    className="text-white bg-red-800 px-2 rounded cursor-pointer"
                  >
                    Eliminar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AGREGAR UN USUARIO */}
      <div className="mt-6 p-4 border border-gray-400 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Agregar Nuevo Usuario
        </h2>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Nombre(s)
            </label>
            <input
              type="text"
              value={nuevoUsuario.nombre}
              onChange={(e) =>
                setNuevoUsuario((prev) => ({ ...prev, nombre: e.target.value }))
              }
              className="
                w-full
                bg-white dark:bg-gray-700
                border border-gray-300 dark:border-gray-600
                rounded px-3 py-2
                text-gray-800 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              placeholder="Nombre del usuario"
            />

            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Correo Eletrónico
            </label>
            <input
              type="email"
              value={nuevoUsuario.email}
              onChange={(e) =>
                setNuevoUsuario((prev) => ({ ...prev, email: e.target.value }))
              }
              className="
                w-full
                bg-white dark:bg-gray-700
                border border-gray-300 dark:border-gray-600
                rounded px-3 py-2
                text-gray-800 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              placeholder="Correo electrónico del usuario"
            />
          </div>
          <div className="w-64 flex-shrink-0">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Apellido(s)
            </label>
            <input
              type="text"
              value={nuevoUsuario.apellidos}
              onChange={(e) =>
                setNuevoUsuario((prev) => ({ ...prev, apellidos: e.target.value }))
              }
              className="
                w-full
                bg-white dark:bg-gray-700
                border border-gray-300 dark:border-gray-600
                rounded px-3 py-2
                text-gray-800 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              placeholder="Apellido(s) del usuario"
            />

            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Rol
            </label>
            <select
              value={nuevoUsuario.rol}
              onChange={(e) =>
                setNuevoUsuario((prev) => ({ ...prev, rol: e.target.value }))
              }
              className="
                w-full
                bg-white dark:bg-gray-700
                border border-gray-300 dark:border-gray-600
                rounded px-3 py-2
                text-gray-800 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            >
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={handleAgregar}
              className="
                bg-blue-600 hover:bg-blue-700
                text-white
                px-4 py-2
                rounded
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition
              "
            >
              Agregar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

