import { useState } from "react";
import { useRouter } from "expo-router";
import { clientesService } from "@/services/clientsService";

export const useLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validar = async () => {
    if (!email.includes("@")) {
      setEmailError("El email no es válido");
      return null;
    }

    setEmailError("");

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
    }

    setPasswordError("");

    return usuario;
  };

  const login = async () => {
    const usuario = await validar();
    if (!usuario) return;

    if (usuario.RolId === 1) {
      router.replace("/home"); // admin
    } else {
      router.replace("/customers"); // customer
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    login,
  };
};
