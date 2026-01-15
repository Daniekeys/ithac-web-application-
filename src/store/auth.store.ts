import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      clearUser: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      isAdmin: () => {
        const { user } = get();
        // Check session storage first as it's the primary source of truth for current session type
        const sessionUserType = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem("userType") : null;
        return sessionUserType === 'admin' || user?.role === "admin";
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage to clear on tab close
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
