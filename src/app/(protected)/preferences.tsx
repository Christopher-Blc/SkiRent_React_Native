import { StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { useTranslation } from "react-i18next";

export default function PreferencesScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const theme = getTheme(mode);
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language ?? "en").split("-")[0];

  const languageOptions = [
    { label: "English", value: "en", icon: "globe" as const },
    { label: "Español", value: "es", icon: "globe" as const },
    { label: "Français", value: "fr", icon: "globe" as const },
    { label: "Deutsch", value: "de", icon: "globe" as const },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Pressable
          style={[
            styles.backButton,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 },
          ]}
          onPress={() => router.replace("/profile")}
        >
          <Feather name="arrow-left" size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t("settingsTitle")}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          {t("themeSection")}
        </Text>

        {([
          { label: t("themeLight"), value: "light", icon: "sun" },
          { label: t("themeDark"), value: "dark", icon: "moon" },
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
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionIconBlock,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                  ]}
                >
                  <Feather name={option.icon} size={16} color={theme.colors.primary} />
                </View>
                <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>
                  {option.label}
                </Text>
              </View>
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

      <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          {t("generalPreferences")}
        </Text>
        <View style={[styles.infoRow, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
            {t("languageSection")}
          </Text>
        </View>
        {languageOptions.map((option) => {
          const selected = currentLanguage === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => i18n.changeLanguage(option.value)}
              style={[
                styles.optionRow,
                { borderColor: theme.colors.border },
                selected && { backgroundColor: theme.colors.surface },
              ]}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionIconBlock,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                  ]}
                >
                  <Feather name={option.icon} size={16} color={theme.colors.primary} />
                </View>
                <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>
                  {option.label}
                </Text>
              </View>
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
    padding: 22,
    paddingTop: 44,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
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
    fontSize: 24,
    fontWeight: "800",
    fontFamily: font.display,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  infoCard: {
    marginTop: 14,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: font.display,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  optionIconBlock: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: font.body,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: font.body,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: font.display,
  },
});
