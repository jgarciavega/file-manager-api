"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faTimes,
  faPaperPlane,
  faTrash,
  faDownload,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

export default function UploadFiles() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 749,
      name: "Registro_Facturacion.docx",
      date: "10/12/2024",
      owner: "Arq. Julio Rubio",
      content: null,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  ]);

  const currentUser = { name: "Julio Rubio", avatar: "/julio-rubio.jpg" };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      Swal.fire("Error", "Selecciona un archivo antes de subirlo", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const newFile = {
        id: uploadedFiles.length + 1,
        name: selectedFile.name,
        date: new Date().toLocaleDateString(),
        owner: currentUser.name,
        content: reader.result,
        type: selectedFile.type,
      };
      setUploadedFiles([...uploadedFiles, newFile]);
      setSelectedFile(null);
      Swal.fire("Éxito", "Archivo subido correctamente", "success");
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    Swal.fire("Cancelado", "Carga cancelada", "info");
  };

  const handleSend = () => {
    if (uploadedFiles.length === 0) {
      Swal.fire("Advertencia", "No hay archivos para enviar", "warning");
      return;
    }
    Swal.fire("Enviado", "Archivos enviados correctamente", "success");
  };

  const handleDownload = (file) => {
    const blob = new Blob([file.content], {
      type: file.type || "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este archivo?");
    if (confirmDelete) {
      setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    }
  };

  return (
    // Agregamos la clase "dark" cuando darkMode es true para activar las variantes dark:
    <div
      className={`p-6 min-h-screen transition-all ${
        darkMode ? "dark bg-gray-900 text-gray-200" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Image
          src={darkMode ? "/api-dark23.png" : "/api.jpg"}
          alt="Logo API"
          width={650}
          height={60}
          className={`transition duration-300 ${
            darkMode ? "dark-logo" : "light-logo"
          }`}
        />
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl text-gray-700 dark:text-yellow-300 hover:text-black dark:hover:text-white transition"
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <div className="flex items-center gap-3">
            <Image
              src={currentUser.avatar}
              alt="Avatar"
              width={60}
              height={60}
              className="rounded-full border"
            />
            <p className="font-semibold text-gray-800 dark:text-white">
              {currentUser.name}
            </p>
          </div>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-center mb-16 text-blue-600 dark:text-blue-300">
        Gestión de Archivos
      </h1>
      <div className="flex flex-col items-center mb-8">
        <span className="text-2xl text-gray-600 dark:text-gray-300">
          Cargar Documento
        </span>
        <span className="text-2xl text-red-600 mt-2 dark:text-red-300">
          Descargar Documento
        </span>
      </div>

      {/* Sección de carga */}
      <div
        className={`shadow-md rounded-lg p-6 border ${
          darkMode ? "bg-gray-800 border-red-400" : "bg-white border-red-200"
        }`}
      >
        <h2 className="text-lg font-bold mb-3 text-red-800 dark:text-red-300">
          Agregar Documento
        </h2>
        <div className="border-dashed border-2 border-gray-600 rounded-lg p-6 text-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <FontAwesomeIcon
              icon={faUpload}
              className="text-3xl text-blue-600 dark:text-gray-300 mb-2"
            />
            <p className="text-gray-600 mt-2 dark:text-gray-400">
              Arrastra o haz clic para seleccionar un archivo
            </p>
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleCancel}
            className="bg-red-600 text-white px-6 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
          </button>
          <button
            onClick={handleUpload}
            className="border border-gray-600 text-gray-900 dark:text-gray-200 px-6 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faUpload} className="text-yellow-300 mr-2" />{" "}
            Subir documento
          </button>
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> Enviar
          </button>
        </div>
      </div>

      {/* Tabla de Favoritos */}
      <h2 className="text-lg font-bold mt-20 text-blue-800 dark:text-violet-600">
        Favoritos
      </h2>
      <div
        className={`shadow-md rounded-lg p-6 mt-2 border ${
          darkMode ? "bg-gray-800 border-gray-500" : "bg-white border-gray-300"
        }`}
      >
        <table className="w-full table-auto border border-gray-400 dark:border-gray-500">
          <thead>
            <tr className="bg-red-200 text-gray-800 dark:bg-red-600 dark:text-white">
              <th className="p-3 border border-gray-800 dark:border-gray-600">
                Documento
              </th>
              <th className="p-3 border border-gray-800 dark:border-gray-600">
                Fecha
              </th>
              <th className="p-3 border border-gray-800 dark:border-gray-600">
                Responsable
              </th>
              <th className="p-3 border border-gray-800 dark:border-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file) => (
              <tr key={file.id} className="text-center">
                <td className="p-3 border border-gray-800 dark:border-gray-600 text-gray-800 dark:text-white">
                  {file.name}
                </td>
                <td className="p-3 border border-gray-800 dark:border-gray-600 text-gray-800 dark:text-white">
                  {file.date}
                </td>
                <td className="p-3 border border-gray-800 dark:border-gray-600 text-gray-800 dark:text-white">
                  {file.owner}
                </td>
                <td className="p-3 border border-gray-800 dark:border-gray-600 flex justify-center gap-4">
                  <button
                    className="text-blue-600 dark:text-blue-300"
                    onClick={() => handleDownload(file)}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button
                    className="text-red-600 dark:text-red-400"
                    onClick={() => handleDelete(file.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
            {uploadedFiles.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-4 text-gray-500 dark:text-gray-400"
                >
                  No hay documentos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
