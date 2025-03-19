import { useChatStore } from "@/store/useChatStore";
import { Search } from "lucide-react";


const SearchContacts = () => {
  const { users } = useChatStore();
  return (
    <div className="w-full p-2 flex space-y-4 h-full">
      <div className="w-full space-y-2">
        <label className="input input-accent">
          <Search />
          <input
            type="search"
            className="grow"
            placeholder="Search Your Contacts..."
          />
        </label>
        <p className="text-sm font-medium text-accent">
          Your search will appeared here
        </p>

        <div className="overflow-y-auto h-full custom-scrollbar">
          {users.map((user) => (
            <button
              key={user._id}
              className={`
            cursor-pointer w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors rounded-md
            `}
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
