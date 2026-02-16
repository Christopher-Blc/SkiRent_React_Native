import { supabase } from "@/lib/supabase";
import type {
  CategoriaProducto,
  Producto,
  ProductoActualizar,
  ProductoCrear,
} from "@/types/Product";

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
    image_url: row.image_url ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at ?? null,
  };
}

function toDb(data: Partial<Omit<Producto, "id" | "created_at" | "updated_at">>) {
  const payload: any = {
    categoria_id: data.categoria_id,
    nombre: data.nombre,
    marca: data.marca,
    modelo: data.modelo,
    descripcion: data.descripcion,
    precio: data.precio,
    activo: data.activo,
    image_url: data.image_url,
  };
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  return payload;
}

export const getProduct = async (): Promise<Producto[]> => {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapDb);
};

export const getProductById = async (id: number): Promise<Producto | null> => {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapDb(data) : null;
};

export const listProductCategories = async (): Promise<CategoriaProducto[]> => {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    nombre: row.nombre ?? row.name ?? `Categoria ${row.id}`,
  }));
};

export const createProduct = async (data: ProductoCrear): Promise<Producto> => {
  const payload = toDb(data);
  const { data: inserted, error } = await supabase
    .from("productos")
    .insert([payload])
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapDb(inserted);
};

export const updateProduct = async (
  id: number,
  data: ProductoActualizar
): Promise<Producto | null> => {
  const payload = toDb(data);
  const { data: updated, error } = await supabase
    .from("productos")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return updated ? mapDb(updated) : null;
};
