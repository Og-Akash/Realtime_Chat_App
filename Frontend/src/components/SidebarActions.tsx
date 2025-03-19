import { useChatStore } from "@/store/useChatStore";
import { FilterType, useSidebarStore } from "@/store/useSidebarStore";
import {
  ArrowDownWideNarrow,
  CheckCircle2Icon,
  Edit,
  Search,
  UserRoundCheck,
  UserRoundX,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";

const SidebarActions = () => {
  const {setFilter,currentFilter} = useSidebarStore()

  return (
    <div className="w-full h-8 flex justify-end items-center gap-3">
      <ConverSationModal />

      <div className="dropdown dropdown-end">
        <div
          tabIndex={1}
          className="transition-colors duration-200 hover:bg-accent-content/40 hover:text-base-100 cursor-pointer p-2 rounded-full"
        >
          <ArrowDownWideNarrow />
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          <button onClick={() => setFilter(FilterType.Online)} className={`${currentFilter === FilterType.Online && "bg-accent/40"} cursor-pointer hover:bg-accent-content hover:text-accent p-2 text-base rounded-md inline-flex items-center gap-2`}>
            <CheckCircle2Icon size={16} className="text-accent" />
            online
          </button>
          <button className="cursor-pointer hover:bg-accent-content hover:text-accent p-2 text-base rounded-md inline-flex items-center gap-2">
            <UserRoundCheck size={16} className="text-accent" />
            Contacts
          </button>
          <button className="cursor-pointer hover:bg-accent-content hover:text-accent p-2 text-base rounded-md inline-flex items-center gap-2">
            <UserRoundX size={16} className="text-accent" />
            Not Contacts
          </button>
          <button className="cursor-pointer hover:bg-accent-content hover:text-accent p-2 text-base rounded-md inline-flex items-center gap-2">
            <Users size={16} className="text-accent" />
            Groups
          </button>
        </ul>
      </div>
    </div>
  );
};

export default SidebarActions;

function ConverSationModal() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const { users } = useChatStore();
  const [searchContact, setSearchContact] = useState("");

  const handleShowModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const filteredUsers =
    searchContact.length > 0
      ? users.filter((user) => user.username.toLowerCase().includes(searchContact.toLowerCase()))
      : users;

  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        onClick={handleShowModal}
        className="transition-colors duration-200 hover:bg-accent-content/40 hover:text-base-100 cursor-pointer p-2 rounded-full"
      >
        <Edit />
      </button>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Start Conversation</h3>
          <label className="input w-full mt-6">
            <Search />
            <input
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              type="search"
              className="grow"
              placeholder="Search Yourr Contacts"
            />
          </label>

          {/* All the contacts */}

          <div className="w-full mt-5 max-h-72 overflow-y-auto">
            {filteredUsers.map((user) => (
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
      </dialog>
    </>
  );
}
