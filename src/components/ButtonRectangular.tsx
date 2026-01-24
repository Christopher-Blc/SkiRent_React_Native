import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

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
  onPressed,
}: ButtonRectangularProps) => {
  const hasBorder = !!colorBorder;

  return (
    <Pressable
      onPress={onPressed}
      style={[
        styles.button,
        {
          backgroundColor: colorBG,
          width: widthButton,
          borderColor: hasBorder ? colorBorder : "transparent",
          borderWidth: hasBorder ? 1 : 0,
        },
      ]}
    >
      {icon?.type === "feather" ? (
        <Feather
          name={icon.name}
          color={colorIcon}
          size={iconSize}
          style={{ marginRight: 12 }}
        />
      ) : null}

      {icon?.type === "google" ? (
        <AntDesign
          name="google"
          color={colorIcon}
          size={iconSize}
          style={{ marginRight: 12 }}
        />
      ) : null}

      <Text style={[styles.buttonText, { color: colorTxt }]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 60,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
