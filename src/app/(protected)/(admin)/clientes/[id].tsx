import React from "react";
import { Text, Modal, Pressable, Animated, StyleSheet, View, Image } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { TextInputRectangle } from "@/components/TextInputRectangle";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import { ClienteCard } from "@/components/EditClientCard";
import { useEdit } from "@/hooks/useEdit";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import { font } from "@/styles/typography";
import { supabase } from "@/lib/supabase";
import { useReservasByCliente, useReservasCount } from "@/hooks/queries/useReservas";
import { useTranslation } from "react-i18next";

export default function ClienteDetalle() {
  const router = useRouter();
  const { id: clientId } = useLocalSearchParams();
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  //constantes que vienen del hook useEdit y controlan toda la logica de editar/eliminar cliente
  const {
    cargando,
    cliente,

    editar,
    animY,
    abrirEditar,
    cerrarEditar,

    name,
    setName,
    surname,
    setSurname,
    displayName,
    setDisplayName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,

    confirmDeleteVisible,
    closeConfirmDelete,
    confirmarEliminar,
    eliminar,

    guardar,
    cambiarAvatar,
    avatarUploading,
  } = useEdit();

  const { t } = useTranslation();
  const { data: reservas } = useReservasByCliente(clientId as string, 5);
  const { data: reservasCount } = useReservasCount(clientId as string);
  const pedidos = (reservas ?? []).map((r) => `#${r.id} · ${r.estado ?? "Sin estado"}`);

  //Imagen de avatar del cliente que se saca del bucket de supa
  const avatarUrl = cliente?.avatar
    ? `${supabase.storage.from("userData").getPublicUrl(cliente.avatar).data.publicUrl}?t=${Date.now()}`
    : null;

  if (cargando) {
    return (
      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.textPrimary }}>{t("loading")}...</Text>
      </View>
    );
  }
  if (!cliente) {
    return (
      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.textPrimary }}>{t("clientNotFound")}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: t("client") + " " + name,
          headerTitleAlign: "center",
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/clientes")}
              style={{ paddingHorizontal: 8 }}
            >
              <Feather name="arrow-left" size={20} color={theme.colors.headerText} />
            </Pressable>
          ),
        }}
      />

      {/* Confirmar eliminar popup*/}
      <Portal>
        <Dialog visible={confirmDeleteVisible} onDismiss={closeConfirmDelete}>
          <Dialog.Title style={[styles.dialogTitle, { color: theme.colors.textPrimary }]}>
            Eliminar cliente
          </Dialog.Title>
          <Dialog.Content>
            <Text style={[styles.dialogText, { color: theme.colors.textSecondary }]}>
              {t("confirmDeleteClient")}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeConfirmDelete}>Cancelar</Button>
            <Button onPress={confirmarEliminar}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>


      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <ClienteCard
          cliente={cliente}
          onEditar={abrirEditar}
          onEliminar={eliminar}
          pedidos={pedidos}
          pedidosCount={reservasCount}
        />
      </View>
      {/* Editar cliente modal que aparece desde abajo y ocupa el 80% de la pantalla */}
      <Modal visible={editar} transparent animationType="none" onRequestClose={cerrarEditar}>
        <Pressable style={styles.backdrop} onPress={cerrarEditar} />

        {/* Hoja animada desde abajo que contiene el formulario de editar el usuario */}
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: animY }],
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>
            {t("editClient")}
          </Text>

          <View style={styles.avatarRow}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={[styles.avatarInitials, { color: theme.colors.primary }]}>
                  {(name?.[0] ?? "") + (surname?.[0] ?? "")}
                </Text>
              )}
            </View>
            <ButtonRectangular
              text={avatarUploading ? t("uploading") : t("changeImage")}
              colorBG={theme.colors.surface}
              colorTxt={theme.colors.textPrimary}
              colorBorder={theme.colors.border}
              onPressed={cambiarAvatar}
              widthButton={'80%'}
            />
          </View>

          {/* el keyboard avoiding view para que no tape el teclado los inputs , cuanto mas offset mas sube el contenido */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={60}
          >
            {/* scrollview con los inputs del formulario */}
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <TextInputRectangle placeholder={t("name")} value={name} onChangeText={setName} />
              <View style={{ marginTop: 14 }} />

              <TextInputRectangle placeholder={t("surname")} value={surname} onChangeText={setSurname} />
              <View style={{ marginTop: 14 }} />

              <TextInputRectangle
                placeholder={t("nickname")}
                value={displayName}
                onChangeText={setDisplayName}
              />
              <View style={{ marginTop: 14 }} />

              <TextInputRectangle
                placeholder={t("email")}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={{ marginTop: 14 }} />

              <TextInputRectangle
                placeholder={t("phoneNumber")}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />

              <View style={{ marginTop: 14 }}>
                <ButtonRectangular
                  text={t("save")}
                  colorBG={theme.colors.primary}
                  colorTxt={theme.colors.primaryContrast}
                  onPressed={guardar}
                />

                <View style={{ height: 10 }} />
                <ButtonRectangular
                  text={t("cancel")}
                  colorBG={theme.colors.surface}
                  colorTxt={theme.colors.textPrimary}
                  colorBorder={theme.colors.border}
                  onPressed={cerrarEditar}
                />
              </View>

              <View style={{ height: 30 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
    borderWidth: 1,
    shadowColor: "#0f172a",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -6 },
    elevation: 8,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  sheetTitle: {
    fontWeight: "800",
    marginBottom: 12,
    fontSize: 16,
    fontFamily: font.display,
  },
  dialogTitle: {
    fontFamily: font.display,
    fontWeight: "800",
  },
  dialogText: {
    fontFamily: font.body,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 54,
    height: 54,
  },
  avatarInitials: {
    fontWeight: "800",
    fontFamily: font.display,
  },
});
