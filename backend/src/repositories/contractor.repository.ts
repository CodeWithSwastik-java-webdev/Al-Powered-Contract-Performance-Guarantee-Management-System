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
    orderBy?: Prisma.ContractorOrderByWithRelationInput;
  }) {
    const [items, total] = await Promise.all([
      this.db.contractor.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy ?? { createdAt: "desc" },
      }),
      this.db.contractor.count({ where: params.where }),
    ]);
    return { items, total };
  }

  async create(data: Prisma.ContractorCreateInput): Promise<Contractor> { return this.db.contractor.create({ data }); }
  async update(id: string, data: Prisma.ContractorUpdateInput): Promise<Contractor> { return this.db.contractor.update({ where: { id }, data }); }
  async delete(id: string): Promise<void> { await this.db.contractor.delete({ where: { id } }); }
  async count(where?: Prisma.ContractorWhereInput): Promise<number> { return this.db.contractor.count({ where }); }
}

export const contractorRepository = new ContractorRepository();
