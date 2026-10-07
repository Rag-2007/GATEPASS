import axios from "axios";

export const BASE_URL = "http://10.238.204.46:3000";

const SECURITY_SECRET = "gatepass_security_iiit_2026";

export function buildSecuritySig(qrId: string): string {
  return `${SECURITY_SECRET}::${Date.now()}::${qrId}`;
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

