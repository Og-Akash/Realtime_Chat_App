import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { User } from "../../../types/userType";

const ContactList = ({ user }: { user: User }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <button
      onClick={() => setSelectedUser(user)}
      className={`
        mb-2 cursor-pointer w-full p-3 flex items-center gap-3 hover:bg-base-300 rounded-md
        ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
        `}
    >
      <div className="relative flex items-center lg:gap-3">
        <img
          className="rounded-full size-12 object-cover"
          src={user.image}
          alt={user.username}
        />
        {onlineUsers?.includes(user._id as any) && (
          <span className="absolute size-3 bg-green-400 ring-1 ring-zinc-900 rounded-full right-0 bottom-0" />
        )}
      </div>
      {/* User info */}
      <div className="block text-left min-w-0">
        <span className="truncate text-accent font-medium">
          {user.username}
        </span>
        <div className="text-base">
          {onlineUsers?.includes(user._id as any) ? "online" : "offline"}
        </div>
      </div>
    </button>
  );
};

export default ContactList;
