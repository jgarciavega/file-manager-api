// app/dashboard/subir-documento/page.js
'use client'

import UploadNew from '../components/UploadNew'

export default function SubirDocumentoPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subir Documento</h1>
      <UploadNew />
    </div>
  )
}
