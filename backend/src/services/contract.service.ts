import {
  AuditEntityType,
  ContractStatus,
  type Prisma,
  type User,
} from "../generated/prisma/client";
import {
  contractRepository,
  contractorRepository,
} from "../repositories";
import { auditService } from "./audit.service";
import type { AuditContext } from "../types/audit";
import type {
  CreateContractInput,
  ListContractsQuery,
  UpdateContractInput,
} from "../validators";
import type { PaginatedResult } from "../types";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils";

export class ContractService {
  async create(
    input: CreateContractInput,
    actor: User,
    context: AuditContext,
  ) {
    const contractor = await contractorRepository.findById(input.contractorId);
    if (!contractor) {
      throw new NotFoundError("Contractor not found");
    }
    if (!contractor.isActive || contractor.isBlacklisted) {
      throw new BadRequestError(
        "Cannot create contract for inactive or blacklisted contractor",
      );
    }

    const existing = await contractRepository.findByContractNumber(
      input.contractNumber,
    );
    if (existing) {
      throw new ConflictError("Contract number already exists");
    }

    return contractRepository.withTransaction(async (tx) => {
      const contract = await contractRepository.create(
        {
          contractNumber: input.contractNumber,
          projectName: input.projectName,
          description: input.description,
          contractValue: input.contractValue,
          currency: input.currency,
          awardDate: input.awardDate,
          completionDate: input.completionDate,
          status: input.status,
          zone: input.zone,
          contractor: { connect: { id: input.contractorId } },
          createdBy: { connect: { id: actor.id } },
        },
        tx,
      );

      await auditService.logCreate(
        context,
        AuditEntityType.CONTRACT,
        contract.id,
        contract,
        undefined,
        tx,
      );

      return contractRepository.findById(contract.id);
    });
  }

  async list(query: ListContractsQuery): Promise<PaginatedResult<unknown>> {
    const { page, limit, status, zone, contractorId, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ContractWhereInput = {
      ...(status && { status }),
      ...(zone && { zone }),
      ...(contractorId && { contractorId }),
      ...(search && {
        OR: [
          { contractNumber: { contains: search, mode: "insensitive" } },
          { projectName: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const { items, total } = await contractRepository.findMany({
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

  async getById(id: string) {
    const contract = await contractRepository.findById(id);
    if (!contract) {
      throw new NotFoundError("Contract not found");
    }
    return contract;
  }

  async update(
    id: string,
    input: UpdateContractInput,
    actor: User,
    context: AuditContext,
  ) {
    const existing = await this.getById(id);

    if (input.contractorId) {
      const contractor = await contractorRepository.findById(input.contractorId);
      if (!contractor) {
        throw new NotFoundError("Contractor not found");
      }
      if (!contractor.isActive || contractor.isBlacklisted) {
        throw new BadRequestError(
          "Cannot assign inactive or blacklisted contractor",
        );
      }
    }

    const awardDate = input.awardDate ?? existing.awardDate;
    const completionDate =
      input.completionDate !== undefined
        ? input.completionDate
        : existing.completionDate;

    if (completionDate && completionDate < awardDate) {
      throw new BadRequestError(
        "Completion date must be on or after award date",
      );
    }

    return contractRepository.withTransaction(async (tx) => {
      const updated = await contractRepository.update(
        id,
        {
          ...(input.projectName !== undefined && {
            projectName: input.projectName,
          }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
          ...(input.contractValue !== undefined && {
            contractValue: input.contractValue,
          }),
          ...(input.currency !== undefined && { currency: input.currency }),
          ...(input.awardDate !== undefined && { awardDate: input.awardDate }),
          ...(input.completionDate !== undefined && {
            completionDate: input.completionDate,
          }),
          ...(input.status !== undefined && { status: input.status }),
          ...(input.zone !== undefined && { zone: input.zone }),
          ...(input.contractorId !== undefined && {
            contractor: { connect: { id: input.contractorId } },
          }),
          updatedBy: { connect: { id: actor.id } },
        },
        tx,
      );

      if (input.status && input.status !== existing.status) {
        await auditService.logStatusChange(
          context,
          AuditEntityType.CONTRACT,
          id,
          existing.status,
          input.status,
          undefined,
          tx,
        );
      }

      await auditService.logUpdate(
        context,
        AuditEntityType.CONTRACT,
        id,
        existing,
        updated,
        undefined,
        tx,
      );

      return contractRepository.findById(id);
    });
  }

  async delete(id: string, context: AuditContext) {
    const existing = await this.getById(id);

    const cpgCount = await contractRepository.countCpgs(id);
    if (cpgCount > 0) {
      throw new BadRequestError(
        "Cannot delete contract with linked CPG records. Remove or reassign CPGs first.",
      );
    }

    if (existing.status === ContractStatus.ACTIVE) {
      throw new BadRequestError(
        "Cannot delete an active contract. Change status before deleting.",
      );
    }

    return contractRepository.withTransaction(async (tx) => {
      await auditService.logDelete(context, "CONTRACT", id, existing, tx);
      await contractRepository.delete(id, tx);
    });
  }
}

export const contractService = new ContractService();
