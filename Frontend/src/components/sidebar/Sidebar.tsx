import { useChatStore } from "@/store/useChatStore";
import { useQuery } from "@tanstack/react-query";
import SidebarSceleton from "../ui/SidebarSceleton";
import { Users } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "../../../types/userType";
import SidebarActions from "../SidebarActions";
import ContactList from "./ContactList";
import { NavigationType, useSidebarStore } from "@/store/useSidebarStore";
import SearchContacts from "./SearchContacts";

const Sidebar = () => {
  const { getUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const {currentFilter} = useSidebarStore();
  const { navigation } = useSidebarStore();

  const { data: users, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUser(),
    staleTime: 60 * 1000,
  });

  if (isPending) {
    return <SidebarSceleton />;
  }

  const filteredUsers = currentFilter
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
      </div>

      {/* all users listed here */}

      <div className="overflow-hidden p-1 lg:p-3 w-full h-full custom-scrollbar">
        {/* Add Users for DM */}

        <SidebarActions />

        {filteredUsers?.length === 0 && (
          <div className="text-accent font-medium">
            No Online Users to Chat
          </div>
        )}

        {(navigation === NavigationType.Contacts ||
          navigation === NavigationType.Assiestant) && (
          <div className="overflow-y-auto h-full custom-scrollbar">
            {filteredUsers?.map((user: User) => (
              <ContactList key={user._id} user={user} />
            ))}
          </div>
        )}

        {navigation === "search" && <SearchContacts />}
      </div>
    </aside>
  );
};

export default Sidebar;
