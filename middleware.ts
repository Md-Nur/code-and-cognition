import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role;

    // Protect all /admin routes
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (role !== "FOUNDER") {
            return NextResponse.redirect(new URL("/contractor", req.url));
        }
    }

    // Protect /contractor routes
    if (pathname.startsWith("/contractor")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Redirect logged-in users away from login page
    if (pathname === "/login" && isLoggedIn) {
        if (role === "FOUNDER") {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
        return NextResponse.redirect(new URL("/contractor", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/contractor/:path*", "/login"],
};
