export default function ContactoSection() {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-200">Contacto y Soporte</h2>
      <div className="space-y-2 text-gray-700 dark:text-gray-200">
        <div>
          <b>Correo soporte:</b> <a href="mailto:soporte@institucion.gob.mx" className="text-blue-600 underline">soporte@institucion.gob.mx</a>
        </div>
        <div>
          <b>Unidad de Transparencia:</b> <a href="mailto:transparencia@institucion.gob.mx" className="text-blue-600 underline">transparencia@institucion.gob.mx</a>
        </div>
        <div>
          <b>Teléfono:</b> (612) 123-4567 ext. 101
        </div>
        <div>
          <b>Horario de atención:</b> Lunes a Viernes, 8:00 a 15:00 hrs
        </div>
      </div>
    </section>
  );
}
