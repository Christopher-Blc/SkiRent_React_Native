import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/productsService";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { ButtonRectangular } from "@/components/ButtonRectangular";

function formatDateIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(value?: string | null) {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length !== 3) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function diffDays(start: Date, end: Date) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;
}

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

const ORDER_STATUS_VALUES = ["BORRADOR", "ACTIVO", "TERMINADO"] as const;
type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];

function normalizeStatus(value?: string | null): OrderStatus {
  const normalized = (value ?? "").trim().toUpperCase();
  if (normalized === "ACTIVO") return "ACTIVO";
  if (normalized === "TERMINADO") return "TERMINADO";
  return "BORRADOR";
}

type SubmitPayload = {
  estado: string | null;
  fechaInicio: string;
  fechaFin: string;
  materialNombre: string;
  total: number;
  dias: number;
};

type InitialValues = {
  estado?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  materialNombre?: string | null;
};

type Props = {
  visible: boolean;
  title: string;
  subtitle: string;
  submitLabel: string;
  isSaving?: boolean;
  showEstado?: boolean;
  initialValues?: InitialValues;
  onClose: () => void;
  onSubmit: (payload: SubmitPayload) => Promise<void> | void;
};

export function OrderFormModal({
  visible,
  title,
  subtitle,
  submitLabel,
  isSaving = false,
  showEstado = false,
  initialValues,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const hoy = useMemo(() => startOfDay(new Date()), []);
  const { data: productos = [], isLoading: productosLoading } = useQuery({
    queryKey: ["productos"],
    queryFn: getProduct,
  });
  const materiales = useMemo(() => productos.filter((p) => p.activo !== false), [productos]);

  const [materialListVisible, setMaterialListVisible] = useState(false);
  const [statusListVisible, setStatusListVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"inicio" | "fin" | null>(null);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [materialId, setMaterialId] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [estado, setEstado] = useState<OrderStatus>("BORRADOR");

  useEffect(() => {
    if (!visible) return;
    setMaterialListVisible(false);
    setStatusListVisible(false);
    setPickerTarget(null);
    setPickerDate(new Date());
    setEstado(normalizeStatus(initialValues?.estado));
    setFechaInicio(parseIsoDate(initialValues?.fechaInicio) ?? null);
    setFechaFin(parseIsoDate(initialValues?.fechaFin) ?? null);
    setMaterialId(null);
  }, [visible, initialValues]);

  useEffect(() => {
    if (!visible || !initialValues?.materialNombre || !materiales.length) return;
    const byName = materiales.find(
      (p) => p.nombre.trim().toLowerCase() === initialValues.materialNombre?.trim().toLowerCase()
    );
    setMaterialId(byName?.id ?? null);
  }, [visible, initialValues?.materialNombre, materiales]);

  const materialSeleccionado = useMemo(
    () => materiales.find((p) => p.id === materialId) ?? null,
    [materiales, materialId]
  );
  const dias = useMemo(() => {
    if (!fechaInicio || !fechaFin) return 0;
    const result = diffDays(fechaInicio, fechaFin);
    return result > 0 ? result : 0;
  }, [fechaInicio, fechaFin]);
  const precioUnitario = materialSeleccionado?.precio ?? 0;
  const totalCalculado = dias > 0 ? dias * precioUnitario : 0;
  const fechaInicioLabel = fechaInicio ? formatDateIso(fechaInicio) : t("selectStartDate");
  const fechaFinLabel = fechaFin ? formatDateIso(fechaFin) : t("selectEndDate");
  const estadoLabel =
    estado === "ACTIVO"
      ? t("orderStatusActive")
      : estado === "TERMINADO"
        ? t("orderStatusFinished")
        : t("orderStatusDraft");

  const abrirSelectorFecha = (target: "inicio" | "fin") => {
    const seedDate =
      target === "inicio"
        ? fechaInicio ?? new Date()
        : fechaFin ?? fechaInicio ?? new Date();
    setPickerDate(seedDate);
    setPickerTarget(target);
  };

  const onChangeDate = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!pickerTarget) return;
    if (!selectedDate) {
      setPickerTarget(null);
      return;
    }
    if (Platform.OS === "android") {
      if (pickerTarget === "inicio") setFechaInicio(selectedDate);
      if (pickerTarget === "fin") setFechaFin(selectedDate);
      setPickerTarget(null);
      return;
    }
    setPickerDate(selectedDate);
  };

  const confirmarFecha = () => {
    if (!pickerTarget) return;
    if (pickerTarget === "inicio") setFechaInicio(pickerDate);
    if (pickerTarget === "fin") setFechaFin(pickerDate);
    setPickerTarget(null);
  };

  const submit = async () => {
    if (!materialSeleccionado) {
      Alert.alert(t("error"), t("selectMaterialError"));
      return;
    }
    if (!fechaInicio || !fechaFin) {
      Alert.alert(t("error"), t("selectDatesError"));
      return;
    }

    const startDay = startOfDay(fechaInicio);
    const endDay = startOfDay(fechaFin);
    if (startDay < hoy || endDay < hoy) {
      Alert.alert(t("error"), t("dateNotBeforeTodayError"));
      return;
    }
    if (endDay < startDay) {
      Alert.alert(t("error"), t("dateOrderError"));
      return;
    }
    if (dias > 30) {
      Alert.alert(t("error"), t("maxReservationDaysError"));
      return;
    }

    await onSubmit({
      estado,
      fechaInicio: formatDateIso(startDay),
      fechaFin: formatDateIso(endDay),
      materialNombre: materialSeleccionado.nombre,
      total: Number(totalCalculado.toFixed(2)),
      dias,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalCard,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>

          {showEstado ? (
            <>
              <Button
                mode="outlined"
                onPress={() => {
                  setMaterialListVisible(false);
                  setPickerTarget(null);
                  setStatusListVisible(true);
                }}
                textColor={theme.colors.textPrimary}
                style={styles.selectorButton}
              >
                {t("state")}: {estadoLabel}
              </Button>
              <View style={{ height: 10 }} />
            </>
          ) : null}

          <Button
            mode="outlined"
            onPress={() => {
              setStatusListVisible(false);
              setPickerTarget(null);
              setMaterialListVisible(true);
            }}
            textColor={theme.colors.textPrimary}
            style={styles.selectorButton}
          >
            {materialSeleccionado?.nombre ??
              (productosLoading ? t("loadingMaterials") : t("selectMaterial"))}
          </Button>

          <View style={{ height: 10 }} />
          <Button
            mode="outlined"
            onPress={() => abrirSelectorFecha("inicio")}
            textColor={theme.colors.textPrimary}
            style={styles.selectorButton}
          >
            {fechaInicioLabel}
          </Button>
          <View style={{ height: 10 }} />
          <Button
            mode="outlined"
            onPress={() => abrirSelectorFecha("fin")}
            textColor={theme.colors.textPrimary}
            style={styles.selectorButton}
          >
            {fechaFinLabel}
          </Button>

          <View
            style={[
              styles.totalBox,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.totalRow, { color: theme.colors.textSecondary }]}>
              {t("days")}: {dias}
            </Text>
            <Text style={[styles.totalRow, { color: theme.colors.textSecondary }]}>
              {t("materialPrice")}: {precioUnitario.toFixed(2)} EUR / {t("days").toLowerCase()}
            </Text>
            <Text style={[styles.totalValue, { color: theme.colors.textPrimary }]}>
              {t("total")}: {totalCalculado.toFixed(2)} EUR
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <ButtonRectangular
              text={t("cancel")}
              colorBG={theme.colors.surface}
              colorTxt={theme.colors.textPrimary}
              colorBorder={theme.colors.border}
              widthButton="48%"
              onPressed={onClose}
            />
            <ButtonRectangular
              text={isSaving ? t("savingProgress") : submitLabel}
              colorBG={theme.colors.primary}
              colorTxt={theme.colors.primaryContrast}
              widthButton="48%"
              onPressed={submit}
            />
          </View>

          {materialListVisible ? (
            <View style={styles.innerOverlay}>
              <Pressable
                style={styles.innerOverlayBackdrop}
                onPress={() => setMaterialListVisible(false)}
              />
              <View
                style={[
                  styles.materialListCard,
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                ]}
              >
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  {t("selectMaterial")}
                </Text>
                <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                  {materiales.map((p) => (
                    <Pressable
                      key={p.id}
                      onPress={() => {
                        setMaterialId(p.id);
                        setMaterialListVisible(false);
                      }}
                      style={[
                        styles.materialOption,
                        {
                          backgroundColor:
                            p.id === materialId ? theme.colors.surface : theme.colors.card,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.materialName, { color: theme.colors.textPrimary }]}>
                        {p.nombre}
                      </Text>
                      <Text style={[styles.materialPrice, { color: theme.colors.textSecondary }]}>
                        {typeof p.precio === "number"
                          ? `${p.precio.toFixed(2)} EUR / ${t("days").toLowerCase()}`
                          : "-"}
                      </Text>
                    </Pressable>
                  ))}
                  {!materiales.length ? (
                    <Text style={[styles.materialPrice, { color: theme.colors.textSecondary }]}>
                      {t("noMaterialsAvailable")}
                    </Text>
                  ) : null}
                </ScrollView>
              </View>
            </View>
          ) : null}

          {statusListVisible ? (
            <View style={styles.innerOverlay}>
              <Pressable
                style={styles.innerOverlayBackdrop}
                onPress={() => setStatusListVisible(false)}
              />
              <View
                style={[
                  styles.materialListCard,
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                ]}
              >
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  {t("selectOrderStatus")}
                </Text>
                {ORDER_STATUS_VALUES.map((status) => {
                  const label =
                    status === "ACTIVO"
                      ? t("orderStatusActive")
                      : status === "TERMINADO"
                        ? t("orderStatusFinished")
                        : t("orderStatusDraft");
                  return (
                    <Pressable
                      key={status}
                      onPress={() => {
                        setEstado(status);
                        setStatusListVisible(false);
                      }}
                      style={[
                        styles.materialOption,
                        {
                          backgroundColor:
                            status === estado ? theme.colors.surface : theme.colors.card,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.materialName, { color: theme.colors.textPrimary }]}>
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {pickerTarget ? (
            <View style={styles.innerOverlay}>
              <Pressable style={styles.innerOverlayBackdrop} onPress={() => setPickerTarget(null)} />
              <View
                style={[
                  styles.datePickerCard,
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                ]}
              >
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  {pickerTarget === "inicio" ? t("selectStartDate") : t("selectEndDate")}
                </Text>
                <DateTimePicker
                  value={pickerDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChangeDate}
                  themeVariant={mode === "dark" ? "dark" : "light"}
                  textColor={mode === "dark" ? theme.colors.textPrimary : "#111827"}
                  minimumDate={
                    pickerTarget === "fin" && fechaInicio && startOfDay(fechaInicio) > hoy
                      ? startOfDay(fechaInicio)
                      : hoy
                  }
                />
                {Platform.OS === "ios" ? (
                  <View style={styles.actionsRow}>
                    <ButtonRectangular
                      text={t("cancel")}
                      colorBG={theme.colors.surface}
                      colorTxt={theme.colors.textPrimary}
                      colorBorder={theme.colors.border}
                      widthButton="48%"
                      onPressed={() => setPickerTarget(null)}
                    />
                    <ButtonRectangular
                      text={t("save")}
                      colorBG={theme.colors.primary}
                      colorTxt={theme.colors.primaryContrast}
                      widthButton="48%"
                      onPressed={confirmarFecha}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  title: {
    fontWeight: "800",
    marginBottom: 12,
    fontSize: 16,
    fontFamily: font.display,
  },
  subtitle: {
    marginTop: -6,
    marginBottom: 12,
    fontFamily: font.body,
  },
  selectorButton: {
    borderRadius: 12,
  },
  totalBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },
  totalRow: {
    fontFamily: font.body,
    fontSize: 13,
    marginBottom: 4,
  },
  totalValue: {
    marginTop: 2,
    fontFamily: font.display,
    fontWeight: "800",
    fontSize: 16,
  },
  actionsRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  materialListCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    maxHeight: "70%",
  },
  materialOption: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  materialName: {
    fontFamily: font.display,
    fontWeight: "700",
    marginBottom: 2,
  },
  materialPrice: {
    fontFamily: font.body,
    fontSize: 13,
  },
  innerOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  innerOverlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  datePickerCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
});
