"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faDownload,
  faFileAlt,
  faExclamationTriangle,
  faCheckCircle,
  faInfoCircle,
  faChevronDown,
  faChevronUp,
  faLightbulb,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import avatarMap from "../../../lib/avatarMap";
import useAutoComplete from "@/app/hooks/useAutoComplete";
import BackToHomeButton from "@/components/BackToHomeButton";
import NEXT_PUBLIC_API_URL from "@/config";
import DashboardHeader from "@/components/DashboardHeader";

export default function UploadNew({ session }) {
  // ===== ESTADO UI / SESIÓN =====
  const [darkMode, setDarkMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // 📚 CATÁLOGOS ARCHIVÍSTICOS DESDE LA API
  const [catalogs, setCatalogs] = useState({
    cuadros: [],
    valores: [],
    plazos: [],
    destinos: [],
    soportes: [],
    departamentos: [],
    tiposDocumentos: [],
  });



  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const endpoints = [
          "catalogs/cuadro_clasificacion",
          "catalogs/valores_documentales",
          "catalogs/plazos_conservacion",
          "catalogs/destinos_finales",
          "catalogs/soportes_documentales",
          "departamentos",
          "tipos-documentos"
        ];

        const responses = await Promise.all(
          endpoints.map(async (ep) => {
            const url = `${NEXT_PUBLIC_API_URL}/${ep}`;
            const res = await fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const text = await res.text();
            try {
              return JSON.parse(text);
            } catch (err) {
              console.error(`❌ Error parseando JSON (${ep}):`, text);
              return { data: [] };
            }
          })
        );

        // 👇 Solo actualiza una vez, sin depender del render
        setCatalogs({
          cuadros: responses[0]?.data || [],
          valores: responses[1]?.data || [],
          plazos: responses[2]?.data || [],
          destinos: responses[3]?.data || [],
          soportes: responses[4]?.data || [],
          departamentos: responses[5]?.data?.departamentos || [],
          tiposDocumentos: responses[6]?.data?.tiposDocumentos || [],
        });
      } catch (error) {
        console.error("❌ Error general al cargar catálogos:", error);
      }
    };

    fetchCatalogs();
  }, []); // 👈 IMPORTANTE: el array vacío evita el bucle infinito

  // ===== FORMULARIO (campos originales + *_id para API) =====
  const [form, setForm] = useState({
    // Diseño original
    nombre: "",
    jefatura: "",
    review: "",
    file: null,
    serie: "",
    subserie: "",
    expediente: "", // compat
    fecha_creacion: "",
    vigencia: "",
    acceso: "",
    observaciones: "",
    classification: "", // texto visible si no se usa tiposDocumentos

    // Campos archivísticos (UI texto)
    codigo_clasificacion: "", // solo para generar numero_expediente readable
    valor_documental: "",
    plazo_conservacion: "",
    destino_final: "",
    soporte_documental: "",
    numero_expediente: "",
    folio_documento: "",
    procedencia: "",

    // IDs reales para el backend
    codigo_clasificacion_id: "",
    valor_documental_id: "",
    plazo_conservacion_id: "",
    destino_final_id: "",
    soporte_id: "",
    tipos_documentos_id: "",
    departamentos_id: "",
    periodos_id: "1", // si tu backend asigna por defecto, puedes dejar "1" editable abajo si quieres
  });

  // ===== AUTO-COMPLETE (tu hook) =====
  const {
    validacionEnTiempo,
    alertasCalidad,
    validarCampo,
  } = useAutoComplete(form, setForm);

  // ===== TOOLTIPS =====
  const [tooltips, setTooltips] = useState({
    titulo: false,
    descripcion: false,
    asunto: false,
    clasificacion: false,
    valorDocumental: false,
    plazoConservacion: false,
    expediente: false,
    soporteDocumental: false,
    destinoFinal: false,
    folio: false,
  });
  const toggleTooltip = (key, show) =>
    setTooltips((p) => ({ ...p, [key]: show }));

  const TooltipWrapper = ({ tooltipKey, content, children, position = "top" }) => (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => toggleTooltip(tooltipKey, true)}
        onMouseLeave={() => toggleTooltip(tooltipKey, false)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      {tooltips[tooltipKey] && (
        <div
          className={`absolute z-50 ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"
            } left-1/2 -translate-x-1/2 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg border border-gray-600 min-w-max max-w-xs`}
        >
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <div
            className={`absolute ${position === "top" ? "top-full" : "bottom-full"
              } left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 border-r border-b border-gray-600 ${position === "top" ? "rotate-45" : "-rotate-45"
              }`}
          />
        </div>
      )}
    </div>
  );

  // ===== CERRAR TOOLTIPS AL CLIC FUERA =====
  useEffect(() => {
    const closeAll = () =>
      setTooltips({
        titulo: false,
        descripcion: false,
        asunto: false,
        clasificacion: false,
        valorDocumental: false,
        plazoConservacion: false,
        expediente: false,
        soporteDocumental: false,
        destinoFinal: false,
        folio: false,
      });
    document.addEventListener("click", closeAll);
    return () => document.removeEventListener("click", closeAll);
  }, []);


  // ===== GENERAR # EXPEDIENTE con código seleccionado =====
  const generarNumeroExpediente = (ccId) => {
    const now = new Date();
    const anio = now.getFullYear();
    const cc = catalogs.cuadros.find((c) => String(c.id) === String(ccId));
    const codigo = cc?.codigo || "000";
    const correlativo = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
    return `API-${anio}-${codigo}-${correlativo}`;
  };


  // ===== HANDLERS =====
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" && files?.[0]) {
      const file = files[0];
      const ALLOWED_FILE_TYPES = {
        "application/pdf": "PDF",
        "application/msword": "DOC",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
        "application/vnd.ms-excel": "XLS",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
        "image/jpeg": "JPG",
        "image/jpg": "JPG",
        "image/png": "PNG",
        "text/plain": "TXT",
      };
      const MAX_FILE_SIZE = 150 * 1024 * 1024;

      if (!ALLOWED_FILE_TYPES[file.type]) {
        alert(`❌ Formato no permitido.\nPermitidos: ${Object.values(ALLOWED_FILE_TYPES).join(", ")}`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`❌ Archivo demasiado grande. Máx 150MB.\nActual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setForm((p) => ({ ...p, file }));
      setErrors((p) => ({ ...p, file: undefined }));
      return;
    }

    // selects *_id
    if (name.endsWith("_id")) {
      // si cambia cuadro clasificación, recalcular número de expediente legible
      if (name === "codigo_clasificacion_id") {
        const numero_expediente = value ? generarNumeroExpediente(value) : "";
        setForm((p) => ({
          ...p,
          codigo_clasificacion_id: value,
          numero_expediente,
        }));
      } else {
        setForm((p) => ({ ...p, [name]: value }));
      }
      return;
    }

    // resto
    setForm((p) => ({ ...p, [name]: value }));

    if (typeof value === "string" && value.trim()) {
      validarCampo(name, value);
    }
  };

  const validateForm = () => {
    const out = {};
    if (!form.nombre.trim()) out.nombre = "El nombre del documento es obligatorio.";
    if (!form.review.trim()) out.review = "La descripción del contenido es obligatoria.";
    if (!form.jefatura.trim()) out.jefatura = "La jefatura responsable es obligatoria.";
    if (!form.file) out.file = "Debes seleccionar un archivo.";

    // IDs obligatorios para backend
    if (!form.codigo_clasificacion_id) out.codigo_clasificacion_id = "Selecciona un código de clasificación.";
    if (!form.valor_documental_id) out.valor_documental_id = "Selecciona un valor documental.";
    if (!form.plazo_conservacion_id) out.plazo_conservacion_id = "Selecciona un plazo de conservación.";
    if (!form.destino_final_id) out.destino_final_id = "Selecciona un destino final.";
    if (!form.soporte_id) out.soporte_id = "Selecciona un tipo de soporte.";
    if (!form.tipos_documentos_id) out.tipos_documentos_id = "Selecciona un tipo de documento.";
    if (!form.departamentos_id) out.departamentos_id = "Selecciona un departamento.";

    // adicionales UI
    if (!form.serie.trim()) out.serie = "La serie documental es obligatoria.";
    if (!form.procedencia.trim()) out.procedencia = "La procedencia administrativa es obligatoria.";

    setErrors(out);
    return Object.keys(out).length === 0;
  };

  const handleUpload = async () => {
    console.log("⚙️ Entrando a handleUpload()");

    if (!validateForm()) {
      console.warn("❌ Formulario no válido");
      console.log("Errores detectados:", errors);
      return;
    }

    console.log("✅ Validación pasada correctamente");
    setUploading(true);
    setErrorMessage("");
    setUploadProgress(0);

    const token = localStorage.getItem("token");
    const usuarios_id = localStorage.getItem("user_id") || session?.user?.id;
    console.log("📦 Token:", token, "| Usuario:", usuarios_id);

    try {
      const fd = new FormData();
      fd.append("file", form.file);
      fd.append("nombre", form.nombre);
      fd.append("descripcion", form.review);

      // IDs de catálogos
      fd.append("usuarios_id", String(usuarios_id || ""));
      fd.append("tipos_documentos_id", String(form.tipos_documentos_id || ""));
      fd.append("departamentos_id", String(form.departamentos_id || ""));
      fd.append("periodos_id", String(form.periodos_id || "1"));

      fd.append("codigo_clasificacion_id", String(form.codigo_clasificacion_id));
      fd.append("valor_documental_id", String(form.valor_documental_id));
      fd.append("plazo_conservacion_id", String(form.plazo_conservacion_id));
      fd.append("destino_final_id", String(form.destino_final_id));
      fd.append("soporte_id", String(form.soporte_id));
      fd.append("procedencia", form.procedencia || "upload");

      // Metadatos adicionales
      fd.append("numero_expediente", form.numero_expediente || "");
      fd.append("serie", form.serie || "");
      fd.append("subserie", form.subserie || "");
      fd.append("folio", form.folio_documento || "");
      fd.append("nivel_acceso", form.acceso || "PUBLICO");
      fd.append("procedencia", form.procedencia || "upload");
      fd.append("estado_vigencia", form.vigencia || "VIGENTE");
      if (form.fecha_creacion) fd.append("fecha_creacion", form.fecha_creacion);
      fd.append("fecha_subida", new Date().toISOString());

      console.log("🧾 Campos añadidos al FormData:", [...fd.keys()]);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
          console.log("📊 Progreso:", percent + "%");
        }
      });

      xhr.onreadystatechange = async () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          console.log("📬 Respuesta recibida:", xhr.status, xhr.responseText);
          setUploading(false);

          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              if (res?.success) {
                const download = res?.data?.download_url || "";
                console.log("✅ Subida exitosa. URL:", download);
                setUploadedFileUrl(download);
                setShowModal(true);

                // Registrar bitácora
                try {
                  await fetch(`${NEXT_PUBLIC_API_URL}/bitacora`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      accion: "subida",
                      descripcion: "Se subió un archivo",
                      usuarios_id: Number(usuarios_id),
                    }),
                  });
                } catch (bitErr) {
                  console.warn("⚠️ Bitácora no registrada:", bitErr);
                }

                // Reset del formulario
                setForm((prev) => ({
                  ...prev,
                  nombre: "",
                  jefatura: "",
                  review: "",
                  file: null,
                  serie: "",
                  subserie: "",
                  expediente: "",
                  fecha_creacion: "",
                  vigencia: "",
                  acceso: "",
                  observaciones: "",
                  classification: "",
                  codigo_clasificacion: "",
                  valor_documental: "",
                  plazo_conservacion: "",
                  destino_final: "",
                  soporte_documental: "",
                  numero_expediente: "",
                  folio_documento: "",
                  procedencia: "",
                  codigo_clasificacion_id: "",
                  valor_documental_id: "",
                  plazo_conservacion_id: "",
                  destino_final_id: "",
                  soporte_id: "",
                  tipos_documentos_id: "",
                  departamentos_id: "",
                  periodos_id: "1",
                }));

                if (fileInputRef.current) fileInputRef.current.value = "";
              } else {
                console.error("❌ Error de servidor:", res?.message);
                setErrorMessage(res?.message || "Error al subir archivo.");
              }
            } catch (parseErr) {
              console.error("💥 Error parseando respuesta:", parseErr);
              setErrorMessage("Respuesta inválida del servidor.");
            }
          } else {
            console.error("🚫 Error HTTP:", xhr.status, xhr.statusText);
            setErrorMessage(`Error al subir archivo (${xhr.status})`);
          }
        }
      };

      const url = `${NEXT_PUBLIC_API_URL}/documentos/upload`;
      console.log("🌐 Enviando a:", url);
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(fd);
    } catch (err) {
      console.error("💥 Error inesperado:", err);
      setErrorMessage("Error inesperado: " + err.message);
      setUploading(false);
    }
  };



  const closeModal = () => {
    setShowModal(false);
    setUploadProgress(0);
  };

  // ===== Datos de usuario para avatar (tus mapas) =====
  const userEmail = session?.user?.email || "default";
  const userAvatar = avatarMap[userEmail] || "/default-avatar.png";

  // ======== UI (idéntico a tu diseño, con selects dinámicos) ========
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <DashboardHeader title="Subir Documento" />

      {/* Back button */}
      <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 px-12 py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-start">
          <BackToHomeButton />
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Alertas Calidad */}
        {alertasCalidad.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-400 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <FontAwesomeIcon icon={faRobot} className="text-amber-600 text-lg" />
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">Asistente de Calidad</h3>
            </div>
            <div className="space-y-2">
              {alertasCalidad.map((alerta, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 text-sm ${alerta.tipo === "error"
                    ? "text-red-600 dark:text-red-400"
                    : alerta.tipo === "warning"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-blue-600 dark:text-blue-400"
                    }`}
                >
                  <span className="mt-0.5">
                    {alerta.tipo === "error" ? "❌" : alerta.tipo === "warning" ? "⚠️" : "ℹ️"}
                  </span>
                  <span>{alerta.mensaje}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barra de progreso */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-medium text-gray-700">Subiendo archivo...</span>
              <span className="text-base text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {/* SECCIÓN 1 */}
        <div className="space-y-10">
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">📄</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">1. Información General del Documento</h2>
                <p className="text-blue-700 dark:text-blue-300 font-medium">Información básica y descriptiva del documento</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Nombre */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Nombre del Documento *
                  <TooltipWrapper
                    tooltipKey="titulo"
                    content="<strong>Nombre descriptivo del documento</strong><br/>Ejemplo: 'Oficio de solicitud', 'Acta de reunión', 'Contrato de servicios'"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="text-sm text-blue-500 dark:text-blue-400 cursor-help" />
                  </TooltipWrapper>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Acta de reunión mensual"
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base font-medium transition-colors ${validacionEnTiempo.nombre
                    ? validacionEnTiempo.nombre.valido
                      ? "border-green-400 focus:border-green-500"
                      : "border-red-400 focus:border-red-500"
                    : "border-blue-300 dark:border-blue-600 focus:border-blue-500"
                    }`}
                />
                {validacionEnTiempo.nombre && (
                  <div className={`flex items-center gap-2 mt-1 text-sm ${validacionEnTiempo.nombre.valido ? "text-green-600" : "text-red-600"}`}>
                    <span>{validacionEnTiempo.nombre.valido ? "✅" : "❌"}</span>
                    <span>{validacionEnTiempo.nombre.mensaje}</span>
                  </div>
                )}
                {errors.nombre && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.nombre}</p>}
              </div>

              {/* Descripción */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Descripción del Contenido *
                  <TooltipWrapper
                    tooltipKey="descripcion"
                    content="<strong>Resumen del contenido y propósito</strong><br/>Describa brevemente qué contiene el documento y para qué se utiliza"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="text-sm text-blue-500 dark:text-blue-400 cursor-help" />
                  </TooltipWrapper>
                </label>
                <input
                  type="text"
                  name="review"
                  value={form.review}
                  onChange={handleChange}
                  placeholder="Ej: Descripción del contenido del documento"
                  className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base font-medium"
                />
                {errors.review && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.review}</p>}
              </div>

              {/* Jefatura */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Jefatura Responsable *
                  <span className="text-sm text-green-600 dark:text-green-400 font-normal">🤖 Auto-completado inteligente</span>
                </label>
                <select
                  name="jefatura"
                  value={form.jefatura}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base font-medium"
                >
                  <option value="">Selecciona una jefatura</option>
                  <option value="Dirección General">Dirección General</option>
                  <option value="Subdirección de Administración y Finanzas">Subdirección de Administración y Finanzas</option>
                  <option value="Subdirección de Recursos Humanos">Subdirección de Recursos Humanos</option>
                  <option value="Subdirección de Operaciones Portuarias">Subdirección de Operaciones Portuarias</option>
                  <option value="Subdirección de Ingeniería y Desarrollo">Subdirección de Ingeniería y Desarrollo</option>
                  <option value="Coordinación de Seguridad">Coordinación de Seguridad</option>
                  <option value="Coordinación de Medio Ambiente">Coordinación de Medio Ambiente</option>
                  <option value="Coordinación Jurídica">Coordinación Jurídica</option>
                </select>
                {errors.jefatura && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.jefatura}</p>}
              </div>

              {/* Fecha de Creación */}
              <div>
                <label className="block mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">Fecha de Creación</label>
                <input
                  type="date"
                  name="fecha_creacion"
                  value={form.fecha_creacion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base font-medium"
                />
              </div>

              {/* Nivel de Acceso */}
              <div>
                <label className="block mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">Nivel de Acceso</label>
                <select
                  name="acceso"
                  value={form.acceso}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base font-medium"
                >
                  <option value="">Selecciona nivel de acceso</option>
                  <option value="PUBLICO">Público</option>
                  <option value="RESERVADO">Reservado</option>
                  <option value="CONFIDENCIAL">Confidencial</option>
                </select>
              </div>

              {/* Observaciones */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 text-base font-medium"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Clasificación Archivística */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">🏛️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200">2. Clasificación Archivística</h2>
                <p className="text-amber-700 dark:text-amber-300 font-medium">Conforme a la Ley de Archivos Estatal de Baja California Sur</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* fila 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Cuadro de clasificación (DINÁMICO) */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                    Código de Clasificación Archivística *
                    <TooltipWrapper
                      tooltipKey="clasificacion"
                      content="<strong>Código que determina el área y tipo de documento</strong><br/>Cada código identifica una función específica."
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="text-sm text-amber-500 dark:text-amber-400 cursor-help" />
                    </TooltipWrapper>
                  </label>
                  <select
                    name="codigo_clasificacion_id"
                    value={form.codigo_clasificacion_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 text-base font-medium"
                  >
                    <option value="">Selecciona un código</option>
                    {catalogs.cuadros.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.codigo} - {item.titulo}
                      </option>
                    ))}
                  </select>

                  {/* Número de expediente auto (legible) */}
                  <div className="mt-3">
                    <label className="block mb-2 text-sm font-semibold text-amber-800 dark:text-amber-200">
                      Número de Expediente (auto)
                    </label>
                    <input
                      type="text"
                      name="numero_expediente"
                      value={form.numero_expediente}
                      readOnly
                      placeholder="Se genera al elegir el código"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-base font-mono cursor-not-allowed"
                    />
                  </div>
                  {errors.codigo_clasificacion_id && (
                    <p className="text-red-500 text-sm mt-2 font-semibold">{errors.codigo_clasificacion_id}</p>
                  )}
                  <input
                    type="text"
                    name="procedencia"
                    value={form.procedencia}
                    onChange={handleChange}
                    placeholder="Ej: Dirección General / Coordinación de..."
                    className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                  />
                  {errors.procedencia && (
                    <p className="text-red-500 text-sm mt-2 font-semibold">
                      {errors.procedencia}
                    </p>
                  )}


                </div>


                {/* Serie / Subserie */}
                <div>
                  <label className="block mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">Serie Documental *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="serie"
                      value={form.serie}
                      onChange={handleChange}
                      placeholder="Serie"
                      className="px-3 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 text-base font-medium"
                    />
                    <input
                      type="text"
                      name="subserie"
                      value={form.subserie}
                      onChange={handleChange}
                      placeholder="Subserie"
                      className="px-3 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 text-base font-medium"
                    />
                  </div>
                  {errors.serie && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.serie}</p>}
                </div>

                {/* Valor Documental (DINÁMICO) */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                    Valor Documental *
                    <TooltipWrapper
                      tooltipKey="valorDocumental"
                      content="<strong>Importancia del documento</strong><br/>Administrativo, Legal, Fiscal, Histórico, etc."
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="text-sm text-amber-500 dark:text-amber-400 cursor-help" />
                    </TooltipWrapper>
                  </label>
                  <select
                    name="valor_documental_id"
                    value={form.valor_documental_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 text-base font-medium"
                  >
                    <option value="">Selecciona un valor documental</option>
                    {catalogs.valores.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.nombre}
                      </option>
                    ))}
                  </select>

                  {errors.valor_documental_id && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.valor_documental_id}</p>}
                </div>
              </div>
              {/* fila 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Plazo de conservación (DINÁMICO) */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                    Plazo de Conservación *
                    <TooltipWrapper
                      tooltipKey="plazoConservacion"
                      content="<strong>Tiempo mínimo de conservación</strong>"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="text-sm text-amber-500 dark:text-amber-400 cursor-help" />
                    </TooltipWrapper>
                  </label>
                  <select
                    name="plazo_conservacion_id"
                    value={form.plazo_conservacion_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 text-base font-medium"
                  >
                    <option value="">Selecciona un plazo de conservación</option>
                    {catalogs.plazos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.descripcion}
                      </option>
                    ))}
                  </select>

                  {errors.plazo_conservacion_id && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.plazo_conservacion_id}</p>}
                </div>

                {/* Destino final (DINÁMICO) */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                    Destino Final *
                    <TooltipWrapper
                      tooltipKey="destinoFinal"
                      content="<strong>Acción al finalizar la conservación</strong>"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="text-sm text-amber-500 dark:text-amber-400 cursor-help" />
                    </TooltipWrapper>
                  </label>
                  <select
                    name="destino_final_id"
                    value={form.destino_final_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 text-base font-medium"
                  >
                    <option value="">Selecciona un destino final</option>
                    {catalogs.destinos.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nombre}
                      </option>
                    ))}
                  </select>

                  {errors.destino_final_id && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.destino_final_id}</p>}
                </div>

                {/* Soporte (DINÁMICO) */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                    Soporte Documental *
                    <TooltipWrapper
                      tooltipKey="soporteDocumental"
                      content="<strong>Origen/Formato del documento</strong>"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="text-sm text-amber-500 dark:text-amber-400 cursor-help" />
                    </TooltipWrapper>
                  </label>
                  <select
                    name="soporte_id"
                    value={form.soporte_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 text-base font-medium"
                  >
                    <option value="">Selecciona un tipo de soporte</option>
                    {catalogs.soportes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>

                  {errors.soporte_id && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.soporte_id}</p>}
                </div>
              </div>

              {/* fila 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Folio */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                    Folio del Documento
                    <TooltipWrapper
                      tooltipKey="folio"
                      content="<strong>Identificador de ubicación dentro del expediente</strong>"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="text-sm text-amber-500 dark:text-amber-400 cursor-help" />
                    </TooltipWrapper>
                  </label>
                  <input
                    type="text"
                    name="folio_documento"
                    value={form.folio_documento}
                    onChange={handleChange}
                    placeholder="Ej: 001/2025, A-001"
                    className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 text-base font-medium"
                  />
                </div>

                {/* Tipo de Documento (DINÁMICO desde /tiposDocumentos) */}
                <div>
                  <label className="block mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                    Tipo de Documento *
                  </label>
                  <select
                    name="tipos_documentos_id"
                    value={form.tipos_documentos_id || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                  >
                    <option value="">Selecciona tipo de documento</option>
                    {catalogs.tiposDocumentos?.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.tipo}
                      </option>
                    ))}
                  </select>
                  {errors.tipos_documentos_id && (
                    <p className="text-red-500 text-sm mt-2 font-semibold">
                      {errors.tipos_documentos_id}
                    </p>
                  )}
                </div>


                {/* Departamento (DINÁMICO) */}
                <div>
                  <label className="block mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                    Departamento *
                  </label>
                  <select
                    name="departamentos_id"
                    value={form.departamentos_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 text-base font-medium"
                  >
                    <option value="">Selecciona un departamento</option>
                    {catalogs.departamentos.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nombre}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* (Opcional) Periodo ID si quieres exponerlo */}
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">Periodo ID (opcional)</label>
                  <input
                    type="number"
                    name="periodos_id"
                    value={form.periodos_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 text-base font-medium"
                  />
                </div>
              </div> */}
            </div>
          </div>

          {/* SECCIÓN 3: Archivo */}
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">📁</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 flex items-center gap-2">
                  3. Archivo Digital
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="text-lg text-green-600 dark:text-green-400 cursor-help hover:text-green-800 dark:hover:text-green-200 transition-colors"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    />
                    {showTooltip && (
                      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg border border-gray-600 min-w-max">
                        <div className="space-y-2">
                          <div>
                            <span className="font-semibold text-green-400">Formatos admitidos:</span>
                            <div className="text-xs mt-1">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, JPEG, PNG, TXT</div>
                          </div>
                          <div>
                            <span className="font-semibold text-blue-400">Tamaño máximo:</span>
                            <div className="text-xs mt-1">150 MB por archivo</div>
                          </div>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 border-r border-b border-gray-600 rotate-45"></div>
                      </div>
                    )}
                  </div>
                </h2>
                <p className="text-green-700 dark:text-green-300 font-medium">Carga y valida el archivo digital del documento</p>
              </div>
            </div>

            {/* preview archivo */}
            {form.file && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faFileAlt} className="text-white text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-green-800 dark:text-green-200">
                      <strong>Archivo seleccionado:</strong> {form.file.name}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                        {(form.file.name || "").split("/").pop()?.toUpperCase() || "FILE"} •{" "}
                        {(form.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">✅ Archivo válido</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-green-400/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FontAwesomeIcon icon={faFileAlt} className="text-xl relative z-10" />
                <span className="text-xl relative z-10">{form.file ? "🔄 Cambiar Archivo" : "📁 Seleccionar Archivo"}</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault(); // 🔒 evita recarga del form
                  console.log("🟢 CLICK DETECTADO"); // ✅ verifica que funcione
                  handleUpload();
                }}
                disabled={uploading || !form.file}
                className={`group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-4 text-lg font-bold rounded-xl shadow-lg transition-all duration-300 transform overflow-hidden ${uploading || !form.file
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed text-gray-200 shadow-none"
                  : "bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-purple-600 hover:to-blue-800 text-white hover:shadow-2xl hover:scale-105 active:scale-95 border border-blue-400/30"
                  }`}
              >
                {!uploading && !form.file && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                )}
                {!(uploading || !form.file) && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  </>
                )}
                <FontAwesomeIcon icon={faUpload} className="text-xl relative z-10" />
                <span className="text-xl relative z-10">
                  {uploading ? "⬆️ Subiendo documento..." : "🚀 Subir Documento"}
                </span>
              </button>

            </div>

            {/* Error */}
            {errorMessage && (
              <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-xl">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-xl" />
                  <p className="text-red-700 dark:text-red-300 text-base font-semibold">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* input file oculto */}
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              onChange={handleChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
              className="hidden"
            />
            {errors.file && (
              <div className="mt-4 text-center">
                <p className="text-red-500 text-sm font-semibold">{errors.file}</p>
              </div>
            )}
          </div>
        </div>

        {/* input duplicado (compat) */}
        <input ref={fileInputRef} type="file" name="file" onChange={handleChange} className="hidden" />

        {/* PROGRESO modal */}
        {uploading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4">
                  <CircularProgressbar
                    value={uploadProgress}
                    text={`${uploadProgress}%`}
                    styles={buildStyles({
                      textColor: darkMode ? "#ffffff" : "#000000",
                      pathColor: "#3b82f6",
                      trailColor: darkMode ? "#374151" : "#e5e7eb",
                    })}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Subiendo archivo...</h3>
                <p className="text-gray-600 dark:text-gray-400">Por favor espera mientras procesamos tu documento.</p>
              </div>
            </div>
          </div>
        )}

        {/* ÉXITO modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">¡Archivo subido exitosamente!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Tu documento ha sido procesado y guardado correctamente.</p>
                {uploadedFileUrl && (
                  <div className="mb-4">
                    <a
                      href={uploadedFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Descargar
                    </a>
                  </div>
                )}
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}