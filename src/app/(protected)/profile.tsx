import { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useUserStore } from "@/store/userStore";
import { roles } from "@/types/Clients";
import { TextInputRectangle } from "@/components/TextInputRectangle";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import { styles } from "@/styles/profile.styles";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [displayName, setDisplayName] = useState(
    user?.displayName ?? user?.name ?? ""
  );

  const [editName, setEditName] = useState(false);
  const [editSurname, setEditSurname] = useState(false);
  const [editNickname, setEditNickname] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setSurname(user?.surname ?? "");
    setDisplayName(user?.displayName ?? user?.name ?? "");
  }, [user?.displayName, user?.name, user?.surname]);

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Mi perfil</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          No hay datos de usuario.
        </Text>
      </View>
    );
  }

  const handleSaveName = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (trimmed === user.name) {
      setEditName(false);
      return;
    }
    updateUser({ name: trimmed });
    setEditName(false);
    Alert.alert("Listo", "Nombre actualizado.");
  };

  const handleSaveSurname = () => {
    const trimmed = surname.trim();
    if (!trimmed) return;
    if (trimmed === user.surname) {
      setEditSurname(false);
      return;
    }
    updateUser({ surname: trimmed });
    setEditSurname(false);
    Alert.alert("Listo", "Apellido actualizado.");
  };

  const handleSaveNickname = () => {
    const trimmed = displayName.trim();
    if (!trimmed) return;
    if (trimmed === (user.displayName ?? user.name)) {
      setEditNickname(false);
      return;
    }
    updateUser({ displayName: trimmed });
    setEditNickname(false);
    Alert.alert("Listo", "Nickname actualizado.");
  };

  const handleAvatarEdit = () => {
    Alert.alert("Editar avatar", "Funcionalidad pendiente.");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Mi perfil
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Edita tus datos personales
      </Text>

      <View style={styles.avatarRow}>
        <Pressable style={styles.avatarButton} onPress={handleAvatarEdit}>
          <Image
            source={{
              uri:
                user.avatar ??
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <View style={[styles.avatarBadge, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]}>
            <Feather name="edit-2" size={12} color="#ffffff" />
          </View>
        </Pressable>
        <View>
          <Text style={[styles.nameText, { color: theme.colors.textPrimary }]}>
            {user.name} {user.surname}
          </Text>
          <Text style={[styles.roleText, { color: theme.colors.textSecondary }]}>
            {roles.find((role) => role.id === user.RolId)?.name ?? "NORMAL"}
          </Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.fieldRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Nombre</Text>
          <Pressable onPress={editName ? handleSaveName : () => setEditName(true)}>
            <Feather
              name={editName ? "check" : "edit-2"}
              size={16}
              color={theme.colors.primary}
            />
          </Pressable>
        </View>
        {editName ? (
          <TextInputRectangle value={name} onChangeText={setName} />
        ) : (
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
            {user.name}
          </Text>
        )}

        <View style={{ marginTop: 14 }} />

        <View style={styles.fieldRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Apellidos
          </Text>
          <Pressable
            onPress={editSurname ? handleSaveSurname : () => setEditSurname(true)}
          >
            <Feather
              name={editSurname ? "check" : "edit-2"}
              size={16}
              color={theme.colors.primary}
            />
          </Pressable>
        </View>
        {editSurname ? (
          <TextInputRectangle value={surname} onChangeText={setSurname} />
        ) : (
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
            {user.surname}
          </Text>
        )}

        <View style={{ marginTop: 14 }} />

        <View style={styles.fieldRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Nickname
          </Text>
          <Pressable
            onPress={editNickname ? handleSaveNickname : () => setEditNickname(true)}
          >
            <Feather
              name={editNickname ? "check" : "edit-2"}
              size={16}
              color={theme.colors.primary}
            />
          </Pressable>
        </View>
        {editNickname ? (
          <TextInputRectangle value={displayName} onChangeText={setDisplayName} />
        ) : (
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
            {user.displayName ?? user.name}
          </Text>
        )}

        <View style={{ marginTop: 14 }} />

        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Correo
        </Text>
        <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
          {user.email}
        </Text>
      </View>

      <ButtonRectangular
        text="Ir a Preferencias"
        colorBG={theme.colors.accent}
        colorTxt={theme.colors.primaryContrast}
        onPressed={() => router.push("/preferences")}
      />
    </View>
  );
}
;
