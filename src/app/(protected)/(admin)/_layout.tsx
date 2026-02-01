import { Redirect, Slot } from "expo-router";
import { useUserStore } from "@/store/userStore";
import { useRoles } from "@/hooks/queries/useRoles";

export default function AdminLayout() {
  const user = useUserStore((s) => s.user);
  const { data: roles, isLoading } = useRoles();
  const roleName = user
    ? roles?.find((role) => role.id === user.roleId)?.name
    : undefined;

  if (isLoading) return null;

  if (roleName !== "ADMIN") {
    return <Redirect href="/home" />;
  }

  return <Slot />;
}
