import type { Prisma, ReportHistory } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";

export class ReportHistoryRepository extends BaseRepository {
  async create(data: Prisma.ReportHistoryCreateInput): Promise<ReportHistory> {
    return this.db.reportHistory.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ReportHistoryWhereInput;
    orderBy?: Prisma.ReportHistoryOrderByWithRelationInput;
  }): Promise<{ items: ReportHistory[]; total: number }> {
    const [items, total] = await Promise.all([
      this.db.reportHistory.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy ?? { generatedOn: "desc" },
      }),
      this.db.reportHistory.count({ where: params.where }),
    ]);

    return { items, total };
  }

  async updateDownloadState(id: string): Promise<ReportHistory> {
    return this.db.reportHistory.update({
      where: { id },
      data: { downloaded: true },
    });
  }
}

export const reportHistoryRepository = new ReportHistoryRepository();
