import { useAuthStore } from "@/store/useAuthStore";
import { NavigationType, useSidebarStore } from "@/store/useSidebarStore";
import { useMutation } from "@tanstack/react-query";
import {
  Brain,
  LogOut,
  Search,
  Settings,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const SideNavbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();
  const { navigation, setNavigation } = useSidebarStore();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("User Logged Out");
      navigate("/login", {
        replace: true,
        state: {
          redirectUrl: window.location.pathname,
        },
      });
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  return (
    <aside className="rounded-lg w-16 h-full bg-base-100 flex flex-col justify-between items-center py-4">
      <div className="space-y-4 text-center">
        <div className="tooltip tooltip-right" data-tip="contacts">
          <button
            onClick={() => setNavigation(NavigationType.Contacts)}
            className={`${navigation === "contacts" && "border-l-4 border-accent"} cursor-pointer hover:bg-accent-content p-2 text-base hover:rounded-md inline-flex items-center gap-2`}
          >
            <UserRoundCheck size={22} className="text-accent" />
          </button>
        </div>

        <div className="tooltip tooltip-right" data-tip="search">
          <button 
          onClick={() => setNavigation(NavigationType.Search)}
          className={`${navigation === "search" && "border-l-4 border-accent"} cursor-pointer hover:bg-accent-content p-2 text-base hover:rounded-md inline-flex items-center gap-2`}>
            <Search size={22} className="text-accent" />
          </button>
        </div>

        <div className="tooltip tooltip-right" data-tip="Assiestant">
          <button 
          onClick={() => setNavigation(NavigationType.Assiestant)}
          className={`${navigation === "assiestant" && "border-l-4 border-accent"} cursor-pointer hover:bg-accent-content p-2 text-base hover:rounded-md inline-flex items-center gap-2`}>
            <Brain size={22} className="text-accent" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="tooltip tooltip-right" data-tip="settings">
          <button
            onClick={() => navigate("/setting")}
            className="cursor-pointer hover:bg-accent-content p-2 text-base rounded-md inline-flex items-center gap-2"
          >
            <Settings size={22} className="text-accent" />
          </button>
        </div>
        <div className="dropdown dropdown-top">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-md">
              <img
                width={40}
                alt="profile-image"
                src={authUser?.image}
                className="rounded-full object-top"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="shoadow-lg shadow-gray-700 menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <Link
              to="/profile"
              className="hover:bg-accent-content p-2 text-base rounded-md inline-flex items-center gap-2"
            >
              <UserRound size={14} className="text-accent" />
              Profile
            </Link>
            <Link
              to="/setting"
              className="hover:bg-accent-content p-2 text-base rounded-md inline-flex items-center gap-2"
            >
              <Settings size={14} className="text-accent" />
              Setting
            </Link>
            <button
              onClick={() => mutate()}
              className="cursor-pointer hover:bg-accent-content p-2 text-base rounded-md inline-flex items-center gap-2"
            >
              <LogOut size={14} className="text-accent" />
              Logout
            </button>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default SideNavbar;
