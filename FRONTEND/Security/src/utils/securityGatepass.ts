export type ScanMode = "in" | "out";
export type ScanStatus = "success" | "failed";

export const securityStudent = {
  name: "Raghuveer",
  rollNumber: "S20240010107",
  passType: "Daypass",
  room: "515",
  passId: "GTP-8842-1A",
  expiredOn: "Oct 24, 2023 - 18:00",
};

const invalidTokens = ["invalid", "expired", "blocked", "revoked", "denied"];
const validTokens = [
  "iiit-sricity-gatepass",
  "gp-2026-8841",
  "gtp-8841",
  securityStudent.rollNumber.toLowerCase(),
];

function objectValue(value: unknown, key: string) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  return (value as Record<string, unknown>)[key];
}

export function resolveGatepassScan(rawValue: string): ScanStatus {
  const normalized = rawValue.trim().toLowerCase();

  if (!normalized || invalidTokens.some((token) => normalized.includes(token))) {
    return "failed";
  }

  try {
    const parsed = JSON.parse(rawValue);
    const status = String(objectValue(parsed, "status") ?? "").toLowerCase();
    const valid = objectValue(parsed, "valid");
    const expired = objectValue(parsed, "expired");
    const rollNumber = String(objectValue(parsed, "rollNumber") ?? "").toLowerCase();
    const passId = String(objectValue(parsed, "passId") ?? "");

    if (valid === false || expired === true || invalidTokens.includes(status)) {
      return "failed";
    }

    if (valid === true || ["valid", "active", "approved"].includes(status)) {
      return "success";
    }

    if (rollNumber === securityStudent.rollNumber.toLowerCase() && passId.length > 0) {
      return "success";
    }
  } catch {
    return validTokens.some((token) => normalized.includes(token)) ? "success" : "failed";
  }

  return validTokens.some((token) => normalized.includes(token)) ? "success" : "failed";
}

