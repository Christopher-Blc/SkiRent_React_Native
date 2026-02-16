import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useUserStore } from "@/store/userStore";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { useRoles } from "@/hooks/queries/useRoles";
import { useReservasCount } from "@/hooks/queries/useReservas";
import { ButtonRectangular } from "@/components/ButtonRectangular";


export default function Home() {
  const user = useUserStore((s) => s.user);
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const {
    data: pedidosCount,
    isLoading: pedidosLoading,
    error: pedidosError,
  } = useReservasCount(user?.id ?? "");

  const nombre = user?.displayName ?? user?.name ?? "Usuario";
  const roleName = rolesLoading
    ? "..."
    : user
      ? roles?.find((role) => role.id === user.roleId)?.name ?? "NORMAL"
      : "NORMAL";
  const pedidosValue = pedidosLoading ? "..." : pedidosError ? "!" : pedidosCount ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: theme.colors.textSecondary }]}>
          Panel principal
        </Text>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Bienvenido, {nombre}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Gestiona tu cuenta y accede a tus módulos desde aquí
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          ]}
        >
          <View style={[styles.statIcon, { backgroundColor: theme.colors.surface }]}>
            <Feather name="shopping-bag" size={18} color={theme.colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            {pedidosValue}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Pedidos
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          ]}
        >
          <View style={[styles.statIcon, { backgroundColor: theme.colors.surface }]}>
            <Feather name="shield" size={18} color={theme.colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
            {roleName}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Rol
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
          Detalles de la cuenta
        </Text>

        <View style={[styles.row, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Email
          </Text>
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
            {user?.email ?? "-"}
          </Text>
        </View>

        <View style={[styles.row, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Estado
          </Text>
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
            Cuenta activa
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },

  header: {
    paddingTop: 12,
    paddingBottom: 16,
  },

  kicker: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
    fontFamily: font.display,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.2,
    fontFamily: font.display,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: font.body,
  },

  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    fontFamily: font.display,
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: font.display,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: font.body,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  label: {
    fontSize: 13,
    fontFamily: font.body,
  },

  value: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: font.display,
  },

  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1
  }
});
