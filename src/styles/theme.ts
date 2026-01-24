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
    background: "#f5f6fb",
    surface: "#ffffff",
    card: "#ffffff",
    border: "#e6e9ef",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    primary: "#4f46e5",
    primaryContrast: "#ffffff",
    accent: "#0ea5e9",
    tabBar: "#002374ff",
    tabBarInactive: "#888888",
    header: "#002374ff",
    headerText: "#ffffff",
    error: "#ff0000",
  },
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    background: "#0f172a",
    surface: "#111827",
    card: "#111827",
    border: "#1f2937",
    textPrimary: "#f9fafb",
    textSecondary: "#9ca3af",
    primary: "#818cf8",
    primaryContrast: "#0f172a",
    accent: "#38bdf8",
    tabBar: "#0b1220",
    tabBarInactive: "#94a3b8",
    header: "#0b1220",
    headerText: "#e2e8f0",
    error: "#ff0000",

  },
};

export const getTheme = (mode: ThemeMode) =>
  mode === "dark" ? darkTheme : lightTheme;
