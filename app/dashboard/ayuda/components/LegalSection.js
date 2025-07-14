export default function LegalSection() {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-200">Avisos Legales y Privacidad</h2>
      <div className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
        <p>
          Esta plataforma cumple con la <b>Ley Estatal de Archivos de Baja California Sur (LEA-BCS)</b> y la <b>Ley General de Archivos</b>.
        </p>
        <p>
          Tus datos personales y documentos están protegidos y solo serán usados conforme a la legislación aplicable.
        </p>
        <p>
          Toda acción queda registrada para fines de auditoría, transparencia y rendición de cuentas.
        </p>
        <p>
          Para ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación u Oposición), contacta a la Unidad de Transparencia institucional.
        </p>
        <p>
          Consulta las <a href="#" className="text-blue-600 underline">Políticas de Privacidad</a> y <a href="#" className="text-blue-600 underline">Términos de Uso</a>.
        </p>
      </div>
    </section>
  );
}
