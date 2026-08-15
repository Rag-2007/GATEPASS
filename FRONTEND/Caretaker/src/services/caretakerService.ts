export type PassType = 'DAYPASS' | 'HOMEPASS';

export interface ApprovalRequest {
  id: string;
  name: string;
  rollNo: string;
  passType: PassType;
  duration: string;
  reason: string;
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

export const dashboardMetrics = [
  {
    id: 'awaiting',
    label: 'AWAITING APPROVAL',
    value: '—',
    tone: 'danger' as const,
  },
  {
    id: 'out',
    label: 'CURRENTLY OUT',
    value: '—',
    tone: 'default' as const,
  },
];

