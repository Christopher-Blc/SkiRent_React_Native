import { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "@/store/userStore";
import { profileService } from "@/services/profileService";
import { TextInputRectangle } from "@/components/TextInputRectangle";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import { styles } from "@/styles/profile.styles";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/lib/supabase";
import { useRoles } from "@/hooks/queries/useRoles";
import { useReservasCount } from "@/hooks/queries/useReservas";


export default function ProfileScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const { logout } = useAuth();
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const {
    data: pedidosCount,
    isLoading: pedidosLoading,
    error: pedidosError,
  } = useReservasCount(user?.id ?? "");
  const pedidosValue = pedidosLoading ? "..." : pedidosError ? "!" : pedidosCount ?? 0;
  const avatarUrl = user?.avatarUrl
  ? `${supabase.storage.from("userData").getPublicUrl(user.avatarUrl).data.publicUrl}?t=${Date.now()}`
  : null;
  const avatarFallback = "https://cdn-icons-png.flaticon.com/512/149/149071.png";


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
  }, [user?.displayName, user?.name, user?.surname , user?.avatarUrl]);

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

  const handleSaveName = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (trimmed === user.name) {
      setEditName(false);
      return;
    }
    try {
      await profileService.updateMe({ name: trimmed });
      updateUser({ name: trimmed });
    } catch {
      Alert.alert("Error", "No se pudo actualizar el nombre.");
      return;
    }
    setEditName(false);
    Alert.alert("Listo", "Nombre actualizado.");
  };

  const handleSaveSurname = async () => {
    const trimmed = surname.trim();
    if (!trimmed) return;
    if (trimmed === user.surname) {
      setEditSurname(false);
      return;
    }
    try {
      await profileService.updateMe({ surname: trimmed });
      updateUser({ surname: trimmed });
    } catch {
      Alert.alert("Error", "No se pudo actualizar el apellido.");
      return;
    }
    setEditSurname(false);
    Alert.alert("Listo", "Apellido actualizado.");
  };

  const handleSaveNickname = async () => {
    const trimmed = displayName.trim();
    if (!trimmed) return;
    if (trimmed === (user.displayName ?? user.name)) {
      setEditNickname(false);
      return;
    }
    try {
      await profileService.updateMe({ displayName: trimmed });
      updateUser({ displayName: trimmed });
    } catch {
      Alert.alert("Error", "No se pudo actualizar el nickname.");
      return;
    }
    setEditNickname(false);
    Alert.alert("Listo", "Nickname actualizado.");
  };

  const handleAvatarEdit = async () => {
    //imagepicker se instala para que salga el menu ese de eligir imagen
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //si se puede acceder a las fotos se abre el menu
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita acceso a tus fotos para cambiar el avatar.");
      return;
    }

    //abre el menu y definimos las configuraciones
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    //si se da a cancelar pues no hace nada
    if (result.canceled) return;

    //pilla el uri de la imagen 
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    try {
      const ext = uri.split(".").pop()?.toLowerCase() || "jpg";
      const contentType =
        ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "image/jpeg";
      const filePath = `imagenes/${user.id}.${ext}`;

      const resp = await fetch(uri);
      const arrayBuffer = await resp.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("userData")
        .upload(filePath, arrayBuffer, {
          contentType,
          upsert: true,
        });


      if (uploadError) throw uploadError;

      await profileService.updateMe({ avatarUrl: filePath });
      updateUser({ avatarUrl: filePath });
      Alert.alert("Listo", "Avatar actualizado.");
    } catch (e: any) {
      const msg = e?.message || e?.error_description || "No se pudo subir la imagen";
      Alert.alert("Error", msg);
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.replace("/home")}
          style={[
            styles.backButton,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 },
          ]}
        >
          <Feather name="arrow-left" size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Mi perfil
        </Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Edita tus datos personales
      </Text>

      {/*editar / mostrar avatar , ponemos un presable para que se pueda editar*/}
      <View style={styles.avatarRow}>
        <Pressable style={styles.avatarButton} onPress={handleAvatarEdit}>
          <Image
            source={{
              //si el usuario no tiene avatar , le ponemos uno predefinido osea si es null es igual a la ruta que pone ahi
              uri: avatarUrl || avatarFallback,
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
            {rolesLoading
              ? "..."
              : roles?.find((role) => role.id === user.roleId)?.name ?? "NORMAL"}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View
          style={[
            styles.statPill,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Pedidos
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            {pedidosValue}
          </Text>
        </View>
        <View
          style={[
            styles.statPill,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Estado
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            Activo
          </Text>
        </View>
      </View>

      {/*editar / mostrar nombre*/}
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

        {/*editar / mostrar apellido*/}
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

        {/*editar / mostrar nickname*/}
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
        text="Preferencias"
        colorBG={theme.colors.primary}
        colorTxt={theme.colors.primaryContrast}
        icon={{type: "feather" , name: "settings"}}
        onPressed={() => router.push("/preferences")}
      />

      <View style={{ marginTop: 14 }} />


      <ButtonRectangular
        text="Logout"
        colorBG={theme.colors.background}
        colorBorder={theme.colors.error}
        colorTxt={theme.colors.error}

        icon={{ type: "feather", name: "log-out" }}
        colorIcon="#ffffff"
        onPressed={logout}

      />
      

    </View>
  );
}
;
