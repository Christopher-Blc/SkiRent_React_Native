import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { useTranslation } from "react-i18next"; 

interface ProductCardProps {
  image?: string | null;
  title: string;
  price?: number | null;
  description?: string | null;
  onEdit?: () => void;
}

export const ProductCard = ({ image, title, price, description, onEdit }: ProductCardProps) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState<number>(0);
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  const handleAdd = () => {
    setQuantity(quantity + 1);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={[styles.imageWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {onEdit ? (
          <TouchableOpacity
            onPress={onEdit}
            style={[styles.editButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          >
            <Feather name="edit-2" size={14} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
        <Image
          source={{
            uri:
              image ??
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.image}
          resizeMode="repeat"
        />
      </View>

      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>

        {typeof price === "number" && Number.isFinite(price) ? (
          <View style={[styles.pricePill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.price, { color: theme.colors.primary }]}>{price.toFixed(2)} euro</Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
        {description || t("noDescription")}
      </Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleAdd}>
        <Text style={[styles.buttonText, { color: theme.colors.primaryContrast }]}>{t("addToCart")}</Text>
      </TouchableOpacity>

      <Text style={[styles.quantity, { color: theme.colors.textPrimary }]}>{t("units")} {quantity}</Text>
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
  imageWrap: {
    width: "100%",
    height:300,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
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
