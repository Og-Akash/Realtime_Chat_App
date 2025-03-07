import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import {
  LogOut,
  MessageCircleMoreIcon,
  Settings,
  User2,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../types/userType";

type NavParams = { authUser: User };

const Navbar = ({ authUser }: NavParams) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("User Logged Out");
      navigate("/login", { replace: true });
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });
  return (
    <>
      <div className="navbar max-w-7xl mx-auto bg-base-100 shadow-sm">
        <div className="flex-1 inline-flex gap-3 items-center">
          <MessageCircleMoreIcon
            size={42}
            className="bg-accent-content p-2 rounded-md"
          />
          <Link to="/" className="text-xl font-semibold">
            Chaty
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <div className="inline-flex items-center gap-2">
            <User2 size={22} />
            <span>{authUser?.username}</span>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-md">
                <img
                  width={40}
                  alt="Tailwind CSS Navbar component"
                  src={authUser.image}
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
              <Link
                to="#"
                onClick={() => mutate()}
                className="hover:bg-accent-content p-2 text-base rounded-md inline-flex items-center gap-2"
              >
                <LogOut size={14} className="text-accent" />
                Logout
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
