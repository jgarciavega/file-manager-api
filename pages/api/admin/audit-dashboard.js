// pages/api/admin/audit-dashboard.js - Dashboard de auditoría para administradores
import { requireAuth } from "../../../lib/auth-utils";
import { auditLogger } from "../../../lib/audit-logger";

export default async function handler(req, res) {
  // Solo super-administradores pueden acceder al dashboard de auditoría
  const authResult = await requireAuth(req, res, "admin");
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { user: currentUser } = authResult;

  // Restricción adicional para super-admin
  if (currentUser.email !== "jorge.garcia@apibcs.com.mx") {
    return res.status(403).json({
      error:
        "Solo el super-administrador puede acceder al dashboard de auditoría",
    });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { days = 7 } = req.query;

    console.log(
      `📊 Super-admin ${currentUser.email} accediendo al dashboard de auditoría`
    );

    // Obtener resumen de actividad
    const activitySummary = await auditLogger.getActivitySummary(
      parseInt(days)
    );

    if (!activitySummary) {
      return res.status(500).json({
        error: "Error obteniendo datos de auditoría",
      });
    }

    // Calcular métricas adicionales
    const metrics = {
      totalSessions: activitySummary.authAttempts,
      successRate:
        activitySummary.authAttempts > 0
          ? Math.round(
              (activitySummary.successfulLogins /
                activitySummary.authAttempts) *
                100
            )
          : 0,
      securityScore: calculateSecurityScore(activitySummary),
      riskLevel: assessRiskLevel(activitySummary),
      topActiveUsers: Object.entries(activitySummary.topUsers)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([email, count]) => ({ email, activities: count })),
    };

    const dashboardData = {
      period: `Últimos ${days} días`,
      timestamp: new Date().toISOString(),
      summary: activitySummary,
      metrics,
      alerts: activitySummary.securityAlerts.slice(0, 10), // Últimas 10 alertas
      recommendations: generateRecommendations(activitySummary),
    };

    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error en dashboard de auditoría:", error);
    return res.status(500).json({
      error: "Error interno generando dashboard",
    });
  }
}

function calculateSecurityScore(summary) {
  let score = 100;

  // Penalizar intentos fallidos de login
  if (summary.authAttempts > 0) {
    const failureRate = summary.failedLogins / summary.authAttempts;
    score -= Math.round(failureRate * 30);
  }

  // Penalizar eventos de seguridad
  score -= Math.min(summary.securityEvents * 5, 40);

  // Bonificar actividad normal
  if (summary.dataOperations > 0 && summary.securityEvents === 0) {
    score += 5;
  }

  return Math.max(score, 0);
}

function assessRiskLevel(summary) {
  const highRiskEvents = summary.securityAlerts.length;
  const failureRate =
    summary.authAttempts > 0 ? summary.failedLogins / summary.authAttempts : 0;

  if (highRiskEvents > 5 || failureRate > 0.3) {
    return "HIGH";
  } else if (highRiskEvents > 2 || failureRate > 0.1) {
    return "MEDIUM";
  } else {
    return "LOW";
  }
}

function generateRecommendations(summary) {
  const recommendations = [];

  if (summary.failedLogins > summary.successfulLogins) {
    recommendations.push({
      type: "WARNING",
      message: "Alto número de intentos de login fallidos detectados",
      action:
        "Revisar logs de autenticación y considerar bloqueo temporal de IPs sospechosas",
    });
  }

  if (summary.securityEvents > 10) {
    recommendations.push({
      type: "ALERT",
      message: "Múltiples eventos de seguridad detectados",
      action: "Revisar inmediatamente los logs de seguridad",
    });
  }

  if (summary.securityAlerts.length === 0 && summary.authAttempts > 0) {
    recommendations.push({
      type: "INFO",
      message: "Sistema funcionando normalmente",
      action: "Continuar monitoreo regular",
    });
  }

  return recommendations;
}
