export type ReservaEstado =
  | "BORRADOR"
  | "PENDIENTE_PAGO"
  | "CONFIRMADA"
  | "EN_CURSO"
  | "FINALIZADA"
  | "CANCELADA";

export interface Reservation {
  id: number;
  clienteId: string;
  estado: ReservaEstado;
  fechaInicio: string;
  fechaFin: string;
  dias: number;
  total: number;
}
