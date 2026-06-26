import { UserRole } from "../generated/prisma/client";

export const Permission = {
  USER_READ: "user:read",
  USER_WRITE: "user:write",
  USER_MANAGE_ROLES: "user:manage_roles",
  CONTRACTOR_READ: "contractor:read",
  CONTRACTOR_WRITE: "contractor:write",
  CONTRACT_READ: "contract:read",
  CONTRACT_WRITE: "contract:write",
  CPG_READ: "cpg:read",
  CPG_WRITE: "cpg:write",
  CPG_MANAGE_STATUS: "cpg:manage_status",
  DOCUMENT_READ: "document:read",
  DOCUMENT_WRITE: "document:write",
  NOTIFICATION_READ: "notification:read",
  AUDIT_READ: "audit:read",
  RISK_READ: "risk:read",
  ML_READ: "ml:read",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

const rolePermissions: Record<UserRole, readonly Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),
  [UserRole.ENGINEER]: [
    Permission.USER_READ,
    Permission.CONTRACTOR_READ,
    Permission.CONTRACTOR_WRITE,
    Permission.CONTRACT_READ,
    Permission.CONTRACT_WRITE,
    Permission.CPG_READ,
    Permission.CPG_WRITE,
    Permission.CPG_MANAGE_STATUS,
    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_WRITE,
    Permission.NOTIFICATION_READ,
    Permission.RISK_READ,
    Permission.ML_READ,
  ],
  [UserRole.FINANCE]: [
    Permission.USER_READ,
    Permission.CONTRACTOR_READ,
    Permission.CONTRACT_READ,
    Permission.CPG_READ,
    Permission.CPG_MANAGE_STATUS,
    Permission.DOCUMENT_READ,
    Permission.NOTIFICATION_READ,
    Permission.AUDIT_READ,
    Permission.RISK_READ,
    Permission.ML_READ,
  ],
  [UserRole.VIEWER]: [
    Permission.USER_READ,
    Permission.CONTRACTOR_READ,
    Permission.CONTRACT_READ,
    Permission.CPG_READ,
    Permission.DOCUMENT_READ,
    Permission.NOTIFICATION_READ,
    Permission.RISK_READ,
    Permission.ML_READ,
  ],
};

export function roleHasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return rolePermissions[role].includes(permission);
}

export function roleHasAnyPermission(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => roleHasPermission(role, permission));
}

export function roleHasAllPermissions(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) => roleHasPermission(role, permission));
}
