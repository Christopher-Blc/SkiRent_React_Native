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
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {styles } from "@/styles/ProductosEditar.styles";
import { Stack, router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { TextInputRectangle } from "@/components/TextInputRectangle";
import { ButtonRectangular } from "@/components/ButtonRectangular";
import {
  getProductById,
  listProductCategories,
  updateProduct,
} from "@/services/productsService";
import { supabase } from "@/lib/supabase";
import type { CategoriaProducto } from "@/types/Product";
import { font } from "@/styles/typography";

const PRODUCT_IMAGES_BUCKET = "userData";
const fallbackImage = "https://cdn-icons-png.flaticon.com/512/3081/3081559.png";

export default function EditarProductoScreen() {
  const { id } = useLocalSearchParams();
  const productId = Number(Array.isArray(id) ? id[0] : id);

  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

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

  const selectedCategoriaNombre = useMemo(
    () => categorias.find((c) => c.id === categoriaId)?.nombre ?? "Selecciona una categoria",
    [categorias, categoriaId]
  );

  const resolveImage = (value?: string | null) => {
    if (!value) return fallbackImage;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(value).data.publicUrl;
  };

  useEffect(() => {
    const load = async () => {
      if (!Number.isFinite(productId)) {
        Alert.alert("Error", "ID de producto invalido");
        router.back();
        return;
      }

      try {
        setIsLoading(true);
        setCategoriasLoading(true);

        const [item, categories] = await Promise.all([
          getProductById(productId),
          listProductCategories(),
        ]);

        setCategorias(categories);

        if (!item) {
          Alert.alert("No encontrado", "El producto no existe");
          router.back();
          return;
        }

        setNombre(item.nombre ?? "");
        setCategoriaId(item.categoria_id ?? null);
        setMarca(item.marca ?? "");
        setModelo(item.modelo ?? "");
        setDescripcion(item.descripcion ?? "");
        setPrecio(typeof item.precio === "number" ? String(item.precio) : "");
        setActivo(item.activo);
        setImageUrl(item.image_url ?? null);
      } catch (e: any) {
        Alert.alert("Error", e?.message || "No se pudo cargar el producto");
        router.back();
      } finally {
        setCategoriasLoading(false);
        setIsLoading(false);
      }
    };

    load();
  }, [productId]);

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
      await updateProduct(productId, {
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
      <Stack.Screen options={{ title: "Editar producto" }} />
      {isLoading ? (
        <View style={[styles.loadingWrap, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Editar producto</Text>

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
      )}

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
