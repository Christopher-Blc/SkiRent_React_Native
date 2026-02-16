import { supabase } from "@/lib/supabase";
import type { Producto } from "@/types/Product";

function mapDb(row: any): Producto {
  return {
    id: row.id,
    categoria_id: row.categoria_id,
    nombre: row.nombre,
    marca: row.marca ?? null,
    modelo: row.modelo ?? null,
    descripcion: row.descripcion ?? null,
    precio: row.precio ?? null,
    activo: row.activo,
    created_at: row.created_at,
    updated_at: row.updated_at ?? null,
  };
}

export const getProduct = async (): Promise<Producto[]> => {
  const { data, error } = await supabase.from("productos").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapDb);
};
