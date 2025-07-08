export default function handler(req, res) {
  const accesos = [
    { id: 1, nombre: "Público" },
    { id: 2, nombre: "Restringido" },
    { id: 3, nombre: "Confidencial" }
  ];
  res.status(200).json(accesos);
}
