// lib/audit-logger.js - Sistema completo de auditoría de seguridad
import fs from "fs/promises";
import path from "path";

export class AuditLogger {
  constructor() {
    this.logDir = path.join(process.cwd(), "logs");
    this.ensureLogDirectory();
  }

  async ensureLogDirectory() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (error) {
      console.error("Error creando directorio de logs:", error);
    }
  }

  // Log de operaciones de autenticación
  async logAuth(action, user, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: "AUTH",
      action,
      user: {
        id: user?.id,
        email: user?.email,
        role: user?.role,
      },
      ip: details.ip,
      userAgent: details.userAgent,
      success: details.success,
      error: details.error,
    };

    await this.writeLog("auth", logEntry);
    console.log(
      `🔐 AUTH: ${action} - ${user?.email || "Unknown"} - ${
        details.success ? "SUCCESS" : "FAILED"
      }`
    );
  }

  // Log de operaciones de datos críticos
  async logDataOperation(action, user, resource, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: "DATA",
      action,
      user: {
        id: user?.id,
        email: user?.email,
        role: user?.role,
      },
      resource,
      resourceId: details.resourceId,
      oldValue: details.oldValue,
      newValue: details.newValue,
      ip: details.ip,
      success: details.success,
      error: details.error,
    };

    await this.writeLog("data-operations", logEntry);
    console.log(`📊 DATA: ${action} on ${resource} by ${user?.email}`);
  }

  // Log de intentos de acceso no autorizado
  async logSecurityEvent(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: "SECURITY",
      event,
      ip: details.ip,
      userAgent: details.userAgent,
      endpoint: details.endpoint,
      method: details.method,
      headers: details.headers,
      payload: details.payload,
      severity: details.severity || "MEDIUM",
    };

    await this.writeLog("security-events", logEntry);
    console.log(
      `🚨 SECURITY: ${event} - IP: ${details.ip} - Severity: ${logEntry.severity}`
    );
  }

  // Log de operaciones de archivos
  async logFileOperation(action, user, fileName, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: "FILE",
      action,
      user: {
        id: user?.id,
        email: user?.email,
        role: user?.role,
      },
      fileName,
      fileSize: details.fileSize,
      mimeType: details.mimeType,
      path: details.path,
      success: details.success,
      error: details.error,
    };

    await this.writeLog("file-operations", logEntry);
    console.log(`📁 FILE: ${action} - ${fileName} by ${user?.email}`);
  }

  // Escribir log al archivo correspondiente
  async writeLog(category, logEntry) {
    try {
      const fileName = `${category}-${
        new Date().toISOString().split("T")[0]
      }.log`;
      const filePath = path.join(this.logDir, fileName);
      const logLine = JSON.stringify(logEntry) + "\n";

      await fs.appendFile(filePath, logLine, "utf8");
    } catch (error) {
      console.error("Error escribiendo log:", error);
    }
  }

  // Obtener resumen de actividad reciente
  async getActivitySummary(days = 7) {
    try {
      const summary = {
        authAttempts: 0,
        successfulLogins: 0,
        failedLogins: 0,
        dataOperations: 0,
        securityEvents: 0,
        fileOperations: 0,
        topUsers: {},
        securityAlerts: [],
      };

      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Leer logs de los últimos días
      const files = await fs.readdir(this.logDir);
      const recentFiles = files.filter((file) => {
        const fileDate = file.match(/(\d{4}-\d{2}-\d{2})/);
        if (fileDate) {
          return new Date(fileDate[1]) >= cutoffDate;
        }
        return false;
      });

      for (const file of recentFiles) {
        const content = await fs.readFile(path.join(this.logDir, file), "utf8");
        const lines = content.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const entry = JSON.parse(line);

            switch (entry.type) {
              case "AUTH":
                summary.authAttempts++;
                if (entry.success) {
                  summary.successfulLogins++;
                } else {
                  summary.failedLogins++;
                }
                break;
              case "DATA":
                summary.dataOperations++;
                break;
              case "SECURITY":
                summary.securityEvents++;
                if (entry.severity === "HIGH") {
                  summary.securityAlerts.push(entry);
                }
                break;
              case "FILE":
                summary.fileOperations++;
                break;
            }

            // Contar actividad por usuario
            if (entry.user?.email) {
              summary.topUsers[entry.user.email] =
                (summary.topUsers[entry.user.email] || 0) + 1;
            }
          } catch (e) {
            // Ignorar líneas malformadas
          }
        }
      }

      return summary;
    } catch (error) {
      console.error("Error generando resumen de actividad:", error);
      return null;
    }
  }
}

// Instancia singleton
export const auditLogger = new AuditLogger();

// Función helper para extraer IP del request
export function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
    "unknown"
  );
}

// Función helper para extraer User-Agent
export function getUserAgent(req) {
  return req.headers["user-agent"] || "unknown";
}
