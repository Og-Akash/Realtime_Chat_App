import { User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "../../types/userType";
import MessageIcon from "./icons/Message";

type NavParams = { authUser: User };

const Navbar = ({ authUser }: NavParams) => {
  return (
    <>
      <div className="navbar max-w-7xl mx-auto bg-base-100 shadow-sm">
        <div className="flex-1 inline-flex gap-3 items-center cursor-pointer">
          <MessageIcon className="size-10"/>
          <Link to="/" className="text-xl font-semibold">
            LumeChat
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden sm:inline-flex items-center gap-2">
            <User2 size={22} />
            <span>{authUser?.username}</span>
          </div>
          <div className="avatar">
            <div className="w-10 rounded-md">
              <img
                width={40}
                alt="profile-image"
                src={authUser.image}
                className="rounded-full object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
