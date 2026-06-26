import { BaseRepository } from "./base.repository";
import type { Prisma, RiskAssessment } from "../generated/prisma/client";
import { toJsonValue } from "../utils/serialize";

export class RiskAssessmentRepository extends BaseRepository {
  async create(
    data: {
      cpgId: string;
      healthScore: number;
      riskLevel: Prisma.RiskAssessmentCreateInput["riskLevel"];
      anomalyDetected: boolean;
      anomalyReason?: string;
      factors?: unknown;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<RiskAssessment> {
    const client = tx ?? this.db;

    return client.riskAssessment.create({
      data: {
        cpgId: data.cpgId,
        healthScore: data.healthScore,
        riskLevel: data.riskLevel,
        anomalyDetected: data.anomalyDetected,
        anomalyReason: data.anomalyReason,
        factors: data.factors ? toJsonValue(data.factors) : undefined,
        assessedBySystem: true,
      },
    });
  }

  async findLatestByCpgId(cpgId: string): Promise<RiskAssessment | null> {
    return this.db.riskAssessment.findFirst({
      where: { cpgId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByCpgId(cpgId: string, limit = 20): Promise<RiskAssessment[]> {
    return this.db.riskAssessment.findMany({
      where: { cpgId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

export const riskAssessmentRepository = new RiskAssessmentRepository();
