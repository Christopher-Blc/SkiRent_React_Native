export type ThemeMode = "light" | "dark";

export type Theme = {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    card: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    primaryContrast: string;
    accent: string;
    tabBar: string;
    tabBarInactive: string;
    header: string;
    headerText: string;
    error: string,

  };
};

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    background: "#eef2f6",
    surface: "#f6f8fb",
    card: "#ffffff",
    border: "#e3e7ee",
    textPrimary: "#0b1220",
    textSecondary: "#5b6b82",
    primary: "#2a8bf2",
    primaryContrast: "#ffffff",
    accent: "#00c2ff",
    tabBar: "#ffffff",
    tabBarInactive: "#8ea0b8",
    header: "#ffffff",
    headerText: "#0b1220",
    error: "#ef4444",
  },
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    background: "#0a0f1f",
    surface: "#0f172a",
    card: "#111827",
    border: "#1f2a44",
    textPrimary: "#f8fafc",
    textSecondary: "#9fb0c8",
    primary: "#4aa3ff",
    primaryContrast: "#0a0f1f",
    accent: "#27c7ff",
    tabBar: "#0f172a",
    tabBarInactive: "#73839a",
    header: "#0f172a",
    headerText: "#f8fafc",
    error: "#ef4444",

  },
};

export const getTheme = (mode: ThemeMode) =>
  mode === "dark" ? darkTheme : lightTheme;
