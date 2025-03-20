import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { ArrowLeft, Phone, Video } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser,clearSelectedUser } = useChatStore();
  const {onlineUsers,lastSeen} = useAuthStore()
  return (
    <div className="flex justify-between items-center bg-accent-content rounded-md">
      <div className="relative flex items-center gap-3 border-b p-2 border-base-300">
        <button onClick={() => clearSelectedUser()} className="cursor-pointer  text-primary">
          <ArrowLeft size={24} />
        </button>
        <img
          className="rounded-full size-12 object-cover"
          src={selectedUser?.image}
          alt={selectedUser?.username}
        />
        {/* User info */}
        <div className="text-left min-w-0">
          <span className="truncate text-accent font-medium">
            {selectedUser?.username}
          </span>
          <div className="text-sm text-zinc-300">
            {onlineUsers?.includes(selectedUser?._id as any) ? "online" : selectedUser?.lastSeen || lastSeen[selectedUser?._id as any] ?  "Last Seen " + selectedUser?.lastSeen : "offline"}
          </div>
        </div>
      </div>

      {/* Calling */}

      <div className="flex items-center gap-6 mr-4">
        <button className="cursor-pointer hover:text-accent transition-colors duration-200 text-primary">
          <Phone size={24} />
        </button>
        <button className="cursor-pointer hover:text-accent transition-colors duration-200 text-primary">
          <Video size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
