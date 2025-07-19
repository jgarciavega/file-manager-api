// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Rate limiting simple (en producción usar Redis)
const rateLimitMap = new Map();

function rateLimit(ip, limit = 100, windowMs = 15 * 60 * 1000) {
  // 100 requests per 15 minutes
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip);
  const validRequests = requests.filter((time) => time > windowStart);

  rateLimitMap.set(ip, validRequests);

  if (validRequests.length >= limit) {
    return false;
  }

  validRequests.push(now);
  return true;
}

export async function middleware(request) {
  const response = NextResponse.next();

  // Headers de seguridad
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Rate limiting
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "900", // 15 minutes
      },
    });
  }

  // Protección de rutas administrativas
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Permitir acceso a páginas demo sin autenticación
    if (request.nextUrl.pathname.includes("-demo")) {
      return response;
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Protección de rutas del dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protección de APIs
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Verificar Content-Type para APIs que reciben datos
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      const contentType = request.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // Verificar tamaño del payload
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
          // 10MB max
          return new NextResponse("Payload Too Large", { status: 413 });
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
