import { axiosInstance } from "@/api/axiosInstance";
import { create } from "zustand";
import { User } from "../../types/userType";
import { Message } from "../../types/messageType";
import { useAuthStore } from "./useAuthStore";
import { NavigationType, useSidebarStore } from "./useSidebarStore";

interface ChatStore {
  selectedUser: User | null;
  messages: Message[] | [];
  users: User[] | [];
  setSelectedUser: (user: User) => void;
  clearSelectedUser: () => void;
  getUser: () => Promise<any>;
  getMessages: (userId: string) => Promise<any>;
  sendMessage: (message: FormData) => Promise<any>;
  subscribeToMessages: () => void;
  unSubscribeToMessages: () => void;
  getUserByQuery: (query: string) => Promise<any>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  selectedUser: null,
  messages: [],
  users: [],
  setSelectedUser: (selectedUser: User) => {
    const { navigation } = useSidebarStore.getState();
    if (navigation === NavigationType.Assiestant && selectedUser) {
      useSidebarStore.setState({ navigation: NavigationType.Contacts });
    }
    set({ selectedUser });
  },
  clearSelectedUser: () => set({ selectedUser: null }),
  getUser: async () => {
    const res = await axiosInstance.get("/messages/users");
    set({ users: res });
    return res;
  },

  getMessages: async (userId: string) => {
    const res = await axiosInstance.get(`/messages/${userId}`);
    set({ messages: res });
    return res;
  },
  sendMessage: async (message) => {
    const { selectedUser } = get();
    const res = await axiosInstance.post(
      `/messages/send/${selectedUser?._id}`,
      message,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    set({ messages: [...get().messages, res] });
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket?.on("newMessage", (newMessage) => {
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  getUserByQuery: (query) =>
    axiosInstance.get(`/user/v1/search/${query}`),
}));
