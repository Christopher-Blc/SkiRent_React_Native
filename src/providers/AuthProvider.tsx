import React, { createContext, useEffect, useMemo, useState } from "react";
import { authService, type Session } from "@/services/authService";
import { useUserStore } from "@/store/userStore";

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const storedUser = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    const init = async () => {
      try {
        // simular que este cargando durante 5 segundos
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const restored = await authService.restoreSession();
        if (!restored) {
          return;
        }

        setSession(restored);

        if (!storedUser || storedUser.id !== restored.userId) {
          const perfil = await authService.getUserById(restored.userId);
          if (perfil) setUser(perfil);
          else {
            await authService.logout();
            setSession(null);
            clearUser();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [clearUser, setUser, storedUser]);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setSession(result.session);
    if (!storedUser || storedUser.id !== result.user.id) {
      setUser(result.user);
    }
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
    // No limpiamos el user para mantener cambios persistidos (avatar/nickname).
  };

  const value = useMemo<AuthState>(
    () => ({
      isLoading,
      isAuthenticated: !!session,
      session,
      login,
      logout,
    }),
    [isLoading, session, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
