import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { supabase } from "@/lib/supabase";

interface ClientsCardProps {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  avatar?: string | null;
  pedidosCount?: number | null;
}

const getInitials = (name: string, surname: string) =>
  `${name?.[0] ?? ""}${surname?.[0] ?? ""}`.toUpperCase();

export const ClientsCard = ({
  name,
  surname,
  email,
  phoneNumber,
  avatar,
  pedidosCount,
}: ClientsCardProps) => {
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const avatarUrl = avatar
    ? `${supabase.storage.from("userData").getPublicUrl(avatar).data.publicUrl}?t=${Date.now()}`
    : null;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 46, height: 46, borderRadius: 23 }}
            />
          ) : (
            <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
              {getInitials(name, surname)}
            </Text>
          )}
        </View>

        <View style={styles.body}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {name} {surname}
          </Text>

          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            {email}
          </Text>

          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            {phoneNumber}
          </Text>
        </View>

        {typeof pedidosCount === "number" ? (
          <View style={styles.meta}>
            <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>
              Pedidos
            </Text>
            <Text style={[styles.metaValue, { color: theme.colors.textPrimary }]}>
              {pedidosCount}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 18,
    marginBottom: 12,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: font.display,
    letterSpacing: 0.4,
  },
  body: {
    flex: 1,
  },
  meta: {
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 11,
    fontFamily: font.body,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: font.display,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: font.display,
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
    fontFamily: font.body,
  },
});
