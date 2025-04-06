import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "./Navbar";
import { Navigate, Outlet } from "react-router-dom";


const Layout = () => {
  const { authUser} = useAuthStore();

  if (!authUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          redirectUrl: window.location.pathname,
        }}
      />
    );
  }

  return (
    <main>
      <Navbar authUser={authUser}/>
      <div>
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
