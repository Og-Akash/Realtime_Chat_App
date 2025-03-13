import { create } from "zustand";
import { axiosInstance } from "@/api/axiosInstance";
import { AuthUser, User } from "../../types/userType";
import { RegisterFormData } from "@/pages/Register";
import { LoginFormData } from "@/pages/Login";
import { io, Socket } from "socket.io-client";

interface AuthState {
  authUser: User | null;
  isSigningIn: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  onlineUsers: User[] | null;
  lastSeen: { [key: string]: string }; // add last seen user timestamps here
  socket: Socket | null;
  checkAuth: () => Promise<void>;
  signUp: (data: RegisterFormData) => Promise<void>;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  uploadImage: (image: FormData) => Promise<any>;
  updateProfile: (data: any) => Promise<void>;
  connectSocket: () => void; // add socket connection logic here
  disconnectSocket: () => void; // add socket disconnection logic here
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null, //{username: "akash", _id: "sdfsdf", email: "akash@gmail.com", image: "shdfhsdhf"},
  isSigningIn: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  onlineUsers: [],
  lastSeen: {},
  socket: null,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const result = await axiosInstance.get<{user:AuthUser}>("/user/v1/getAuthUser");
      set({ authUser: result.user });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  uploadImage: async (image) =>
    axiosInstance.post("/upload/media", image, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  signUp: async (data: any) => {
    await axiosInstance.post("/auth/v1/register", data);
    get().connectSocket();
  },
  login: async (data: any) => {
    await axiosInstance.post("/auth/v1/login", data);
    get().connectSocket();
  },
  logout: async () => {
    await axiosInstance.get("/auth/v1/logout");
    get().disconnectSocket();
  },
  updateProfile: async (data) =>
    axiosInstance.put("/auth/v1/update", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  //* socket functions

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_BACKEND,{
      query: {
        userId: authUser._id
      }
    });
    socket.connect();
    set({socket})

    socket.on("getOnlineUsers", (userIds)=>{
      set({onlineUsers: userIds})
    })

    //? listening to last seen event
    socket.on("user:last-seen", ({userId,lastSeen}) =>{
      set((state) => ({
        lastSeen:{
          ...state.lastSeen,
          [userId]: lastSeen
        }
      }))
    })
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
