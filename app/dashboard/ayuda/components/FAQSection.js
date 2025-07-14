export default function FAQSection() {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-200">Preguntas Frecuentes</h2>
      <ul className="space-y-3">
        <li>
          <b>¿Cómo cambio mi contraseña?</b>
          <div className="text-sm text-gray-700 dark:text-gray-200">Ve a Ajustes &gt; Seguridad y sigue las instrucciones para actualizar tu contraseña.</div>
        </li>
        <li>
          <b>¿Qué hago si olvido mi usuario o contraseña?</b>
          <div className="text-sm text-gray-700 dark:text-gray-200">Utiliza la opción "Recuperar acceso" en la pantalla de inicio de sesión o contacta a la Unidad de Transparencia.</div>
        </li>
        <li>
          <b>¿Cómo reporto un problema o solicito soporte?</b>
          <div className="text-sm text-gray-700 dark:text-gray-200">Desde la sección de contacto en esta misma página o al correo institucional de soporte.</div>
        </li>
        <li>
          <b>¿Qué es la LEA-BCS y cómo me afecta?</b>
          <div className="text-sm text-gray-700 dark:text-gray-200">La Ley Estatal de Archivos de BCS regula el manejo, protección y acceso a la información en este sistema. Todos los movimientos quedan auditados.</div>
        </li>
      </ul>
    </section>
  );
}
