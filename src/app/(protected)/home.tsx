import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useUserStore } from "@/store/userStore";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import {styles } from "@/styles/home.styles";
import { useRoles } from "@/hooks/queries/useRoles";
import { useReservasCount } from "@/hooks/queries/useReservas";
import { useTranslation } from "react-i18next";



export default function Home() {
  const {t} = useTranslation();
  const user = useUserStore((s) => s.user);
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const {
    data: pedidosCount,
    isLoading: pedidosLoading,
    error: pedidosError,
  } = useReservasCount(user?.id ?? "");

  const nombre = user?.displayName ?? user?.name ?? t("users");
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
          {t("mainPanel")}
        </Text>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {t("welcome")}, {nombre}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {t("manageAccountAndModules")}
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
            {t("reservations")}
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
            {t("role")}
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
          {t("accountDetails")}
        </Text>

        <View style={[styles.row, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            {t("email")}
          </Text>
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
            {user?.email ?? "-"}
          </Text>
        </View>

        <View style={[styles.row, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            {t("state")}
          </Text>
          <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
            {t("accountActive")}
          </Text>
        </View>
      </View>
    </View>
  );
}

