export type ReservaEstado = string;

export interface Reserva {
  id: number;
  clienteId: string;
  estado: ReservaEstado | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  dias: number | null;
  total: number | null;
  notas: string | null;
  createdAt: string | null;
}
