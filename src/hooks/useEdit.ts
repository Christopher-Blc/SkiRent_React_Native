import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { Cliente } from "@/types/Clients";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import {
  useCliente,
  useDeleteCliente,
  useUpdateCliente,
} from "@/hooks/queries/useClientes";

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
  const clientId = Array.isArray(id) ? id[0] : id;
  const clientIdStr = clientId ? String(clientId) : "";

  // data cliente
  const {
    data: clienteData,
    isLoading,
    refetch,
  } = useCliente(clientIdStr);
  const updateMutation = useUpdateCliente(clientIdStr);
  const deleteMutation = useDeleteCliente(clientIdStr);

  const cliente: Cliente | null = clienteData ?? null;
  const cargando = !!clientIdStr && isLoading;

  const cargarCliente = async () => {
    if (!clientIdStr) return;
    await refetch();
  };

  // popup editar
  const [editar, setEditar] = useState(false);
  const animY = useRef(new Animated.Value(H)).current;

  // campos
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

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
    setPhoneNumber(cliente.phoneNumber ?? "");
  }, [cliente]);

  const abrirEditar = () => {
    if (!cliente) return;

    setName(cliente.name);
    setSurname(cliente.surname);
    setDisplayName(cliente.displayName ?? cliente.name);
    setEmail(cliente.email);
    setPhoneNumber(cliente.phoneNumber ?? "");

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
      if (!clientIdStr) return;
      await deleteMutation.mutateAsync();
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
      if (!clientIdStr) return;
      await updateMutation.mutateAsync(result.data);
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

  const cambiarAvatar = async () => {
  if (!clientIdStr) return;

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permiso requerido", "Se necesita acceso a tus fotos para cambiar el avatar.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return;

  const uri = result.assets?.[0]?.uri;
  if (!uri) return;

  setAvatarUploading(true);
  try {
    const ext = uri.split(".").pop()?.toLowerCase() || "jpg";
    const contentType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : "image/jpeg";

    const filePath = `clientes/${clientIdStr}/avatar.${ext}`;

    const resp = await fetch(uri);
    const blob = await resp.blob();

    const { error: uploadError } = await supabase.storage
      .from("userData")
      .upload(filePath, blob, { contentType, upsert: true });

    if (uploadError) throw uploadError;

      await updateMutation.mutateAsync({ avatar: filePath });
      await cargarCliente();
    } catch (e: any) {
    const msg = e?.message || e?.error_description || "No se pudo subir la imagen";
    Alert.alert("Error", msg);
  } finally {
    setAvatarUploading(false);
  }
};


  return {
    clientId: clientIdStr,

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
    avatarUploading,

    // borrar
    confirmDeleteVisible,
    openConfirmDelete,
    closeConfirmDelete,
    eliminar,
    confirmarEliminar,

    // guardar
    guardar,

    // avatar
    cambiarAvatar,
  };
}
