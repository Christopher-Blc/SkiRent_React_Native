import React from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { font } from "@/styles/typography";

type IconProp =
  | { type: "feather"; name: keyof typeof Feather.glyphMap }
  | { type: "google" };

interface ButtonRectangularProps {
  icon?: IconProp;
  text: string;
  colorBG: string;
  colorTxt: string;
  colorBorder?: string;
  colorIcon?: string;
  iconSize?: number;
  widthButton?: number | `${number}%`;
  heightButton?: number | `${number}%`;
  onPressed?: () => void;
}

export const ButtonRectangular = ({
  icon,
  text,
  colorBG,
  colorTxt,
  colorBorder,
  colorIcon = "#ffffff",
  iconSize = 20,
  widthButton = "100%",
  heightButton = 52,
  onPressed,
}: ButtonRectangularProps) => {
  const hasBorder = !!colorBorder;

  const h = typeof heightButton === "number" ? heightButton : 62;
  const iconBoxSize = Math.max(36, Math.min(56, h - 18));
  const iconRadius = Math.max(8, Math.min(12, iconBoxSize * 0.2));

  return (
    <Pressable
      onPress={onPressed}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colorBG,
          width: widthButton,
          height: heightButton,
          borderColor: hasBorder ? colorBorder : "transparent",
          borderWidth: hasBorder ? 1 : 0,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      {/* ZONA 1 — ICONO */}
      <View style={styles.zone1}>
        {icon ? (
          <View
            style={[
              styles.iconBlock,
              {
                backgroundColor: colorBorder
                  ? colorBorder
                  : "rgba(255,255,255,0.18)",
                width: iconBoxSize,
                height: iconBoxSize,
                borderRadius: iconRadius,
              },
            ]}
          >
            {icon.type === "feather" ? (
              <Feather name={icon.name} color={colorIcon} size={iconSize} />
            ) : (
              <AntDesign name="google" color={colorIcon} size={iconSize} />
            )}
          </View>
        ) : null}
      </View>

      {/* ZONA 2 — TEXTO */}
      <View style={styles.zone}>
        <Text style={[styles.buttonText, { color: colorTxt }]}>{text}</Text>
      </View>

      {/* ZONA 3 — VACIA */}
      <View style={styles.zone} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  zone: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  zone1: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start" ,
    paddingLeft: 7
  },
  iconBlock: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: font.display,
    letterSpacing: 0.3,
    textAlign: "center",
  },
});
