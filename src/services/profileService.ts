import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types/Users";

type ProfileRow = {
  auth_user_id: string;
  role_id: number;
  name: string | null;
  surname: string | null;
  email: string | null;
  phone_number: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

const mapRowToProfile = (row: ProfileRow): UserProfile => ({
  id: row.auth_user_id,
  roleId: row.role_id,
  name: row.name,
  surname: row.surname,
  email: row.email,
  phoneNumber: row.phone_number,
  displayName: row.display_name,
  avatarUrl: row.avatar_url,
});

export type ProfilePatch = Partial<Pick<UserProfile, "name" | "surname" | "displayName" | "phoneNumber" | "avatarUrl">>;

export const profileService = {
  async getMe(): Promise<UserProfile | null> {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(authError.message);

    const authUserId = authData.user?.id;
    if (!authUserId) return null;

    const { data, error } = await supabase
      .from("users")
      .select("auth_user_id, role_id, name, surname, email, phone_number, display_name, avatar_url")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return mapRowToProfile(data);
  },

  async getByAuthUserId(authUserId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("users")
      .select("auth_user_id, role_id, name, surname, email, phone_number, display_name, avatar_url")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return mapRowToProfile(data);
  },

  async updateMe(patch: ProfilePatch): Promise<UserProfile | null> {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(authError.message);

    const authUserId = authData.user?.id;
    if (!authUserId) return null;

    const updatePayload: Partial<ProfileRow> = {};
    if (patch.name !== undefined) updatePayload.name = patch.name ?? null;
    if (patch.surname !== undefined) updatePayload.surname = patch.surname ?? null;
    if (patch.displayName !== undefined) updatePayload.display_name = patch.displayName ?? null;
    if (patch.phoneNumber !== undefined) updatePayload.phone_number = patch.phoneNumber ?? null;
    if (patch.avatarUrl !== undefined) updatePayload.avatar_url = patch.avatarUrl ?? null;

    const { data, error } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("auth_user_id", authUserId)
      .select("auth_user_id, role_id, name, surname, email, phone_number, display_name, avatar_url")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return mapRowToProfile(data);
  },
};
