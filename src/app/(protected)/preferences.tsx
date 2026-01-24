import { StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";

export default function PreferencesScreen() {
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const theme = getTheme(mode);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace("/profile")}>
          <Feather name="arrow-left" size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Preferencias</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          Tema
        </Text>

        {([
          { label: "Claro", value: "light" },
          { label: "Oscuro", value: "dark" },
        ] as const).map((option) => {
          const selected = mode === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setMode(option.value)}
              style={[
                styles.optionRow,
                { borderColor: theme.colors.border },
                selected && { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}
              >
                {option.label}
              </Text>
              <View
                style={[
                  styles.radio,
                  { borderColor: theme.colors.textSecondary },
                  selected && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
                ]}
              />
            </Pressable>
          );
        })}
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
});
