export interface Producto {
  id: number;
  categoria_id: number;
  nombre: string;
  marca?: string | null;
  modelo?: string | null;
  descripcion?: string | null;
  precio?: number | null;
  activo: boolean;
  image_url: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface CategoriaProducto {
  id: number;
  nombre: string;
}

export interface ProductoCrear {
  categoria_id: number;
  nombre: string;
  marca?: string;
  modelo?: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
  image_url?: string | null;
}

export interface ProductoActualizar {
  categoria_id?: number;
  nombre?: string;
  marca?: string;
  modelo?: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
  image_url?: string | null;
}
