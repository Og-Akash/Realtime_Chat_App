import { create } from "zustand";
import { axiosIntance } from "@/api/axiosIntance";
import { User } from "../../types/userType";
import toast from "react-hot-toast";
import { RegisterFormData } from "@/pages/Register";
import { LoginFormData } from "@/pages/Login";

interface AuthState {
  authUser: User | null;
  isSigningIn: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: RegisterFormData) => Promise<void>;
  login: (data: LoginFormData) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningIn: false,
  isLoggingIn: false,
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

  signUp: async (data: any) => {
    set({ isSigningIn: true });
    try {
      const response = await axiosIntance.post("/auth/v1/register", data);
      console.log(response);
      set({ authUser: response.data });
      toast.success("User Registration Successful");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message ?? "Failed to Register");
    } finally {
      set({ isSigningIn: false });
    }
  },
  login: async (data: any) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosIntance.post("/auth/v1/login", data);
      console.log(response);
      set({ authUser: response.data });
      toast.success("User Login Successful");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Login");
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));
