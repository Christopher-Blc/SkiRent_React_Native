import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientesService } from "@/services/clientesService";
import type { Cliente } from "@/types/Clients";

export const clientesKeys = {
  all: ["clientes"] as const,
  detail: (id: string) => ["clientes", id] as const,
};

export function useClientesList() {
  return useQuery({
    queryKey: clientesKeys.all,
    queryFn: () => clientesService.list(),
  });
}

export function useCliente(id: string) {
  return useQuery({
    queryKey: clientesKeys.detail(id),
    queryFn: () => clientesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Cliente, "id">) => clientesService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientesKeys.all });
    },
  });
}

export function useCreateClienteWithAuth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      roleId: number;
      name: string;
      surname: string;
      displayName: string;
      phoneNumber: string | null;
    }) => clientesService.createWithAuth(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientesKeys.all });
    },
  });
}

export function useUpdateCliente(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<Cliente, "id">>) =>
      clientesService.update(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: clientesKeys.all });
      if (updated) {
        qc.setQueryData(clientesKeys.detail(id), updated);
      }
    },
  });
}

export function useDeleteCliente(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => clientesService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientesKeys.all });
      qc.removeQueries({ queryKey: clientesKeys.detail(id) });
    },
  });
}
