import { BaseRepository } from "./base.repository";
import type {
  AuditAction,
  AuditEntityType,
  AuditLog,
  Prisma,
} from "../generated/prisma/client";
import type { AuditContext } from "../types/audit";
import { toJsonValue } from "../utils/serialize";

export class AuditLogRepository extends BaseRepository {
  async create(
    params: {
      context: AuditContext;
      entityType: AuditEntityType;
      entityId: string;
      action: AuditAction;
      oldValue?: unknown;
      newValue?: unknown;
      metadata?: unknown;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<AuditLog> {
    const client = tx ?? this.db;

    return client.auditLog.create({
      data: {
        userId: params.context.userId,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        oldValue: params.oldValue ? toJsonValue(params.oldValue) : undefined,
        newValue: params.newValue ? toJsonValue(params.newValue) : undefined,
        metadata: params.metadata ? toJsonValue(params.metadata) : undefined,
        ipAddress: params.context.ipAddress,
        userAgent: params.context.userAgent,
      },
    });
  }

  async findByEntity(
    entityType: AuditEntityType,
    entityId: string,
    limit = 50,
  ): Promise<AuditLog[]> {
    return this.db.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

export const auditLogRepository = new AuditLogRepository();
