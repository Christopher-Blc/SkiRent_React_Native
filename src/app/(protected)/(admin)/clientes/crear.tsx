import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Alert } from "react-native";
import { Card } from "react-native-paper";
import { router } from "expo-router";
import { TextInputRectangle } from "@/components/TextInputRectangle";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import { clientesService } from "@/services/userService";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const telefonoRegex = /^\+?\d{7,15}$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  surname: z.string().min(1, "Los apellidos son obligatorios"),
  email: z.string().min(1, "El email es obligatorio").email("Email no válido"),
  phoneNumber: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(telefonoRegex, "Teléfono no válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatorio")
    .regex(passRegex, "Contraseña Invalida"),
});

type FormValues = z.infer<typeof schema>;

export default function CrearClienteScreen() {
  const [guardando, setGuardando] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  // esto se ejecuta SOLO si el formulario es valido
  const onSubmit = async (data: FormValues) => {
    if (guardando) return;

    try {
      setGuardando(true);

      await clientesService.create({
        name: data.name.trim(),
        RolId: 0,
        surname: data.surname.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber.trim(),
        pedidos: [],
        password: data.password.trim()
      });

      Alert.alert("Cliente creado", "Se ha creado correctamente", [
        { text: "OK", onPress: () => router.replace("/clientes/") },
      ]);
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
    } finally {
      setGuardando(false);
    }
  };

  // si hay errores, opcional: mensaje general
  const onError = () => {
    Alert.alert("Revisa el formulario", "Hay campos con errores");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Nuevo cliente</Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <>
                  <TextInputRectangle
                    placeholder="Nombre"
                    iconLeft="user"
                    iconRight="edit-2"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                  />
                  {errors.name?.message ? (
                    <Text style={styles.errorText}>{errors.name.message}</Text>
                  ) : null}
                </>
              )}
            />

            <Controller
              control={control}
              name="surname"
              render={({ field: { value, onChange } }) => (
                <>
                  <TextInputRectangle
                    placeholder="Apellidos"
                    iconLeft="users"
                    iconRight="edit-2"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                  />
                  {errors.surname?.message ? (
                    <Text style={styles.errorText}>
                      {errors.surname.message}
                    </Text>
                  ) : null}
                </>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <>
                  <TextInputRectangle
                    placeholder="Correo electrónico"
                    iconLeft="mail"
                    iconRight="at-sign"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email?.message ? (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  ) : null}
                </>
              )}
            />

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { value, onChange } }) => (
                <>
                  <TextInputRectangle
                    placeholder="Teléfono"
                    iconLeft="phone"
                    iconRight="smartphone"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                  />
                  {errors.phoneNumber?.message ? (
                    <Text style={styles.errorText}>
                      {errors.phoneNumber.message}
                    </Text>
                  ) : null}
                </>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <>
                  <TextInputRectangle
                    placeholder="Password"
                    iconLeft="lock"
                    iconRight="lock"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                  />
                  {errors.password?.message ? (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  ) : null}
                </>
              )}
            />

            <View style={styles.buttons}>
              <ButtonRectangular
                text="Cancelar"
                icon="x"
                colorBG="#ffffff"
                colorTxt="#374151"
                colorBorder="#d1d5db"
                colorIcon="#374151"
                widthButton={"48%"}
                onPressed={() => router.replace("clientes/")}
              />

              <ButtonRectangular
                text={guardando || isSubmitting ? "Guardando..." : "Guardar"}
                icon="check"
                colorBG="#2563eb"
                colorTxt="#ffffff"
                colorIcon="#ffffff"
                widthButton={"48%"}
                onPressed={handleSubmit(onSubmit, onError)}
                colorBorder="#2563eb"
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
  errorText: {
    color: "red",
    marginLeft: 6,
    marginTop: 4,
  },
});
