// pages/api/favoritos-usuario.js - API protegida para favoritos de usuario
import { requireAuth } from "../../lib/auth-utils";

export default async function handler(req, res) {
  // Esta API está desactivada - usar /api/favoritos en su lugar
  const authResult = await requireAuth(req, res);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  return res.status(410).json({
    error: "API deprecada",
    message: "Use /api/favoritos en su lugar",
    redirectTo: "/api/favoritos",
  });
}
