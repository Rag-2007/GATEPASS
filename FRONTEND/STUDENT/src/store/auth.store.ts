import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { loginApi, logoutApi } from "../api/auth.api";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: { accessToken: string; refreshToken: string; userId: string } }
  | { type: "LOGOUT" }
  | { type: "HYDRATE"; payload: AuthState };

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  isLoggedIn: false,
  isHydrated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload, isLoggedIn: true, isHydrated: true };
    case "LOGOUT":
      return { ...initialState, isHydrated: true };
    case "HYDRATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    (async () => {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const userId = await SecureStore.getItemAsync("userId");
      dispatch({
        type: "HYDRATE",
        payload: {
          accessToken,
          refreshToken,
          userId,
          isLoggedIn: !!accessToken,
          isHydrated: true,
        },
      });
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginApi(email, password);
    await SecureStore.setItemAsync("accessToken", data.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);
    await SecureStore.setItemAsync("userId", data.UserID);
    dispatch({
      type: "LOGIN",
      payload: { accessToken: data.accessToken, refreshToken: data.refreshToken, userId: data.UserID },
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) await logoutApi(userId);
    } catch { /* best-effort */ }
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("userId");
    dispatch({ type: "LOGOUT" });
  }, []);

  return React.createElement(AuthContext.Provider, { value: { state, login, logout } }, children);
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

