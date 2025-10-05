"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Paginacion from "@/app/admin/components/Paginacion";

export default function BitacoraAdmin() {
  const [bitacora, setBitacora] = useState([]);
  const [filteredBitacora, setFilteredBitacora] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAccion, setFilterAccion] = useState("");
  const [loading, setLoading] = useState(true);

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const [token, setToken] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchBitacora = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/api/bitacora", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!data.success || !Array.isArray(data.data.registros)) {
          setBitacora([]);
          setFilteredBitacora([]);
          return;
        }

        const registros = data.data.registros;

        // Obtener correos de usuarios
        const uniqueUserIds = [...new Set(registros.map((r) => r.usuario_id))];
        const userEmails = {};

        await Promise.all(
          uniqueUserIds.map(async (id) => {
            try {
              const resUser = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              const userData = await resUser.json();
              if (userData?.data?.email) {
                userEmails[id] = userData.data.email;
              }
            } catch (err) {
              console.error(`Error usuario ${id}:`, err);
            }
          })
        );

        const enriched = registros.map((r) => ({
          ...r,
          usuario_email: userEmails[r.usuario_id] || `Usuario ${r.usuario_id}`,
        }));

        setBitacora(enriched);
        setFilteredBitacora(enriched);
      } catch (err) {
        console.error("Error bitácora:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBitacora();
  }, [token]);

  // Filtrar y buscar
  useEffect(() => {
    let filtered = bitacora;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.usuario_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterAccion) {
      filtered = filtered.filter((item) => item.accion === filterAccion);
    }

    setFilteredBitacora(filtered);
    setPaginaActual(1);
  }, [searchTerm, filterAccion, bitacora]);

  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimero = indiceUltimo - registrosPorPagina;
  const registrosActuales = filteredBitacora.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(filteredBitacora.length / registrosPorPagina);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300">
        Cargando bitácora…
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center flex-1">
          Bitácora Administrativa
        </h1>
        <div className="w-32" />
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="text"
            placeholder="Buscar por usuario, acción o detalle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={filterAccion}
          onChange={(e) => setFilterAccion(e.target.value)}
        >
          <option value="">Todas las acciones</option>
          {[...new Set(bitacora.map((item) => item.accion))].map((accion) => (
            <option key={accion} value={accion}>
              {accion}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-400 dark:border-gray-700 border-collapse text-center">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              {["#", "Usuario", "Acción", "Detalles", "Fecha"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-sm font-black text-gray-700 dark:text-gray-300 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrosActuales.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-gray-700 dark:text-gray-300">
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              registrosActuales.map((item, i) => (
                <tr
                  key={item.id}
                  className={`transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-600 ${i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                    }`}
                >
                  <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                    {indicePrimero + i + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                    {item.usuario_email}
                  </td>
                  <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                    {item.accion}
                  </td>
                  <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                    {item.descripcion}
                  </td>
                  <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                    {new Date(item.fecha_inicio).toLocaleString("es-MX")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredBitacora.length > registrosPorPagina && (
        <Paginacion
          pagina={paginaActual}
          totalPaginas={totalPaginas}
          onChangePagina={setPaginaActual}
        />
      )}
    </div>
  );
}
