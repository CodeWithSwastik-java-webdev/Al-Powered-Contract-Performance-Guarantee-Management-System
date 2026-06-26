import { BaseRepository } from "./base.repository";
import type { Contract, Prisma } from "../generated/prisma/client";

export type ContractWithRelations = Prisma.ContractGetPayload<{
  include: { contractor: true; cpgs: true };
}>;

export type ContractListItem = Prisma.ContractGetPayload<{
  include: { contractor: true };
}>;

export class ContractRepository extends BaseRepository {
  async findById(id: string): Promise<ContractWithRelations | null> {
    return this.db.contract.findUnique({
      where: { id },
      include: { contractor: true, cpgs: true },
    });
  }

  async findByContractNumber(
    contractNumber: string,
  ): Promise<Contract | null> {
    return this.db.contract.findUnique({ where: { contractNumber } });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ContractWhereInput;
    orderBy?: Prisma.ContractOrderByWithRelationInput;
  }): Promise<{ items: ContractListItem[]; total: number }> {
    const [items, total] = await Promise.all([
      this.db.contract.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        include: { contractor: true },
        orderBy: params.orderBy ?? { createdAt: "desc" },
      }),
      this.db.contract.count({ where: params.where }),
    ]);
    return { items, total };
  }

  async create(
    data: Prisma.ContractCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Contract> {
    const client = tx ?? this.db;
    return client.contract.create({ data });
  }

  async update(
    id: string,
    data: Prisma.ContractUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Contract> {
    const client = tx ?? this.db;
    return client.contract.update({ where: { id }, data });
  }

  async delete(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Contract> {
    const client = tx ?? this.db;
    return client.contract.delete({ where: { id } });
  }

  async countCpgs(
    contractId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.db;
    return client.cpg.count({ where: { contractId } });
  }

  withTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.db.$transaction(fn);
  }
}

export const contractRepository = new ContractRepository();
