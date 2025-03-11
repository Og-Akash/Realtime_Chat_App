import { axiosIntance } from "@/api/axiosIntance";
import { create } from "zustand";
import toast from "react-hot-toast";
import { User } from "../../types/userType";

interface ChatStore {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
  getUser: () => Promise<any>;
  getMessages: (userId: string) => Promise<any>;
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedUser: null,

  setSelectedUser: (selectedUser: User) => set({ selectedUser }),
  getUser: async () => axiosIntance.get("/messages/users"),

  getMessages: async (userId: string) => axiosIntance.get(`/messages/${userId}`),
}));
