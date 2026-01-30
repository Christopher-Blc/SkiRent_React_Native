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

export const reservasService = {
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
};
