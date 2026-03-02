import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  slug: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;

  setAuth: (payload: { token: string; user: AuthUser }) => void;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: ({ token, user }) => set({ token, user }),
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "crednosso-auth", // chave do localStorage
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);