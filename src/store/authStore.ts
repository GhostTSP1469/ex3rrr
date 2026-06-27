import { create } from "zustand";
import { clearToken, getToken, setToken } from "../shared/auth/authStorage";
import { getRoleFromToken } from "../shared/auth/jwt";

interface AuthState {
  token: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const initialToken = getToken();

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  role: getRoleFromToken(initialToken),
  login: (token) => {
    setToken(token);
    set({ token, role: getRoleFromToken(token) });
  },
  logout: () => {
    clearToken();
    set({ token: null, role: null });
  },
}));
