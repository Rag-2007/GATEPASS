import { api } from "./config";

export type PassStatus =
  | "PENDING"
  | "CANCELLED"
  | "Parentapproved"
  | "CareTakerapproved"
  | "CHECKEDIN"
  | "CHECKEDOUT";

export type PassType = "DAY_PASS" | "HOME_PASS";

export interface Pass {
  passID: string;
  RollNo: string;
  passtype: PassType;
  passType?: PassType;
  HostelId: string;
  RaisedAt: string;
  Destination: string;
  Purpose: string;
  ModeofTransport: string;
  QRCODE: string;
  Status: PassStatus;
  Expected_Date: string;
  Expected_Time: string;
  Actual_Return_Date: string | null;
  Actual_Return_Time: string | null;
}

export interface CreatePassDto {
  passtype: PassType;
  destination: string;
  purpose: string;
  modeOfTransport: string;
  expectedDate: string;
  expectedTime: string;
}

export const ACTIVE_STATUSES: PassStatus[] = [
  "PENDING",
  "Parentapproved",
  "CareTakerapproved",
  "CHECKEDOUT",
];

export const QR_VISIBLE_STATUSES: PassStatus[] = [
  "CareTakerapproved",
  "CHECKEDOUT",
  "CHECKEDIN",
];

export const getMyPassesApi = async (): Promise<Pass[]> => {
  const res = await api.get("/Passes/getMyPasses");
  return res.data;
};

export const createPassApi = async (dto: CreatePassDto): Promise<Pass> => {
  const res = await api.post("/Passes/createPass", dto);
  return res.data;
};

export const cancelPassApi = async (id: string): Promise<unknown> => {
  const res = await api.put(`/Passes/cancelPass/${id}`);
  return res.data;
};

