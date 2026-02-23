import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { getProduct } from "@/services/productsService";
import type { Producto } from "@/types/Product";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

const PRODUCT_IMAGES_BUCKET = "userData";
const fallbackImage = "https://cdn-icons-png.flaticon.com/512/3081/3081559.png";

//Pagina con lista de productos
export default function ProductosListScreen() {
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const resolveImage = (value?: string | null) => {
    if (!value) return fallbackImage;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(value).data.publicUrl;
  };

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const data = await getProduct();
      setProductos(data ?? []);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: theme.colors.textSecondary }]}>Catalogo</Text>

        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Listado de productos</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push("/productos/crear")}
          >
            <Feather name="plus" size={16} color={theme.colors.primaryContrast} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Crea y edita productos con imagen</Text>
      </View>

      {isLoading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>Cargando...</Text>
        </View>
      ) : hasError ? (
        <View style={styles.stateWrap}>
          <Feather name="alert-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>No se pudieron cargar los productos.</Text>
        </View>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductCard
              image={resolveImage(item.image_url)}
              title={item.nombre}
              price={item.precio ?? null}
              description={item.descripcion ?? null}
              onEdit={() => router.push(`/productos/editar/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  kicker: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
    fontFamily: font.display,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.2,
    fontFamily: font.display,
    flex: 1,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: font.body,
  },
  listContent: {
    paddingBottom: 24,
  },
  stateWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stateText: {
    fontSize: 14,
    fontFamily: font.body,
  },
});
