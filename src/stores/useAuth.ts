import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

interface UserAuth {
  id: string;      
  name: string;
  email: string;
  profilePic: string | null;
  role: string;    
}

type Store = {
  user: UserAuth | null;
  login: (user: UserAuth) => void;
  logout: () => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: async () => {
        await axiosInstance.post("/auth/logout");
        set({ user: null });
        window.location.href = "/";
      },
    }),
    { name: "auth" },
  ),
);