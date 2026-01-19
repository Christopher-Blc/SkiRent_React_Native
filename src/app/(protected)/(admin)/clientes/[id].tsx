import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { clientesService } from "@/services/clientsService";
import { Cliente } from "@/data/clientes";
import { TextInputRectangle } from "@/components/TextInputRectangle";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import { ClienteCard } from "@/components/EditClientCard";
import { z } from "zod";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";



const H = Dimensions.get("window").height;
const telefonoRegex = /^\+?\d{7,15}$/;

const clienteSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  surname: z.string().min(1, "Los apellidos son obligatorios"),
  email: z.string().min(1, "El email es obligatorio").email("Email no válido"),
  phoneNumber: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(telefonoRegex, "Teléfono no válido"),
});

export default function ClienteDetalle() {
  const { id } = useLocalSearchParams();
  const clientId = Number(id);

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cargando, setCargando] = useState(true);

  // popup
  const [editar, setEditar] = useState(false);
  const animY = useRef(new Animated.Value(H)).current;

  // campos
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const openConfirmDelete = () => setConfirmDeleteVisible(true);
  const closeConfirmDelete = () => setConfirmDeleteVisible(false);

  const cargarCliente = async () => {
    setCargando(true);
    const c = await clientesService.getById(clientId);
    setCliente(c);
    setCargando(false);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      setCargando(true);
      const c = await clientesService.getById(clientId);
      if (mounted) {
        setCliente(c);
        setCargando(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [clientId]);

  const abrirEditar = () => {
    if (!cliente) return;

    setName(cliente.name);
    setSurname(cliente.surname);
    setEmail(cliente.email);
    setPhoneNumber(cliente.phoneNumber);

    setEditar(true);

    // sube desde abajo
    animY.setValue(H);
    Animated.timing(animY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const cerrarEditar = () => {
    // baja y cierra
    Animated.timing(animY, {
      toValue: H,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setEditar(false));
  };

  const eliminar = () => {
    openConfirmDelete();
  };

  const guardar = async () => {
    if (!cliente) return;

    const result = clienteSchema.safeParse({
      name,
      surname,
      email,
      phoneNumber,
    });

    if (!result.success) {
      Alert.alert("Error", result.error.issues[0].message);
      return;
    }

    try {
      await clientesService.update(clientId, result.data);
      cerrarEditar();
      await cargarCliente();
    } catch (e: any) {
      if (e?.message === "EMAIL_DUPLICADO") {
        Alert.alert("Email duplicado", "Ya existe un cliente con ese email");
        return;
      }

      if (e?.message === "TELEFONO_DUPLICADO") {
        Alert.alert("Teléfono duplicado", "Ya existe un cliente con ese teléfono");
        return;
      }

      Alert.alert("Error", "No se ha podido crear el cliente");
    }
  }



  if (cargando) return <Text>Cargando...</Text>;
  if (!cliente) return <Text>Cliente no encontrado</Text>;

  return (
    <>
      <Stack.Screen options={{ title:"Cliente " + name , headerTitleAlign: "center"}} />
      <Portal>
        <Dialog visible={confirmDeleteVisible} onDismiss={closeConfirmDelete}>
          <Dialog.Title>Eliminar cliente</Dialog.Title>
          <Dialog.Content>
            <Text>¿Seguro que quieres eliminar este cliente?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeConfirmDelete}>Cancelar</Button>
            <Button
              onPress={async () => {
                closeConfirmDelete();
                try {
                  await clientesService.remove(clientId);
                  router.replace("/clientes");
                } catch (e) {
                  Alert.alert("Error", "No se pudo eliminar el cliente");
                }
              }}
            >
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ClienteCard
        cliente={cliente}
        onEditar={abrirEditar}
        onEliminar={eliminar} />



      {/* Popup desde abajo */}
      <Modal visible={editar} transparent animationType="none" onRequestClose={cerrarEditar}>
        {/* fondo oscuro, si pulsas fuera cierra */}
        <Pressable style={styles.backdrop} onPress={cerrarEditar} />

        <Animated.View style={[styles.sheet, { transform: [{ translateY: animY }] }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Editar cliente</Text>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={60}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 30 }}
            >
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
                  colorBG="#1a0083ff"
                  colorTxt="#fff"
                  onPressed={guardar}
                />

                <View style={{ height: 10 }} />
                <ButtonRectangular
                  text="Cancelar"
                  colorBG="#fff"
                  colorTxt="#000"
                  colorBorder="#000"
                  onPressed={cerrarEditar}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "80%",

  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  sheetTitle: {
    fontWeight: "700",
    marginBottom: 10,
    fontSize: 16,
  },
});
