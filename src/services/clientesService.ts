import { supabase } from "@/lib/supabase";
import type { Cliente } from "@/types/Clients";
import i18next from "i18next";

const selectCliente =
  "id, role_id, name, surname, email, phone_number, display_name, avatar, created_at";

function mapDb(row: any): Cliente {
  return {
    id: row.id,
    RolId: row.role_id,
    name: row.name,
    surname: row.surname,
    email: row.email,
    phoneNumber: row.phone_number,
    displayName: row.display_name,
    avatar: row.avatar,
  };
}

function toDb(data: Partial<Omit<Cliente, "id">>) {
  const payload: any = {
    role_id: data.RolId,
    name: data.name,
    surname: data.surname,
    email: data.email,
    phone_number: data.phoneNumber,
    display_name: data.displayName,
    avatar: data.avatar,
  };
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  return payload;
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback UUIDv4 (not cryptographically strong, but fine for client-side id)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// convierte errores de unique constraint en tus codigos antiguos
function mapUniqueError(err: any) {
  // postgres unique violation
  if (err?.code === "23505") {
    const msg = String(err.message || "").toLowerCase();

    // intenta detectar columna por mensaje
    if (msg.includes("email")) return "EMAIL_DUPLICADO";
    if (msg.includes("phone")) return "TELEFONO_DUPLICADO";

    // fallback
    return "DUPLICADO";
  }
  return null;
}

export const clientesService = {
  async list(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from("clientes")
      .select(selectCliente)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapDb);
  },

  async getById(id: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from("clientes")
      .select(selectCliente)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // not found
      throw new Error(error.message);
    }
    return mapDb(data);
  },

  // IMPORTANTE:
  // - crear "usuario" (email/password) NO es aqui, eso es supabase.auth.signUp
  // - este create crea el PERFIL en public.clientes
  // - si no pasas id, se usa el default de la tabla (uuid)
  async create(
    data: Omit<Cliente, "id">,
    id?: string
  ): Promise<Cliente> {
    const payload = toDb(data);
    const rowId = id ?? generateId();
    const row = { id: rowId, ...payload };

    const { data: inserted, error } = await supabase
      .from("clientes")
      .insert([row])
      .select(selectCliente)
      .single();

    if (error) {
      const mapped = mapUniqueError(error);
      if (mapped) throw new Error(mapped);
      throw new Error(error.message);
    }

    return mapDb(inserted);
  },

  async createWithAuth(input: {
    email: string;
    password: string;
    roleId: number;
    name: string;
    surname: string;
    displayName: string;
    phoneNumber: string | null;
  }): Promise<Cliente> {
    const { data, error } = await supabase.functions.invoke("create-cliente", {
      body: {
        email: input.email,
        password: input.password,
        role_id: input.roleId,
        name: input.name,
        surname: input.surname,
        display_name: input.displayName,
        phone_number: input.phoneNumber,
      },
    });

    if (error) throw new Error(error.message);
    if (!data) throw new Error(i18next.t("createClientFailed"));
    if (data.error) throw new Error(data.error);

    return mapDb(data.data ?? data);
  },

  async findByEmail(email: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from("clientes")
      .select(selectCliente)
      .ilike("email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapDb(data) : null;
  },

  async update(
    id: string,
    data: Partial<Omit<Cliente, "id">>
  ): Promise<Cliente | null> {
    // comprobacion de existencia (como hacias antes)
    const actual = await this.getById(id);
    if (!actual) return null;

    const payload = toDb(data);

    const { data: updated, error } = await supabase
      .from("clientes")
      .update(payload)
      .eq("id", id)
      .select(selectCliente)
      .single();

    if (error) {
      const mapped = mapUniqueError(error);
      if (mapped) throw new Error(mapped);
      throw new Error(error.message);
    }

    return updated ? mapDb(updated) : null;
  },

  async remove(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error(i18next.t("deleteClientNoPermissionOrNotFound"));
    }
    return true;
  },
};
