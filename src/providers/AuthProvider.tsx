import React, { createContext, useEffect, useMemo, useState, useCallback } from "react";
import { authService, type Session } from "@/services/authService";
import { useUserStore } from "@/store/userStore";

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshPerfil: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const storedUser = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  const refreshPerfil = useCallback(async () => {
    const perfil = await authService.getPerfilActual();
    if (perfil) setUser(perfil);
    else clearUser();
  }, [setUser, clearUser]);

  useEffect(() => {
    const init = async () => {
      try {
        const restored = await authService.restoreSession();
        if (!restored) return;

        setSession(restored);

        // carga perfil desde clientes
        await refreshPerfil();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [refreshPerfil]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setSession(result.session);
    setUser(result.user);
  }, [setUser]);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
    clearUser(); // yo lo limpiaria ya que es bdd, no local
  }, [clearUser]);

  const value = useMemo<AuthState>(
    () => ({
      isLoading,
      isAuthenticated: !!session,
      session,
      login,
      logout,
      refreshPerfil,
    }),
    [isLoading, session, login, logout, refreshPerfil]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
