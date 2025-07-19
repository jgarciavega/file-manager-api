// lib/auth-utils.js
import bcrypt from "bcryptjs";
import { getSession } from "next-auth/react";
import { auditLogger, getClientIP, getUserAgent } from "./audit-logger";

/**
 * Hash de contraseña seguro
 */
export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verificación de contraseña
 */
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Middleware de autenticación para APIs
 */
export async function requireAuth(req, res, requiredRole = null) {
  try {
    const session = await getSession({ req });
    const ip = getClientIP(req);
    const userAgent = getUserAgent(req);

    if (!session) {
      // Log intento de acceso no autorizado
      await auditLogger.logSecurityEvent("UNAUTHORIZED_ACCESS_ATTEMPT", {
        ip,
        userAgent,
        endpoint: req.url,
        method: req.method,
        severity: "MEDIUM",
      });

      return {
        error: "Acceso no autorizado. Sesión requerida.",
        status: 401,
      };
    }

    // Log acceso autorizado
    await auditLogger.logAuth("ACCESS_GRANTED", session.user, {
      ip,
      userAgent,
      success: true,
    });

    if (requiredRole && !hasRole(session.user.role, requiredRole)) {
      // Log intento de acceso con privilegios insuficientes
      await auditLogger.logSecurityEvent("INSUFFICIENT_PRIVILEGES", {
        ip,
        userAgent,
        endpoint: req.url,
        method: req.method,
        requiredRole,
        userRole: session.user.role,
        severity: "HIGH",
      });

      return {
        error: "Permisos insuficientes para esta operación.",
        status: 403,
      };
    }

    return { user: session.user };
  } catch (error) {
    console.error("Error en verificación de autenticación:", error);

    // Log error del sistema de autenticación
    await auditLogger.logSecurityEvent("AUTH_SYSTEM_ERROR", {
      ip: getClientIP(req),
      userAgent: getUserAgent(req),
      endpoint: req.url,
      error: error.message,
      severity: "HIGH",
    });

    return {
      error: "Error interno de autenticación.",
      status: 500,
    };
  }
}

/**
 * Verificación jerárquica de roles
 */
function hasRole(userRole, requiredRole) {
  const roleHierarchy = {
    admin: ["admin", "revisor", "capturista"],
    revisor: ["revisor", "capturista"],
    capturista: ["capturista"],
  };

  return roleHierarchy[userRole]?.includes(requiredRole) || false;
}

/**
 * Generación de token seguro
 */
export function generateSecureToken(length = 32) {
  const crypto = require("crypto");
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Validación de fuerza de contraseña
 */
export function validatePasswordStrength(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`La contraseña debe tener al menos ${minLength} caracteres.`);
  }
  if (!hasUpperCase) {
    errors.push("La contraseña debe contener al menos una letra mayúscula.");
  }
  if (!hasLowerCase) {
    errors.push("La contraseña debe contener al menos una letra minúscula.");
  }
  if (!hasNumbers) {
    errors.push("La contraseña debe contener al menos un número.");
  }
  if (!hasSpecialChar) {
    errors.push("La contraseña debe contener al menos un carácter especial.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
