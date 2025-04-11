'use client';

import { useEffect, useState } from 'react';

const roles = ['admin', 'revisor', 'capturista'];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', rol: 'capturista' });

  // Leer usuarios guardados en localStorage al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('usuarios');
    if (datosGuardados) {
      setUsuarios(JSON.parse(datosGuardados));
    } else {
      // Si no hay datos, usamos estos por defecto
      const usuariosIniciales = [
        { id: 1, nombre: 'Jorge', rol: 'admin' },
        { id: 2, nombre: 'Andrea', rol: 'capturista' },
        { id: 3, nombre: 'Luis', rol: 'revisor' },
      ];
      setUsuarios(usuariosIniciales);
      localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
    }
  }, []);

  // Guardar en localStorage cada vez que cambia la lista
  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgregar = () => {
    if (nuevoUsuario.nombre.trim() === '') return;

    const nuevo = {
      id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
      nombre: nuevoUsuario.nombre,
      rol: nuevoUsuario.rol,
    };

    setUsuarios([...usuarios, nuevo]);
    setNuevoUsuario({ nombre: '', rol: 'capturista' });
  };

  const cambiarRol = (id, nuevoRol) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
    );
  };

  const eliminarUsuario = (id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Usuarios</h1>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="p-3 text-gray-800 dark:text-gray-200">{u.id}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200">{u.nombre}</td>
                <td className="p-3">
                  <select
                    value={u.rol}
                    onChange={(e) => cambiarRol(u.id, e.target.value)}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-white"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario para nuevo usuario */}
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Agregar nuevo usuario</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={nuevoUsuario.nombre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Nombre del usuario"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Rol</label>
            <select
              name="rol"
              value={nuevoUsuario.rol}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAgregar}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          Agregar Usuario
        </button>
      </div>
    </div>
  );
}
