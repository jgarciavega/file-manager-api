"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFile,
  faFilePdf,
  faFileWord,
  faFileImage,
  faFileExcel,
  faTrash,
  faCheck,
  faSpinner,
  faCloudUploadAlt,
  faFolderOpen,
  faTag,
  faCalendar,
  faUser,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function NuevoDocumentoPage() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    tags: "",
    fechaVencimiento: "",
    prioridad: "media",
    confidencial: false,
  });

  const categorias = [
    "Documentos Administrativos",
    "Contratos y Convenios",
    "Reportes Financieros",
    "Documentos Legales",
    "Correspondencia Oficial",
    "Actas y Minutas",
    "Manuales y Procedimientos",
    "Otros",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return faFilePdf;
      case "doc":
      case "docx":
        return faFileWord;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return faFileImage;
      case "xls":
      case "xlsx":
        return faFileExcel;
      default:
        return faFile;
    }
  };

  const getFileIconColor = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "text-red-500";
      case "doc":
      case "docx":
        return "text-blue-500";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "text-green-500";
      case "xls":
      case "xlsx":
        return "text-green-600";
      default:
        return "text-gray-500";
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      // Validar tamaño (máximo 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Archivo muy grande",
          text: "El archivo no puede ser mayor a 50MB",
        });
        return;
      }

      // Validar tipos permitidos
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        Swal.fire({
          icon: "error",
          title: "Tipo de archivo no permitido",
          text: "Solo se permiten archivos PDF, Word, Excel, imágenes y texto",
        });
        return;
      }

      setFile(selectedFile);

      // Auto-completar nombre si está vacío
      if (!formData.nombre) {
        const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "");
        setFormData((prev) => ({
          ...prev,
          nombre: nameWithoutExtension,
        }));
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "No hay archivo",
        text: "Por favor selecciona un archivo para subir",
      });
      return;
    }

    if (!formData.nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre requerido",
        text: "Por favor ingresa un nombre para el documento",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("nombre", formData.nombre);
      uploadData.append("descripcion", formData.descripcion);
      uploadData.append("categoria", formData.categoria);
      uploadData.append("tags", formData.tags);
      uploadData.append("fechaVencimiento", formData.fechaVencimiento);
      uploadData.append("prioridad", formData.prioridad);
      uploadData.append("confidencial", formData.confidencial);
      uploadData.append("usuarioId", session?.user?.id || 1);

      // Simular progreso de subida
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();

        await Swal.fire({
          icon: "success",
          title: "¡Documento subido exitosamente!",
          text: `El documento "${formData.nombre}" ha sido guardado correctamente`,
          confirmButtonColor: "#10B981",
        });

        // Limpiar formulario
        setFile(null);
        setFormData({
          nombre: "",
          descripcion: "",
          categoria: "",
          tags: "",
          fechaVencimiento: "",
          prioridad: "media",
          confidencial: false,
        });
        setUploadProgress(0);
      } else {
        throw new Error("Error en la subida");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Error al subir archivo",
        text: "Hubo un problema al subir el documento. Inténtalo de nuevo.",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FontAwesomeIcon
                icon={faCloudUploadAlt}
                className="text-blue-600 text-2xl"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Nuevo Documento
              </h1>
              <p className="text-gray-600">
                Sube y organiza tus documentos de manera fácil y segura
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zona de subida */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faUpload} className="mr-2 text-blue-600" />
              Seleccionar Archivo
            </h2>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : file
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <FontAwesomeIcon
                      icon={getFileIcon(file.name)}
                      className={`text-4xl ${getFileIconColor(file.name)}`}
                    />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{file.name}</p>
                      <p className="text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}

                  <button
                    onClick={removeFile}
                    className="mt-3 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center space-x-2"
                    disabled={uploading}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Remover archivo</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <FontAwesomeIcon
                    icon={faFolderOpen}
                    className="text-6xl text-gray-400"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Arrastra tu archivo aquí
                    </p>
                    <p className="text-gray-500">o haz clic para seleccionar</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    Seleccionar Archivo
                  </button>
                  <p className="text-xs text-gray-400">
                    Archivos permitidos: PDF, Word, Excel, Imágenes (máx. 50MB)
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
            />
          </div>

          {/* Formulario de información */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="mr-2 text-blue-600"
              />
              Información del Documento
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faTag} className="mr-1" />
                  Nombre del Documento *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa el nombre del documento"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe brevemente el contenido del documento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiquetas
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: urgente, revisión, contrato (separadas por comas)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    name="fechaVencimiento"
                    value={formData.fechaVencimiento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="confidencial"
                  checked={formData.confidencial}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Documento confidencial
                </label>
              </div>
            </div>

            {/* Botón de subida */}
            <div className="mt-6">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                  !file || uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
                }`}
              >
                {uploading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin"
                    />
                    <span>Subiendo... {Math.round(uploadProgress)}%</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Subir Documento</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-blue-600 mt-1"
            />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Información importante:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Los documentos se guardan de forma segura y encriptada</li>
                <li>
                  Puedes editar la información del documento después de subirlo
                </li>
                <li>
                  Los documentos confidenciales solo son visibles para ti y los
                  administradores
                </li>
                <li>Se mantendrá un historial de versiones automáticamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
