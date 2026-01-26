import { Platform } from "react-native";

export const font = {
  display: Platform.select({
    ios: "Avenir Next",
    android: "sans-serif-medium",
    default: "System",
  }),
  body: Platform.select({
    ios: "Avenir Next",
    android: "sans-serif",
    default: "System",
  }),
};
