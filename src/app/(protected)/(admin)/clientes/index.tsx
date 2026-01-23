import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { router, Stack } from "expo-router";
import { FAB } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { clientesService } from "@/services/clientsService";
import { ClientsCard } from "@/components/ClientsCard";
import { Cliente } from "@/types/Clients";


export default function Clientes() {
  const [lista, setLista] = useState<Cliente[]>([]);

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
      
      
      <View style={styles.container}>
            <View style={{ marginTop: 20 }} />
      
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
              />
            </Pressable>
          )}
        />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => router.push("/clientes/crear")}
          color="white"
        />
      </View>
  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2979FF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
