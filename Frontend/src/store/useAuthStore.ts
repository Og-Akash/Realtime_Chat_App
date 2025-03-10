import { create } from "zustand";
import { axiosIntance } from "@/api/axiosIntance";
import { User } from "../../types/userType";
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
  logout: () => Promise<void>;
  uploadImage: (image: FormData) => Promise<any>;
  updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null, //{username: "akash", _id: "sdfsdf", email: "akash@gmail.com", image: "shdfhsdhf"},
  isSigningIn: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const result = await axiosIntance.get("/user/v1/getAuthUser");
      set({ authUser: result.data.user });
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  uploadImage: async (image) =>
    axiosIntance.post("/upload/media", image, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  signUp: async (data: any) => axiosIntance.post("/auth/v1/register", data),
  login: async (data: any) => axiosIntance.post("/auth/v1/login", data),
  logout: async () => axiosIntance.get("/auth/v1/logout"),
  updateProfile: async (data) =>
    axiosIntance.put("/auth/v1/update", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
}));
