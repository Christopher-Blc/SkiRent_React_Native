import React from "react";
import { Text, Modal, Pressable, Animated, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { TextInputRectangle } from "@/components/TextInputRectangle";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import { ClienteCard } from "@/components/EditClientCard";
import { useEdit } from "@/hooks/useEdit";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";

export default function ClienteDetalle() {
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
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,

    confirmDeleteVisible,
    closeConfirmDelete,
    confirmarEliminar,
    eliminar,

    guardar,
  } = useEdit();

  if (cargando) {
    return (
      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.textPrimary }}>Cargando...</Text>
      </View>
    );
  }
  if (!cliente) {
    return (
      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.textPrimary }}>Cliente no encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Cliente " + name, headerTitleAlign: "center" }} />

      {/* Confirmar eliminar popup*/}
      <Portal>
        <Dialog visible={confirmDeleteVisible} onDismiss={closeConfirmDelete}>
          <Dialog.Title>Eliminar cliente</Dialog.Title>
          <Dialog.Content>
            <Text>Seguro que quieres eliminar este cliente</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeConfirmDelete}>Cancelar</Button>
            <Button onPress={confirmarEliminar}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>


      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <ClienteCard cliente={cliente} onEditar={abrirEditar} onEliminar={eliminar} />
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
            Editar cliente
          </Text>

          {/* el keyboard avoiding view para que no tape el teclado los inputs , cuanto mas offset mas sube el contenido */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={60}
          >
            {/* scrollview con los inputs del formulario */}
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <TextInputRectangle placeholder="Nombre" value={name} onChangeText={setName} />
              <View style={{ marginTop: 14 }} />

              <TextInputRectangle placeholder="Apellidos" value={surname} onChangeText={setSurname} />
              <View style={{ marginTop: 14 }} />

              <TextInputRectangle
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={{ marginTop: 14 }} />

              <TextInputRectangle
                placeholder="Teléfono"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />

              <View style={{ marginTop: 14 }}>
                <ButtonRectangular
                  text="Guardar"
                  colorBG={theme.colors.primary}
                  colorTxt={theme.colors.primaryContrast}
                  onPressed={guardar}
                />

                <View style={{ height: 10 }} />
                <ButtonRectangular
                  text="Cancelar"
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "80%",
    borderWidth: 1,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  sheetTitle: {
    fontWeight: "700",
    marginBottom: 10,
    fontSize: 16,
  },
});
