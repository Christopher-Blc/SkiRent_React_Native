import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";

interface ClientsCardProps {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
}

export const ClientsCard = ({ name, surname, email, phoneNumber }: ClientsCardProps) => {
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {name} {surname}
      </Text>

      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
        Email:{" "}
        <Text style={[styles.content, { color: theme.colors.accent }]}>
          {email}
        </Text>
      </Text>

      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
        Teléfono:{" "}
        <Text style={[styles.content, { color: theme.colors.accent }]}>
          {phoneNumber}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 20,
    marginBottom: 12,
    borderRadius: 14,
    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    alignSelf: "center",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  content: {
    fontWeight: "500",
  },
});
