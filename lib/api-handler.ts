import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { Role } from "@prisma/client";
import { isRoleAllowed, canAccessProject } from "./rbac";
import { prisma } from "./prisma";

export type ApiHandler = (
  req: NextRequest,
  context: any,
  session: any,
) => Promise<NextResponse>;

type RoleRequirement = Role | Role[];

/**
 * API Route Proxy Guard
 */
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
        if (!isRoleAllowed(session.user as any, roles)) {
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

export function withProjectAuth(
  handler: ApiHandler,
  options?: { allowClient?: boolean; includeFinder?: boolean }
) {
  return withAuth(async (req, context, session) => {
    try {
      // In Next.js App Router context.params is a Promise
      const params = await context.params;
      const id = params?.id;

      if (!id) {
        return ApiResponse.error("Project ID is required");
      }

      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          booking: true,
          members: true,
        },
      });

      if (!project) {
        return ApiResponse.notFound("Project");
      }

      const canAccess = canAccessProject(session.user as any, project, options);
      if (!canAccess) {
        return ApiResponse.forbidden();
      }

      context.project = project;
      return handler(req, context, session);
    } catch (error) {
      console.error("Project Auth Error:", error);
      return ApiResponse.error("Internal Server Error", 500);
    }
  });
}

/**
 * Server Action Proxy Guard
 */
export function withProxyValidation<T extends (...args: any[]) => Promise<any>>(
  action: T,
  options?: {
    requiredRole?: RoleRequirement;
    checkProjectAccess?: (args: Parameters<T>) => Promise<string | undefined>;
  }
): T {
  return (async (...args: Parameters<T>) => {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (options?.requiredRole) {
      const roles = Array.isArray(options.requiredRole)
        ? options.requiredRole
        : [options.requiredRole];
      if (!isRoleAllowed(session.user as any, roles)) {
        throw new Error("Forbidden: Insufficient privileges");
      }
    }

    if (options?.checkProjectAccess) {
      const projectId = await options.checkProjectAccess(args);
      if (projectId) {
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: { booking: true, members: true },
        });

        if (!project || !canAccessProject(session.user as any, project)) {
          throw new Error("Forbidden: Project Access Denied");
        }
      }
    }

    return action(...args);
  }) as T;
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
