import { api, BASE_URL } from "./config";
import axios from "axios";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  UserID: string;
}

export const loginApi = async (Email: string, password: string): Promise<LoginResponse> => {
  const res = await axios.post(`${BASE_URL}/auth/login`, { Email, password, role: "STUDENT" });
  return res.data;
};

export const logoutApi = async (userId: string): Promise<void> => {
  await api.post("/auth/logout", { userId });
};

