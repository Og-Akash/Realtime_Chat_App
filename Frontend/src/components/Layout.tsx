import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "./Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import Loader from "./ui/Loader";

const Layout = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);
  console.log("current auth user", authUser);

  if (isCheckingAuth && !authUser) {
    return <Loader />;
  }

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
