export default function handler(req, res) {
  const responsables = [
    { id: 1, nombre: "Titular de la Unidad" },
    { id: 2, nombre: "Jefe de Departamento" },
    { id: 3, nombre: "Responsable de Archivo Central" },
    { id: 4, nombre: "Responsable de Archivo de Trámite" },
    { id: 5, nombre: "Responsable de Archivo Histórico" }
  ];
  res.status(200).json(responsables);
}
