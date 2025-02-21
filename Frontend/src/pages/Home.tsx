import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const Home = () => {
  const { authUser, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);
  console.log(authUser);

  return (
    <div>
      home
      <h1>{authUser?.username}</h1>
    </div>
  );
};

export default Home;
