export default function TutorialesSection() {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-200">Guías y Tutoriales</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <b>Subir un documento:</b> Ve a la sección "Mis Documentos" y haz clic en "Subir documento". Selecciona el archivo y completa los datos requeridos.
        </li>
        <li>
          <b>Validar un archivo:</b> Ingresa a "Verificación LEA-BCS", filtra el documento y usa los botones de acción para validar o rechazar.
        </li>
        <li>
          <b>Exportar datos:</b> En las vistas de Bitácora o Informes, utiliza el botón "Exportar CSV" para descargar la información filtrada.
        </li>
        <li>
          <b>¿Necesitas más ayuda?</b> Descarga el <a href="#" className="text-blue-600 underline">manual de usuario</a> o contacta a soporte.
        </li>
      </ul>
    </section>
  );
}
