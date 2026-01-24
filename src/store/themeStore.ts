import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeMode } from "@/styles/theme";

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      setMode: (mode) => set({ mode }),
      toggle: () =>
        set({ mode: get().mode === "light" ? "dark" : "light" }),
    }),
    {
      name: "@skirent/theme",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
