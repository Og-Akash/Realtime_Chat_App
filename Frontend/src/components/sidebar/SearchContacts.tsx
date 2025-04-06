import { useChatStore } from "@/store/useChatStore";
import { useMutation } from "@tanstack/react-query";
import { Search } from "lucide-react";
import SidebarSceleton from "../ui/SidebarSceleton";
import { useEffect, useState } from "react";
import { User } from "../../../types/userType";

const SearchContacts = () => {
  const { getUserByQuery,setSelectedUser } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    mutate,
    data: matchedUsers,
    isPending,
    isError,
    error,
    reset
  } = useMutation({
    mutationFn: () => getUserByQuery(searchQuery),
  });

  useEffect(() => {
    if (!searchQuery.trim()){
      reset()
      return;
    }

    function debouncedSearch() {
      mutate();
    }
    let debouncedTimer = setTimeout(() => debouncedSearch(), 500);

    return () => clearTimeout(debouncedTimer);
  }, [searchQuery]);

  return (
    <div className="w-full p-2 flex space-y-4 h-full">
      <div className="w-full space-y-2">
        <label className="input input-accent">
          <Search />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            className="grow"
            placeholder="Search Your Contacts..."
          />
        </label>

        <div className="overflow-y-auto h-full custom-scrollbar">
          {isPending && <SidebarSceleton />}
          {isError && (
            <span className="text-error font-medium mt-8">
              {error.message ||
                `No user found with the query " ${searchQuery} "`}
            </span>
          )}
          {matchedUsers &&
            matchedUsers.map((user: User) => (
              <button
                key={user._id}
                className={`
            cursor-pointer w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors rounded-md
            `}
            onClick={() => setSelectedUser(user)}
              >
                <div className="relative flex items-center lg:gap-3">
                  <img
                    className="rounded-full size-12 object-cover"
                    src={user.image}
                    alt={user.username}
                  />
                </div>
                {/* User info */}
                <div className="text-left">
                  <span className="truncate text-accent font-medium">
                    {user.username}
                  </span>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchContacts;
