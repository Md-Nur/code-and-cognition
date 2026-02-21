import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { Role } from "@prisma/client";
import { isRoleAllowed } from "./rbac";

export type ApiHandler = (
  req: NextRequest,
  context: any,
  session: any,
) => Promise<NextResponse>;

type RoleRequirement = Role | Role[];

export function withAuth(handler: ApiHandler, requiredRole?: RoleRequirement) {
  return async (req: NextRequest, context: any) => {
    try {
      const session = await auth();

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (requiredRole) {
        const roles = Array.isArray(requiredRole)
          ? requiredRole
          : [requiredRole];
        if (!isRoleAllowed(session.user, roles)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      return handler(req, context, session);
    } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}

export const ApiResponse = {
  success: (data: any, status: number = 200) =>
    NextResponse.json(data, { status }),
  error: (message: string, status: number = 400) =>
    NextResponse.json({ error: message }, { status }),
  unauthorized: () =>
    NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  forbidden: () => NextResponse.json({ error: "Forbidden" }, { status: 403 }),
  notFound: (entity: string = "Resource") =>
    NextResponse.json({ error: `${entity} not found` }, { status: 404 }),
};
