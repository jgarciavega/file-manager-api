'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faMoon, 
  faSun, 
  faArrowLeft, 
  faDownload, 
  faFileAlt, 
  faFilePdf,
  faExclamationTriangle,
  faCheckCircle,
  faInfoCircle,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import avatarMap from '../../../lib/avatarMap';
import Link from 'next/link';


export default function UploadNew() {
  // Referencia para el input de archivo
  const fileInputRef = useRef(null);

  // Tipos de archivo permitidos
  const ALLOWED_FILE_TYPES = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'image/jpeg': 'JPG/JPEG',
    'image/png': 'PNG',
    'text/plain': 'TXT'
  };

  // Tamaño máximo de archivo (150MB)
  const MAX_FILE_SIZE = 150 * 1024 * 1024;

  // Estado para modal de éxito
  const [showModal, setShowModal] = useState(false);

  // Estado para la URL del archivo subido
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  // Estado para mensaje de error general
  const [errorMessage, setErrorMessage] = useState("");
  // Estado para saber si se está subiendo un archivo
  const [uploading, setUploading] = useState(false);
  const { data: session, status } = useSession();

  // Estado para modo oscuro
  const [darkMode, setDarkMode] = useState(false);

  // Estado para tooltips
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
    folio: false
  });

  // Estado para tooltip de archivo digital
  const [showTooltip, setShowTooltip] = useState(false);

  // Estado para errores del formulario
  const [errors, setErrors] = useState({});

  // Estado para progreso de subida
  const [uploadProgress, setUploadProgress] = useState(0);

  // Estado para los campos del formulario
  const [form, setForm] = useState({
    nombre: '',
    review: '',
    jefatura: '',
    file: null,
    codigo_clasificacion: '',
    serie: '',
    subserie: '',
    expediente: '',
    fecha_creacion: '',
    vigencia: '',
    acceso: '',
    observaciones: '',
    classification: '',
    valor_documental: '',
    plazo_conservacion: '',
    destino_final: '',
    soporte_documental: '',
    numero_expediente: '',
    folio_documento: '',
    procedencia_admin: ''
  });

  // Estados del formulario

  const userEmail = session?.user?.email || 'default';
  const userName = session?.user?.name || 'Usuario';
  const userAvatar = avatarMap[userEmail] || '/default-avatar.png';

  // ...existing code...


  // Render principal UNIFICADO
  // ...todo el contenido del formulario y helpers debe estar dentro de este único return principal...

  const PLAZOS_CONSERVACION = {
    '1': '1 año',
    '2': '2 años', 
    '3': '3 años',
    '5': '5 años',
    '10': '10 años',
    '15': '15 años',
    '20': '20 años',
    '30': '30 años',
    'permanente': 'Conservación Permanente'
  };

  const DESTINOS_FINALES = {
    'conservacion_permanente': 'Conservación Permanente',
    'baja_documental': 'Baja Documental',
    'transferencia_historico': 'Transferencia a Archivo Histórico'
  };

  const SOPORTES_DOCUMENTALES = {
    'original_fisico': 'Original Físico',
    'original_digital': 'Original Digital', 
    'copia_fisica': 'Copia Física',
    'copia_digital': 'Copia Digital',
    'digitalizacion': 'Digitalización de Original Físico'
  };

  // Catálogo de valores documentales (ejemplo, personaliza según tu sistema)
  const VALORES_DOCUMENTALES = {
    'administrativo': 'Administrativo',
    'legal': 'Legal',
    'fiscal': 'Fiscal',
    'historico': 'Histórico'
  };

  // Catálogo de clasificación archivística (ejemplo, personaliza según tu sistema)
  const CUADRO_CLASIFICACION = {
    '100': 'Administración General',
    '200': 'Recursos Humanos',
    '300': 'Finanzas',
    '400': 'Jurídico',
    '500': 'Operaciones',
    '600': 'Planeación',
    '700': 'Informática',
    '800': 'Contraloría',
    '900': 'Otros'
  };

  // Función helper para manejar tooltips
  const toggleTooltip = (key, show) => {
    setTooltips(prev => ({
      ...prev,
      [key]: show
    }));
  };

  // Componente tooltip reutilizable mejorado
  const TooltipWrapper = ({ tooltipKey, content, children, position = 'top' }) => (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => toggleTooltip(tooltipKey, true)}
        onMouseLeave={() => toggleTooltip(tooltipKey, false)}
        onClick={(e) => e.stopPropagation()} // Prevenir que el clic cierre el tooltip
      >
        {children}
      </div>
      {tooltips[tooltipKey] && (
        <div 
          className={`absolute z-50 ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 transform -translate-x-1/2 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg border border-gray-600 min-w-max max-w-xs pointer-events-auto`}
          onClick={(e) => e.stopPropagation()} // Prevenir que el clic en el tooltip lo cierre
          onMouseEnter={() => toggleTooltip(tooltipKey, true)} // Mantener abierto si el mouse está sobre el tooltip
          onMouseLeave={() => toggleTooltip(tooltipKey, false)} // Cerrar al salir del tooltip
        >
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <div className={`absolute ${position === 'top' ? 'top-full' : 'bottom-full'} left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 border-r border-b border-gray-600 ${position === 'top' ? 'rotate-45' : '-rotate-45'}`}></div>
        </div>
      )}
    </div>
  );

  // useEffect para cerrar tooltips al hacer clic fuera o después de un tiempo
  useEffect(() => {
    const handleClickOutside = () => {
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
        folio: false
      });
    };

    // Agregar listener para clics en el documento
    document.addEventListener('click', handleClickOutside);
    
    // Cleanup al desmontar el componente
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Auto-cerrar tooltips después de 5 segundos
  useEffect(() => {
    const activeTooltips = Object.keys(tooltips).filter(key => tooltips[key]);
    
    if (activeTooltips.length > 0) {
      const timer = setTimeout(() => {
        setTooltips(prev => ({
          ...prev,
          ...Object.fromEntries(activeTooltips.map(key => [key, false]))
        }));
      }, 5000); // 5 segundos

      return () => clearTimeout(timer);
    }
  }, [tooltips]);

  // Eliminados returns condicionales para permitir renderizado completo

  // --- LOGO GRANDE Y VISUALMENTE DESTACADO ---
  const LogoGrande = () => (
    <div className="flex justify-center items-center w-full my-8">
      <Image
        src="/api_logo.png"
        alt="Logo API"
        width={180}
        height={180}
        className="rounded-2xl shadow-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 object-contain"
        priority
      />
    </div>
  );

  // 🏛️ FUNCIÓN PARA GENERAR NÚMERO DE EXPEDIENTE
  const generarNumeroExpediente = () => {
    const año = new Date().getFullYear();
    const mes = String(new Date().getMonth() + 1).padStart(2, '0');
    const codigo = form.codigo_clasificacion || '000';
    const correlativo = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    
    return `API-${año}-${codigo}-${correlativo}`;
  };

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files && files[0]) {
      const file = files[0];
      
      // Validar tipo de archivo
      if (!ALLOWED_FILE_TYPES[file.type]) {
        const allowedFormats = Object.values(ALLOWED_FILE_TYPES).join(', ');
        alert(`❌ Formato de archivo no permitido.\n\nFormatos aceptados: ${allowedFormats}\n\nArchivo seleccionado: ${file.type || 'Desconocido'}`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validar tamaño de archivo
      if (file.size > MAX_FILE_SIZE) {
        alert(`❌ El archivo es demasiado grande.\n\nTamaño máximo: 150MB\nTamaño del archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setForm(prev => ({ ...prev, file }));
      setErrors(prev => ({ ...prev, file: undefined }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
        // Auto-generar expediente si se selecciona código de clasificación
        ...(name === 'codigo_clasificacion' && value ? { numero_expediente: generarNumeroExpediente() } : {})
      }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    // ✅ VALIDACIONES BÁSICAS ESENCIALES
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre del documento es obligatorio.';
    if (!form.review.trim()) newErrors.review = 'La descripción del contenido es obligatoria.';
    if (!form.jefatura.trim()) newErrors.jefatura = 'La jefatura responsable es obligatoria.';
    if (!form.file) newErrors.file = 'Debes seleccionar un archivo.';
    
    // 🏛️ VALIDACIONES ARCHIVÍSTICAS OBLIGATORIAS - LEY DE ARCHIVOS BCS
    if (!form.codigo_clasificacion.trim()) {
      newErrors.codigo_clasificacion = 'El código de clasificación archivística es obligatorio.';
    }
    if (!form.serie.trim()) newErrors.serie = 'La serie documental es obligatoria.';
    if (!form.valor_documental.trim()) {
      newErrors.valor_documental = 'El valor documental es obligatorio.';
    }
    if (!form.plazo_conservacion.trim()) {
      newErrors.plazo_conservacion = 'El plazo de conservación es obligatorio.';
    }
    if (!form.destino_final.trim()) {
      newErrors.destino_final = 'El destino final es obligatorio.';
    }
    if (!form.soporte_documental.trim()) {
      newErrors.soporte_documental = 'El tipo de soporte documental es obligatorio.';
    }
    if (!form.procedencia_admin.trim()) {
      newErrors.procedencia_admin = 'La procedencia administrativa es obligatoria.';
    }
    if (!form.classification.trim()) {
      newErrors.classification = 'El tipo de documento es obligatorio.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función de subida
  const handleUpload = async () => {
    if (!validateForm()) return;

    setUploading(true);
    setUploadProgress(0);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', form.file);
      formData.append('nombre', form.nombre);
      formData.append('classification', form.classification);
      formData.append('jefatura', form.jefatura);
      formData.append('review', form.review);
      formData.append('serie', form.serie);
      formData.append('subserie', form.subserie);
      formData.append('expediente', form.expediente);
      formData.append('fecha_creacion', form.fecha_creacion);
      formData.append('vigencia', form.vigencia);
      formData.append('acceso', form.acceso);
      formData.append('observaciones', form.observaciones);
      formData.append('usuarioId', session.user.id);
      
      // 🏛️ CAMPOS ARCHIVÍSTICOS PARA LA API
      formData.append('codigo_clasificacion', form.codigo_clasificacion);
      formData.append('valor_documental', form.valor_documental);
      formData.append('plazo_conservacion', form.plazo_conservacion);
      formData.append('destino_final', form.destino_final);
      formData.append('soporte_documental', form.soporte_documental);
      formData.append('numero_expediente', form.numero_expediente);
      formData.append('folio_documento', form.folio_documento);
      formData.append('procedencia_admin', form.procedencia_admin);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setUploadedFileUrl(response.fileUrl || '');
            setShowModal(true);
            setForm({
              nombre: '',
              jefatura: '',
              review: '',
              file: null,
              serie: '',
              subserie: '',
              expediente: '',
              fecha_creacion: '',
              vigencia: '',
              acceso: '',
              observaciones: '',
              classification: '',
              // 🏛️ RESETEO DE CAMPOS ARCHIVÍSTICOS
              codigo_clasificacion: '',
              valor_documental: '',
              plazo_conservacion: '',
              destino_final: '',
              soporte_documental: '',
              numero_expediente: '',
              folio_documento: '',
              procedencia_admin: ''
            });
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } else {
            setErrorMessage(response.message || 'Error al subir el archivo');
          }
        } else {
          setErrorMessage('Error de conexión');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setErrorMessage('Error de red');
        setUploading(false);
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error inesperado');
      setUploading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setUploadProgress(0);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header reorganizado: Logo izquierda - Título centro - Avatar derecha */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-12 py-6">
        <div className="w-full flex items-center">
          {/* Logo más a la izquierda y aún más grande con imagen específica para modo oscuro */}
          <div className="absolute left-12">
            <Image 
              src={darkMode ? "/api-dark23.png" : "/api.jpg"}
              alt="Logo API" 
              width={300} 
              height={105} 
              className="object-contain transition-opacity duration-300" 
            />
          </div>
          
          {/* Título al centro con estilo profesional y animación de ondas */}
          <div className="w-full flex justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold drop-shadow-2xl wave-container">
                <span style={{animationDelay: '0.1s'}}>S</span>
                <span style={{animationDelay: '0.2s'}}>u</span>
                <span style={{animationDelay: '0.3s'}}>b</span>
                <span style={{animationDelay: '0.4s'}}>i</span>
                <span style={{animationDelay: '0.5s'}}>r</span>
                <span style={{animationDelay: '0.6s'}} className="ml-3">D</span>
                <span style={{animationDelay: '0.7s'}}>o</span>
                <span style={{animationDelay: '0.8s'}}>c</span>
                <span style={{animationDelay: '0.9s'}}>u</span>
                <span style={{animationDelay: '1.0s'}}>m</span>
                <span style={{animationDelay: '1.1s'}}>e</span>
                <span style={{animationDelay: '1.2s'}}>n</span>
                <span style={{animationDelay: '1.3s'}}>t</span>
                <span style={{animationDelay: '1.4s'}}>o</span>
                <span style={{animationDelay: '1.5s'}}>s</span>
              </h1>
              <div className="h-1 w-32 mx-auto mt-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Avatar y controles más a la derecha y más grandes */}
          <div className="absolute right-12 flex items-center gap-6">
            {/* Toggle modo oscuro más grande */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110"
              title="Cambiar tema"
            >
              <FontAwesomeIcon 
                icon={darkMode ? faSun : faMoon} 
                className="text-gray-600 dark:text-gray-300 text-xl" 
              />
            </button>

            {/* Avatar del usuario más grande */}
            {session?.user && (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700">
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                  <Image 
                    src="/blanca.jpeg" 
                    alt="Avatar" 
                    width={64} 
                    height={64} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden lg:block pr-2">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {session.user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {session.user.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón volver al inicio debajo del logo - Diseño ultra premium */}
      <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 px-12 py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-start">
          <Link 
            href="/home" 
            className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 border border-blue-400/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <FontAwesomeIcon icon={faArrowLeft} className="text-base relative z-10 group-hover:animate-bounce" />
            <span className="text-base relative z-10 group-hover:text-blue-100">🏠 Volver al inicio</span>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>

      {/* Formulario principal sin caja */}
      <div className="max-w-7xl mx-auto px-8 py-8">
          
          {/* Resumen de errores */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                <h3 className="font-semibold text-red-700">Corrige los siguientes errores</h3>
              </div>
              <ul className="list-disc list-inside space-y-1 text-red-600 text-sm">
                {Object.values(errors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-medium text-gray-700">
                  Subiendo archivo...
                </span>
                <span className="text-base text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 📄 FORMULARIO ÚNICO INTEGRADO - GESTIÓN DOCUMENTAL PROFESIONAL */}
          <div className="space-y-10">
            
            {/* 📄 SECCIÓN 1: IDENTIFICACIÓN DEL DOCUMENTO */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-8">
              {/* Encabezado Sección 1 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">📄</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    1. Información General del Documento
                  </h2>
                  <p className="text-blue-700 dark:text-blue-300 font-medium">
                    Información básica y descriptiva del documento
                  </p>
                </div>
              </div>

              {/* Campos de identificación */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Nombre del Documento */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
                    Nombre del Documento *
                    <TooltipWrapper 
                      tooltipKey="titulo" 
                      content="<strong>Nombre descriptivo del documento</strong><br/>Ejemplo: 'Oficio de solicitud', 'Acta de reunión', 'Contrato de servicios'"
                    >
                      <FontAwesomeIcon 
                        icon={faInfoCircle} 
                        className="text-sm text-blue-500 dark:text-blue-400 cursor-help hover:text-blue-700 dark:hover:text-blue-200 transition-colors"
                      />
                    </TooltipWrapper>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Acta de reunión mensual"
                    className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
                  />
                  {errors.nombre && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.nombre}</p>}
                </div>

                {/* Descripción del Contenido */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
                    Descripción del Contenido *
                    <TooltipWrapper 
                      tooltipKey="descripcion" 
                      content="<strong>Resumen del contenido y propósito</strong><br/>Describa brevemente qué contiene el documento y para qué se utiliza"
                    >
                      <FontAwesomeIcon 
                        icon={faInfoCircle} 
                        className="text-sm text-blue-500 dark:text-blue-400 cursor-help hover:text-blue-700 dark:hover:text-blue-200 transition-colors"
                      />
                    </TooltipWrapper>
                  </label>
                  <input
                    type="text"
                    name="review"
                    value={form.review}
                    onChange={handleChange}
                    placeholder="Ej: Descripción del contenido del documento"
                    className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
                  />
                  {errors.review && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.review}</p>}
                </div>

                {/* Jefatura Responsable */}
                <div>
                  <label className="block mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">Jefatura Responsable *</label>
                  <select
                    name="jefatura"
                    value={form.jefatura}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
                  >
                    <option value="">Selecciona una jefatura</option>
                    <option value="Administración y Finanzas">Administración y Finanzas</option>
                    <option value="Contraloría e Investigación">Contraloría e Investigación</option>
                    <option value="Coordinación General">Coordinación General</option>
                    <option value="Informática">Informática</option>
                    <option value="Jurídico">Jurídico</option>
                    <option value="Operaciones Portuarias">Operaciones Portuarias</option>
                    <option value="Planeación">Planeación</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
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
                    className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
                  />
                </div>

                {/* Nivel de Acceso */}
                <div>
                  <label className="block mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">Nivel de Acceso</label>
                  <select
                    name="acceso"
                    value={form.acceso}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
                  >
                    <option value="">Selecciona nivel de acceso</option>
                    <option value="Público">Público</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Confidencial">Confidencial</option>
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
                    className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical text-base font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 🏛️ SECCIÓN 2: METADATOS ARCHIVÍSTICOS OBLIGATORIOS */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl p-8">
              {/* Encabezado Sección 2 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">🏛️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                    2. Clasificación Archivística
                  </h2>
                  <p className="text-amber-700 dark:text-amber-300 font-medium">
                    Conforme a la Ley de Archivos Estatal de Baja California Sur
                  </p>
                </div>
              </div>
              
              {/* Aviso legal */}
              <div className="bg-white dark:bg-amber-900/30 rounded-xl p-4 border border-amber-300 dark:border-amber-600 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-amber-600 dark:text-amber-400 text-lg">⚖️</span>
                  <span className="font-semibold text-amber-800 dark:text-amber-200">Cumplimiento Legal Obligatorio</span>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                  Los siguientes campos son requeridos por la normatividad archivística estatal para garantizar 
                  la correcta gestión, conservación y acceso a los documentos públicos.
                </p>
              </div>

              {/* Campos archivísticos organizados */}
              <div className="space-y-6">
                {/* Primera fila: Clasificación y Control */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Código de Clasificación Archivística */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                      Código de Clasificación Archivística *
                      <TooltipWrapper 
                        tooltipKey="clasificacion" 
                        content="<strong>Código que determina el área y tipo de documento</strong><br/>Según normativa de la Ley de Archivos de BCS. Cada código identifica una función específica del gobierno."
                      >
                        <FontAwesomeIcon 
                          icon={faInfoCircle} 
                          className="text-sm text-amber-500 dark:text-amber-400 cursor-help hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
                        />
                      </TooltipWrapper>
                    </label>
                    <select
                      name="codigo_clasificacion"
                      value={form.codigo_clasificacion}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                    >
                      <option value="">Selecciona código de clasificación</option>
                      {Object.entries(CUADRO_CLASIFICACION).map(([codigo, descripcion]) => (
                        <option key={codigo} value={codigo}>
                          {codigo} - {descripcion}
                        </option>
                      ))}
                    </select>
                    {errors.codigo_clasificacion && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.codigo_clasificacion}</p>}
                  </div>

                  {/* Número de Expediente (Auto-generado) */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                      Número de Expediente
                      <TooltipWrapper 
                        tooltipKey="expediente" 
                        content="<strong>Generado automáticamente</strong><br/>Se crea basado en el código de clasificación seleccionado. Formato: [CÓDIGO]-[AÑO]-[CONSECUTIVO]"
                      >
                        <FontAwesomeIcon 
                          icon={faInfoCircle} 
                          className="text-sm text-amber-500 dark:text-amber-400 cursor-help hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
                        />
                      </TooltipWrapper>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="numero_expediente"
                        value={form.numero_expediente}
                        readOnly
                        placeholder="Se genera automáticamente"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-base font-mono cursor-not-allowed"
                      />
                      <div className="absolute right-3 top-3 text-gray-400">
                        <span className="text-sm font-semibold">AUTO</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Se genera al seleccionar código de clasificación
                    </p>
                  </div>

                  {/* Serie y Subserie Integradas */}
                  <div>
                    <label className="block mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">Serie Documental *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="serie"
                        value={form.serie}
                        onChange={handleChange}
                        placeholder="Serie"
                        className="px-3 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                      />
                      <input
                        type="text"
                        name="subserie"
                        value={form.subserie}
                        onChange={handleChange}
                        placeholder="Subserie"
                        className="px-3 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                      />
                    </div>
                    {errors.serie && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.serie}</p>}
                  </div>
                </div>

                {/* Segunda fila: Valores y Conservación */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Valor Documental */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                      Valor Documental *
                      <TooltipWrapper 
                        tooltipKey="valorDocumental" 
                        content="<strong>Importancia del documento</strong><br/><span class='text-blue-300'>Administrativo:</span> Tramites y procedimientos<br/><span class='text-green-300'>Legal:</span> Sustento jurídico<br/><span class='text-yellow-300'>Fiscal:</span> Recursos económicos<br/><span class='text-purple-300'>Histórico:</span> Valor cultural permanente"
                      >
                        <FontAwesomeIcon 
                          icon={faInfoCircle} 
                          className="text-sm text-amber-500 dark:text-amber-400 cursor-help hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
                        />
                      </TooltipWrapper>
                    </label>
                    <select
                      name="valor_documental"
                      value={form.valor_documental}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                    >
                      <option value="">Selecciona valor documental</option>
                      {Object.entries(VALORES_DOCUMENTALES).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.valor_documental && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.valor_documental}</p>}
                  </div>

                  {/* Plazo de Conservación */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                      Plazo de Conservación *
                      <TooltipWrapper 
                        tooltipKey="plazoConservacion" 
                        content="<strong>Tiempo mínimo de conservación</strong><br/>Determina cuánto tiempo debe preservarse el documento según la Ley de Archivos. Después del plazo, se evalúa su destino final."
                      >
                        <FontAwesomeIcon 
                          icon={faInfoCircle} 
                          className="text-sm text-amber-500 dark:text-amber-400 cursor-help hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
                        />
                      </TooltipWrapper>
                    </label>
                    <select
                      name="plazo_conservacion"
                      value={form.plazo_conservacion}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                    >
                      <option value="">Selecciona plazo de conservación</option>
                      {Object.entries(PLAZOS_CONSERVACION).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.plazo_conservacion && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.plazo_conservacion}</p>}
                  </div>

                  {/* Destino Final */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                      Destino Final *
                      <TooltipWrapper 
                        tooltipKey="destinoFinal" 
                        content="<strong>Qué sucede después del plazo de conservación</strong><br/><span class='text-green-300'>Conservación Permanente:</span> Se preserva para siempre<br/><span class='text-red-300'>Baja Documental:</span> Se elimina<br/><span class='text-blue-300'>Transferencia:</span> Se envía al archivo histórico"
                      >
                        <FontAwesomeIcon 
                          icon={faInfoCircle} 
                          className="text-sm text-amber-500 dark:text-amber-400 cursor-help hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
                        />
                      </TooltipWrapper>
                    </label>
                    <select
                      name="destino_final"
                      value={form.destino_final}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                    >
                      <option value="">Selecciona destino final</option>
                      {Object.entries(DESTINOS_FINALES).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.destino_final && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.destino_final}</p>}
                  </div>
                </div>

                {/* Tercera fila: Soporte y Procedencia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Soporte Documental */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                      Soporte Documental *
                      <TooltipWrapper 
                        tooltipKey="soporteDocumental" 
                        content="<strong>Origen del documento</strong><br/><span class='text-blue-300'>Original:</span> Documento fuente<br/><span class='text-green-300'>Copia:</span> Reproducción<br/><span class='text-yellow-300'>Digitalización:</span> Conversión de físico a digital"
                      >
                        <FontAwesomeIcon 
                          icon={faInfoCircle} 
                          className="text-sm text-amber-500 dark:text-amber-400 cursor-help hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
                        />
                      </TooltipWrapper>
                    </label>
                    <select
                      name="soporte_documental"
                      value={form.soporte_documental}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                    >
                      <option value="">Selecciona tipo de soporte</option>
                      {Object.entries(SOPORTES_DOCUMENTALES).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.soporte_documental && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.soporte_documental}</p>}
                  </div>

                  {/* Procedencia Administrativa (antes "Origen") */}
                  <div>
                    <label className="block mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                      Procedencia Administrativa *
                    </label>
                    <input
                      type="text"
                      name="procedencia_admin"
                      value={form.procedencia_admin}
                      onChange={handleChange}
                      placeholder="Ej: Dirección General / Coordinación de..."
                      className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                    />
                    {errors.procedencia_admin && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.procedencia_admin}</p>}
                  </div>
                </div>

                {/* Cuarta fila: Campos adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Folio del Documento */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">
                      Folio del Documento
                      <TooltipWrapper 
                        tooltipKey="folio" 
                        content="<strong>Número de página o posición</strong><br/>Identifica la ubicación del documento dentro del expediente. Ejemplo: 001/2025, A-001, F-123"
                      >
                        <FontAwesomeIcon 
                          icon={faInfoCircle} 
                          className="text-sm text-amber-500 dark:text-amber-400 cursor-help hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
                        />
                      </TooltipWrapper>
                    </label>
                    <input
                      type="text"
                      name="folio_documento"
                      value={form.folio_documento}
                      onChange={handleChange}
                      placeholder="Ej: 001/2025, A-001"
                      className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                    />
                  </div>

                  {/* Tipo de Documento (consolidado de classification) */}
                  <div>
                    <label className="block mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">Tipo de Documento *</label>
                    <select
                      name="classification"
                      value={form.classification}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                    >
                      <option value="">Selecciona tipo de documento</option>
                      <option value="Acuerdo">Acuerdo</option>
                      <option value="Acta">Acta</option>
                      <option value="Circular">Circular</option>
                      <option value="Informe">Informe</option>
                      <option value="Memorándum">Memorándum</option>
                      <option value="Oficio">Oficio</option>
                      <option value="Otro">Otro</option>
                    </select>
                    {errors.classification && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.classification}</p>}
                  </div>

                  {/* Vigencia */}
                  <div>
                    <label className="block mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">Estado de Vigencia</label>
                    <select
                      name="vigencia"
                      value={form.vigencia}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base font-medium"
                    >
                      <option value="">Selecciona estado de vigencia</option>
                      <option value="Vigente">Vigente</option>
                      <option value="Temporal">Temporal</option>
                      <option value="Vencido">Vencido</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 📁 SECCIÓN 3: SUBIDA Y VALIDACIÓN DE ARCHIVO */}
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl p-8">
              {/* Encabezado Sección 3 */}
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
                        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg border border-gray-600 min-w-max">
                          <div className="space-y-2">
                            <div>
                              <span className="font-semibold text-green-400">Formatos admitidos:</span>
                              <div className="text-xs mt-1">
                                PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, JPEG, PNG, TXT
                              </div>
                            </div>
                            <div>
                              <span className="font-semibold text-blue-400">Tamaño máximo:</span>
                              <div className="text-xs mt-1">150 MB por archivo</div>
                            </div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 border-r border-b border-gray-600 rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </h2>
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    Carga y valida el archivo digital del documento
                  </p>
                </div>
              </div>

              {/* Información del archivo seleccionado */}
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
                          {ALLOWED_FILE_TYPES[form.file.type]} • {(form.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                          ✅ Archivo válido
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                {/* Botón para seleccionar archivo - Diseño premium */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-green-400/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FontAwesomeIcon icon={faFileAlt} className="text-xl relative z-10" />
                  <span className="text-xl relative z-10">
                    {form.file ? '🔄 Cambiar Archivo' : '📁 Seleccionar Archivo'}
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </button>

                {/* Botón para subir documento - Diseño premium */}
                <button
                  onClick={handleUpload}
                  disabled={uploading || !form.file}
                  className={`group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-4 text-lg font-bold rounded-xl shadow-lg transition-all duration-300 transform overflow-hidden ${
                    uploading || !form.file
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed text-gray-200 shadow-none'
                      : 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-purple-600 hover:to-blue-800 text-white hover:shadow-2xl hover:scale-105 active:scale-95 border border-blue-400/30'
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
                    {uploading ? '⬆️ Subiendo documento...' : '🚀 Subir Documento'}
                  </span>
                </button>
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-xl" />
                    <p className="text-red-700 dark:text-red-300 text-base font-semibold">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Campo de archivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                name="file"
                onChange={handleChange}
                accept={Object.keys(ALLOWED_FILE_TYPES).join(',')}
                className="hidden"
              />
              {errors.file && (
                <div className="mt-4 text-center">
                  <p className="text-red-500 text-sm font-semibold">{errors.file}</p>
                </div>
              )}
            </div>
          </div>

          {/* Campo de archivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            onChange={handleChange}
            accept={Object.keys(ALLOWED_FILE_TYPES).join(',')}
            className="hidden"
          />
          {errors.file && (
            <div className="mb-4 text-center">
              <p className="text-red-500 text-sm font-semibold">{errors.file}</p>
            </div>
          )}
        </div>

      {/* Modal de éxito */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                ¡Archivo subido exitosamente!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tu documento ha sido procesado y guardado correctamente.
              </p>
              
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

      {/* Modal de progreso */}
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4">
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${uploadProgress}%`}
                  styles={buildStyles({
                    textColor: darkMode ? '#ffffff' : '#000000',
                    pathColor: '#3b82f6',
                    trailColor: darkMode ? '#374151' : '#e5e7eb'
                  })}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Subiendo archivo...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Por favor espera mientras procesamos tu documento.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  // --- RETURN PRINCIPAL ---
  return (
    <div>
      <LogoGrande />
      {/* ...existing code del formulario y helpers... */}
    </div>
  );
}
