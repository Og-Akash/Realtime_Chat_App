import { useChatStore } from "@/store/useChatStore";
import { useQuery } from "@tanstack/react-query";
import SidebarSceleton from "./ui/SidebarSceleton";
import { Users } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "../../types/userType";

const Sidebar = () => {
  const { getUser, selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { data: users, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUser(),
  });

  if (isPending) {
    return <SidebarSceleton />;
  }

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 
  flex flex-col transition-all duration-200"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">All Users</span>
        </div>
        {/* TODO: online players toggler */}
      </div>

      {/* all users listed here */}

      <div className="overflow-y-auto p-1 lg:p-3 w-full">
        {users?.map((user: User) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
        cursor-pointer w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors rounded-md
        ${
          selectedUser?._id === user._id
            ? "bg-base-300 ring-1 ring-base-300"
            : ""
        }
        `}
          >
            <div className="relative mx-auto lg:mx-0 flex items-center lg:gap-3">
              <img
                className="rounded-full size-12 object-cover"
                src={user.image}
                alt={user.username}
              />
              <span className="absolute size-3 bg-green-400 ring-1 ring-zinc-900 rounded-full right-0 bottom-0" />
            </div>
            {/* User info */}
            <div className="hidden lg:block text-left min-w-0">
              <span className="truncate text-accent font-medium">
                {user.username}
              </span>
              <div className="text-sm text-zinc-200">
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
