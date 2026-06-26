import { BaseRepository } from "./base.repository";
import type { Cpg, Prisma } from "../generated/prisma/client";

export type CpgWithRelations = Prisma.CpgGetPayload<{
  include: {
    contract: { include: { contractor: true } };
    documents: true;
    renewedFrom: true;
    renewals: true;
  };
}>;

export class CpgRepository extends BaseRepository {
  async findById(id: string): Promise<CpgWithRelations | null> {
    return this.db.cpg.findUnique({
      where: { id },
      include: {
        contract: { include: { contractor: true } },
        documents: { where: { isActive: true } },
        renewedFrom: true,
        renewals: true,
      },
    });
  }

  async findByBgNumber(bgNumber: string): Promise<Cpg | null> {
    return this.db.cpg.findUnique({ where: { bgNumber } });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CpgWhereInput;
  }) {
    const [items, total] = await Promise.all([
      this.db.cpg.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        include: { contract: true },
        orderBy: { expiryDate: "asc" },
      }),
      this.db.cpg.count({ where: params.where }),
    ]);
    return { items, total };
  }

  async create(
    data: Prisma.CpgCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Cpg> {
    const client = tx ?? this.db;
    return client.cpg.create({ data });
  }

  async update(
    id: string,
    data: Prisma.CpgUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Cpg> {
    const client = tx ?? this.db;
    return client.cpg.update({ where: { id }, data });
  }

  async getRenewalChain(cpgId: string): Promise<Cpg[]> {
    const chain: Cpg[] = [];
    let current = await this.db.cpg.findUnique({ where: { id: cpgId } });

    while (current?.renewedFromId) {
      const parent = await this.db.cpg.findUnique({
        where: { id: current.renewedFromId },
      });
      if (!parent) break;
      chain.push(parent);
      current = parent;
    }

    return chain;
  }

  async countRecentRenewals(cpgId: string, withinMonths: number): Promise<number> {
    const since = new Date();
    since.setMonth(since.getMonth() - withinMonths);

    const ancestors = await this.getRenewalChain(cpgId);
    const familyIds = [cpgId, ...ancestors.map((a) => a.id)];

    return this.db.cpg.count({
      where: {
        renewedFromId: { in: familyIds },
        createdAt: { gte: since },
      },
    });
  }
}

export const cpgRepository = new CpgRepository();
