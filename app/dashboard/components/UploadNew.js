'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faMoon, faSun, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useSession } from 'next-auth/react'
import avatarMap from '../../../lib/avatarMap'
import Link from 'next/link'

export default function UploadNew() {
  const { data: session } = useSession()
  const userEmail  = session?.user?.email  || 'default'
  const userName   = session?.user?.name   || 'Usuario'
  const userAvatar = avatarMap[userEmail]  || '/default-avatar.png'

  const [form, setForm] = useState({
    nombre:         '',
    origin:         '',
    classification: '',
    jefatura:       '',
    review:         '',
    file:           null,
  })
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [darkMode, setDarkMode]     = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const currentUser = {
    name:   userName,
    avatar: userAvatar,
    logo:   '/api-dark23.png',
  }

  const handleChange = e => {
    const { name, value, files } = e.target
    setForm(f => ({ ...f, [name]: files ? files[0] : value }))
  }

  const handleUpload = async () => {
    if (!form.file) {
      alert('❗ Debes seleccionar un archivo.')
      return
    }

    const fd = new FormData()
    fd.append('file', form.file)
    fd.append('nombre',         form.nombre || form.file.name)
    fd.append('origin',         form.origin)
    fd.append('classification', form.classification)
    fd.append('jefatura',       form.jefatura)
    fd.append('review',         form.review)
    fd.append('usuarioId',      session.user.id)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Error en el servidor')
      const { documento } = await res.json()

      setUploadedFiles(prev => [{
        id:          documento.id,
        nombre:      documento.nombre,
        origin:      form.origin,
        classification: form.classification,
        jefatura:    form.jefatura,
        review:      documento.descripcion,
        fecha:       new Date(documento.fecha_subida).toLocaleDateString(),
        owner:       currentUser.name,
        ruta:        documento.ruta,
      }, ...prev])

      alert('✅ Documento subido exitosamente')
      setForm({ nombre:'', origin:'', classification:'', jefatura:'', review:'', file:null })
      document.getElementById('file-input').value = ''

    } catch (err) {
      console.error(err)
      alert('❌ Error al subir el documento')
    }
  }

  const filtered = uploadedFiles.filter(doc =>
    doc.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.id.toString().includes(searchQuery)
  )

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <Image src={currentUser.logo} alt="Logo API" width={300} height={60} priority />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(d => !d)}
            className="text-2xl text-gray-700 dark:text-yellow-300"
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src={currentUser.avatar}
              alt="Avatar"
              width={50}
              height={50}
              className="rounded-full border-2 border-gray-300 dark:border-gray-600"
            />
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>

      {/* Volver */}
      <Link
        href="/home"
        className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Volver al Inicio
      </Link>

      <h1 className="text-4xl font-bold text-center mb-8 text-blue-500">Subir Documento</h1>

      {/* Formulario */}
      <div className="p-6 mb-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campos texto */}
          {[
            { label: 'Nombre del Documento *', name: 'nombre' },
            { label: 'Origen',               name: 'origin' }
          ].map(fld => (
            <div key={fld.name}>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
                {fld.label}
              </label>
              <input
                type="text"
                name={fld.name}
                value={form[fld.name]}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-400 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}

          {/* Selects */}
          {[
            {
              label:   'Clasificación',
              name:    'classification',
              options: ['Oficio','Memorándum','Circular','Cédula de Auditoría','Expediente de Investigación']
            },
            {
              label:   'Dirección / Jefatura',
              name:    'jefatura',
              options: ['Contraloría e Investigación','Contraloría y Resolución','Contraloría y Substanciación','Control Administrativo']
            }
          ].map(fld => (
            <div key={fld.name}>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
                {fld.label}
              </label>
              <select
                name={fld.name}
                value={form[fld.name]}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-400 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition"
              >
                <option value="">Seleccione una opción</option>
                {fld.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

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
              className="w-full p-2 rounded border border-gray-400 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* File input */}
        <div className="mt-6">
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
            Seleccionar archivo *
          </label>
          <input
            id="file-input"
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-400 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition"
          />
        </div>

        <button
          onClick={handleUpload}
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 transition"
        >
          <FontAwesomeIcon icon={faUpload} /> Subir Documento
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-center font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              {['ID','Nombre','Origen','Clasificación','Jefatura','Reseña','Fecha','Responsable','Descargar'].map(th => (
                <th key={th} className="p-2 border border-gray-400 dark:border-gray-600">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No hay documentos disponibles.
                </td>
              </tr>
            ) : filtered.map(doc => (
              <tr key={doc.id} className="text-center odd:bg-white even:bg-gray-50 dark:odd:bg-gray-700 dark:even:bg-gray-600">
                <td className="p-2 border border-gray-400 dark:border-gray-600">{doc.id}</td>
                <td className="p-2 border border-gray-400 dark:border-gray-600">{doc.nombre}</td>
                <td className="p-2 border border-gray-400 dark:border-gray-600">{doc.origin}</td>
                <td className="p-2 border border-gray-400 dark:border-gray-600">{doc.classification}</td>
                <td className="p-2 border border-gray-400 dark:border-gray-600">{doc.jefatura}</td>
                <td className="p-2 border border-gray-400 dark:border-gray-600">{doc.review}</td>
                <td className="p-2 border border-gray-400 dark:border-gray-600">{doc.fecha}</td>
                <td className="p-2 border border-gray-400 dark:border-gray-600">{doc.owner}</td>
                <td className="p-2 border border-gray-400 dark:border-gray-600">
                  <a href={doc.ruta} download className="text-blue-600 dark:text-blue-300 hover:underline">
                    📥
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
