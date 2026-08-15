import { Platform } from 'react-native';
import { getAccessToken } from '../utils/tokenStore';

export const BASE_URL = "http://10.0.98.89:3000";

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: await authHeaders(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `GET ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

async function put<T>(path: string, body?: object): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `PUT ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  UserID: string;
}

export async function loginWarden(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Email: email, password, role: 'WARDEN' }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || 'Login failed');
  }
  return res.json() as Promise<LoginResponse>;
}

export interface WardenMe {
  user: {
    Id: string;
    Name: string;
    Email: string;
    Phone: string;
    role: string;
  };
  hostel: {
    Block_Id: string;
    Warden_Id: string;
    CareTaker_Id: string;
  } | null;
}

export function getMe(): Promise<WardenMe> {
  return get<WardenMe>('/hostel/getMe');
}

export function updateMyProfile(data: { Name?: string; Phone?: string }): Promise<{ message: string }> {
  return put<{ message: string }>('/auth/updateMe', data);
}

export interface PassStudent {
  Roll_No: string;
  Block_Id: string;
  User_Id: string;
}

export interface Pass {
  passID: string;
  RollNo: string;
  passType: 'DAY_PASS' | 'HOME_PASS';
  HostelId: string;
  RaisedAt: string;
  Destination: string;
  Purpose: string;
  ModeofTransport: string;
  QRCODE: string;
  Status: string;
  Expected_Date: string;
  Expected_Time: string;
  Actual_Return_Date: string | null;
  Actual_Return_Time: string | null;
  student?: PassStudent;
}

export function getApprovalsByHostel(hostelId: string): Promise<Pass[]> {
  return get<Pass[]>(`/Passes/getByHostelStatus/${hostelId}/Parentapproved`);
}

export function getPassesByHostel(hostelId: string): Promise<Pass[]> {
  return get<Pass[]>(`/Passes/getByHostel/${hostelId}`);
}

export function getCurrentlyOut(hostelId: string): Promise<Pass[]> {
  return get<Pass[]>(`/Passes/getByHostelStatus/${hostelId}/CHECKEDOUT`);
}

export function approvePass(passId: string): Promise<Pass> {
  return put<Pass>(`/Passes/approveCaretaker/${passId}`);
}

export function rejectPass(passId: string): Promise<Pass> {
  return put<Pass>(`/Passes/rejectPass/${passId}`);
}

export interface PassAction {
  id: string;
  passID: string;
  Actor_Id: string;
  Action_Type: string;
  Timestamp: string;
  Remarks: string | null;
}

export function getAllPassActions(): Promise<PassAction[]> {
  return get<PassAction[]>('/Passes/getPassActions');
}

export interface StudentRecord {
  USER_ID: string;
  Roll_NO: string;
  Name: string;
  Email: string;
  PhoneNo: string;
  Hostel_Id: string;
  IS_BLOCKED: boolean;
  DEFAULTER_Attempts: number;
}

export function getStudentsByHostel(hostelId: string): Promise<StudentRecord[]> {
  return get<StudentRecord[]>(`/student/getbyHostel/${hostelId}`);
}

export interface BlockedRecord {
  id: string;
  Roll_No: string;
  Hostel_id: string;
  Blocked_Role_ID: string;
  BlockedAt: string;
  UnblockedAt: string | null;
}

export function getAllBlocked(): Promise<BlockedRecord[]> {
  return get<BlockedRecord[]>('/Blocked/getAllBlocked');
}

export function unblockStudent(rollNo: string, Blocked_Role_id: string): Promise<unknown> {
  return put<unknown>(`/Blocked/unblockStudent/${rollNo}`, { Blocked_Role_id });
}

