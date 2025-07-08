export default function handler(req, res) {
  const jefaturas = [
    { id: 1, nombre: "Dirección General de Administración" },
    { id: 2, nombre: "Dirección de Recursos Humanos" },
    { id: 3, nombre: "Departamento de Archivo" },
    { id: 4, nombre: "Contraloría Interna" }
  ];
  res.status(200).json(jefaturas);
}
