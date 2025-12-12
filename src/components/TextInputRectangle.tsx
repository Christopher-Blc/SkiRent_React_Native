import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface TextInputRectangleProps {
  placeholder?: string;

  iconLeft?: keyof typeof Feather.glyphMap;
  iconRightShow?: keyof typeof Feather.glyphMap;
  iconRightHide?: keyof typeof Feather.glyphMap;

  isSecure?: boolean;

  iconColor?: string;
  iconSize?: number;
  iconSpacing?: number;

  textColor?: string;
  placeholderColor?: string;
  borderColor?: string;
  bgColor?: string;

  width?: number | `${number}%`;
  height?: number;
}

export const TextInputRectangle = ({
  isSecure = false,

  placeholder = isSecure ? "passowrd" : "input text",
  iconLeft = "mail",
  iconRightShow = "eye",
  iconRightHide = "eye-off",


  iconColor = "#7d7d7d",
  iconSize = 20,
  iconSpacing = 12,

  textColor = "#333333",
  placeholderColor = "#7d7d7d",
  borderColor = "#d0d7e2",
  bgColor = "#f7f9fc",

}: TextInputRectangleProps) => {
  const [hidden, setHidden] = useState(isSecure);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor, borderColor },
      ]}
    >
      {/* Icono izquierdo */}
      {iconLeft && (
        <Feather
          name={iconLeft}
          size={iconSize}
          color={iconColor}
          style={{ marginRight: iconSpacing }}
        />
      )}

      {/* Input */}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        secureTextEntry={isSecure && hidden}
        style={[styles.input, { color: textColor }]}
      />

      {/* Icono mostrar/ocultar contraseña */}
      {isSecure && (
        <TouchableOpacity onPress={() => setHidden(!hidden)}>
          <Feather
            name={hidden ? iconRightShow : iconRightHide}
            size={iconSize}
            color={iconColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 400,
    padding: 16,
    margin: 16,
    elevation: 3,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
