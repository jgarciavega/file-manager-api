export default function handler(req, res) {
  const ubicaciones = [
    { id: 1, nombre: "Archivo Central" },
    { id: 2, nombre: "Archivo de Trámite" },
    { id: 3, nombre: "Archivo Histórico" }
  ];
  res.status(200).json(ubicaciones);
}
