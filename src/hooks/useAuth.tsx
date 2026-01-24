import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService, type Session, type UserProfile } from "@/services/authService";

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  user: UserProfile | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const restored = await authService.restoreSession();
        if (!restored) return;

        setSession(restored);

        const perfil = await authService.getUserById(restored.userId);
        if (perfil) setUser(perfil);
        else {
          await authService.logout();
          setSession(null);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setSession(result.session);
    setUser(result.user);
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
    setUser(null);
  };

  const value = useMemo<AuthState>(
    () => ({
      isLoading,
      isAuthenticated: !!session,
      session,
      user,
      login,
      logout,
    }),
    [isLoading, session, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
