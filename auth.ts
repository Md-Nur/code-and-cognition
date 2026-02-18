import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";

if (!SECRET_KEY) {
    console.error("Critical: AUTH_SECRET or NEXTAUTH_SECRET is not set");
}

const SECRET = new TextEncoder().encode(SECRET_KEY || "fallback-for-compilation");

export async function auth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET);
        return {
            user: {
                id: payload.id as string,
                email: payload.email as string,
                role: payload.role as string,
                name: payload.name as string,
            },
        };
    } catch (error) {
        console.error("Auth helper verification failed:", error);
        return null;
    }
}

export const handlers = {
    GET: () => new Response("Not implemented", { status: 404 }),
    POST: () => new Response("Not implemented", { status: 404 }),
};
