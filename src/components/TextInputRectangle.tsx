import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";

interface TextInputRectangleProps {
  placeholder?: string;

  iconLeft?: keyof typeof Feather.glyphMap;

  iconRight?: keyof typeof Feather.glyphMap;
  onPressIconRight?: () => void;

  iconRightShow?: keyof typeof Feather.glyphMap;
  iconRightHide?: keyof typeof Feather.glyphMap;

  isSecure?: boolean;

  iconColor?: string;
  iconSize?: number;

  textColor?: string;
  placeholderColor?: string;
  borderColor?: string;
  bgColor?: string;

  width?: number | `${number}%`;
  height?: number;

  onChangeText?: (text: string) => void;
  value?: string;

  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export const TextInputRectangle = ({
  isSecure = false,

  placeholder = isSecure ? "password" : "input text",
  iconLeft,

  iconRight,
  onPressIconRight,

  iconRightShow = "eye",
  iconRightHide = "eye-off",

  iconColor,
  iconSize = 20,

  textColor,
  placeholderColor,
  bgColor,

  width = "100%",
  height = 60,

  onChangeText,
  value,

  keyboardType = "default",
  autoCapitalize = "sentences",
}: TextInputRectangleProps) => {
  const [hidden, setHidden] = useState(isSecure);
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const resolvedIconColor = iconColor ?? theme.colors.textSecondary;
  const resolvedTextColor = textColor ?? theme.colors.textPrimary;
  const resolvedPlaceholderColor = placeholderColor ?? theme.colors.textSecondary;
  const resolvedBgColor = bgColor ?? theme.colors.surface;

  return (
    <TextInput
      mode="outlined"
      placeholder={placeholder}
      placeholderTextColor={resolvedPlaceholderColor}
      secureTextEntry={isSecure && hidden}
      activeOutlineColor={theme.colors.primary}
      outlineColor={theme.colors.border}
      onChangeText={onChangeText}
      value={value}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      style={[
        styles.input,
        {
          width,
          height,
          color: resolvedTextColor,
          backgroundColor: resolvedBgColor,
        },
      ]}
      contentStyle={{ color: textColor }} 
      theme={{ roundness: 16 }}
      left={
        iconLeft ? (
          <TextInput.Icon
            icon={() => (
              <Feather
                name={iconLeft}
                size={iconSize}
                color={resolvedIconColor}
              />
            )}
          />
        ) : null
      }
      right={
        isSecure ? (
          <TextInput.Icon
            onPress={() => setHidden(!hidden)}
            icon={() => (
              <Feather
                name={hidden ? iconRightShow : iconRightHide}
                size={iconSize}
                color={resolvedIconColor}
              />
            )}
          />
        ) : iconRight ? (
          <TextInput.Icon
            onPress={onPressIconRight}
            icon={() => (
              <Feather
                name={iconRight}
                size={iconSize}
                color={resolvedIconColor}
              />
            )}
          />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    borderRadius: 30,
    paddingLeft: 0,
    outlineColor: "#d0d7e2",
  },
});
