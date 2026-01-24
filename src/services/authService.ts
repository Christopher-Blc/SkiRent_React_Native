import AsyncStorage from "@react-native-async-storage/async-storage";
import { clientesService } from "@/services/userService";
import { Cliente, RoleName, roles } from "@/types/Clients";

export type Session = {
  userId: number;
  token: string;
};

export type UserProfile = {
  id: number;
  email: string;
  name: string;
  surname: string;
  role: RoleName;
  displayName: string;
};

export type AuthResult = {
  session: Session;
  user: UserProfile;
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

const roleById = new Map(roles.map((role) => [role.id, role.name]));

const toUserProfile = (cliente: Cliente): UserProfile => {
  const role = roleById.get(cliente.RolId) ?? "NORMAL";
  const displayName = cliente.name;

  return {
    id: cliente.id,
    email: cliente.email,
    name: cliente.name,
    surname: cliente.surname,
    role,
    displayName,
  };
};

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

    const session: Session = {
      userId: usuario.id,
      token: `mock-token-${usuario.id}-${Date.now()}`,
    };

    const result: AuthResult = {
      session,
      user: toUserProfile(usuario),
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

  async getUserById(id: number): Promise<UserProfile | null> {
    const usuario = await clientesService.getById(id);
    return usuario ? toUserProfile(usuario) : null;
  },
};
