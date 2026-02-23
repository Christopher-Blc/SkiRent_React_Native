import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types/Users";
import { profileService } from "@/services/profileService";
import i18next from "i18next";

export type AuthErrorCode =
  | "EMAIL_INVALID"
  | "USER_NOT_FOUND"
  | "PASSWORD_INVALID"
  | "UNKNOWN";

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export type Session = {
  userId: string;
  email: string;
};

export const authService = {
  async restoreSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;

    const s = data.session;
    if (!s?.user) return null;

    return { userId: s.user.id, email: s.user.email ?? "" };
  },

  async login(email: string, password: string): Promise<{ session: Session; user: UserProfile }> {
    if (!email.includes("@")) {
      throw new AuthError("EMAIL_INVALID", i18next.t("invalidEmail"));
    }
    if (!password?.trim()) {
      throw new AuthError("PASSWORD_INVALID", i18next.t("passwordRequired"));
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("invalid login credentials")) {
        throw new AuthError("PASSWORD_INVALID", i18next.t("invalidCredentials"));
      }
      if (msg.includes("email")) {
        throw new AuthError("EMAIL_INVALID", i18next.t("invalidEmail"));
      }
      throw new AuthError("UNKNOWN", error.message);
    }

    const userId = data.user?.id;
    if (!userId) throw new AuthError("USER_NOT_FOUND", i18next.t("userNotFound"));

    const perfil = await profileService.getMe();
    if (!perfil) throw new AuthError("USER_NOT_FOUND", i18next.t("userNotFound"));

    return { session: { userId, email: data.user?.email ?? email }, user: perfil };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getUserById(userId: string): Promise<UserProfile | null> {
    return profileService.getByAuthUserId(userId);
  },

  async getPerfilActual(): Promise<UserProfile | null> {
    return profileService.getMe();
  },
};
