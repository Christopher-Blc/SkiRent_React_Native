import AsyncStorage from "@react-native-async-storage/async-storage";
import { clientesService } from "@/services/userService";
import { Cliente } from "@/types/Clients";

export type Session = {
  userId: number;
  token: string;
};

export type AuthResult = {
  session: Session;
  user: Cliente;
};

export type AuthErrorCode =
  | "EMAIL_INVALID"
  | "USER_NOT_FOUND"
  | "PASSWORD_INVALID";

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

const KEY_SESSION = "auth_session";

export const authService = {
  async login(email: string, password: string): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes("@")) {
      throw new AuthError("EMAIL_INVALID", "El email no es valido");
    }

    const clientes = await clientesService.list();
    const usuario = clientes.find(
      (c) => c.email.toLowerCase() === normalizedEmail
    );

    if (!usuario) {
      throw new AuthError("USER_NOT_FOUND", "El email no existe");
    }

    if (usuario.password !== password) {
      throw new AuthError("PASSWORD_INVALID", "La contrasena no es correcta");
    }

    const nickname = `${usuario.name} ${usuario.surname}`.trim();
    if (usuario.displayName !== nickname) {
      const actualizado = await clientesService.update(usuario.id, {
        displayName: nickname,
      });
      if (actualizado) {
        usuario.displayName = actualizado.displayName;
      }
    }

    const session: Session = {
      userId: usuario.id,
      token: `mock-token-${usuario.id}-${Date.now()}`,
    };

    const result: AuthResult = {
      session,
      user: usuario,
    };

    // persistir sesión
    await AsyncStorage.setItem(KEY_SESSION, JSON.stringify(result.session));

    return result;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(KEY_SESSION);
  },

  async restoreSession(): Promise<Session | null> {
    const raw = await AsyncStorage.getItem(KEY_SESSION);
    if (!raw) return null;

    try {
      const session = JSON.parse(raw) as Session;
      if (!session?.userId || !session?.token) return null;
      return session;
    } catch {
      await AsyncStorage.removeItem(KEY_SESSION);
      return null;
    }
  },

  async getUserById(id: number): Promise<Cliente | null> {
    const usuario = await clientesService.getById(id);
    return usuario ?? null;
  },
};
