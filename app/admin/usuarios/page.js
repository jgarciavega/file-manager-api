"use client";
import { useEffect, useState } from "react";
import NEXT_PUBLIC_API_URL from "@/config";
import Paginacion from "@/app/admin/components/Paginacion";
import Swal from "sweetalert2";


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
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);


<<<<<<< Updated upstream
=======
  // 1️⃣ Al montar, traemos la lista de usuarios
>>>>>>> Stashed changes
  useEffect(() => {
    setLoading(true);
    fetch(`${NEXT_PUBLIC_API_URL}/usuarios/view?page=${paginaActual}`)
      .then((r) => r.json())
      .then((data) => {
<<<<<<< Updated upstream
        setUsuarios(data.data.usuarios || []);
        setTotalPaginas(data.data.pagination?.pages || 1);
=======
        // Verifica la estructura antes de acceder
        if (data && data.data && Array.isArray(data.data.usuarios)) {
          setUsuarios(data.data.usuarios);
        } else if (data && Array.isArray(data.usuarios)) {
          setUsuarios(data.usuarios);
        } else {
          console.error('La respuesta no contiene usuarios:', data);
          setUsuarios([]);
        }
>>>>>>> Stashed changes
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
          rolesArr = data.data.roles;
        } else {
          console.error('La respuesta no contiene roles:', data);
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
        console.error('Error cargando roles:', err);
        setRoles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Cargando usuarios…</div>;
  }

<<<<<<< Updated upstream
=======
  // 3️⃣ Crear usuario via API
>>>>>>> Stashed changes
  const handleAgregar = async () => {
    // Validaciones básicas
    if (!nuevoUsuario.nombre.trim()) return alert("El nombre no puede estar vacío");
    if (!nuevoUsuario.apellidos.trim()) return alert("El apellido no puede estar vacío");
    if (!nuevoUsuario.email.trim()) return alert("El correo electrónico no puede estar vacío");
    if (!nuevoUsuario.password.trim()) return alert("La contraseña no puede estar vacía");

    try {
      // 1. Crear nuevo usuario
      const crearRes = await fetch(`${NEXT_PUBLIC_API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
<<<<<<< Updated upstream

      if (!crearRes.ok) {
        const errorData = await crearRes.json();
        throw new Error(errorData?.message || "No se pudo crear el usuario");
      }


      // 4. Limpiar formulario
      setNuevoUsuario({
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        rol: "",
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

=======
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Verifica la estructura antes de agregar
      let usuarioCreado = null;
      if (data && data.data && data.data.usuario) {
        usuarioCreado = data.data.usuario;
      } else if (data && data.usuario) {
        usuarioCreado = data.usuario;
      }
      if (usuarioCreado) {
        setUsuarios((prev) => (Array.isArray(prev) ? [...prev, usuarioCreado] : [usuarioCreado]));
        setNuevoUsuario({
          nombre: "",
          apellidos: "",
          email: "",
          rol: roles.length > 0 ? roles[0].name || roles[0].id || "" : "",
          activo: 1,
        });
      } else {
        alert("No se pudo agregar el usuario");
      }
    } catch (error) {
      console.error('Error agregando usuario:', error);
      alert("Error agregando usuario");
    }
  }

  // 4️⃣ Eliminar usuario via API
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar?")) return;
    try {
      const res = await fetch(`${NEXT_PUBLIC_API_URL}/usuarios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsuarios((prev) => (Array.isArray(prev) ? prev.filter((u) => u.id !== id) : prev));
    } catch {
      alert("No se pudo eliminar");
    }
>>>>>>> Stashed changes
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
                  {/* Si el usuario tiene un array de roles, muestra el nombre del primer rol */}
                  {Array.isArray(u.roles)
                    ? u.roles.length > 0
                      ? u.roles[0].name || u.roles[0].id || ""
                      : ""
                    : u.rol || u.roles || ""}
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
                    // Aquí deberías abrir un modal o formulario de edición
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
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onPageChange={setPaginaActual}
        />

      </div>

      {/* AGREGAR UN USUARIO */}
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
<<<<<<< Updated upstream
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre"
=======
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
              Correo Electrónico
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
>>>>>>> Stashed changes
            />
          </div>

          {/* Apellidos */}
          <div className="flex flex-col max-w-sm">
            <label className="mb-1 text-gray-700 dark:text-gray-300">Apellido(s)</label>
            <input
              type="text"
              value={nuevoUsuario.apellidos}
              onChange={(e) =>
                setNuevoUsuario((prev) => ({ ...prev, apellidos: e.target.value }))
              }
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Apellidos"
            />
          </div>

          {/* Correo */}
          <div className="flex flex-col max-w-sm">
            <label className="mb-1 text-gray-700 dark:text-gray-300">Correo Electrónico</label>
            <input
              type="email"
              value={nuevoUsuario.email}
              onChange={(e) =>
                setNuevoUsuario((prev) => ({ ...prev, email: e.target.value }))
              }
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Correo"
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col max-w-sm">
            <label className="mb-1 text-gray-700 dark:text-gray-300">Contraseña</label>
            <input
              type="text"
              value={nuevoUsuario.password}
              onChange={(e) =>
                setNuevoUsuario((prev) => ({ ...prev, password: e.target.value }))
              }
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contraseña"
            />
          </div>

          {/* Rol */}
          <div className="flex flex-col max-w-sm">
            <label className="mb-1 text-gray-700 dark:text-gray-300">Rol</label>
            <select
              value={nuevoUsuario.rol}
              onChange={(e) =>
                setNuevoUsuario((prev) => ({ ...prev, rol: e.target.value }))
              }
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un rol</option>
              {roles.map((r) => (
<<<<<<< Updated upstream
                <option key={r.id} value={r.id}>
                  {r.descripcion}
=======
                <option key={r.id} value={r.name || r.id}>
                  {r.name || r.id}
>>>>>>> Stashed changes
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

