import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ButtonRectangular } from "./ButtonRectangular";
import { Feather } from "@expo/vector-icons";
import { TextInputRectangle } from "./TextInputRectangle";
import { useRouter } from "expo-router";
import { Cliente } from "../data/clientes";
import { clientesService } from "../services/clientsService";


export const LoginCard = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validar = async () => {
    let valido = true;

    if (!email.includes("@")) {
      setEmailError("El email no es válido");
      return null;
    } else {
      setEmailError("");
    }

    // Obtener clientes
    const clientes = await clientesService.list();
    const usuario = clientes.find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );

    if (!usuario) {
      setEmailError("El email no existe");
      return null;
    }

    if (usuario.password !== password) {
      setPasswordError("La contraseña no es correcta");
      return null;
    } else {
      setPasswordError("");
    }

    return usuario; 
  };


  // const isAdmin = async () => {
   
  //   const usuario = await validar();
  //   if (!usuario) return;

  //   if (usuario.RolId == 1) {
  //     return true;
  //   }
  //   return false;
      
  // };
  
  const login = async () => {
    const usuario = await validar();
    if (!usuario) return;

    if (usuario.RolId === 1) {
      router.replace("/home"); // admin
    } else {
      router.replace("/customer"); // customer
    }
  };

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
        onChangeText={setEmail}
      />

      {emailError !== "" && (
        <Text style={{ color: "red", alignSelf: "flex-start" }}>
          {emailError}
        </Text>
      )}


      {/* Forgot password row */}
      <View style={styles.passwordRow}>
        <Text style={styles.label}>Contraseña</Text>
        <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
      </View>

      <TextInputRectangle
        iconLeft="lock"
        isSecure={true}
        onChangeText={setPassword}
      />

      {passwordError !== "" && (
        <Text style={{ color: "red", alignSelf: "flex-start" }}>
          {passwordError}
        </Text>
      )}

      <View style={{ marginTop: 20 }} />

      {/* Login button */}
        <ButtonRectangular
          text="Iniciar Sesión"
          colorBG="#4f46e5"
          colorTxt="#ffffff"
          onPressed={login}
        />

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
    width: "90%",
    padding: 16,
    margin: 16,
    backgroundColor: "#d1d7ff4f",
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


function findbyEmail(email: string) {
  throw new Error("Function not implemented.");
}

