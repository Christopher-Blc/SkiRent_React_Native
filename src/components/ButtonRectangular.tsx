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
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colorBG,
          width: widthButton,
          borderColor: hasBorder ? colorBorder : "transparent",
          borderWidth: hasBorder ? 1 : 0,
          opacity: pressed ? 0.9 : 1,
          transform: [{ translateY: pressed ? 1 : 0 }],
        },
      ]}
    >
      {icon ? (
        <View
          style={[
            styles.iconBlock,
            {
              marginLeft: -10,
              backgroundColor: colorBorder ? colorBorder : "rgba(255,255,255,0.18)",
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

      <Text style={[styles.buttonText, { color: colorTxt }]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 62,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    gap: 12,
  },
  iconBlock: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: font.display,
    letterSpacing: 0.3,
  },
});
