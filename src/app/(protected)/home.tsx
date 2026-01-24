import { View, Text, StyleSheet } from "react-native";
import { useUserStore } from "@/store/userStore";
import { roles } from "@/types/Clients";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";

export default function Home() {
  const user = useUserStore((s) => s.user);
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  const nombre = user?.displayName ?? user?.name ?? "Usuario";
  const roleName = user
    ? roles.find((role) => role.id === user.RolId)?.name ?? "NORMAL"
    : "NORMAL";

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Bienvenido, {nombre}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Gestiona tu cuenta y accede a tus módulos desde aquí
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
          Tu sesión
        </Text>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Rol
          </Text>
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
            {roleName}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Email
          </Text>
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
            {user?.email ?? "-"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    paddingTop: 12,
    paddingBottom: 18,
  },

  kicker: {
    fontSize: 13,
    color: "#6b7280",
    textTransform: "capitalize",
    marginBottom: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 20,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eef2f7",
  },

  label: {
    fontSize: 13,
  },

  value: {
    fontSize: 13,
    fontWeight: "600",
  },
});
