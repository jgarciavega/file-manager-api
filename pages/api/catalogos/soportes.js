export default function handler(req, res) {
  const soportes = [
    { id: 1, nombre: "Digital" },
    { id: 2, nombre: "Físico" },
    { id: 3, nombre: "Mixto" }
  ];
  res.status(200).json(soportes);
}
