import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Loader from "@/components/ui/Loader";

const Home = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);
  console.log(authUser);

  if (isCheckingAuth && !authUser) {
    return <Loader />;
  }

  return (
    <div>
      home
      <h1>{authUser?.username}</h1>
    </div>
  );
};

export default Home;
