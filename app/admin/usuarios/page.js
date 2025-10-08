"use client";
import { useEffect, useState } from "react";
import NEXT_PUBLIC_API_URL from "@/config";
import Paginacion from "@/app/admin/components/Paginacion";
import Swal from "sweetalert2";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    departamentos_id: "",
    password: "",
    activo: 1,
    role_tipo: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Validación
  useEffect(() => {
    const newErrores = {};
    if (!nuevoUsuario.nombre.trim()) newErrores.nombre = "El nombre es requerido";
    if (!nuevoUsuario.apellidos.trim()) newErrores.apellidos = "El apellido es requerido";
    if (!nuevoUsuario.email.trim()) newErrores.email = "El correo es requerido";
    if ((usuarioEditando === null || nuevoUsuario.password) && nuevoUsuario.password.length < 6)
      newErrores.password = "La contraseña debe tener al menos 6 caracteres";
    if (nuevoUsuario.password !== confirmPassword)
      newErrores.confirmPassword = "Las contraseñas no coinciden";
    if (!nuevoUsuario.departamentos_id) newErrores.departamentos_id = "Selecciona un departamento";
    if (!nuevoUsuario.role_tipo) newErrores.role_tipo = "Selecciona un rol";
    setErrores(newErrores);
  }, [nuevoUsuario, confirmPassword, usuarioEditando]);

  // Fetch usuarios
  const cargarUsuarios = async (p = pagina) => {
    setLoading(true);
    try {
      const res = await fetch(`${NEXT_PUBLIC_API_URL}/usuarios/view?page=${p}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.usuarios)) {
        setUsuarios(data.data.usuarios);
        setTotalPaginas(data.data.pagination?.pages || 1);
      } else if (data && Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
        setTotalPaginas(data.pagination?.pages || 1);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [pagina]);

  // Fetch roles
  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_URL}/roles`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        let rolesArr = data?.data?.roles || data.roles || [];
        setRoles(rolesArr);
        if (rolesArr.length > 0 && !usuarioEditando) {
          setNuevoUsuario((prev) => ({ ...prev, role_tipo: rolesArr[0].tipo }));
        }
      })
      .catch((err) => {
        console.error("Error cargando roles:", err);
        setRoles([]);
      });
  }, []);

  // Fetch departamentos
  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_URL}/departamentos`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        let departamentosArr = data?.data?.departamentos || data.departamentos || [];
        setDepartamentos(departamentosArr);
      })
      .catch((err) => {
        console.error("Error cargando departamentos:", err);
        setDepartamentos([]);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Cargando usuarios…</div>;
  }

  // Agregar o Editar usuario
  const handleGuardarUsuario = async () => {
    if (Object.keys(errores).length > 0) return;

    try {
      const usuarioAEnviar = {
        nombre: nuevoUsuario.nombre.trim(),
        apellidos: nuevoUsuario.apellidos.trim(),
        email: nuevoUsuario.email.trim(),
        role_tipo: nuevoUsuario.role_tipo,
        departamentos_id: nuevoUsuario.departamentos_id,
        activo: nuevoUsuario.activo,
      };
      if (nuevoUsuario.password) usuarioAEnviar.password = nuevoUsuario.password;

      let url = `${NEXT_PUBLIC_API_URL}/usuarios`;
      let method = "POST";

      if (usuarioEditando) {
        url += `/${usuarioEditando.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuarioAEnviar),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "No se pudo guardar el usuario");
      }

      const data = await res.json();

      // Actualizar estado local
      if (usuarioEditando) {
        setUsuarios((prev) =>
          prev.map((u) =>
            u.id === data.id
              ? {
                  ...u,
                  ...usuarioAEnviar,
                  departamento:
                    departamentos.find((d) => d.id === usuarioAEnviar.departamentos_id)?.nombre ||
                    u.departamento,
                }
              : u
          )
        );
      } else {
        // Recargar usuarios al agregar nuevo
        cargarUsuarios(1);
      }

      Swal.fire({
        icon: "success",
        title: usuarioEditando ? "Usuario editado" : "Usuario agregado",
        text: usuarioEditando
          ? "El usuario ha sido editado exitosamente."
          : "El usuario ha sido agregado exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      setModalVisible(false);
      setUsuarioEditando(null);
      setNuevoUsuario({
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        departamentos_id: "",
        role_tipo: roles.length > 0 ? roles[0].tipo : "",
        activo: 1,
      });
      setConfirmPassword("");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo guardar el usuario.",
      });
    }
  };

  const eliminarUsuario = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (!result.isConfirmed) return;
      fetch(`${NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("No se pudo eliminar el usuario");
          setUsuarios((prev) => prev.filter((u) => u.id !== id));
          Swal.fire({
            icon: "success",
            title: "Usuario eliminado",
            text: "El usuario ha sido eliminado exitosamente.",
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          console.error("Error al eliminar usuario:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.message || "No se pudo eliminar el usuario.",
          });
        });
    });
  };

  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setNuevoUsuario({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      departamentos_id: usuario.departamentos_id,
      password: "",
      role_tipo: usuario.role_tipo,
      activo: usuario.activo,
    });
    setConfirmPassword("");
    setModalVisible(true);
  };

  // Filtrado local
  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = busqueda.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(texto) ||
      u.apellidos.toLowerCase().includes(texto) ||
      u.email.toLowerCase().includes(texto) ||
      (u.departamento?.toLowerCase().includes(texto) ?? false) ||
      (u.rol?.toLowerCase().includes(texto) ?? false)
    );
  });

  return (
    <div>
      <h1 className="text-2xl text-center font-bold text-gray-900 dark:text-gray-100">
        Gestión de Usuarios
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-500
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm dark:shadow
            "
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.6 3.6a7.5 7.5 0 0012.9 12.9z"
              />
            </svg>
          </div>
        </div>

        <button
          onClick={() => {
            setUsuarioEditando(null);
            setNuevoUsuario({
              nombre: "",
              apellidos: "",
              email: "",
              password: "",
              departamentos_id: "",
              role_tipo: roles.length > 0 ? roles[0].tipo : "",
              activo: 1,
            });
            setConfirmPassword("");
            setModalVisible(true);
          }}
          className="
            bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800
            text-white font-semibold px-5 py-2 rounded transition
            focus:outline-none focus:ring-2 focus:ring-blue-500
            w-full md:w-auto
          "
        >
          Agregar Usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-400 bg-white dark:border-gray-700 dark:bg-gray-800 border-collapse text-center">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              {["ID", "Nombre(s)", "Apellido(s)", "Correo", "Departamento", "Rol", "Acciones"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-center font-black text-sm uppercase text-gray-700 dark:text-gray-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u, i) => (
              <tr
                key={u.id}
                className={`
                  transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-600
                  ${i % 2 === 0 ? "even:bg-gray-50 dark:even:bg-gray-800" : "bg-white dark:bg-gray-900"}
                `}
              >
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">{u.id}</td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">{u.nombre}</td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">{u.apellidos}</td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">{u.email}</td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">{u.departamento}</td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">{u.rol}</td>
                <td className="flex justify-center py-2 border border-gray-400 dark:border-gray-700 space-x-2">
                  <button
                    onClick={() => editarUsuario(u)}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l-1 4 4-1 7-7a2 2 0 00-2.828-2.828L9 11z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7L5 7M6 7V19a2 2 0 002 2h8a2 2 0 002-2V7M9 11v6m6-6v6M10 7h4l1-2H9l1 2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-gray-700 dark:text-gray-300">No se encontraron usuarios.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChangePagina={setPagina} />

      {/* Modal */}
      {modalVisible && typeof window !== "undefined" && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={() => setModalVisible(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded max-w-xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalVisible(false)}
              className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-bold text-xl"
              aria-label="Cerrar modal"
            >
              ×
            </button>

            <h2 className="text-xl text-center font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {usuarioEditando ? "Editar Usuario" : "Agregar Usuario"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuardarUsuario();
              }}
              className="space-y-4"
            >
              {/* Nombre */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Nombre(s)</label>
                <input
                  type="text"
                  value={nuevoUsuario.nombre}
                  onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-400 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
              </div>

              {/* Apellidos */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Apellido(s)</label>
                <input
                  type="text"
                  value={nuevoUsuario.apellidos}
                  onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, apellidos: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-400 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errores.apellidos && <p className="text-red-500 text-sm">{errores.apellidos}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Correo</label>
                <input
                  type="email"
                  value={nuevoUsuario.email}
                  onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-400 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errores.email && <p className="text-red-500 text-sm">{errores.email}</p>}
              </div>

              {/* Departamento */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Departamento</label>
                <select
                  value={nuevoUsuario.departamentos_id}
                  onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, departamentos_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-400 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un departamento</option>
                  {departamentos.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
                {errores.departamentos_id && <p className="text-red-500 text-sm">{errores.departamentos_id}</p>}
              </div>

              {/* Rol */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Rol</label>
                <select
                  value={nuevoUsuario.role_tipo}
                  onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, role_tipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-400 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((r) => (
                    <option key={r.tipo} value={r.tipo}>
                      {r.tipo}
                    </option>
                  ))}
                </select>
                {errores.role_tipo && <p className="text-red-500 text-sm">{errores.role_tipo}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                  {usuarioEditando ? "Nueva Contraseña (opcional)" : "Contraseña"}
                </label>
                <input
                  type="password"
                  value={nuevoUsuario.password}
                  onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-400 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={usuarioEditando ? "Dejar en blanco para no cambiar" : ""}
                  required={!usuarioEditando}
                />
                {errores.password && <p className="text-red-500 text-sm">{errores.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-400 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errores.confirmPassword && <p className="text-red-500 text-sm">{errores.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={Object.keys(errores).length > 0}
                className={`w-full py-2 px-4 rounded text-white font-semibold transition ${
                  Object.keys(errores).length > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {usuarioEditando ? "Guardar Cambios" : "Agregar Usuario"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
