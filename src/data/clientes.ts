
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
  id: number;
  RolId: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  pedidos: string[];
  password: string;
}



export const clientes: Cliente[] = [
  {
    id: 1,
    RolId: roles[0].id,
    name: "Christopher",
    surname: "Bolocan",
    email: "chris.bolocan@gmail.com",
    phoneNumber: "+34641251848",
    pedidos: ["Pedido A", "Pedido B"],
    password:"Chris2006"
  },
  {
    id: 2,
    RolId: roles[1].id,
    name: "María",
    surname: "Martínez",
    email: "Martinez.maria@gmail.com",
    phoneNumber: "+34641251849",
    pedidos: ["Pedido C"],
    password:"Maria2006"
  },
  {
    id: 3,
    RolId: roles[1].id,
    name: "Sharon",
    surname: "Bolocan",
    email: "sharon.bolocan@gmail.com",
    phoneNumber: "+34641251849",
    pedidos: ["Pedido C"],
    password:"Maria2006"
  },
  {
    id: 4,
    RolId: roles[1].id,
    name: "ioan",
    surname: "bolocan",
    email: "ioan.bolocan@gmail.com",
    phoneNumber: "+34641251849",
    pedidos: ["Pedido C"],
    password:"Maria2006"
  },
  {
    id: 5,
    RolId: roles[1].id,
    name: "maman",
    surname: "bolocan",
    email: "maman.bolocan@gmail.com",
    phoneNumber: "+34641251849",
    pedidos: ["Pedido C"],
    password:"Maria2006"
  },
];
