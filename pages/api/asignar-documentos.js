// pages/api/asignar-documentos.js - API protegida para asignación de documentos
import { requireAuth } from "../../lib/auth-utils";

export default async function handler(req, res) {
  // Verificar autenticación (solo admins pueden asignar documentos)
  const authResult = await requireAuth(req, res, "admin");
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { user: currentUser } = authResult;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Método no permitido" });
  }

  console.log(`📋 Admin ${currentUser.email} asignando documentos`);

  // Funcionalidad de asignación pendiente de implementar
  return res.status(501).json({
    error: "Funcionalidad no implementada",
    message: "API protegida pero pendiente de desarrollo",
    user: currentUser.email,
  });
}
