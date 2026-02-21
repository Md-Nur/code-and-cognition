import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import { verifyToken } from "./jwt";

export async function auth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    user: {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as Role,
      name: payload.name as string,
    },
  };
}

export const handlers = {
  GET: () => new Response("Not implemented", { status: 404 }),
  POST: () => new Response("Not implemented", { status: 404 }),
};
