import { axiosIntance } from "@/api/axiosIntance";
import { create } from "zustand";
import toast from "react-hot-toast";
import { User } from "../../types/userType";

interface ChatStore {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
  clearSelectedUser: () => void;
  getUser: () => Promise<any>;
  getMessages: (userId: string) => Promise<any>;
  sendMessage: (message: FormData) => Promise<any>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  selectedUser: null,

  setSelectedUser: (selectedUser: User) => set({ selectedUser }),
  clearSelectedUser: () => set({ selectedUser: null }),
  getUser: async () => axiosIntance.get("/messages/users"),

  getMessages: async (userId: string) =>
    axiosIntance.get(`/messages/${userId}`),
  sendMessage: async (message) => {
    const { selectedUser } = get();
    axiosIntance.post(`/messages/send/${selectedUser?._id}`, message, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
}));
