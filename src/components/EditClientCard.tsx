import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ButtonRectangular } from "./ButtonRectangular";
import { Cliente } from "@/types/Clients";

interface Props {
  cliente: Cliente;
  onEditar: () => void;
  onEliminar: () => void;
}

export function ClienteCard({ cliente, onEditar , onEliminar}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>
        {cliente.name} {cliente.surname}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Correo</Text>
        <Text style={styles.value}>{cliente.email}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.value}>{cliente.phoneNumber}</Text>
      </View>

      <Text style={styles.sectionTitle}>Últimos pedidos</Text>

      <View style={styles.orders}>
        {cliente.pedidos.map((p, i) => (
          <Text key={i} style={styles.orderItem}>• {p}</Text>
        ))}
      </View>

      <View style={styles.editButton}>
        <ButtonRectangular
          text="Editar"
          colorBG="#1a0083ff"
          colorTxt="#fff"
          onPressed={onEditar}
          widthButton="100%"
        />
        <View style={{ height: 10 }} />
        
        <ButtonRectangular
            text="Eliminar"
            colorBG="#ffffffcc"
            colorTxt="#000000ff"
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    margin: 16,
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
    color: "#888",
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
