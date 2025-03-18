import { useChatStore } from "@/store/useChatStore";
import { useQuery } from "@tanstack/react-query";
import SidebarSceleton from "./ui/SidebarSceleton";
import {
  Users,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "../../types/userType";
import { useState } from "react";
import SidebarActions from "./SidebarActions";

const Sidebar = () => {
  const { getUser, selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [isShowOnlyOnline, setIsShowOnlyOnline] = useState(false);
  const { data: users, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUser(),
  });

  if (isPending) {
    return <SidebarSceleton />;
  }

  const filteredUsers = isShowOnlyOnline
    ? users.filter((user: any) => onlineUsers?.includes(user._id))
    : users;

  return (
    <aside
      className="h-full w-full md:w-72 border-r border-base-300 
  flex flex-col transition-all duration-200"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-2">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium">All Users</span>
        </div>

        {/* <div className="mt-4 flex gap-3 w-full justify-between items-center">
          <label className="hidden lg:block text-sm font-medium text-gray-600">
            Only show online users
          </label>
          <input
            type="checkbox"
            checked={isShowOnlyOnline}
            onChange={() => setIsShowOnlyOnline(!isShowOnlyOnline)}
            className="toggle"
          />
        </div> */}
      </div>

      {/* all users listed here */}

      <div className="overflow-y-auto p-1 lg:p-3 w-full custom-scrollbar">
        {/* Add Users for DM */}

        <SidebarActions />

        {filteredUsers?.length === 0 && (
          <span className="text-accent font-medium">
            No Online Users to Chat
          </span>
        )}
        {filteredUsers?.map((user: User) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
        mb-2 cursor-pointer w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors rounded-md
        ${
          selectedUser?._id === user._id
            ? "bg-base-300 ring-1 ring-base-300"
            : ""
        }
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
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
