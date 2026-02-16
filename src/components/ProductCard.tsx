import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";

interface ProductCardProps {
  title: string;
  price?: number | null;
  description?: string | null;
}

export const ProductCard = ({
  title,
  price,
  description,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState<number>(0);
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  const handleAdd = () => {
    setQuantity(quantity + 1);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
        {typeof price === "number" && Number.isFinite(price) ? (
          <View
            style={[
              styles.pricePill,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {price.toFixed(2)} euro
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description || "Sin descripcion"}</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleAdd}>
        <Text style={[styles.buttonText, { color: theme.colors.primaryContrast }]}>Anadir al carrito</Text>
      </TouchableOpacity>

      <Text style={[styles.quantity, { color: theme.colors.textPrimary }]}>Unidades: {quantity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 18,
    marginBottom: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  pricePill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: font.display,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: font.display,
  },
  description: {
    fontSize: 14,
    fontFamily: font.body,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: {
    fontWeight: "700",
    fontFamily: font.display,
  },
  quantity: {
    fontSize: 14,
    fontFamily: font.body,
  },
});
