import { supabase } from "@/lib/supabase";
import type { Cliente } from "@/types/Clients";
import { clientesService } from "./clientesService";

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

  async login(email: string, password: string): Promise<{ session: Session; user: Cliente }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    const userId = data.user?.id;
    if (!userId) throw new Error("no user id");

    const perfil = await clientesService.getById(userId);
    if (!perfil) throw new Error("perfil no existe en clientes");

    return { session: { userId, email }, user: perfil };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getUserById(userId: string): Promise<Cliente | null> {
    return clientesService.getById(userId);
  },

  async getPerfilActual(): Promise<Cliente | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);

    const uid = data.user?.id;
    if (!uid) return null;

    return await clientesService.getById(uid);
  },
};
