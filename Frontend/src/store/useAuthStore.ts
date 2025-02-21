import { create } from "zustand";
import { axiosIntance } from "@/api/axiosIntance";
import { User } from "../../types/userType";

interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosIntance.get("/auth/v1/authuser");
      set({ authUser: response.data });
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
