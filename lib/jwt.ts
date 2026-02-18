import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";

if (!SECRET_KEY && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET must be set in production");
}

const SECRET = new TextEncoder().encode(SECRET_KEY || "fallback-secret-for-dev-only-do-not-use-in-prod");

export async function signToken(payload: any, expiresIn: string = "24h") {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(SECRET);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}
