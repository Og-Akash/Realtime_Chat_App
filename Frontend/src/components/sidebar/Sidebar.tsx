import { useChatStore } from "@/store/useChatStore";
import { useQuery } from "@tanstack/react-query";
import SidebarSceleton from "../ui/SidebarSceleton";
import { Users } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "../../../types/userType";
import { useState } from "react";
import SidebarActions from "../SidebarActions";
import ContactList from "./ContactList";
import { NavigationType, useSidebarStore } from "@/store/useSidebarStore";
import SearchContacts from "./SearchContacts";
import Assiestant from "./Assiestant";

const Sidebar = () => {
  const { getUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [isShowOnlyOnline] = useState(false);
  const { navigation, setNavigation } = useSidebarStore();

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
        </div> 
        */}
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
        {(navigation === NavigationType.Contacts || navigation === NavigationType.Assiestant) && filteredUsers?.map((user: User) => (
          <ContactList key={user._id} user={user} />
        ))}
        {navigation === "search" && (
         <SearchContacts />
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
