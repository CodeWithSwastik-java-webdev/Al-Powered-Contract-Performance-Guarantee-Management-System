import {
  AuditEntityType,
  ContractStatus,
  CpgStatus,
  type User,
} from "../generated/prisma/client";
import { prisma } from "../prisma/client";
import { contractRepository, cpgRepository } from "../repositories";
import { auditService } from "./audit.service";
import { detectAndStoreAnomalies } from "./anomaly-detection.service";
import type { AuditContext } from "../types/audit";
import type {
  CreateCpgInput,
  CpgActionInput,
  ExtendCpgInput,
  ListCpgsQuery,
} from "../validators";
import type { PaginatedResult } from "../types";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils";
import type { Prisma } from "../generated/prisma/client";

const EXTENDABLE_STATUSES: CpgStatus[] = [
  CpgStatus.ACTIVE,
  CpgStatus.EXPIRED,
];

const RELEASABLE_STATUSES: CpgStatus[] = [
  CpgStatus.ACTIVE,
  CpgStatus.EXPIRED,
  CpgStatus.CLAIMED,
];

export class CpgService {
  async create(
    input: CreateCpgInput,
    context: AuditContext,
  ) {
    const contract = await contractRepository.findById(input.contractId);
    if (!contract) {
      throw new NotFoundError("Contract not found");
    }
    if (contract.status !== ContractStatus.ACTIVE) {
      throw new BadRequestError(
        "CPG can only be created for active contracts",
      );
    }

    const existingBg = await cpgRepository.findByBgNumber(input.bgNumber);
    if (existingBg) {
      throw new ConflictError("BG number already exists");
    }

    const result = await prisma.$transaction(async (tx) => {
      const cpg = await cpgRepository.create(
        {
          contract: { connect: { id: input.contractId } },
          bgNumber: input.bgNumber,
          bgType: input.bgType,
          bankName: input.bankName,
          bankBranch: input.bankBranch,
          ifscCode: input.ifscCode,
          amount: input.amount,
          issueDate: input.issueDate,
          expiryDate: input.expiryDate,
          claimPeriodEnd: input.claimPeriodEnd,
          remarks: input.remarks,
          status: CpgStatus.ACTIVE,
        },
        tx,
      );

      await auditService.logCreate(
        context,
        AuditEntityType.CPG,
        cpg.id,
        cpg,
        undefined,
        tx,
      );

      return cpg;
    });

    await detectAndStoreAnomalies(result.id);
    return cpgRepository.findById(result.id);
  }

  async list(
    query: ListCpgsQuery,
    actor?: User,
  ): Promise<PaginatedResult<unknown>> {
    const { page, limit, contractId, status, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CpgWhereInput = {
      ...(contractId && { contractId }),
      ...(status && { status }),
      ...(actor?.role === "CONTRACTOR" && {
        contract: {
          contractorId: actor.contractorId ?? "__none__",
        },
      }),
      ...(search && {
        OR: [
          { bgNumber: { contains: search, mode: "insensitive" } },
          { bankName: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const { items, total } = await cpgRepository.findMany({
      skip,
      take: limit,
      where,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: string, actor?: User) {
    const cpg = await cpgRepository.findById(id);
    if (!cpg) {
      throw new NotFoundError("CPG not found");
    }
    if (actor?.role === "CONTRACTOR") {
      const contract = await contractRepository.findById(cpg.contractId);
      if (!contract || contract.contractorId !== actor.contractorId) {
        throw new NotFoundError("CPG not found");
      }
    }
    return cpg;
  }

  async verify(id: string, input: CpgActionInput, context: AuditContext) {
    const existing = await this.getById(id);

    if (existing.status !== CpgStatus.ACTIVE) {
      throw new BadRequestError("Only active CPGs can be verified");
    }

    const now = new Date();
    if (existing.expiryDate < now) {
      throw new BadRequestError(
        "Cannot verify an expired CPG. Update status first.",
      );
    }

    if (existing.issueDate >= existing.expiryDate) {
      throw new BadRequestError("Invalid CPG dates: issue date must precede expiry");
    }

    if (existing.claimPeriodEnd < existing.expiryDate) {
      throw new BadRequestError(
        "Invalid CPG dates: claim period must end on or after expiry",
      );
    }

    const contract = await contractRepository.findById(existing.contractId);
    if (!contract || contract.status !== ContractStatus.ACTIVE) {
      throw new BadRequestError("Linked contract is not active");
    }

    await prisma.$transaction(async (tx) => {
      await auditService.logUpdate(
        context,
        AuditEntityType.CPG,
        id,
        { status: existing.status, verified: false },
        { status: existing.status, verified: true },
        {
          operation: "VERIFY",
          remarks: input.remarks,
          verifiedAt: new Date().toISOString(),
        },
        tx,
      );
    });

    const anomaly = await detectAndStoreAnomalies(id);

    return {
      cpg: await this.getById(id),
      verification: {
        verified: true,
        verifiedAt: new Date().toISOString(),
        remarks: input.remarks,
      },
      riskAssessment: anomaly.assessment,
    };
  }

  async extend(
    id: string,
    input: ExtendCpgInput,
    context: AuditContext,
  ) {
    const original = await this.getById(id);

    if (!EXTENDABLE_STATUSES.includes(original.status)) {
      throw new BadRequestError(
        `CPG with status ${original.status} cannot be extended`,
      );
    }

    const existingBg = await cpgRepository.findByBgNumber(input.bgNumber);
    if (existingBg) {
      throw new ConflictError("BG number already exists");
    }

    const issueDate = input.issueDate ?? new Date();
    if (input.expiryDate <= issueDate) {
      throw new BadRequestError("New expiry date must be after issue date");
    }

    const result = await prisma.$transaction(async (tx) => {
      const renewed = await cpgRepository.update(
        id,
        { status: CpgStatus.RENEWED },
        tx,
      );

      const newCpg = await cpgRepository.create(
        {
          contract: { connect: { id: original.contractId } },
          bgNumber: input.bgNumber,
          bgType: original.bgType,
          bankName: original.bankName,
          bankBranch: original.bankBranch,
          ifscCode: original.ifscCode,
          amount: input.amount ?? original.amount,
          issueDate,
          expiryDate: input.expiryDate,
          claimPeriodEnd: input.claimPeriodEnd,
          remarks: input.remarks ?? original.remarks,
          status: CpgStatus.ACTIVE,
          renewedFrom: { connect: { id } },
        },
        tx,
      );

      await auditService.logStatusChange(
        context,
        AuditEntityType.CPG,
        id,
        original.status,
        CpgStatus.RENEWED,
        { operation: "EXTEND", newCpgId: newCpg.id },
        tx,
      );

      await auditService.logRenewal(
        context,
        id,
        newCpg.id,
        {
          operation: "EXTEND",
          oldBgNumber: original.bgNumber,
          newBgNumber: input.bgNumber,
          newExpiryDate: input.expiryDate.toISOString(),
        },
        tx,
      );

      await auditService.logCreate(
        context,
        AuditEntityType.CPG,
        newCpg.id,
        newCpg,
        { operation: "EXTEND", renewedFromId: id },
        tx,
      );

      return { original: renewed, newCpg };
    });

    await detectAndStoreAnomalies(result.newCpg.id);

    return {
      originalCpg: await cpgRepository.findById(id),
      extendedCpg: await cpgRepository.findById(result.newCpg.id),
    };
  }

  async release(id: string, input: CpgActionInput, context: AuditContext) {
    const existing = await this.getById(id);

    if (!RELEASABLE_STATUSES.includes(existing.status)) {
      throw new BadRequestError(
        `CPG with status ${existing.status} cannot be released`,
      );
    }

    await prisma.$transaction(async (tx) => {
      const updated = await cpgRepository.update(
        id,
        {
          status: CpgStatus.RELEASED,
          remarks: input.remarks ?? existing.remarks,
        },
        tx,
      );

      await auditService.logStatusChange(
        context,
        AuditEntityType.CPG,
        id,
        existing.status,
        CpgStatus.RELEASED,
        { operation: "RELEASE", remarks: input.remarks },
        tx,
      );

      await auditService.logRelease(
        context,
        id,
        { remarks: input.remarks },
        tx,
      );

      return updated;
    });

    return cpgRepository.findById(id);
  }

  async expire(id: string, input: CpgActionInput, context: AuditContext) {
    const existing = await this.getById(id);

    if (existing.status !== CpgStatus.ACTIVE) {
      throw new BadRequestError(
        `Only active CPGs can be expired. Current status: ${existing.status}`,
      );
    }

    const now = new Date();
    const isNaturallyExpired = existing.expiryDate <= now;

    await prisma.$transaction(async (tx) => {
      await cpgRepository.update(
        id,
        {
          status: CpgStatus.EXPIRED,
          remarks: input.remarks ?? existing.remarks,
        },
        tx,
      );

      await auditService.logStatusChange(
        context,
        AuditEntityType.CPG,
        id,
        existing.status,
        CpgStatus.EXPIRED,
        {
          operation: "EXPIRE",
          remarks: input.remarks,
          naturallyExpired: isNaturallyExpired,
          expiryDate: existing.expiryDate.toISOString(),
        },
        tx,
      );
    });

    await detectAndStoreAnomalies(id);
    return cpgRepository.findById(id);
  }
}

export const cpgService = new CpgService();
