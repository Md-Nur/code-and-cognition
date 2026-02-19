import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
const SECRET = new TextEncoder().encode(SECRET_KEY || "fallback-secret-for-dev-only-do-not-use-in-prod");

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Routes that require authentication
    const isProtectedPath = pathname.startsWith("/admin") || pathname.startsWith("/contractor");
    const isProtectedApi = pathname.startsWith("/api/admin");

    if (isProtectedPath || isProtectedApi) {
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            if (isProtectedApi) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            await jwtVerify(token, SECRET);
            return NextResponse.next();
        } catch (error) {
            console.error("Middleware Auth Error:", error);
            if (isProtectedApi) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/contractor/:path*",
        "/api/admin/:path*",
    ],
};
