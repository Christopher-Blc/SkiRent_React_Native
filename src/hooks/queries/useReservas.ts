import { useQuery } from "@tanstack/react-query";
import { reservasService } from "@/services/reservasService";

export const reservasKeys = {
  byCliente: (clienteId: string) => ["reservas", "cliente", clienteId] as const,
  countByCliente: (clienteId: string) =>
    ["reservas", "cliente", clienteId, "count"] as const,
};

export function useReservasByCliente(clienteId: string, limit = 5) {
  return useQuery({
    queryKey: [...reservasKeys.byCliente(clienteId), limit],
    queryFn: () => reservasService.listByCliente(clienteId, limit),
    enabled: !!clienteId,
  });
}

export function useReservasCount(clienteId: string) {
  return useQuery({
    queryKey: reservasKeys.countByCliente(clienteId),
    queryFn: () => reservasService.countByCliente(clienteId),
    enabled: !!clienteId,
  });
}
