import React, { useState, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import Link from "next/link";
import BackToHomeButton from "@/components/BackToHomeButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faMoon, faSun, faExclamationTriangle, faCheckCircle, faDownload, faUpload, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ALLOWED_FILE_TYPES = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "text/plain": "TXT"
};
const MAX_FILE_SIZE = 150 * 1024 * 1024;

export default function UploadNew({ session }) {
  // Campos requeridos por LEA-BCS y wizard
  const [form, setForm] = useState({
    nombre: "",
    jefatura: session?.user?.jefatura || "",
    file: null,
    serie: "",
    subserie: "",
    codigo_clasificacion: "",
    numero_expediente: "",
    valor_documental: "",
    plazo_conservacion: "",
    destino_final: "",
    soporte_documental: "",
    procedencia_admin: "",
    folio_documento: "",
    classification: "",
    vigencia: "",
    observaciones: "",
    fecha_documento: "",
    fecha_recepcion: "",
    unidad_productora: "",
    responsable: ""
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1);
    const fileInputRef = useRef();

    // Opciones de select (puedes expandir según tu lógica)
    const CUADRO_CLASIFICACION = {
      "ADM-001": "Administrativo General",
      "LEG-002": "Legal",
      "FIS-003": "Fiscal",
      "HIS-004": "Histórico"
    };
    const VALORES_DOCUMENTALES = {
      "Administrativo": "Administrativo",
      "Legal": "Legal",
      "Fiscal": "Fiscal",
      "Histórico": "Histórico"
    };
    const PLAZOS_CONSERVACION = {
      "1": "1 año",
      "3": "3 años",
      "5": "5 años",
      "10": "10 años",
      "Permanente": "Permanente"
    };
    const DESTINOS_FINALES = {
      "Conservación Permanente": "Conservación Permanente",
      "Baja Documental": "Baja Documental",
      "Transferencia": "Transferencia"
    };
    const SOPORTES_DOCUMENTALES = {
      "Original": "Original",
      "Copia": "Copia",
      "Digitalización": "Digitalización"
    };

    // Validación profesional por paso
    // Validación profesional por paso
    const validateStep = (currentStep = step) => {
      const newErrors = {};
      if (currentStep === 1) {
        if (!form.nombre) newErrors.nombre = "Campo requerido";
        if (!form.file) newErrors.file = "Campo requerido";
        if (!form.fecha_documento) newErrors.fecha_documento = "Campo requerido";
        if (!form.fecha_recepcion) newErrors.fecha_recepcion = "Campo requerido";
      }
      if (currentStep === 2) {
        if (!form.codigo_clasificacion) newErrors.codigo_clasificacion = "Campo requerido";
        if (!form.serie) newErrors.serie = "Campo requerido";
        if (!form.valor_documental) newErrors.valor_documental = "Campo requerido";
        if (!form.plazo_conservacion) newErrors.plazo_conservacion = "Campo requerido";
        if (!form.destino_final) newErrors.destino_final = "Campo requerido";
        if (!form.soporte_documental) newErrors.soporte_documental = "Campo requerido";
        if (!form.procedencia_admin) newErrors.procedencia_admin = "Campo requerido";
        if (!form.unidad_productora) newErrors.unidad_productora = "Campo requerido";
        if (!form.responsable) newErrors.responsable = "Campo requerido";
      }
      if (currentStep === 3) {
        if (!form.classification) newErrors.classification = "Campo requerido";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Validación sin modificar estado (solo para mostrar color de pasos)
    const isStepComplete = (currentStep) => {
      if (currentStep === 1) {
        return form.nombre && form.file && form.fecha_documento && form.fecha_recepcion;
      }
      if (currentStep === 2) {
        return (
          form.codigo_clasificacion &&
          form.serie &&
          form.valor_documental &&
          form.plazo_conservacion &&
          form.destino_final &&
          form.soporte_documental &&
          form.procedencia_admin &&
          form.unidad_productora &&
          form.responsable
        );
      }
      if (currentStep === 3) {
        return form.classification;
      }
      return false;
    };

    // Manejo de cambios
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === "file") {
        const file = files[0];
        if (file) {
          if (!ALLOWED_FILE_TYPES[file.type]) {
            setErrors((prev) => ({ ...prev, file: "Tipo de archivo no permitido" }));
            return;
          }
          if (file.size > MAX_FILE_SIZE) {
            setErrors((prev) => ({ ...prev, file: "Archivo demasiado grande" }));
            return;
          }
          setForm((prev) => ({ ...prev, file }));
          setErrors((prev) => ({ ...prev, file: undefined }));
        }
      } else {
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    };

    // Subida de archivo (dummy, puedes adaptar a tu API)
    const handleUpload = async () => {
      if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;
      setUploading(true);
      setErrorMessage("");
      setUploadProgress(0);
      setTimeout(() => {
        setUploadedFileUrl("/uploads/ejemplo.pdf");
        setShowModal(true);
        setUploading(false);
      }, 1500);
    };

    const closeModal = () => {
      setShowModal(false);
      setUploadProgress(0);
    };

    // Nombres de los pasos
    const stepTitles = [
      "Subir nuevo documento",
      "Datos de clasificación y gestión",
      "Detalles y tipo documental"
    ];

    return (
      <>
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-white via-blue-50 to-white"}`}>
          <div className={`${darkMode ? "bg-gray-900 border-b border-blue-900 shadow-lg" : "bg-white border-b border-gray-100 shadow-sm"} px-12 py-6`}>
            <div className="relative flex items-center justify-between w-full">
              <div className="absolute left-12">
                <Image src={darkMode ? "/api-dark23.png" : "/api.jpg"} alt="Logo API" width={380} height={130} className="object-contain transition-opacity duration-300" />
              </div>
              <div className="w-full flex flex-col items-center justify-center">
                <h1 className={`text-4xl font-extrabold text-center tracking-tight ${darkMode ? "text-blue-200" : "text-blue-700"}`}>Subir Documentos</h1>
                <div className={`h-1 w-32 mx-auto mt-2 bg-gradient-to-r from-blue-500 to-green-400 rounded-full animate-pulse ${darkMode ? "opacity-80" : ""}`}></div>
              </div>
              <div className="absolute right-12 flex items-center gap-4">
                {darkMode ? (
                  <Image src="/blanca.jpeg" alt="Avatar" width={64} height={64} className="w-16 h-16 object-cover" />
                ) : (
                  <Image src="/blanca.jpeg" alt="Avatar" width={64} height={64} className="w-16 h-16 object-cover rounded-xl shadow-lg border-none" />
                )}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-3 rounded-xl transition-all duration-300 border group ${darkMode ? "bg-gray-800 border-blue-900 hover:bg-blue-900" : "bg-blue-50 border-blue-100 hover:bg-blue-100"}`}
                  title="Cambiar tema"
                >
                  <FontAwesomeIcon
                    icon={darkMode ? faSun : faMoon}
                    className={`text-xl ${darkMode ? "text-blue-200" : "text-blue-500"} group-hover:animate-spin-slow`}
                    style={{ transition: 'transform 0.5s', willChange: 'transform' }}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className={`${darkMode ? "bg-gradient-to-r from-gray-900 via-blue-900/10 to-gray-900 border-b border-blue-900" : "bg-gradient-to-r from-white via-blue-50 to-white border-b border-gray-100"} px-12 py-6`}>
            <div className="flex justify-start">
              <BackToHomeButton label="Volver al Inicio" size="lg" color="blue" darkMode={darkMode} />
            </div>
          </div>
          <div className="w-full max-w-screen-2xl mx-auto px-2 py-10">
            <div className={`${darkMode ? "bg-gray-900 rounded-3xl shadow-2xl p-16 border border-blue-900" : "bg-white rounded-3xl shadow-xl p-16 border border-blue-100"}`}>
              <h2 className={`text-2xl font-extrabold mb-6 tracking-tight ${darkMode ? "text-blue-200" : "text-blue-700"}`}>{stepTitles[step-1]}</h2>
              {/* Wizard horizontal */}
              <div className="flex flex-col md:flex-row gap-8">
                {/* Pasos */}
                <div className="flex md:flex-col gap-4 md:w-1/5 w-full mb-6 md:mb-0">
                  {[1,2,3].map((s) => {
                    let isComplete = isStepComplete(s);
                    let colorClass = '';
                    if (step === s) {
                      colorClass = darkMode ? 'bg-blue-700 text-white border-blue-400 shadow-md' : 'bg-blue-500 text-white border-blue-500 shadow-md';
                    } else if (isComplete) {
                      colorClass = darkMode ? 'bg-green-600 text-white border-green-400 shadow-sm' : 'bg-green-400 text-white border-green-400 shadow-sm';
                    } else {
                      colorClass = darkMode ? 'bg-gray-800 text-blue-200 border-blue-900 hover:bg-blue-900' : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100';
                    }
                    return (
                      <button key={s} type="button" onClick={() => setStep(s)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 border-2 ${colorClass}`}
                        style={{ fontSize: '1.2rem' }}
                      >
                        Paso {s}
                      </button>
                    );
                  })}
                </div>
                {/* Formulario por paso */}
                <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {step === 1 && (
                    <>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="nombre">
                          Nombre del documento
                          <Tooltip title="Nombre claro y descriptivo del documento. Ejemplo: Acta de reunión mensual" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-blue-300" : "text-blue-400"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <input type="text" id="nombre" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Acta de reunión mensual" className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`} />
                        {errors.nombre && <div className="text-red-500 text-xs mt-1">{errors.nombre}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="file">
                          Archivo
                          <Tooltip title="Solo formatos permitidos por la ley. Máximo 150MB. PDF, DOC, DOCX, JPG, PNG, TXT" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-blue-300" : "text-blue-400"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <input type="file" id="file" name="file" ref={fileInputRef} onChange={handleChange} className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`} />
                        {errors.file && <div className="text-red-500 text-xs mt-1">{errors.file}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="fecha_documento">
                          Fecha del documento
                          <Tooltip title="Fecha en que se generó el documento" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-blue-300" : "text-blue-400"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <input type="date" id="fecha_documento" name="fecha_documento" value={form.fecha_documento} onChange={handleChange} className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`} />
                        {errors.fecha_documento && <div className="text-red-500 text-xs mt-1">{errors.fecha_documento}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="fecha_recepcion">
                          Fecha de recepción
                          <Tooltip title="Fecha en que se recibió el documento" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-blue-300" : "text-blue-400"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <input type="date" id="fecha_recepcion" name="fecha_recepcion" value={form.fecha_recepcion} onChange={handleChange} className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`} />
                        {errors.fecha_recepcion && <div className="text-red-500 text-xs mt-1">{errors.fecha_recepcion}</div>}
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="codigo_clasificacion">
                          Código de Clasificación Archivística
                          <Tooltip title="Código que determina el área y tipo de documento según la Ley Estatal de Archivos. Ejemplo: ADM-001" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-amber-300" : "text-amber-500"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <select name="codigo_clasificacion" value={form.codigo_clasificacion} onChange={handleChange} className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`}>
                          <option value="">Selecciona código</option>
                          {Object.entries(CUADRO_CLASIFICACION).map(([codigo, descripcion]) => (
                            <option key={codigo} value={codigo}>{codigo} - {descripcion}</option>
                          ))}
                        </select>
                        {errors.codigo_clasificacion && <div className="text-red-500 text-xs mt-1">{errors.codigo_clasificacion}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="serie">
                          Serie Documental
                          <Tooltip title="Serie documental según el cuadro de clasificación institucional" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-amber-300" : "text-amber-500"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <input type="text" id="serie" name="serie" value={form.serie} onChange={handleChange} placeholder="Ej: Expedientes de contratos" className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`} />
                        {errors.serie && <div className="text-red-500 text-xs mt-1">{errors.serie}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="valor_documental">
                          Valor Documental
                          <Tooltip title="Importancia del documento: Administrativo, Legal, Fiscal, Histórico" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-amber-300" : "text-amber-500"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <select name="valor_documental" value={form.valor_documental} onChange={handleChange} className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`}>
                          <option value="">Selecciona valor</option>
                          {Object.entries(VALORES_DOCUMENTALES).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        {errors.valor_documental && <div className="text-red-500 text-xs mt-1">{errors.valor_documental}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="plazo_conservacion">
                          Plazo de Conservación
                          <Tooltip title="Tiempo mínimo de conservación según la ley. Ejemplo: 5 años, Permanente" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-amber-300" : "text-amber-500"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <select name="plazo_conservacion" value={form.plazo_conservacion} onChange={handleChange} className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`}>
                          <option value="">Selecciona plazo</option>
                          {Object.entries(PLAZOS_CONSERVACION).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        {errors.plazo_conservacion && <div className="text-red-500 text-xs mt-1">{errors.plazo_conservacion}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="destino_final">
                          Destino Final
                          <Tooltip title="Qué sucede después del plazo de conservación: Conservación Permanente, Baja Documental, Transferencia" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-amber-300" : "text-amber-500"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <select name="destino_final" value={form.destino_final} onChange={handleChange} className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`}>
                          <option value="">Selecciona destino</option>
                          {Object.entries(DESTINOS_FINALES).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        {errors.destino_final && <div className="text-red-500 text-xs mt-1">{errors.destino_final}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="soporte_documental">
                          Soporte Documental
                          <Tooltip title="Origen del documento: Original, Copia, Digitalización" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-amber-300" : "text-amber-500"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <select name="soporte_documental" value={form.soporte_documental} onChange={handleChange} className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`}>
                          <option value="">Selecciona soporte</option>
                          {Object.entries(SOPORTES_DOCUMENTALES).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        {errors.soporte_documental && <div className="text-red-500 text-xs mt-1">{errors.soporte_documental}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="procedencia_admin">
                          Procedencia Administrativa
                          <Tooltip title="Área administrativa responsable del documento. Ejemplo: Dirección General" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-amber-300" : "text-amber-500"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <input type="text" id="procedencia_admin" name="procedencia_admin" value={form.procedencia_admin} onChange={handleChange} placeholder="Ej: Dirección General" className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`} />
                        {errors.procedencia_admin && <div className="text-red-500 text-xs mt-1">{errors.procedencia_admin}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="unidad_productora">
                          Unidad productora
                          <Tooltip title="Área o unidad que produce el documento" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-blue-300" : "text-blue-400"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <input type="text" id="unidad_productora" name="unidad_productora" value={form.unidad_productora} onChange={handleChange} placeholder="Ej: Recursos Humanos" className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`} />
                        {errors.unidad_productora && <div className="text-red-500 text-xs mt-1">{errors.unidad_productora}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="responsable">
                          Responsable
                          <Tooltip title="Persona responsable del documento" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-blue-300" : "text-blue-400"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <input type="text" id="responsable" name="responsable" value={form.responsable} onChange={handleChange} placeholder="Ej: Juan Pérez" className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`} />
                        {errors.responsable && <div className="text-red-500 text-xs mt-1">{errors.responsable}</div>}
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="classification">
                          Tipo de Documento
                          <Tooltip title="Tipo documental: Acuerdo, Acta, Circular, Informe, Memorándum, Oficio, Otro" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-amber-300" : "text-amber-500"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <select name="classification" value={form.classification} onChange={handleChange} className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`}>
                          <option value="">Selecciona tipo</option>
                          <option value="Acuerdo">Acuerdo</option>
                          <option value="Acta">Acta</option>
                          <option value="Circular">Circular</option>
                          <option value="Informe">Informe</option>
                          <option value="Memorándum">Memorándum</option>
                          <option value="Oficio">Oficio</option>
                          <option value="Otro">Otro</option>
                        </select>
                        {errors.classification && <div className="text-red-500 text-xs mt-1">{errors.classification}</div>}
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="vigencia">
                          Estado de Vigencia
                          <Tooltip title="Estado actual del documento: Vigente, Temporal, Vencido" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-amber-300" : "text-amber-500"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <select name="vigencia" value={form.vigencia} onChange={handleChange} className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`}>
                          <option value="">Selecciona vigencia</option>
                          <option value="Vigente">Vigente</option>
                          <option value="Temporal">Temporal</option>
                          <option value="Vencido">Vencido</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="folio_documento">
                          Folio del Documento
                          <Tooltip title="Número de página o posición dentro del expediente. Ejemplo: 001/2025" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-amber-300" : "text-amber-500"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <input type="text" id="folio_documento" name="folio_documento" value={form.folio_documento} onChange={handleChange} placeholder="Ej: 001/2025" className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`} />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-blue-200" : "text-blue-700"}`} htmlFor="observaciones">
                          Observaciones
                          <Tooltip title="Observaciones adicionales relevantes para la gestión documental" arrow>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={`ml-2 ${darkMode ? "text-blue-300" : "text-blue-400"} cursor-help`} />
                          </Tooltip>
                        </label>
                        <textarea id="observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} rows={2} placeholder="Observaciones adicionales..." className={`w-full px-4 py-3 border-2 rounded-lg ${darkMode ? "bg-gray-800 text-blue-100 border-blue-900 focus:ring-2 focus:ring-blue-700 focus:border-blue-700" : "bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"} transition`} />
                      </div>
                    </>
                  )}
                  <div className="col-span-2 flex justify-between mt-8">
                    {step > 1 && <button type="button" className={`px-6 py-2 rounded-lg font-bold transition border ${darkMode ? "bg-gray-800 text-blue-200 border-blue-900 hover:bg-blue-900" : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"}`} onClick={() => setStep(step-1)}>Anterior</button>}
                    {step < 3 && <button type="button" className={`px-6 py-2 rounded-lg font-bold shadow-md transition border ${darkMode ? "bg-blue-700 text-white border-blue-400 hover:bg-blue-800" : "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"}`} onClick={() => {if(validateStep()) setStep(step+1);}}>Siguiente</button>}
                    {step === 3 && <button type="button" className={`px-6 py-2 rounded-lg font-bold shadow-md transition border ${darkMode ? "bg-green-600 text-white border-green-400 hover:bg-green-700" : "bg-green-400 text-white border-green-400 hover:bg-green-500"}`} onClick={handleUpload} disabled={uploading}>{uploading ? "Subiendo..." : "Subir documento"}</button>}
                  </div>
                </form>
              </div>
              {errorMessage && (<div className="mt-4 text-red-600">{errorMessage}</div>)}
              {uploadedFileUrl && (<div className="mt-4 text-green-600">Archivo subido: {uploadedFileUrl}</div>)}
            </div>
          </div>
          {/* Modal de éxito */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <div className="text-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">¡Archivo subido exitosamente!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Tu documento ha sido procesado y guardado correctamente.</p>
                  {uploadedFileUrl && (
                    <a
                      href={uploadedFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                      Ver documento
                    </a>
                  )}
                  <button
                    className="mt-6 px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold"
                    onClick={closeModal}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
}
