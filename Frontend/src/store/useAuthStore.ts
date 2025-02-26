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
  uploadImage: (image: FormData) => Promise<any>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null, //{username: "akash", _id: "sdfsdf", email: "akash@gmail.com", image: "shdfhsdhf"},
  isSigningIn: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const result = await axiosIntance.get("/user/v1/getAuthUser");
      set({ authUser: result.data });
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
}));
