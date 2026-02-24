import React, { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { useDeleteReserva, useReservasAll, useUpdateReserva } from "@/hooks/queries/useReservas";
import { useClientesList } from "@/hooks/queries/useClientes";
import { useTranslation } from "react-i18next";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import { OrderFormModal } from "@/components/OrderFormModal";
import type { Reserva } from "@/types/Reservas";

function fmtDate(value: string | null) {
  if (!value) return "-";
  return value;
}

function fmtTotal(value: number | null) {
  if (typeof value !== "number") return "-";
  return `${value.toFixed(2)} EUR`;
}

export default function PedidosScreen() {
  // Queries y estados para listado y edicion de pedidos.
  const { t } = useTranslation();
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const { data: reservas = [], isLoading, error, refetch } = useReservasAll();
  const { data: clientes = [] } = useClientesList();
  const updateReserva = useUpdateReserva();
  const deleteReserva = useDeleteReserva();
  const [editing, setEditing] = useState<Reserva | null>(null);

  // Mapa auxiliar para resolver nombre de cliente desde clienteId.
  const clientesMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of clientes) {
      map.set(c.id, `${c.name} ${c.surname}`.trim());
    }
    return map;
  }, [clientes]);

  // Confirma y elimina un pedido.
  const onDelete = (item: Reserva) => {
    Alert.alert(t("deleteOrder"), t("deleteOrderConfirm", { id: item.id }), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteReserva.mutateAsync(item.id);
          } catch (e: any) {
            Alert.alert(t("error"), e?.message ?? t("orderDeleteFailed"));
          }
        },
      },
    ]);
  };

  return (
    // Pantalla global de pedidos.
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t("reservations")}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {reservas.length} {t("reservations").toLowerCase()}
        </Text>
      </View>

      {isLoading ? (
        <Text style={{ color: theme.colors.textSecondary }}>{t("loading")}...</Text>
      ) : null}

      {error ? (
        <Pressable onPress={() => refetch()}>
          <Text style={{ color: theme.colors.error }}>{t("loadingError")}</Text>
        </Pressable>
      ) : null}

      {!isLoading && !error ? (
        <FlatList
          data={reservas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {t("noOrders")}
            </Text>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.idText, { color: theme.colors.textPrimary }]}>#{item.id}</Text>
              <Text style={[styles.line, { color: theme.colors.textSecondary }]}>
                {t("orderClient")}: {clientesMap.get(item.clienteId) ?? item.clienteId}
              </Text>
              <Text style={[styles.line, { color: theme.colors.textSecondary }]}>
                {t("orderDates")}: {fmtDate(item.fechaInicio)} {"->"} {fmtDate(item.fechaFin)}
              </Text>
              <Text style={[styles.line, { color: theme.colors.textSecondary }]}>
                {t("orderMaterial")}: {item.notas?.replace("Material:", "").trim() || "-"}
              </Text>
              <Text style={[styles.line, { color: theme.colors.textSecondary }]}>
                {t("orderStatus")}: {item.estado ?? t("noStatus")}
              </Text>
              <Text style={[styles.total, { color: theme.colors.textPrimary }]}>
                {t("total")}: {fmtTotal(item.total)}
              </Text>

              <View style={styles.actionsRow}>
                <ButtonRectangular
                  text={t("editOrder")}
                  colorBG={theme.colors.surface}
                  colorTxt={theme.colors.textPrimary}
                  colorBorder={theme.colors.border}
                  widthButton="48%"
                  onPressed={() => setEditing(item)}
                />
                <ButtonRectangular
                  text={t("delete")}
                  colorBG={theme.colors.surface}
                  colorTxt={theme.colors.error}
                  colorBorder={theme.colors.error}
                  widthButton="48%"
                  onPressed={() => onDelete(item)}
                />
              </View>
            </View>
          )}
        />
      ) : null}

      {/* Modal reutilizable para editar un pedido existente */}
      <OrderFormModal
        visible={!!editing}
        title={t("editOrder")}
        subtitle={t("editOrderSubtitle")}
        submitLabel={t("save")}
        isSaving={updateReserva.isPending}
        showEstado
        initialValues={
          editing
            ? {
                estado: editing.estado,
                fechaInicio: editing.fechaInicio,
                fechaFin: editing.fechaFin,
                materialNombre: editing.notas?.replace("Material:", "").trim(),
              }
            : undefined
        }
        onClose={() => setEditing(null)}
        onSubmit={async (values) => {
          if (!editing) return;
          try {
            await updateReserva.mutateAsync({
              id: editing.id,
              input: {
                estado: values.estado,
                fechaInicio: values.fechaInicio,
                fechaFin: values.fechaFin,
                total: values.total,
                notas: `Material: ${values.materialNombre}`,
              },
            });
            setEditing(null);
          } catch (e: any) {
            Alert.alert(t("error"), e?.message ?? t("orderUpdateFailed"));
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontFamily: font.display,
    fontWeight: "800",
    fontSize: 24,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: font.body,
  },
  listContent: {
    paddingBottom: 22,
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  idText: {
    fontFamily: font.display,
    fontWeight: "800",
    marginBottom: 6,
  },
  line: {
    fontFamily: font.body,
    marginBottom: 3,
  },
  total: {
    marginTop: 6,
    fontFamily: font.display,
    fontWeight: "800",
  },
  emptyText: {
    fontFamily: font.body,
    marginTop: 16,
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});
