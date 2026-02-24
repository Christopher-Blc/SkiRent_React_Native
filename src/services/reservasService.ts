import { supabase } from "@/lib/supabase";
import type { Reserva } from "@/types/Reservas";

const selectReserva =
  "id, cliente_id, estado, fecha_inicio, fecha_fin, dias, total, notas, created_at";

function mapDb(row: any): Reserva {
  return {
    id: row.id,
    clienteId: row.cliente_id,
    estado: row.estado ?? null,
    fechaInicio: row.fecha_inicio ?? null,
    fechaFin: row.fecha_fin ?? null,
    dias: row.dias ?? null,
    total: row.total ?? null,
    notas: row.notas ?? null,
    createdAt: row.created_at ?? null,
  };
}

export type CrearReservaInput = {
  clienteId: string;
  fechaInicio: string;
  fechaFin: string;
  total: number;
  estado?: string;
  notas?: string | null;
};

export type ActualizarReservaInput = {
  clienteId?: string;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  total?: number | null;
  estado?: string | null;
  notas?: string | null;
};

export const reservasService = {
  async listAll(): Promise<Reserva[]> {
    const { data, error } = await supabase
      .from("reservas")
      .select(selectReserva)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapDb);
  },

  async listByCliente(clienteId: string, limit = 5): Promise<Reserva[]> {
    const { data, error } = await supabase
      .from("reservas")
      .select(selectReserva)
      .eq("cliente_id", clienteId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapDb);
  },

  async countByCliente(clienteId: string): Promise<number> {
    const { error, count } = await supabase
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .eq("cliente_id", clienteId);

    if (error) throw new Error(error.message);
    return count ?? 0;
  },

  async countAll(): Promise<number> {
    const { error, count } = await supabase
      .from("reservas")
      .select("id", { count: "exact", head: true });

    if (error) throw new Error(error.message);
    return count ?? 0;
  },

  async create(input: CrearReservaInput): Promise<Reserva> {
    const payload = {
      cliente_id: input.clienteId,
      fecha_inicio: input.fechaInicio,
      fecha_fin: input.fechaFin,
      total: input.total,
      estado: input.estado ?? "BORRADOR",
      notas: input.notas ?? null,
    };

    const { data, error } = await supabase
      .from("reservas")
      .insert([payload])
      .select(selectReserva)
      .single();

    if (error) throw new Error(error.message);
    return mapDb(data);
  },

  async update(id: number, input: ActualizarReservaInput): Promise<Reserva> {
    const payload: any = {
      cliente_id: input.clienteId,
      fecha_inicio: input.fechaInicio,
      fecha_fin: input.fechaFin,
      total: input.total,
      estado: input.estado,
      notas: input.notas,
    };

    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const { data, error } = await supabase
      .from("reservas")
      .update(payload)
      .eq("id", id)
      .select(selectReserva)
      .single();

    if (error) throw new Error(error.message);
    return mapDb(data);
  },

  async remove(id: number): Promise<boolean> {
    const { data, error } = await supabase
      .from("reservas")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw new Error(error.message);
    return !!data?.length;
  },
};
