export const ANOMALY_THRESHOLDS = {
  /** CPG amount above this fraction of contract value triggers anomaly */
  MAX_CPG_TO_CONTRACT_RATIO: 0.25,
  /** Max renewals in a CPG chain before flagging */
  MAX_EXTENSIONS: 3,
  /** Max renewals within the lookback window */
  MAX_RECENT_EXTENSIONS: 2,
  RECENT_EXTENSION_MONTHS: 12,
  REQUIRED_DOCUMENT_TYPES: ["BANK_GUARANTEE"] as const,
} as const;

export const ANOMALY_HEALTH_SCORES = {
  NONE: 100,
  SINGLE: 75,
  DOUBLE: 50,
  MULTIPLE: 25,
} as const;
