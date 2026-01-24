import { useState } from "react";
import { AuthError } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";

export const useLogin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    try {
      await login(email.trim(), password);
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.code === "EMAIL_INVALID" || error.code === "USER_NOT_FOUND") {
          setEmailError(error.message);
          return;
        }

        if (error.code === "PASSWORD_INVALID") {
          setPasswordError(error.message);
          return;
        }
      }

      setPasswordError("No se pudo iniciar sesión");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    login: handleLogin,
  };
};
