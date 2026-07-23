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
  REGISTRATION_READ: "registration:read",
  REGISTRATION_WRITE: "registration:write",
  REPORT_READ: "report:read",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

const ALL_PERMISSIONS = Object.values(Permission);

const READ_PORTFOLIO: Permission[] = [
  Permission.USER_READ,
  Permission.CONTRACTOR_READ,
  Permission.CONTRACT_READ,
  Permission.CPG_READ,
  Permission.DOCUMENT_READ,
  Permission.NOTIFICATION_READ,
  Permission.RISK_READ,
  Permission.ML_READ,
  Permission.REPORT_READ,
];

const rolePermissions: Record<UserRole, readonly Permission[]> = {
  [UserRole.ADMIN]: ALL_PERMISSIONS,
  [UserRole.PROJECT_ENGINEER]: [
    ...READ_PORTFOLIO,
    Permission.CONTRACTOR_WRITE,
    Permission.CONTRACT_WRITE,
    Permission.CPG_WRITE,
    Permission.CPG_MANAGE_STATUS,
    Permission.DOCUMENT_WRITE,
  ],
  [UserRole.FINANCE_OFFICER]: [
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
    Permission.REPORT_READ,
  ],
  [UserRole.CONTRACT_MANAGER]: [
    ...READ_PORTFOLIO,
    Permission.CONTRACTOR_WRITE,
    Permission.CONTRACT_WRITE,
    Permission.CPG_WRITE,
    Permission.CPG_MANAGE_STATUS,
    Permission.DOCUMENT_WRITE,
  ],
  [UserRole.AUDITOR]: [
    ...READ_PORTFOLIO,
    Permission.AUDIT_READ,
  ],
  [UserRole.CONTRACTOR]: [
    Permission.CONTRACT_READ,
    Permission.CPG_READ,
    Permission.DOCUMENT_READ,
    Permission.NOTIFICATION_READ,
  ],
  [UserRole.VIEWER]: [
    Permission.NOTIFICATION_READ,
    Permission.REPORT_READ,
    Permission.CONTRACT_READ,
    Permission.CPG_READ,
  ],
};

export function roleHasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
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
