import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ButtonRectangular } from "./ButtonRectangular";
import { Cliente } from "@/types/Clients";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";

interface Props {
  cliente: Cliente;
  onEditar: () => void;
  onEliminar: () => void;
}

export function ClienteCard({ cliente, onEditar , onEliminar}: Props) {
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
        {cliente.name} {cliente.surname}
      </Text>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Correo
        </Text>
        <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
          {cliente.email}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Teléfono
        </Text>
        <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
          {cliente.phoneNumber}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        Últimos pedidos
      </Text>

      <View style={styles.orders}>
        {cliente.pedidos.map((p, i) => (
          <Text
            key={i}
            style={[styles.orderItem, { color: theme.colors.textSecondary }]}
          >
            • {p}
          </Text>
        ))}
      </View>

      <View style={styles.editButton}>
        <ButtonRectangular
          text="Editar"
          colorBG={theme.colors.primary}
          colorTxt={theme.colors.primaryContrast}
          onPressed={onEditar}
          widthButton="100%"
        />
        <View style={{ height: 10 }} />
        
        <ButtonRectangular
            text="Eliminar"
            colorBG={theme.colors.surface}
            colorTxt={theme.colors.textPrimary}
            colorBorder="#ff0000ff"
            onPressed={onEliminar}
            widthButton="100%"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    margin: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  infoRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 15,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  orders: {
    paddingLeft: 6,
  },
  orderItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  editButton: {
    marginTop: 20,
  },
});
