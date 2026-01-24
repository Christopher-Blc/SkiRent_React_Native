import { Redirect, Slot } from "expo-router";
import { useUserStore } from "@/store/userStore";
import { roles } from "@/types/Clients";

export default function AdminLayout() {
  const user = useUserStore((s) => s.user);
  const roleName = user
    ? roles.find((role) => role.id === user.RolId)?.name
    : undefined;

  if (roleName !== "ADMIN") {
    return <Redirect href="/home" />;
  }

  return <Slot />;
}
