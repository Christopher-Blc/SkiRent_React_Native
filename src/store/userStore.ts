import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserProfile } from "@/types/Users";

type UserState = {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUser: (data: Partial<UserProfile>) => void;
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
