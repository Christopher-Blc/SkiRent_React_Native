import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Cliente } from "@/types/Clients";

type UserState = {
  user: Cliente | null;
  setUser: (user: Cliente) => void;
  updateUser: (data: Partial<Cliente>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (data) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...data } } : state
        ),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "@skirent/user-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
