export type RoleName = 'NORMAL' | 'ADMIN';

export interface Role {
    id: number;
    name: RoleName;
    description?: string;
}

export const roles: Role[] = [
    { id: 1, name: 'NORMAL', description: 'Standard user' },
    { id: 2, name: 'ADMIN', description: 'System administrator' },
];

export interface Cliente {
  id: string;
  RolId: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string | null;
  displayName: string;
  avatar?: string | null;
  pedidos?: string[];

}

