import axios from "axios";
import * as SecureStore from "expo-secure-store";
export const BASE_URL = "http://10.0.98.89:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const userId = await SecureStore.getItemAsync("userId");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!userId || !refreshToken) throw new Error("No refresh credentials");
        const res = await axios.post(`${BASE_URL}/auth/refresh`, { userId, refreshToken });
        const newAccess: string = res.data.accessToken;
        const newRefresh: string = res.data.refreshToken;
        await SecureStore.setItemAsync("accessToken", newAccess);
        await SecureStore.setItemAsync("refreshToken", newRefresh);
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("userId");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

