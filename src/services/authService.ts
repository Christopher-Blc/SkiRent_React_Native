import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types/Users";
import { profileService } from "@/services/profileService";

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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    const userId = data.user?.id;
    if (!userId) throw new Error("no user id");

    const perfil = await profileService.getMe();
    if (!perfil) throw new Error("perfil no existe en users");

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
