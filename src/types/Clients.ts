export type RoleName = "NORMAL" | "ADMIN";

export interface Role {
  id: number;
  name: RoleName;
  description?: string | null;
}

export interface Cliente {
  id: string;
  RolId: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string | null;
  displayName: string;
  avatar?: string | null;
}
