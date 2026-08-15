export type PassType = 'DAYPASS' | 'HOMEPASS';

export interface ApprovalRequest {
  id: string;
  name: string;
  rollNo: string;
  passType: PassType;
  duration: string;
  reason: string;
}

export interface AuditEntry {
  id: string;
  name: string;
  rollNo: string;
  action: string;
  time: string;
  remarks: string | null;
}

export interface DirectoryStudent {
  id: string;
  name: string;
  rollNo: string;
  hostelId: string;
  accent: 'navy' | 'brown';
}

export interface CurrentlyOutStudent {
  id: string;
  name: string;
  rollNo: string;
  passType: PassType;
  schedule: string;
  destination: string;
  overdue?: boolean;
}

export interface BlockedStudent {
  id: string;
  rollNo: string;
  name: string;
  hostelId: string;
  date: string;
  remark: string | null;
}

