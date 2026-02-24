import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { ButtonRectangular } from "./ButtonRectangular";
import { Cliente } from "@/types/Clients";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";

interface Props {
  cliente: Cliente;
  onEditar: () => void;
  onEliminar: () => void;
  onNuevoPedido?: () => void;
  nuevoPedidoText?: string;
  pedidos?: string[];
  pedidosCount?: number | null;
}

export function ClienteCard({
  cliente,
  onEditar,
  onEliminar,
  onNuevoPedido,
  nuevoPedidoText = "Nuevo pedido",
  pedidos = [],
  pedidosCount,
}: Props) {
  const { t } = useTranslation();
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const initials = `${cliente.name?.[0] ?? ""}${cliente.surname?.[0] ?? ""}`.toUpperCase();
  const pedidosTotal = typeof pedidosCount === "number" ? pedidosCount : pedidos.length;
  const avatarUrl = cliente?.avatar
      ? `${supabase.storage.from("userData").getPublicUrl(cliente.avatar).data.publicUrl}?t=${Date.now()}`
      : null;
      
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          ) : (
            <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
              {initials}
            </Text>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
            {cliente.name} {cliente.surname}
          </Text>
          <Text style={[styles.subtle, { color: theme.colors.textSecondary }]}>
            {cliente.email}
          </Text>
        </View>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
            {t("accountActive")}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {t("email")}
        </Text>
        <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
          {cliente.email}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {t("phoneNumber")}
        </Text>
        <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
          {cliente.phoneNumber}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {t("nickname")}
        </Text>
        <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
          {cliente.displayName}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {t("reservations")}
        </Text>
        <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
          {pedidosTotal}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        {t("recentOrders")}
      </Text>

      <View style={styles.orders}>
        {pedidos.map((p, i) => (
          <Text
            key={i}
            style={[styles.orderItem, { color: theme.colors.textSecondary }]}
          >
            • {p}
          </Text>
        ))}
        {pedidos.length === 0 ? (
          <Text style={[styles.orderItem, { color: theme.colors.textSecondary }]}>
            • {t("noRecentOrders")}
          </Text>
        ) : null}
      </View>

      <View style={styles.editButton}>
        {onNuevoPedido ? (
          <>
            <ButtonRectangular
              text={nuevoPedidoText}
              colorBG={theme.colors.primary}
              colorTxt={theme.colors.primaryContrast}
              onPressed={onNuevoPedido}
              widthButton="100%"
            />
            <View style={{ height: 10 }} />
          </>
        ) : null}

        <ButtonRectangular
          text={t("edit")}
          colorBG={theme.colors.surface}
          colorTxt={theme.colors.textPrimary}
          colorBorder={theme.colors.border}
          onPressed={onEditar}
          widthButton="100%"
        />
        <View style={{ height: 10 }} />
        
        <ButtonRectangular
          text={t("delete")}
          colorBG={theme.colors.surface}
          colorTxt={theme.colors.error}
          colorBorder={theme.colors.error}
          onPressed={onEliminar}
          widthButton="100%"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    margin: 16,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: font.display,
  },
  headerInfo: {
    flex: 1,
  },
  subtle: {
    fontSize: 13,
    fontFamily: font.body,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    fontFamily: font.display,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: font.display,
    marginBottom: 0,
  },
  infoRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    fontFamily: font.body,
  },
  value: {
    fontSize: 15,
    fontFamily: font.body,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    fontFamily: font.display,
  },
  orders: {
    paddingLeft: 6,
  },
  orderItem: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: font.body,
  },
  editButton: {
    marginTop: 20,
  },
});
