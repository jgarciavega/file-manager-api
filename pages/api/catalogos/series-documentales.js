export default function handler(req, res) {
  const series = [
    { id: 1, tipo: "Actas de Cabildo" },
    { id: 2, tipo: "Contratos de Obra Pública" },
    { id: 3, tipo: "Correspondencia Oficial" },
    { id: 4, tipo: "Expedientes de Personal" },
    { id: 5, tipo: "Informes Financieros" },
    { id: 6, tipo: "Oficios" },
    { id: 7, tipo: "Resoluciones" },
    { id: 8, tipo: "Dictámenes" }
  ];
  res.status(200).json(series);
}
