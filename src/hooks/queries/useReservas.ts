import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservasService } from "@/services/reservasService";
import type { ActualizarReservaInput, CrearReservaInput } from "@/services/reservasService";

export const reservasKeys = {
  all: ["reservas", "all"] as const,
  totalCount: ["reservas", "count", "all"] as const,
  byCliente: (clienteId: string) => ["reservas", "cliente", clienteId] as const,
  countByCliente: (clienteId: string) =>
    ["reservas", "cliente", clienteId, "count"] as const,
};

export function useReservasAll() {
  return useQuery({
    queryKey: reservasKeys.all,
    queryFn: () => reservasService.listAll(),
  });
}

export function useReservasByCliente(clienteId: string, limit = 5) {
  return useQuery({
    queryKey: [...reservasKeys.byCliente(clienteId), limit],
    queryFn: () => reservasService.listByCliente(clienteId, limit),
    enabled: !!clienteId,
  });
}

export function useReservasTotalCount() {
  return useQuery({
    queryKey: reservasKeys.totalCount,
    queryFn: () => reservasService.countAll(),
  });
}

export function useReservasCount(clienteId: string) {
  return useQuery({
    queryKey: reservasKeys.countByCliente(clienteId),
    queryFn: () => reservasService.countByCliente(clienteId),
    enabled: !!clienteId,
  });
}

export function useCreateReserva(clienteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CrearReservaInput) => reservasService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reservasKeys.all });
      qc.invalidateQueries({ queryKey: reservasKeys.totalCount });
      qc.invalidateQueries({ queryKey: reservasKeys.byCliente(clienteId) });
      qc.invalidateQueries({ queryKey: reservasKeys.countByCliente(clienteId) });
    },
  });
}

export function useUpdateReserva() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ActualizarReservaInput }) =>
      reservasService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reservas"] });
    },
  });
}

export function useDeleteReserva() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reservasService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reservas"] });
    },
  });
}
