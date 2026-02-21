import { Role } from "@prisma/client";

type ProjectAccessShape = {
  finderId: string;
  members?: Array<{ userId: string }>;
  booking?: { clientEmail?: string | null } | null;
};

type UserAccessShape = {
  id: string;
  email: string;
  role: Role;
};

export function isRoleAllowed(user: UserAccessShape, roles: Role[]) {
  if (user.role === Role.FOUNDER) return true;
  return roles.includes(user.role);
}

export function isProjectMember(
  user: UserAccessShape,
  project: ProjectAccessShape,
  options?: { includeFinder?: boolean },
) {
  const includeFinder = options?.includeFinder ?? true;
  const isMember =
    project.members?.some((member) => member.userId === user.id) ?? false;
  if (isMember) return true;
  if (includeFinder && project.finderId === user.id) return true;
  return false;
}

export function isProjectClient(
  user: UserAccessShape,
  project: ProjectAccessShape,
) {
  const clientEmail = project.booking?.clientEmail;
  if (!clientEmail) return false;
  return clientEmail.toLowerCase() === user.email.toLowerCase();
}

/**
 * Validates if the user has access to a specific resource (usually project-bound)
 * Founders: Full access
 * Contractors: Only assigned projects
 * Clients: Only own project & invoices
 */
export function canAccessProject(
  user: UserAccessShape,
  project: ProjectAccessShape,
  options?: { allowClient?: boolean; includeFinder?: boolean },
) {
  if (user.role === Role.FOUNDER) return true;

  if (user.role === Role.CONTRACTOR) {
    return isProjectMember(user, project, {
      includeFinder: options?.includeFinder,
    });
  }

  if (user.role === Role.CLIENT && options?.allowClient !== false) {
    return isProjectClient(user, project);
  }

  return false;
}

