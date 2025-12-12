import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ButtonRectangular } from "./ButtonRectangular";
import { Feather } from "@expo/vector-icons";
import { TextInputRectangle } from "./TextInputRectangle";

//para este he gastado un poco el chat y para lo de password tamb pero lo demas
//si que es picado por mi
export const LoginCard = () => {
  return (
    <View style={styles.card}>

      {/* Top Icon */}
      <View style={styles.lockCircle}>
        <Feather name="lock" size={34} color="#5a4ff7" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Bienvenido</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Introduce tus credenciales para continuar
      </Text>

      {/* Email label */}
      <Text style={styles.label}>Correo Electrónico</Text>

      <TextInputRectangle
        placeholder="nombre@ejemplo.com"
        iconLeft="mail"
      />


      {/* Forgot password row */}
      <View style={styles.passwordRow}>
        <Text style={styles.label}>Contraseña</Text>
        <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
      </View>

      <TextInputRectangle
        iconLeft="lock"
        isSecure={true}
      />

      {/* Login button */}
      <View style={{ marginTop: 20 }}>
        <ButtonRectangular
          text="Iniciar Sesión"
          colorBG="#4f46e5"
          colorTxt="#ffffff"
        />
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>O continúa con</Text>
        <View style={styles.divider} />
      </View>

      {/* Google button */}
      <ButtonRectangular
        text="Google"
        icon="globe"
        iconSize={20}
        colorBG="#ffffff"
        colorTxt="#374151"
        colorBorder="#d1d5db"
        colorIcon="#ea4335"
      />

      {/* Bottom text */}
      <Text style={styles.bottomText}>
        ¿No tienes una cuenta? <Text style={styles.register}>Regístrate ahora</Text>
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "30%",
    padding: 16,
    margin: 16,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,

  },

  lockCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ebe9ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 6,
  },

  passwordRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  forgot: {
    color: "#4f46e5",
    fontWeight: "600",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },

  dividerText: {
    color: "#6b7280",
    marginHorizontal: 10,
  },

  bottomText: {
    marginTop: 18,
    color: "#6b7280",
  },

  register: {
    color: "#4f46e5",
    fontWeight: "600",
  },
});
