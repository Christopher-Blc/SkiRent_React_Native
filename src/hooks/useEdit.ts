import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { clientesService } from "@/services/userService";
import { Cliente } from "@/types/Clients";

const H = Dimensions.get("window").height;

const telefonoRegex = /^\+?\d{7,15}$/;

const clienteSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  surname: z.string().min(1, "Los apellidos son obligatorios"),
  displayName: z.string().min(1, "El nickname es obligatorio"),
  email: z.string().min(1, "El email es obligatorio").email("Email no válido"),
  phoneNumber: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(telefonoRegex, "Teléfono no válido"),
});

export function useEdit() {
  // id desde la ruta
  const { id } = useLocalSearchParams();
  const clientId = Number(id);

  // data cliente
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarCliente = async () => {
    setCargando(true);
    const c = await clientesService.getById(clientId);
    setCliente(c);
    setCargando(false);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      setCargando(true);
      const c = await clientesService.getById(clientId);
      if (mounted) {
        setCliente(c);
        setCargando(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [clientId]);

  // popup editar
  const [editar, setEditar] = useState(false);
  const animY = useRef(new Animated.Value(H)).current;

  // campos
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // confirmar eliminar
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const openConfirmDelete = () => setConfirmDeleteVisible(true);
  const closeConfirmDelete = () => setConfirmDeleteVisible(false);

  // precargar campos cuando llega el cliente
  useEffect(() => {
    if (!cliente) return;
    setName(cliente.name);
    setSurname(cliente.surname);
    setDisplayName(cliente.displayName ?? cliente.name);
    setEmail(cliente.email);
    setPhoneNumber(cliente.phoneNumber);
  }, [cliente]);

  const abrirEditar = () => {
    if (!cliente) return;

    setName(cliente.name);
    setSurname(cliente.surname);
    setDisplayName(cliente.displayName ?? cliente.name);
    setEmail(cliente.email);
    setPhoneNumber(cliente.phoneNumber);

    setEditar(true);

    animY.setValue(H);
    Animated.timing(animY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const cerrarEditar = () => {
    Animated.timing(animY, {
      toValue: H,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setEditar(false));
  };

  const eliminar = () => {
    openConfirmDelete();
  };

  const confirmarEliminar = async () => {
    closeConfirmDelete();
    try {
      await clientesService.remove(clientId);
      router.replace("/clientes");
    } catch {
      Alert.alert("Error", "No se pudo eliminar el cliente");
    }
  };

  const guardar = async () => {
    if (!cliente) return;

    const result = clienteSchema.safeParse({
      name,
      surname,
      displayName,
      email,
      phoneNumber,
    });

    if (!result.success) {
      Alert.alert("Error", result.error.issues[0].message);
      return;
    }

    try {
      await clientesService.update(clientId, result.data);
      cerrarEditar();
      await cargarCliente();
    } catch (e: any) {
      if (e?.message === "EMAIL_DUPLICADO") {
        Alert.alert("Email duplicado", "Ya existe un cliente con ese email");
        return;
      }

      if (e?.message === "TELEFONO_DUPLICADO") {
        Alert.alert("Teléfono duplicado", "Ya existe un cliente con ese teléfono");
        return;
      }

      Alert.alert("Error", "No se ha podido crear el cliente");
    }
  };

  return {
    clientId,

    // data
    cliente,
    cargando,
    cargarCliente,

    // popup
    editar,
    animY,
    abrirEditar,
    cerrarEditar,

    // campos
    name,
    setName,
    surname,
    setSurname,
    displayName,
    setDisplayName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,

    // borrar
    confirmDeleteVisible,
    openConfirmDelete,
    closeConfirmDelete,
    eliminar,
    confirmarEliminar,

    // guardar
    guardar,
  };
}
