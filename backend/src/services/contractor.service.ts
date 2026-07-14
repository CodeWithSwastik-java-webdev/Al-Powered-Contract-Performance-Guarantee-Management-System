import { contractorRepository } from "../repositories";
import type { Prisma, Contractor } from "../generated/prisma/client";
import type { PaginatedResult } from "../types";
import { NotFoundError } from "../utils";
import type {
  CreateContractorInput,
  UpdateContractorInput,
  ListContractorsQuery,
} from "../validators";

export class ContractorService {
  async create(input: CreateContractorInput): Promise<Contractor> {
    return contractorRepository.create(input);
  }

  async getById(id: string): Promise<Contractor> {
    const contractor = await contractorRepository.findById(id);
    if (!contractor) {
      throw new NotFoundError("Contractor not found");
    }
    return contractor;
  }

  async update(id: string, input: UpdateContractorInput): Promise<Contractor> {
    await this.getById(id); // Ensure exists
    return contractorRepository.update(id, input);
  }

  async list(query: ListContractorsQuery): Promise<PaginatedResult<Contractor>> {
    const { page = 1, limit = 10, search, isActive, isBlacklisted } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ContractorWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }
    if (isBlacklisted !== undefined) {
      where.isBlacklisted = isBlacklisted === "true";
    }

    const [data, total] = await Promise.all([
      contractorRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { name: "asc" },
      }),
      contractorRepository.count(where),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await contractorRepository.delete(id);
  }
}

export const contractorService = new ContractorService();
