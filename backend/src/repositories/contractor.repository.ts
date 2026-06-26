import { BaseRepository } from "./base.repository";
import type { Contractor, Prisma } from "../generated/prisma/client";

export class ContractorRepository extends BaseRepository {
  async findById(id: string): Promise<Contractor | null> {
    return this.db.contractor.findUnique({ where: { id } });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ContractorWhereInput;
  }) {
    const [items, total] = await Promise.all([
      this.db.contractor.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: { createdAt: "desc" },
      }),
      this.db.contractor.count({ where: params.where }),
    ]);
    return { items, total };
  }
}

export const contractorRepository = new ContractorRepository();
