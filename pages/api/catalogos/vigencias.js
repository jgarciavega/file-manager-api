export default function handler(req, res) {
  const vigencias = [
    { id: 1, nombre: "Temporal" },
    { id: 2, nombre: "Permanente" }
  ];
  res.status(200).json(vigencias);
}
