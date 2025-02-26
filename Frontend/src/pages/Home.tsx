import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Loader from "@/components/ui/Loader";

const Home = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);
  console.log("current auth user",authUser);

  if (isCheckingAuth && !authUser) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="text-white">{authUser?.email}</h1>
    </div>
  );
};

export default Home;
