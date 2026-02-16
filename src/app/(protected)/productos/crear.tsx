import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Stack, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { TextInputRectangle } from "@/components/TextInputRectangle";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import {
  createProduct,
  listProductCategories,
} from "@/services/productsService";
import { supabase } from "@/lib/supabase";
import type { CategoriaProducto } from "@/types/Product";

const PRODUCT_IMAGES_BUCKET = "userData";
const fallbackImage = "https://cdn-icons-png.flaticon.com/512/3081/3081559.png";

export default function CrearProductoScreen() {
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [categoriaPickerVisible, setCategoriaPickerVisible] = useState(false);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [activo, setActivo] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const selectedCategoriaNombre = useMemo(
    () => categorias.find((c) => c.id === categoriaId)?.nombre ?? "Selecciona una categoria",
    [categorias, categoriaId]
  );

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        setCategoriasLoading(true);
        const data = await listProductCategories();
        setCategorias(data);
      } catch (e: any) {
        Alert.alert("Error", e?.message || "No se pudieron cargar las categorias");
      } finally {
        setCategoriasLoading(false);
      }
    };

    loadCategorias();
  }, []);

  const resolveImage = (value?: string | null) => {
    if (!value) return fallbackImage;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(value).data.publicUrl;
  };

  const pickAndUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita acceso a las fotos.");
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

    setImageUploading(true);
    try {
      const ext = uri.split(".").pop()?.toLowerCase() || "jpg";
      const contentType =
        ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "image/jpeg";

      const filePath = `productos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const resp = await fetch(uri);
      const arrayBuffer = await resp.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(filePath, arrayBuffer, { contentType, upsert: true });

      if (uploadError) throw uploadError;
      const publicUrl = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filePath).data.publicUrl;
      setImageUrl(publicUrl);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "No se pudo subir la imagen");
    } finally {
      setImageUploading(false);
    }
  };

  const guardarProducto = async () => {
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }
    if (!categoriaId) {
      Alert.alert("Error", "Selecciona una categoria");
      return;
    }

    const precioNum = precio.trim() ? Number(precio) : undefined;
    if (precio.trim() && (!Number.isFinite(precioNum) || (precioNum ?? 0) < 0)) {
      Alert.alert("Error", "El precio debe ser un numero valido");
      return;
    }

    try {
      setIsSaving(true);
      await createProduct({
        categoria_id: categoriaId,
        nombre: nombreLimpio,
        marca: marca.trim() || undefined,
        modelo: modelo.trim() || undefined,
        descripcion: descripcion.trim() || undefined,
        precio: precioNum,
        activo,
        image_url: imageUrl,
      });

      router.replace("/productos");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "No se pudo guardar el producto");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Crear producto" }} />
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Nuevo producto</Text>

            <View style={styles.imageRow}>
              <View style={[styles.previewWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Image source={{ uri: resolveImage(imageUrl) }} style={styles.previewImage} resizeMode="cover" />
              </View>

              <ButtonRectangular
                text={imageUploading ? "Subiendo..." : "Cambiar imagen"}
                colorBG={theme.colors.surface}
                colorTxt={theme.colors.textPrimary}
                colorBorder={theme.colors.border}
                onPressed={pickAndUploadImage}
                widthButton="68%"
              />
            </View>

            <TextInputRectangle placeholder="Nombre" value={nombre} onChangeText={setNombre} autoCapitalize="words" />
            <View style={styles.gap} />

            <TouchableOpacity
              onPress={() => setCategoriaPickerVisible(true)}
              style={[styles.selector, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              disabled={categoriasLoading}
            >
              <Text style={[styles.selectorText, { color: theme.colors.textPrimary }]}>
                {categoriasLoading ? "Cargando categorias..." : selectedCategoriaNombre}
              </Text>
              <Feather name="chevron-down" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.gap} />
            <TextInputRectangle placeholder="Marca" value={marca} onChangeText={setMarca} autoCapitalize="words" />
            <View style={styles.gap} />
            <TextInputRectangle placeholder="Modelo" value={modelo} onChangeText={setModelo} autoCapitalize="words" />
            <View style={styles.gap} />
            <TextInputRectangle placeholder="Descripcion" value={descripcion} onChangeText={setDescripcion} autoCapitalize="sentences" />
            <View style={styles.gap} />
            <TextInputRectangle
              placeholder="Precio"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
            <View style={styles.gap} />

            <Pressable
              onPress={() => setActivo((prev) => !prev)}
              style={[styles.activeRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.activeText, { color: theme.colors.textPrimary }]}>Activo</Text>
              <View style={[styles.activePill, { backgroundColor: activo ? theme.colors.primary : theme.colors.card, borderColor: theme.colors.border }]}
              >
                <Text style={{ color: activo ? theme.colors.primaryContrast : theme.colors.textSecondary, fontFamily: font.display, fontSize: 12 }}>
                  {activo ? "SI" : "NO"}
                </Text>
              </View>
            </Pressable>

            <View style={styles.actions}>
              <ButtonRectangular
                text={isSaving ? "Guardando..." : "Guardar"}
                colorBG={theme.colors.primary}
                colorTxt={theme.colors.primaryContrast}
                onPressed={guardarProducto}
              />
              <View style={{ height: 10 }} />
              <ButtonRectangular
                text="Cancelar"
                colorBG={theme.colors.surface}
                colorTxt={theme.colors.textPrimary}
                colorBorder={theme.colors.border}
                onPressed={() => router.back()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      <Modal transparent visible={categoriaPickerVisible} animationType="fade" onRequestClose={() => setCategoriaPickerVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setCategoriaPickerVisible(false)}>
          <Pressable style={[styles.modalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Selecciona categoria</Text>
            {categoriasLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : (
              <FlatList
                data={categorias}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => {
                  const isSelected = categoriaId === item.id;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setCategoriaId(item.id);
                        setCategoriaPickerVisible(false);
                      }}
                      style={styles.modalItem}
                    >
                      <Text style={[styles.modalItemText, { color: theme.colors.textPrimary }]}>{item.nombre}</Text>
                      {isSelected ? <Feather name="check" size={16} color={theme.colors.primary} /> : null}
                    </TouchableOpacity>
                  );
                }}
                ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: font.display,
    marginBottom: 16,
    alignSelf: "center",
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  previewWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    borderWidth: 1,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  selector: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  selectorText: {
    fontFamily: font.body,
    fontSize: 15,
  },
  gap: {
    marginTop: 14,
  },
  activeRow: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeText: {
    fontFamily: font.body,
    fontSize: 15,
  },
  activePill: {
    minWidth: 42,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  actions: {
    marginTop: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    maxHeight: "65%",
  },
  modalTitle: {
    fontFamily: font.display,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  modalLoading: {
    paddingVertical: 16,
    alignItems: "center",
  },
  modalItem: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  modalItemText: {
    fontFamily: font.body,
    fontSize: 15,
  },
  separator: {
    height: 1,
    width: "100%",
  },
});
