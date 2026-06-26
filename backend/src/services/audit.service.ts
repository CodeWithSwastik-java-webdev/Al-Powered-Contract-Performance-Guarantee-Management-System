import {
  AuditAction,
  AuditEntityType,
  type Prisma,
} from "../generated/prisma/client";
import { auditLogRepository } from "../repositories";
import type { AuditContext } from "../types/audit";

export class AuditService {
  async logCreate(
    context: AuditContext,
    entityType: AuditEntityType,
    entityId: string,
    newValue: unknown,
    metadata?: unknown,
    tx?: Prisma.TransactionClient,
  ) {
    return auditLogRepository.create(
      {
        context,
        entityType,
        entityId,
        action: AuditAction.CREATE,
        newValue,
        metadata,
      },
      tx,
    );
  }

  async logUpdate(
    context: AuditContext,
    entityType: AuditEntityType,
    entityId: string,
    oldValue: unknown,
    newValue: unknown,
    metadata?: unknown,
    tx?: Prisma.TransactionClient,
  ) {
    return auditLogRepository.create(
      {
        context,
        entityType,
        entityId,
        action: AuditAction.UPDATE,
        oldValue,
        newValue,
        metadata,
      },
      tx,
    );
  }

  async logDelete(
    context: AuditContext,
    entityType: AuditEntityType,
    entityId: string,
    oldValue: unknown,
    tx?: Prisma.TransactionClient,
  ) {
    return auditLogRepository.create(
      {
        context,
        entityType,
        entityId,
        action: AuditAction.DELETE,
        oldValue,
      },
      tx,
    );
  }

  async logStatusChange(
    context: AuditContext,
    entityType: AuditEntityType,
    entityId: string,
    oldStatus: string,
    newStatus: string,
    metadata?: unknown,
    tx?: Prisma.TransactionClient,
  ) {
    return auditLogRepository.create(
      {
        context,
        entityType,
        entityId,
        action: AuditAction.STATUS_CHANGE,
        oldValue: { status: oldStatus },
        newValue: { status: newStatus },
        metadata,
      },
      tx,
    );
  }

  async logRenewal(
    context: AuditContext,
    originalCpgId: string,
    newCpgId: string,
    metadata?: unknown,
    tx?: Prisma.TransactionClient,
  ) {
    return auditLogRepository.create(
      {
        context,
        entityType: AuditEntityType.CPG,
        entityId: originalCpgId,
        action: AuditAction.RENEWAL,
        metadata: { ...((metadata as object) ?? {}), newCpgId },
      },
      tx,
    );
  }

  async logRelease(
    context: AuditContext,
    cpgId: string,
    metadata?: unknown,
    tx?: Prisma.TransactionClient,
  ) {
    return auditLogRepository.create(
      {
        context,
        entityType: AuditEntityType.CPG,
        entityId: cpgId,
        action: AuditAction.RELEASE,
        metadata,
      },
      tx,
    );
  }
}

export const auditService = new AuditService();
