import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { TextInputRectangle } from "@/components/TextInputRectangle";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import { styles } from "@/styles/profile.styles";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from "react-i18next";
import { useProfileScreen } from "@/hooks/useProfileScreen";


export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const { logout } = useAuth();
  const {
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
  } = useProfileScreen();

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t("myProfile")}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {t("noUserData")}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerRow}>
        
        
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {t("myProfile")}
        </Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        {t("editPersonalData")}
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
            {roleName}
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
            {t("reservations")}
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
            {t("state")}
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            {t("accountActive")}
          </Text>
        </View>
      </View>

      {/*editar / mostrar nombre*/}
      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.fieldRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t("name")}</Text>
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
            {t("surname")}
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
            {t("nickname")}
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
          {t("email")}
        </Text>
        <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
          {user.email}
        </Text>
      </View>

        {/*Botones abajo */}
      <ButtonRectangular
        text={t("settingsTitle")}
        colorBG={theme.colors.primary}
        colorTxt={theme.colors.primaryContrast}
        icon={{type: "feather" , name: "settings"}}
        onPressed={() => router.push("/preferences")}
      />

      <View style={{ marginTop: 14 }} />


      <ButtonRectangular
        text={t("logout")}
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
