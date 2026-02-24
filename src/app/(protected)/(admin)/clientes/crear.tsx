import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Alert } from "react-native";
import { Card } from "react-native-paper";
import { router } from "expo-router";
import { TextInputRectangle } from "@/components/TextInputRectangle";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { useCreateCliente } from "@/hooks/queries/useClientes";
import { useTranslation } from "react-i18next";

const telefonoRegex = /^\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function CrearClienteScreen() {
  // Estado visual de guardado para evitar doble envio.
  const { t } = useTranslation();
  const [guardando, setGuardando] = useState(false);
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const createMutation = useCreateCliente();
  // Esquema de validacion del formulario.
  const schema = z.object({
    name: z.string().min(1, t("nameRequired")),
    surname: z.string().min(1, t("surnameRequired")),
    displayName: z.string().min(1, t("nicknameRequired")),
    email: z.string().min(1, t("emailRequired")).regex(emailRegex, t("invalidEmail")),
    phoneNumber: z
      .string()
      .min(1, t("phoneRequired"))
      .regex(telefonoRegex, t("invalidPhone")),
  });
  type FormValues = z.infer<typeof schema>;

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
      displayName: "",
      email: "",
      phoneNumber: "",
    },
  });

  // esto se ejecuta SOLO si el formulario es valido
  const onSubmit = async (data: FormValues) => {
    if (guardando) return;

    try {
      setGuardando(true);

      const nickname = data.displayName.trim();

      await createMutation.mutateAsync({
        name: data.name.trim(),
        surname: data.surname.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber.trim(),
        displayName: nickname,
        RolId: 1,
      });

      Alert.alert(t("clientCreatedTitle"), t("clientCreatedMessage"), [
        { text: "OK", onPress: () => router.replace("/clientes") },
      ]);
    } catch (e: any) {
      if (e?.message === "EMAIL_DUPLICADO") {
        Alert.alert(t("duplicateEmailTitle"), t("duplicateEmailMessage"));
        return;
      }

      if (e?.message === "TELEFONO_DUPLICADO") {
        Alert.alert(t("duplicatePhoneTitle"), t("duplicatePhoneMessage"));
        return;
      }

      const msg = e?.message || t("saveClientFailed");
      Alert.alert(t("error"), msg);
    } finally {
      setGuardando(false);
    }
  };

  // si hay errores, opcional: mensaje general
  const onError = () => {
    Alert.alert(t("reviewFormTitle"), t("formHasErrorsMessage"));
  };

  return (
    // Contenedor con formulario de alta de cliente.
    <ScrollView contentContainerStyle={{ backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Card style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t("newClient")}</Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <>
                  <TextInputRectangle
                    placeholder={t("name")}
                    iconLeft="user"
                    iconRight="edit-2"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                  />
                  {errors.name?.message ? (
                    <Text style={[styles.errorText, { color: "#ef4444" }]}>{errors.name.message}</Text>
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
                    placeholder={t("surname")}
                    iconLeft="users"
                    iconRight="edit-2"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                  />
                  {errors.surname?.message ? (
                    <Text style={[styles.errorText, { color: "#ef4444" }]}>
                      {errors.surname.message}
                    </Text>
                  ) : null}
                </>
              )}
            />

            <Controller
              control={control}
              name="displayName"
              render={({ field: { value, onChange } }) => (
                <>
                  <TextInputRectangle
                    placeholder={t("nickname")}
                    iconLeft="tag"
                    iconRight="edit-2"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                  />
                  {errors.displayName?.message ? (
                    <Text style={[styles.errorText, { color: "#ef4444" }]}>
                      {errors.displayName.message}
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
                    placeholder={t("email")}
                    iconLeft="mail"
                    iconRight="at-sign"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email?.message ? (
                    <Text style={[styles.errorText, { color: "#ef4444" }]}>{errors.email.message}</Text>
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
                    placeholder={t("phoneNumber")}
                    iconLeft="phone"
                    iconRight="smartphone"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                  />
                  {errors.phoneNumber?.message ? (
                    <Text style={[styles.errorText, { color: "#ef4444" }]}>
                      {errors.phoneNumber.message}
                    </Text>
                  ) : null}
                </>
              )}
            />

            <View style={styles.buttons}>
              <ButtonRectangular
                text={t("cancel")}
                icon={{ type: "feather", name: "x" }}
                colorBG={theme.colors.surface}
                colorTxt={theme.colors.textPrimary}
                colorBorder={theme.colors.border}
                colorIcon={theme.colors.textPrimary}
                widthButton={"48%"}
                onPressed={() => router.replace("/clientes")}
              />

              <ButtonRectangular
                text={guardando || isSubmitting ? t("savingProgress") : t("save")}
                icon={{ type: "feather", name: "check" }}
                colorBG={theme.colors.primary}
                colorTxt={theme.colors.primaryContrast}
                colorIcon={theme.colors.primaryContrast}
                widthButton={"48%"}
                onPressed={handleSubmit(onSubmit, onError)}
                colorBorder={theme.colors.primary}
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
    padding: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  card: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: font.display,
    marginBottom: 16,
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
    marginLeft: 6,
    marginTop: 4,
    fontFamily: font.body,
  },
});
