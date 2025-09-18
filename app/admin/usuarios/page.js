"use client";
import { useEffect, useState } from "react";
import NEXT_PUBLIC_API_URL from "@/config";
import Paginacion from "@/app/admin/components/Paginacion";
import Swal from "sweetalert2";
import { Judson } from "next/font/google";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departamentos, setDepartamentos] = useState([])
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
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);


  // 1️⃣ Al montar, traemos la lista de usuarios
  useEffect(() => {
    setLoading(true);
    fetch(`${NEXT_PUBLIC_API_URL}/usuarios/view?page=${paginaActual}`)
      .then((r) => r.json())
      .then((data) => {
        // Verifica la estructura antes de acceder
        if (data && data.data && Array.isArray(data.data.usuarios)) {
          setUsuarios(data.data.usuarios);
          setTotalPaginas(data.data.pagination?.pages || 1);
          console.log(data.data.usuarios);
        } else if (data && Array.isArray(data.usuarios)) {
          setUsuarios(data.usuarios);
          setTotalPaginas(data.pagination?.pages || 1);
        } else {
          console.error('La respuesta no contiene usuarios:', data);
          setUsuarios([]);
        }
      })
      .catch((err) => {
        console.error('Error cargando usuarios:', err);
        setUsuarios([]);
      })
      .finally(() => setLoading(false));
  }, [paginaActual]);


  // 2️⃣ Al montar, traemos la lista de roles
  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_URL}/roles`)
      .then((r) => r.json())
      .then((data) => {
        let rolesArr = [];
        if (data && data.data && Array.isArray(data.data.roles)) {
          rolesArr = data.data.roles;
        } else if (data && Array.isArray(data.roles)) {
          rolesArr = data.roles;
        } else {
          console.error("La respuesta no contiene roles:", data);
        }
        setRoles(rolesArr);

        // Inicializa el rol del nuevo usuario con el primer rol disponible
        if (rolesArr.length > 0) {
          setNuevoUsuario((prev) => ({
            ...prev,
            rol: rolesArr[0].name || rolesArr[0].id || "",
          }));
        }
      })
      .catch((err) => {
        console.error("Error cargando roles:", err);
        setRoles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 2.1️⃣ Al montar, traemos la lista de departamentos
  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_URL}/departamentos`)
      .then((r) => r.json())
      .then((data) => {
        let departamentosArr = [];
        if (data && data.data && Array.isArray(data.data.departamentos)) {
          departamentosArr = data.data.departamentos;
        } else if (data && Array.isArray(data.departamentos)) {
          departamentosArr = data.departamentos;
        } else {
          console.error("La respuesta no contiene departamentos:", data);
        }
        setDepartamentos(departamentosArr);
      })
      .catch((err) => {
        console.error("Error cargando departamentos:", err);
        setDepartamentos([]);
      })
      .finally(() => setLoading(false));
  }, []);


  if (loading) {
    return <div className="p-6 text-center">Cargando usuarios…</div>;
  }

  // 3️⃣ Crear usuario via API
  const handleAgregar = async () => {
    try {
      // Validaciones básicas
      if (!nuevoUsuario.nombre.trim()) return alert("El nombre no puede estar vacío");
      if (!nuevoUsuario.apellidos.trim()) return alert("El apellido no puede estar vacío");
      if (!nuevoUsuario.email.trim()) return alert("El correo electrónico no puede estar vacío");
      if (!nuevoUsuario.password.trim()) return alert("La contraseña no puede estar vacía");
      if (!nuevoUsuario.role_tipo) return alert("Debes seleccionar un rol");
      if (!nuevoUsuario.departamentos_id) return alert("Debes seleccionar un departamento");

      // 3.1️⃣ Construir el objeto a enviar
      const usuarioAEnviar = {
        nombre: nuevoUsuario.nombre.trim(),
        apellidos: nuevoUsuario.apellidos.trim(),
        email: nuevoUsuario.email.trim(),
        password: nuevoUsuario.password,
        role_tipo: nuevoUsuario.role_tipo,
        departamentos_id: nuevoUsuario.departamentos_id,
        activo: nuevoUsuario.activo,
      };

      // 3.2️⃣ Enviar la petición
      const res = await fetch(`${NEXT_PUBLIC_API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioAEnviar),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "No se pudo agregar el usuario");
      }

      const data = await res.json();
      console.log("Usuario agregado:", data);

      // 4. Limpiar el formulario

      setNuevoUsuario({
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        departamentos_id: "",
        role_tipo: "",
        activo: 1,
      });

      // 5. Mostrar éxito por unos segundos y al terminar recargar la página
      Swal.fire({
        icon: 'success',
        title: 'Usuario agregado',
        text: 'El usuario ha sido agregado exitosamente.',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        setPaginaActual(1);

        fetch(`${NEXT_PUBLIC_API_URL}/usuarios/view?page=1`)
          .then((r) => r.json())
          .then((data) => {
            setUsuarios(data.data.usuarios || []);
            setTotalPaginas(data.data.pagination?.pages || 1);
          })
          .catch((err) => {
            console.error('Error cargando usuarios:', err);
            setUsuarios([]);
          });
      });
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo agregar el usuario.',
      });
    }
  };

  // 4️⃣ Eliminar usuario via API
  const eliminarUsuario = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;
      fetch(`${NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("No se pudo eliminar el usuario");
          setUsuarios((prev) => prev.filter((u) => u.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            text: 'El usuario ha sido eliminado exitosamente.',
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          console.error("Error al eliminar usuario:", err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'No se pudo eliminar el usuario.',
          });
        });
    });
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
              {["ID", "Nombre(s)", "Apellido(s)", "Correo", "Departamento", "Rol", "Acciones"].map((h) => (
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
                  {u.departamento}
                </td>
                <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {u.rol}
                </td>
                <td className="flex justify-center py-2 border border-gray-400 dark:border-gray-700">

                  <button
                    onClick={() => editarUsuario(u.id)}
                    className="p-1 rounded cursor-pointer mr-2 flex items-center justify-center hover:bg-gray-200"
                    title="Editar"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <img src="/editar4.png" alt="Editar" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="p-1 rounded cursor-pointer flex items-center justify-center hover:bg-gray-200"
                    title="Eliminar"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <img src="/eliminar5.png" alt="Eliminar" className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onPageChange={setPaginaActual}
        />

      </div>

      {/* Formulario para agregar usuario */}
      <div className="mt-6 p-6 border border-gray-400 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Agregar Nuevo Usuario
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Nombre */}
          <div className="flex flex-col max-w-sm">
            <label className="mb-1 text-gray-700 dark:text-gray-300">Nombre(s)</label>
            <input
              type="text"
              value={nuevoUsuario.nombre}
              onChange={(e) =>
                setNuevoUsuario((prev) => ({ ...prev, nombre: e.target.value }))
              }
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre"
            />
          </div>

          {/* Apellidos */}
          <div className="flex flex-col max-w-sm">
            <label className="mb-1 text-gray-700 dark:text-gray-300">Apellido(s)</label>
            <input
              type="text"
              value={nuevoUsuario.apellidos}
              onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, apellidos: e.target.value }))}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Apellidos"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col max-w-sm">
            <label className="mb-1 text-gray-700 dark:text-gray-300">Correo Electrónico</label>
            <input
              type="email"
              value={nuevoUsuario.email}
              onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, email: e.target.value }))}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none              focus:ring-2 focus:ring-blue-500"
              placeholder="Correo electrónico"
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col max-w-sm">
            <label className="mb-1 text-gray-700 dark:text-gray-300">Contraseña</label>
            <input
              type="password"
              value={nuevoUsuario.password}
              onChange={(e) =>
                setNuevoUsuario((prev) => ({ ...prev, password: e.target.value }))
              }
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contraseña"
            />
          </div>


          {/* Departamento */}
          <div className="flex flex-col max-w-sm">
            <label className="mb-1 text-gray-700 dark:text-gray-300">Departamento</label>
            <select
              value={nuevoUsuario.departamentos_id}
              onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, departamentos_id: e.target.value }))}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un departamento</option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.nombre}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Rol */}
          <div className="flex flex-col max-w-sm">
            <label className="mb-1 text-gray-700 dark:text-gray-300">Rol</label>
            <select
              value={nuevoUsuario.role_tipo}
              onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, role_tipo: e.target.value }))}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un rol</option>
              {roles.map((r) => (
                <option key={r.id} value={r.tipo}>
                  {r.descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* Botón */}
          <div className="flex justify-start md:justify-end">
            <button
              onClick={handleAgregar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              Agregar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}