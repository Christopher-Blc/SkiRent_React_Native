import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { FAB } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { clientesService } from "@/services/userService";
import { ClientsCard } from "@/components/ClientsCard";
import { Cliente } from "@/types/Clients";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";


export default function Clientes() {
  const [lista, setLista] = useState<Cliente[]>([]);
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  const cargar = useCallback(() => {
    clientesService.list().then(setLista);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  return (
    <>
      
      
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.titleText, { color: theme.colors.textPrimary }]}>
            Clientes
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Gestiona y actualiza la base de clientes
          </Text>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.metaPill,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>
                Total
              </Text>
              <Text style={[styles.metaValue, { color: theme.colors.textPrimary }]}>
                {lista.length}
              </Text>
            </View>
          </View>
        </View>
      
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/clientes/${item.id}`)}>
              <ClientsCard
                name={item.name}
                surname={item.surname}
                email={item.email}
                phoneNumber={item.phoneNumber}
                pedidosCount={item.pedidos?.length ?? 0}
              />
            </Pressable>
          )}
        />

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push("/clientes/crear")}
          color={theme.colors.primaryContrast}
        />
      </View>
  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: font.display,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: font.body,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  metaPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontFamily: font.display,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "800",
    fontFamily: font.display,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    borderRadius: 18,
    elevation: 4,
    shadowColor: "#0f172a",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
});
