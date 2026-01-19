import { Cliente, clientes } from "@/data/clientes";

let clientesDb: Cliente[] = [...clientes];

const nextId = () =>
  clientesDb.length ? Math.max(...clientesDb.map((c) => c.id)) + 1 : 1;

export const clientesService = {
  async list(): Promise<Cliente[]> {
    return [...clientesDb];
  },

  async getById(id: number): Promise<Cliente | null> {
    return clientesDb.find((c) => c.id === id) ?? null;
  },

  async create(data: Omit<Cliente, "id">): Promise<Cliente> {
    // comprobar que email y telefono sean unicos
    if (clientesDb.some((c) => c.email === data.email)) {
      throw new Error("EMAIL_DUPLICADO");
    }

    if (clientesDb.some((c) => c.phoneNumber === data.phoneNumber)) {
      throw new Error("TELEFONO_DUPLICADO");
    }

    const nuevo: Cliente = { id: nextId(), ...data };
    clientesDb = [nuevo, ...clientesDb];
    return nuevo;
  },

  async findByEmail(email: string): Promise<Cliente | null> {
    return clientesDb.find((c) => c.email === email) ?? null;
  },

  async update(
    id: number,
    data: Partial<Omit<Cliente, "id">>
  ): Promise<Cliente | null> {

    //comprobar que el cliente existe
    const actual = clientesDb.find(c => c.id === id);
    if (!actual) return null;

    //email duplicado (si se está cambiando y otro lo tiene)
    if (
      data.email &&
      clientesDb.some(c => c.id !== id && c.email === data.email)
    ) {
      throw new Error("EMAIL_DUPLICADO");
    }

    //teléfono duplicado (si se está cambiando y otro lo tiene)
    if (
      data.phoneNumber &&
      clientesDb.some(c => c.id !== id && c.phoneNumber === data.phoneNumber)
    ) {
      throw new Error("TELEFONO_DUPLICADO");
    }

    //actualizar
    clientesDb = clientesDb.map(c => (c.id === id ? { ...c, ...data } : c));

    return clientesDb.find(c => c.id === id) ?? null;
  },


  async remove(id: number): Promise<boolean> {
    const before = clientesDb.length;
    clientesDb = clientesDb.filter((c) => c.id !== id);
    return clientesDb.length !== before;
  },
};
