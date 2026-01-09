import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Card, Button } from "react-native-paper";
import { router } from "expo-router";
import { TextInputRectangle } from "../../../components/TextInputRectangle";
import { ButtonRectangular } from "../../../components/ButtonRectangular";
import { clientesService } from "../../../services/clientsService";

export default function CrearClienteScreen() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const onGuardar = async () => {

    await clientesService.create({
      name: nombre.trim(),
      surname: apellidos.trim(),
      email: email.trim(),
      phoneNumber: telefono.trim(),
      pedidos: [],
    });

    router.back();

  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Crear cliente</Text>

        <View style={styles.form}>
          
          <TextInputRectangle
            placeholder="Nombre"
            iconLeft="user"
            iconRight="edit-2"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />

          <TextInputRectangle
            placeholder="Apellidos"
            iconLeft="users"
            iconRight="edit-2"
            value={apellidos}
            onChangeText={setApellidos}
            autoCapitalize="words"
          />

          <TextInputRectangle
            placeholder="Correo electrónico"
            iconLeft="mail"
            iconRight="at-sign"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInputRectangle
            placeholder="Teléfono"
            iconLeft="phone"
            iconRight="smartphone"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <View style={styles.buttons}>
            <ButtonRectangular
              text="Cancelar"
              icon="x"
              colorBG="#ffffff"
              colorTxt="#374151"
              colorBorder="#d1d5db"
              colorIcon="#374151"
              widthButton={'48%'}
              onPressed={() => router.back()}
            />

            <ButtonRectangular
              text="Guardar"
              icon="check"
              colorBG="#2563eb"
              colorTxt="#ffffff"
              colorIcon="#ffffff"
              onPressed={onGuardar}
              widthButton={'48%'}
            />

          </View>
        </View>
      </Card>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    color: "#111827",
    alignSelf: "center",
  },
  form: {
    gap: 12,
  },
  buttons: {
    marginTop: 6,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
  },
});
