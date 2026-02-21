import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
const SECRET = new TextEncoder().encode(
  SECRET_KEY || "fallback-secret-for-dev-only-do-not-use-in-prod",
);

const PUBLIC_API_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/logout",
  "/api/booking",
  "/api/services",
  "/api/portfolio",
]);

const PUBLIC_API_PREFIXES = ["/api/portal/project/"];

const ROLE_RULES = [
  { prefix: "/admin/profile", roles: ["CONTRACTOR", "FOUNDER"] },
  { prefix: "/admin", roles: ["FOUNDER"] },
  { prefix: "/contractor", roles: ["CONTRACTOR", "FOUNDER"] },
];

function isPublicApi(pathname: string) {
  if (PUBLIC_API_PATHS.has(pathname)) return true;
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function getRequiredRoles(pathname: string) {
  return (
    ROLE_RULES.find((rule) => pathname.startsWith(rule.prefix))?.roles ?? null
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");
  const requiresAuth = isApi
    ? !isPublicApi(pathname)
    : pathname.startsWith("/admin") || pathname.startsWith("/contractor");

  if (!requiresAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role as string | undefined;
    const requiredRoles = getRequiredRoles(pathname);

    if (requiredRoles && (!role || !requiredRoles.includes(role))) {
      if (isApi) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Auth Error:", error);
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/contractor/:path*", "/api/:path*"],
};
