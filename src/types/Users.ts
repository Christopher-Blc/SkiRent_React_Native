export type RoleName = "JEFE" | "ADMIN" | "NORMAL";

export interface UserProfile {
  id: string; // auth.users.id (auth_user_id)
  roleId: number;
  name?: string | null;
  surname?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}
