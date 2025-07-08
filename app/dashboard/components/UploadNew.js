'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faMoon, faSun, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import avatarMap from '../../../lib/avatarMap';
import Link from 'next/link';
import { useAutoCorrect } from '../../../lib/useAutoCorrect';

export default function UploadNew() {
  const { data: session, status } = useSession();

  // Eliminados logs de sesión para mayor seguridad

  const userEmail  = session?.user?.email  || 'default';
  const userName   = session?.user?.name   || 'Usuario';
  const userAvatar = avatarMap[userEmail]  || '/default-avatar.png';

  // Guardamos el formulario completo: nombre, origin, classification, jefatura, review y file
  const [form, setForm] = useState({
    nombre:         '',
    origin:         '',
    classification: '',
    jefatura:       '',
    review:         '',
    file:           null,
    serie:          '',
    subserie:       '',
    expediente:     '',
    fecha_creacion: '',
    vigencia:       '',
    acceso:         '',
    observaciones:  '',
  });

  // Estado de errores para validación visual
  const [errors, setErrors] = useState({});

  // Tabla de archivos recién subidos (solo local, para que aparezcan al instante)
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [darkMode, setDarkMode]       = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados para el progress bar circular
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Referencia para limpiar el <input type="file"> después de subir
  const fileInputRef = useRef(null);

  const currentUser = {
    name:   userName,
    avatar: userAvatar,
    logo:   '/api-dark23.png', // la imagen de tu logo
  };

  // Estado para la URL de vista previa
  const [previewUrl, setPreviewUrl] = useState(null);

  // Hook global de autocorrección
  const handleAutoCorrect = useAutoCorrect();

  if (status === "loading") {
    return <p className="text-center p-10">Cargando sesión...</p>;
  }

  if (status === "unauthenticated") {
    return <p className="text-center p-10">No estás autenticado. Por favor, inicia sesión.</p>;
  }

  // --- AUTOCORRECCIÓN AUTOMÁTICA EN NOMBRE DEL DOCUMENTO ---
  async function autocorregirTexto(texto) {
    // LanguageTool API pública (puede tener límites)
    const res = await fetch('https://api.languagetoolplus.com/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text: texto,
        language: 'es',
      })
    });
    const data = await res.json();
    let corregido = texto;
    if (data.matches && data.matches.length > 0) {
      // Aplicar sugerencias de derecha a izquierda para no desfasar offsets
      data.matches.sort((a, b) => b.offset - a.offset).forEach(match => {
        if (match.replacements && match.replacements.length > 0) {
          corregido = corregido.slice(0, match.offset) + match.replacements[0].value + corregido.slice(match.offset + match.length);
        }
      });
    }
    return corregido;
  }

  // Cada vez que cambie un campo (o se elija un archivo), lo guardamos en `form`
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files && files[0]) {
      const file = files[0];
      setForm(prev => ({ ...prev, file }));
      // Generar vista previa si es imagen o PDF
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Autocorrección solo al perder el foco en el campo nombre
  const handleNombreBlur = async (e) => {
    const value = e.target.value;
    const corregido = await autocorregirTexto(value);
    if (corregido !== value) {
      setForm(prev => ({ ...prev, nombre: corregido }));
    }
  };

  // Autocorrección automática al terminar palabra (espacio, punto, enter)
  const handleNombreKeyUp = async (e) => {
    const value = e.target.value;
    // Si la tecla es espacio, punto o enter
    if ([32, 190, 13].includes(e.keyCode)) {
      // Solo autocorregir si hay texto
      if (value.trim().length > 0) {
        const corregido = await autocorregirTexto(value);
        if (corregido !== value) {
          setForm(prev => ({ ...prev, nombre: corregido }));
        }
      }
    }
  };

  // Validación de todos los campos obligatorios
  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!form.serie.trim()) newErrors.serie = 'La serie documental es obligatoria.';
    if (!form.fecha_creacion) newErrors.fecha_creacion = 'La fecha de creación es obligatoria.';
    if (!form.vigencia) newErrors.vigencia = 'La vigencia documental es obligatoria.';
    if (!form.acceso) newErrors.acceso = 'El nivel de acceso es obligatorio.';
    if (!form.file) newErrors.file = 'Debes seleccionar un archivo.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función que dispara la subida with progress bar
  const handleUpload = async () => {
    if (!validateForm()) {
      // Scroll al primer error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const el = document.querySelector(`[name="${firstError}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (form.file.size > 100 * 1024 * 1024) {
      alert('❌ El archivo es demasiado grande. Máximo 100MB.');
      return;
    }

    // Verificar que tenemos el ID del usuario
    if (!session?.user?.id) {
      alert('❌ Error: No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    // Iniciar estados de progreso
    setUploading(true);
    setUploadProgress(0);

    // Para archivos pequeños, simular progreso mínimo
    const isSmallFile = form.file.size < 1024 * 1024; // menos de 1MB
    let progressInterval;
    
    if (isSmallFile) {
      // Simular progreso para archivos pequeños
      let simulatedProgress = 0;
      progressInterval = setInterval(() => {
        simulatedProgress += Math.random() * 25;
        if (simulatedProgress < 90) {
          setUploadProgress(Math.floor(simulatedProgress));
        }
      }, 100);
    }

    // Construimos el FormData
    const fd = new FormData();
    fd.append('file', form.file);
    fd.append('nombre', form.nombre);
    fd.append('origin', form.origin);
    fd.append('classification', form.classification);
    fd.append('jefatura', form.jefatura);
    fd.append('review', form.review);
    fd.append('usuarioId', session.user.id);
    fd.append('serie', form.serie);
    fd.append('subserie', form.subserie);
    fd.append('expediente', form.expediente);
    fd.append('fecha_creacion', form.fecha_creacion);
    fd.append('vigencia', form.vigencia);
    fd.append('acceso', form.acceso);
    fd.append('observaciones', form.observaciones);

    try {
      // Usar XMLHttpRequest para monitorear progreso
      const xhr = new XMLHttpRequest();
      let realProgressStarted = false;

      // Monitorear el progreso de subida
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          realProgressStarted = true;
          // Limpiar intervalo simulado si el progreso real comenzó
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      // Evento loadstart para asegurar que comience
      xhr.upload.addEventListener('loadstart', () => {
        if (!realProgressStarted) {
          setUploadProgress(5); // Al menos mostrar 5%
        }
      });

      // Promesa para manejar la respuesta
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error('Error al procesar la respuesta del servidor'));
            }
          } else {
            reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error('Error de red'));
      });

      // Configurar y enviar la petición
      xhr.open('POST', '/api/upload');
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send(fd);

      // Para archivos pequeños, asegurar que llegue al 90% antes de completar
      if (isSmallFile) {
        setTimeout(() => {
          if (!realProgressStarted) {
            setUploadProgress(90);
          }
        }, 500);
      }

      // Esperar la respuesta
      const data = await uploadPromise;

      // Asegurar que llegue al 100% antes de procesar
      setUploadProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));

      if (!data.documento) {
        throw new Error('No se recibió información del documento creado');
      }

      // Si llegó bien el JSON y hay un documento creado, lo agregamos a la tabla en pantalla:
      setUploadedFiles(prev => [
        {
          id:            data.documento.id,
          nombre:        data.documento.nombre,
          origin:        form.origin,
          classification:form.classification,
          jefatura:      form.jefatura,
          review:        data.documento.descripcion,
          fecha:         new Date(data.documento.fecha_subida).toLocaleDateString(),
          owner:         currentUser.name,
          ruta:          data.documento.ruta
        },
        ...prev
      ]);

      alert('✅ Documento subido exitosamente');

      // Reiniciamos el formulario y limpiamos el input file
      setForm({
        nombre:         '',
        origin:         '',
        classification: '',
        jefatura:       '',
        review:         '',
        file:           null,
        serie:          '',
        subserie:       '',
        expediente:     '',
        fecha_creacion: '',
        vigencia:       '',
        acceso:         '',
        observaciones:  '',
      });
      setErrors({});
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      alert(`❌ Error al subir el documento: ${err.message}`);
    } finally {
      // Limpiar intervalo simulado si existe
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      // Limpiar estados de progreso después de una pausa
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Función para limpiar el formulario manualmente
  const handleClearForm = () => {
    setForm({
      nombre:         '',
      origin:         '',
      classification: '',
      jefatura:       '',
      review:         '',
      file:           null,
      serie:          '',
      subserie:       '',
      expediente:     '',
      fecha_creacion: '',
      vigencia:       '',
      acceso:         '',
      observaciones:  '',
    });
    setErrors({});
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filtrar los documentos recién subidos para la tabla
  const filtered = uploadedFiles.filter(doc =>
    doc.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.id.toString().includes(searchQuery)
  );

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6`}>

      {/* Progress Bar Circular Modal */}
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center border-2 border-gray-200 dark:border-gray-600">
            <div className="w-32 h-32 mx-auto mb-6">
              <CircularProgressbar
                value={uploadProgress}
                text={`${uploadProgress}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: darkMode ? '#60A5FA' : '#3B82F6',
                  textColor: darkMode ? '#F3F4F6' : '#1F2937',
                  trailColor: darkMode ? '#374151' : '#E5E7EB',
                  backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
                })}
              />
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Subiendo archivo...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {form.file?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {form.file && `${(form.file.size / 1024 / 1024).toFixed(2)} MB`}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Image
          src={currentUser.logo}
          alt="Logo API"
          width={420}
          height={90}
          priority
          className={[
            'drop-shadow-2xl',
            'rounded-xl', // menos redondeado
            'border-4',
            'border-blue-200',
            'bg-white',
            'p-2',
            'transition-all',
            'duration-300',
            'dark:border-gray-800', // borde sutil en dark
            'dark:bg-transparent', // sin fondo en dark
            'dark:p-0' // sin padding en dark
          ].join(' ')}
          style={{ boxShadow: '0 8px 32px 0 rgba(30, 64, 175, 0.18), 0 1.5px 8px 0 rgba(59, 130, 246, 0.10)' }}
        />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(d => !d)}
            className="text-2xl text-gray-700 dark:text-yellow-300 hover:scale-110 transition-transform duration-200"
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src={currentUser.avatar}
              alt="Avatar"
              width={60}
              height={60}
              className="rounded-full border-4 border-blue-200 dark:border-blue-900 shadow-lg"
            />
            <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>

      {/* Volver al Inicio */}
      <Link
        href="/home"
        className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-full shadow-lg text-lg font-semibold transition-all duration-200 border-2 border-blue-300 dark:border-blue-800 dark:from-blue-800 dark:to-blue-600 dark:hover:from-blue-900 dark:hover:to-blue-700"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Volver al Inicio
      </Link>

      <h1 className="text-4xl font-bold text-center mb-8 text-blue-500">Subir Documento</h1>

      {/* Formulario de carga */}
      <div className="p-6 mb-10 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
        {/* Resumen de errores en la parte superior */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded">
            <p className="font-semibold text-red-700 dark:text-red-200 mb-2">Por favor corrige los siguientes errores:</p>
            <ul className="list-disc pl-6 text-red-700 dark:text-red-200 text-sm">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre y Origen */}
          <div>
            <label className="flex items-center gap-1 mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Nombre del Documento *
              <span title="Nombre identificador del documento. Obligatorio.">
                <span className="text-blue-500 cursor-help">ⓘ</span>
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                onBlur={handleNombreBlur}
                onKeyUp={e => handleAutoCorrect(e, form.nombre, v => setForm(prev => ({ ...prev, nombre: v })))} // Autocorrección en nombre
                disabled={uploading}
                spellCheck={true}
                autoCorrect="on"
                className={`w-full p-2 rounded border-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 ${errors.nombre ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}`}
              />
            </div>
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Origen
            </label>
            <input
              type="text"
              name="origin"
              value={form.origin}
              onChange={handleChange}
              onKeyUp={e => handleAutoCorrect(e, form.origin, v => setForm(prev => ({ ...prev, origin: v })))} // Autocorrección en origen
              disabled={uploading}
              spellCheck={true}
              autoCorrect="on"
              className="w-full p-2 rounded border-2 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            />
          </div>

          {/* Serie y Subserie */}
          <div>
            <label className="flex items-center gap-1 mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Serie documental *
              <span title="Serie documental según el catálogo institucional. Obligatorio.">
                <span className="text-blue-500 cursor-help">ⓘ</span>
              </span>
            </label>
            <input
              type="text"
              name="serie"
              value={form.serie}
              onChange={handleChange}
              onKeyUp={e => handleAutoCorrect(e, form.serie, v => setForm(prev => ({ ...prev, serie: v })))} // Autocorrección en serie
              disabled={uploading}
              spellCheck={true}
              autoCorrect="on"
              placeholder="Ej. Correspondencia, Expedientes, etc."
              className={`w-full p-2 rounded border-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 ${errors.serie ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}`}
            />
            {errors.serie && <p className="text-red-500 text-xs mt-1">{errors.serie}</p>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Subserie
            </label>
            <input
              type="text"
              name="subserie"
              value={form.subserie}
              onChange={handleChange}
              onKeyUp={e => handleAutoCorrect(e, form.subserie, v => setForm(prev => ({ ...prev, subserie: v })))} // Autocorrección en subserie
              disabled={uploading}
              spellCheck={true}
              autoCorrect="on"
              placeholder="Opcional"
              className="w-full p-2 rounded border-2 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            />
          </div>

          {/* Número de expediente y fecha de creación */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Número de expediente
            </label>
            <input
              type="text"
              name="expediente"
              value={form.expediente}
              onChange={handleChange}
              onKeyUp={e => handleAutoCorrect(e, form.expediente, v => setForm(prev => ({ ...prev, expediente: v })))} // Autocorrección en expediente
              disabled={uploading}
              spellCheck={true}
              autoCorrect="on"
              placeholder="Opcional"
              className="w-full p-2 rounded border-2 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Fecha de creación/emisión *
              <span title="Fecha en que se creó o emitió el documento. Obligatorio.">
                <span className="text-blue-500 cursor-help">ⓘ</span>
              </span>
            </label>
            <input
              type="date"
              name="fecha_creacion"
              value={form.fecha_creacion}
              onChange={handleChange}
              disabled={uploading}
              className={`w-full p-2 rounded border-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 ${errors.fecha_creacion ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}`}
            />
            {errors.fecha_creacion && <p className="text-red-500 text-xs mt-1">{errors.fecha_creacion}</p>}
          </div>

          {/* Clasificación y Jefatura */}
          {[{
            label:   'Clasificación',
            name:    'classification',
            options: ['Oficio', 'Memorándum', 'Circular', 'Cédula de Auditoría', 'Expediente de Investigación'],
            tooltip: 'Tipo documental según clasificación institucional.'
          }, {
            label:   'Dirección / Jefatura',
            name:    'jefatura',
            options: ['Contraloría e Investigación', 'Contraloría y Resolución', 'Contraloría y Substanciación', 'Control Administrativo'],
            tooltip: 'Área responsable de la gestión documental.'
          }].map(fld => (
            <div key={fld.name}>
              <label className="flex items-center gap-1 mb-1 font-semibold text-gray-700 dark:text-gray-200">
                {fld.label}
                {fld.tooltip && (
                  <span title={fld.tooltip}>
                    <span className="text-blue-500 cursor-help">ⓘ</span>
                  </span>
                )}
              </label>
              <select
                name={fld.name}
                value={form[fld.name]}
                onChange={handleChange}
                disabled={uploading}
                className="w-full p-2 rounded border-2 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:ring-2 hover:ring-blue-500 transition disabled:opacity-50"
              >
                <option value="">Seleccione una opción</option>
                {fld.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Vigencia y Nivel de acceso */}
          <div>
            <label className="flex items-center gap-1 mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Vigencia documental *
              <span title="Tiempo que el documento debe conservarse. Obligatorio.">
                <span className="text-blue-500 cursor-help">ⓘ</span>
              </span>
            </label>
            <select
              name="vigencia"
              value={form.vigencia}
              onChange={handleChange}
              disabled={uploading}
              className={`w-full p-2 rounded border-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:ring-2 hover:ring-blue-500 transition disabled:opacity-50 ${errors.vigencia ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}`}
            >
              <option value="">Seleccione una opción</option>
              <option value="Temporal">Temporal</option>
              <option value="Permanente">Permanente</option>
              <option value="5 años">5 años</option>
              <option value="10 años">10 años</option>
            </select>
            {errors.vigencia && <p className="text-red-500 text-xs mt-1">{errors.vigencia}</p>}
          </div>
          <div>
            <label className="flex items-center gap-1 mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Nivel de acceso *
              <span title="Quién puede consultar el documento. Obligatorio.">
                <span className="text-blue-500 cursor-help">ⓘ</span>
              </span>
            </label>
            <select
              name="acceso"
              value={form.acceso}
              onChange={handleChange}
              disabled={uploading}
              className={`w-full p-2 rounded border-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:ring-2 hover:ring-blue-500 transition disabled:opacity-50 ${errors.acceso ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}`}
            >
              <option value="">Seleccione una opción</option>
              <option value="Público">Público</option>
              <option value="Reservado">Reservado</option>
              <option value="Confidencial">Confidencial</option>
            </select>
            {errors.acceso && <p className="text-red-500 text-xs mt-1">{errors.acceso}</p>}
          </div>

          {/* Observaciones */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              rows={2}
              value={form.observaciones}
              onChange={handleChange}
              onKeyUp={e => handleAutoCorrect(e, form.observaciones, v => setForm(prev => ({ ...prev, observaciones: v })))} // Autocorrección en observaciones
              disabled={uploading}
              spellCheck={true}
              autoCorrect="on"
              className="w-full p-2 rounded border-2 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            />
          </div>

          {/* Reseña */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Reseña
            </label>
            <textarea
              name="review"
              rows={3}
              value={form.review}
              onChange={handleChange}
              onKeyUp={e => handleAutoCorrect(e, form.review, v => setForm(prev => ({ ...prev, review: v })))} // Autocorrección en reseña
              disabled={uploading}
              spellCheck={true}
              autoCorrect="on"
              className="w-full p-2 rounded border-2 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            />
          </div>
        </div>

        {/* File input */}
        <div className="mt-6">
          <label className="flex items-center gap-1 mb-1 font-semibold text-gray-700 dark:text-gray-200">
            Seleccionar archivo *
            <span title="Selecciona el archivo a subir. Obligatorio. Tamaño máximo 100MB.">
              <span className="text-blue-500 cursor-help">ⓘ</span>
            </span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            onChange={handleChange}
            disabled={uploading}
            spellCheck={true}
            autoCorrect="on"
            className={`w-full p-3 rounded-lg border-2 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition disabled:opacity-50 focus:ring-2 focus:ring-blue-400 border-blue-300 dark:border-blue-800 shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:shadow-lg file:transition-all file:duration-200 ${errors.file ? 'border-red-500' : 'border-blue-300 dark:border-blue-800'}`}
          />
          {form.file && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Archivo seleccionado: {form.file.name} ({(form.file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
          {/* Vista previa de archivo */}
          {form.file && (
            <div className="mt-4 flex items-center gap-4">
              {form.file.type.startsWith('image/') ? (
                <img src={previewUrl} alt="Vista previa" className="max-h-64 rounded border mx-auto" />
              ) : form.file.type === 'application/pdf' ? (
                <object data={previewUrl} type="application/pdf" width="100%" height="400" className="border rounded">
                  <p className="text-center">No se puede mostrar la vista previa del PDF.</p>
                </object>
              ) : form.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || form.file.type === 'application/msword' ? (
                <div className="flex items-center gap-2">
                  <span role="img" aria-label="Word" className="text-3xl">📄</span>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{form.file.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">(Word)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span role="img" aria-label="Archivo" className="text-3xl">📎</span>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{form.file.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">(Sin vista previa)</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-8 justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={
              [
                'px-8 py-3 rounded-full border-2 flex items-center gap-2 text-lg font-semibold shadow-lg transition-all duration-200',
                uploading
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200 border-gray-300 dark:border-gray-700'
                  : 'bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-900 text-white border-blue-300 dark:border-blue-800'
              ].join(' ')
            }
          >
            <FontAwesomeIcon icon={faUpload} />
            {uploading ? 'Subiendo...' : 'Subir Documento'}
          </button>
          <button
            type="button"
            onClick={handleClearForm}
            disabled={uploading}
            className="px-8 py-3 rounded-full border-2 border-gray-400 dark:border-gray-600 bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 ring-1 ring-gray-300 dark:ring-gray-700 hover:ring-4 hover:ring-blue-200 dark:hover:ring-blue-900"
          >
            Limpiar formulario
          </button>
        </div>
      </div>

      {/* Tabla de archivos subidos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-600 p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Documentos Subidos
        </h2>

        {/* Filtros superiores */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Buscar por nombre, propietario o ID:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full p-2 rounded border-2 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Ej. Documento, Juan, 123"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            No se encontraron documentos que coincidan con tu búsqueda.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full table-auto rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200 font-semibold text-sm uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200 font-semibold text-sm uppercase tracking-wider">
                    Propietario
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200 font-semibold text-sm uppercase tracking-wider">
                    Fecha de Subida
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200 font-semibold text-sm uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">
                      {doc.nombre}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                      {doc.owner}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                      {doc.fecha}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={doc.ruta}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 dark:bg-blue-800 text-white font-semibold shadow-md hover:bg-blue-700 dark:hover:bg-blue-900 transition-all duration-200"
                        download
                        title="Descargar documento"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        Descargar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}