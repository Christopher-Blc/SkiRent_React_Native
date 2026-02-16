import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { getProduct } from "@/services/productsService";
import type { Producto } from "@/types/Product";
import { ProductCard } from "@/components/ProductCard";

export default function Productos() {
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await getProduct();
        if (isMounted) {
          setProductos((data ?? []).filter((producto) => producto.activo));
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: theme.colors.textSecondary }]}>Catalogo</Text>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Listado de productos</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Explora el inventario disponible y anade articulos a tu carrito
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>Cargando...</Text>
        </View>
      ) : hasError ? (
        <View style={styles.stateWrap}>
          <Feather name="alert-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}
          >
            No se pudieron cargar los productos. Intenta mas tarde.
          </Text>
        </View>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductCard
              title={item.nombre}
              price={item.precio ?? null}
              description={item.descripcion ?? null}
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.2,
    fontFamily: font.display,
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
