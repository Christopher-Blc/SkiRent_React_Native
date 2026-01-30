import { supabase } from "@/lib/supabase";
import type { Role } from "@/types/Clients";

export const rolesService = {
  async list(): Promise<Role[]> {
    const { data, error } = await supabase
      .from("roles")
      .select("id, name, description")
      .order("id", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },
};
