import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { FAB } from "react-native-paper";
import { ClientsCard } from "@/components/ClientsCard";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { useClientesList } from "@/hooks/queries/useClientes";
import { useUserStore } from "@/store/userStore";
import { styles } from "@/styles/create.styles";
import { useTranslation } from "react-i18next";

//pantalla que muestra la lista de clientes
export default function Clientes() {
  const { t } = useTranslation();
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const user = useUserStore((s) => s.user);
  

  const { data, isLoading, error, refetch } = useClientesList();
  const lista = (data ?? []).filter((c) => c.id !== user?.id);

  return (
    <>
      
      
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.titleText, { color: theme.colors.textPrimary }]}>
            {t("clients")}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t("manageClients")}
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
        

        {isLoading ? (
          <Text style={{ color: theme.colors.textSecondary, paddingHorizontal: 16 }}>
            {t("loading")}...
          </Text>
        ) : null}
        {error ? (
          <Pressable onPress={() => refetch()}>
            <Text style={{ color: theme.colors.error, paddingHorizontal: 16 }}>
              {t("loadingError")}
            </Text>
          </Pressable>
        ) : null}
      
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
                phoneNumber={item.phoneNumber ?? ""}
                avatar={item.avatar}
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
