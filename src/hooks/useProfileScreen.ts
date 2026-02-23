import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/store/userStore";
import { profileService } from "@/services/profileService";
import { supabase } from "@/lib/supabase";
import { useRoles } from "@/hooks/queries/useRoles";
import { useReservasCount } from "@/hooks/queries/useReservas";

export function useProfileScreen() {
  const { t } = useTranslation();
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);

  const { data: roles, isLoading: rolesLoading } = useRoles();
  const {
    data: pedidosCount,
    isLoading: pedidosLoading,
    error: pedidosError,
  } = useReservasCount(user?.id ?? "");

  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [displayName, setDisplayName] = useState(user?.displayName ?? user?.name ?? "");
  const [editName, setEditName] = useState(false);
  const [editSurname, setEditSurname] = useState(false);
  const [editNickname, setEditNickname] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());

  useEffect(() => {
    setName(user?.name ?? "");
    setSurname(user?.surname ?? "");
    setDisplayName(user?.displayName ?? user?.name ?? "");
  }, [user?.displayName, user?.name, user?.surname]);

  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarVersion(Date.now());
    }
  }, [user?.avatarUrl]);

  const pedidosValue = pedidosLoading ? "..." : pedidosError ? "!" : pedidosCount ?? 0;

  const roleName = rolesLoading
    ? "..."
    : user
      ? roles?.find((role) => role.id === user.roleId)?.name ?? "NORMAL"
      : "NORMAL";

  const avatarUrl = useMemo(() => {
    if (!user?.avatarUrl) return null;
    return `${supabase.storage.from("userData").getPublicUrl(user.avatarUrl).data.publicUrl}?t=${avatarVersion}`;
  }, [avatarVersion, user?.avatarUrl]);

  const avatarFallback = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleSaveName = async () => {
    if (!user) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    if (trimmed === user.name) {
      setEditName(false);
      return;
    }
    try {
      await profileService.updateMe({ name: trimmed });
      updateUser({ name: trimmed });
      setEditName(false);
      Alert.alert(t("success"), t("nameUpdated"));
    } catch {
      Alert.alert(t("error"), t("nameUpdateFailed"));
    }
  };

  const handleSaveSurname = async () => {
    if (!user) return;
    const trimmed = surname.trim();
    if (!trimmed) return;
    if (trimmed === user.surname) {
      setEditSurname(false);
      return;
    }
    try {
      await profileService.updateMe({ surname: trimmed });
      updateUser({ surname: trimmed });
      setEditSurname(false);
      Alert.alert(t("success"), t("surnameUpdated"));
    } catch {
      Alert.alert(t("error"), t("surnameUpdateFailed"));
    }
  };

  const handleSaveNickname = async () => {
    if (!user) return;
    const trimmed = displayName.trim();
    if (!trimmed) return;
    if (trimmed === (user.displayName ?? user.name)) {
      setEditNickname(false);
      return;
    }
    try {
      await profileService.updateMe({ displayName: trimmed });
      updateUser({ displayName: trimmed });
      setEditNickname(false);
      Alert.alert(t("success"), t("nicknameUpdated"));
    } catch {
      Alert.alert(t("error"), t("nicknameUpdateFailed"));
    }
  };

  const handleAvatarEdit = async () => {
    if (!user) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("error"), t("permissionsRequired"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images','videos'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    try {
      const ext = uri.split(".").pop()?.toLowerCase() || "jpg";
      const contentType =
        ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
      const filePath = `imagenes/${user.id}.${ext}`;

      const resp = await fetch(uri);
      const arrayBuffer = await resp.arrayBuffer();

      const { error: uploadError } = await supabase.storage.from("userData").upload(filePath, arrayBuffer, {
        contentType,
        upsert: true,
      });

      if (uploadError) throw uploadError;

      await profileService.updateMe({ avatarUrl: filePath });
      updateUser({ avatarUrl: filePath });
      Alert.alert(t("success"), t("avatarUpdated"));
    } catch (e: any) {
      const msg = e?.message || e?.error_description || t("imageUploadFailed");
      Alert.alert(t("error"), msg);
    }
  };

  return {
    user,
    name,
    setName,
    surname,
    setSurname,
    displayName,
    setDisplayName,
    editName,
    setEditName,
    editSurname,
    setEditSurname,
    editNickname,
    setEditNickname,
    handleSaveName,
    handleSaveSurname,
    handleSaveNickname,
    handleAvatarEdit,
    avatarUrl,
    avatarFallback,
    pedidosValue,
    roleName,
  };
}
