import { api } from "./config";

export interface StudentProfile {
  USER_ID: string;
  Roll_NO: string;
  Name: string;
  Email: string;
  PhoneNo: string;
  Hostel_Id: string;
  Parent_Name: string;
  Parent_Mail: string;
  Parent_Phone: string;
  Address: string;
  IS_BLOCKED: boolean;
  DEFAULTER_Attempts: number;
}

export const getMeApi = async (): Promise<StudentProfile> => {
  const res = await api.get("/student/getMe");
  return res.data;
};

