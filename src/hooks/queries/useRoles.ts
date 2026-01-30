import { useQuery } from "@tanstack/react-query";
import { rolesService } from "@/services/rolesService";

export const rolesKeys = {
  all: ["roles"] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: rolesKeys.all,
    queryFn: () => rolesService.list(),
    staleTime: 5 * 60 * 1000,
  });
}
