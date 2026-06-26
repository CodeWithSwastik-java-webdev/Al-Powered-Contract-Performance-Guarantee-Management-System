import {
  DocumentType,
  RiskLevel,
  type Prisma,
} from "../generated/prisma/client";
import {
  ANOMALY_HEALTH_SCORES,
  ANOMALY_THRESHOLDS,
} from "../config/anomaly";
import {
  cpgRepository,
  riskAssessmentRepository,
} from "../repositories";

export type AnomalyType =
  | "UNUSUAL_AMOUNT"
  | "EXCESSIVE_EXTENSIONS"
  | "FREQUENT_DELAYS"
  | "MISSING_DOCUMENTS";

export interface AnomalyFinding {
  type: AnomalyType;
  severity: RiskLevel;
  message: string;
  details: Record<string, unknown>;
}

export interface AnomalyDetectionResult {
  cpgId: string;
  anomalies: AnomalyFinding[];
  anomalyDetected: boolean;
  healthScore: number;
  riskLevel: RiskLevel;
  summary: string | null;
}

function toNumber(value: Prisma.Decimal | number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export async function detectUnusualAmount(
  cpgId: string,
): Promise<AnomalyFinding | null> {
  const cpg = await cpgRepository.findById(cpgId);
  if (!cpg) return null;

  const contractValue = toNumber(cpg.contract.contractValue);
  const cpgAmount = toNumber(cpg.amount);
  const ratio = contractValue > 0 ? cpgAmount / contractValue : 0;

  if (ratio <= ANOMALY_THRESHOLDS.MAX_CPG_TO_CONTRACT_RATIO) {
    return null;
  }

  return {
    type: "UNUSUAL_AMOUNT",
    severity: ratio > 0.5 ? RiskLevel.CRITICAL : RiskLevel.HIGH,
    message: `CPG amount (${cpgAmount}) exceeds ${(ANOMALY_THRESHOLDS.MAX_CPG_TO_CONTRACT_RATIO * 100).toFixed(0)}% of contract value (${contractValue})`,
    details: {
      cpgAmount,
      contractValue,
      ratio: Number(ratio.toFixed(4)),
      threshold: ANOMALY_THRESHOLDS.MAX_CPG_TO_CONTRACT_RATIO,
    },
  };
}

export async function detectExcessiveExtensions(
  cpgId: string,
): Promise<AnomalyFinding | null> {
  const cpg = await cpgRepository.findById(cpgId);
  if (!cpg) return null;

  const chain = await cpgRepository.getRenewalChain(cpgId);
  const extensionCount = chain.length + cpg.renewals.length;

  if (extensionCount < ANOMALY_THRESHOLDS.MAX_EXTENSIONS) {
    return null;
  }

  return {
    type: "EXCESSIVE_EXTENSIONS",
    severity:
      extensionCount >= ANOMALY_THRESHOLDS.MAX_EXTENSIONS + 2
        ? RiskLevel.CRITICAL
        : RiskLevel.HIGH,
    message: `CPG has ${extensionCount} extensions, exceeding threshold of ${ANOMALY_THRESHOLDS.MAX_EXTENSIONS}`,
    details: {
      extensionCount,
      threshold: ANOMALY_THRESHOLDS.MAX_EXTENSIONS,
      chainLength: chain.length,
      directRenewals: cpg.renewals.length,
    },
  };
}

export async function detectFrequentDelays(
  cpgId: string,
): Promise<AnomalyFinding | null> {
  const recentCount = await cpgRepository.countRecentRenewals(
    cpgId,
    ANOMALY_THRESHOLDS.RECENT_EXTENSION_MONTHS,
  );

  if (recentCount < ANOMALY_THRESHOLDS.MAX_RECENT_EXTENSIONS) {
    return null;
  }

  return {
    type: "FREQUENT_DELAYS",
    severity:
      recentCount >= ANOMALY_THRESHOLDS.MAX_RECENT_EXTENSIONS + 1
        ? RiskLevel.HIGH
        : RiskLevel.MEDIUM,
    message: `${recentCount} CPG extensions within the last ${ANOMALY_THRESHOLDS.RECENT_EXTENSION_MONTHS} months`,
    details: {
      recentExtensions: recentCount,
      lookbackMonths: ANOMALY_THRESHOLDS.RECENT_EXTENSION_MONTHS,
      threshold: ANOMALY_THRESHOLDS.MAX_RECENT_EXTENSIONS,
    },
  };
}

export async function detectMissingDocuments(
  cpgId: string,
): Promise<AnomalyFinding | null> {
  const cpg = await cpgRepository.findById(cpgId);
  if (!cpg) return null;

  const presentTypes = new Set(
    cpg.documents.map((doc) => doc.documentType),
  );
  const missing = ANOMALY_THRESHOLDS.REQUIRED_DOCUMENT_TYPES.filter(
    (type) => !presentTypes.has(type as DocumentType),
  );

  if (missing.length === 0) {
    return null;
  }

  return {
    type: "MISSING_DOCUMENTS",
    severity: RiskLevel.MEDIUM,
    message: `Missing required document types: ${missing.join(", ")}`,
    details: {
      missingDocumentTypes: missing,
      uploadedCount: cpg.documents.length,
    },
  };
}

export async function runAnomalyDetection(
  cpgId: string,
): Promise<AnomalyDetectionResult> {
  const findings = (
    await Promise.all([
      detectUnusualAmount(cpgId),
      detectExcessiveExtensions(cpgId),
      detectFrequentDelays(cpgId),
      detectMissingDocuments(cpgId),
    ])
  ).filter((f): f is AnomalyFinding => f !== null);

  const count = findings.length;
  const healthScore =
    count === 0
      ? ANOMALY_HEALTH_SCORES.NONE
      : count === 1
        ? ANOMALY_HEALTH_SCORES.SINGLE
        : count === 2
          ? ANOMALY_HEALTH_SCORES.DOUBLE
          : ANOMALY_HEALTH_SCORES.MULTIPLE;

  const riskLevel = resolveRiskLevel(findings);
  const summary =
    findings.length > 0
      ? findings.map((f) => f.message).join("; ")
      : null;

  return {
    cpgId,
    anomalies: findings,
    anomalyDetected: findings.length > 0,
    healthScore,
    riskLevel,
    summary,
  };
}

function resolveRiskLevel(findings: AnomalyFinding[]): RiskLevel {
  if (findings.length === 0) return RiskLevel.LOW;
  if (findings.some((f) => f.severity === RiskLevel.CRITICAL)) {
    return RiskLevel.CRITICAL;
  }
  if (findings.some((f) => f.severity === RiskLevel.HIGH)) {
    return RiskLevel.HIGH;
  }
  if (findings.some((f) => f.severity === RiskLevel.MEDIUM)) {
    return RiskLevel.MEDIUM;
  }
  return RiskLevel.LOW;
}

export async function storeAnomalyResults(
  result: AnomalyDetectionResult,
  tx?: Prisma.TransactionClient,
) {
  return riskAssessmentRepository.create(
    {
      cpgId: result.cpgId,
      healthScore: result.healthScore,
      riskLevel: result.riskLevel,
      anomalyDetected: result.anomalyDetected,
      anomalyReason: result.summary ?? undefined,
      factors: {
        anomalies: result.anomalies,
        detectedAt: new Date().toISOString(),
      },
    },
    tx,
  );
}

export async function detectAndStoreAnomalies(
  cpgId: string,
  tx?: Prisma.TransactionClient,
) {
  const result = await runAnomalyDetection(cpgId);
  const assessment = await storeAnomalyResults(result, tx);
  return { result, assessment };
}

export class AnomalyDetectionService {
  detectUnusualAmount = detectUnusualAmount;
  detectExcessiveExtensions = detectExcessiveExtensions;
  detectFrequentDelays = detectFrequentDelays;
  detectMissingDocuments = detectMissingDocuments;
  runAnomalyDetection = runAnomalyDetection;
  storeAnomalyResults = storeAnomalyResults;
  detectAndStoreAnomalies = detectAndStoreAnomalies;

  async getLatestAssessment(cpgId: string) {
    return riskAssessmentRepository.findLatestByCpgId(cpgId);
  }

  async getAssessmentHistory(cpgId: string) {
    return riskAssessmentRepository.findByCpgId(cpgId);
  }
}

export const anomalyDetectionService = new AnomalyDetectionService();
