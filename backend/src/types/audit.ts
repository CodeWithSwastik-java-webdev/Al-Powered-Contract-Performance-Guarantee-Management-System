export interface AuditContext {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export function auditContextFromRequest(req: {
  user?: { id: string };
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
}): AuditContext {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    req.ip ??
    (typeof forwarded === "string"
      ? forwarded.split(",")[0]?.trim()
      : undefined);

  const userAgent = req.headers["user-agent"];

  return {
    userId: req.user?.id,
    ipAddress: ip,
    userAgent: typeof userAgent === "string" ? userAgent : undefined,
  };
}
