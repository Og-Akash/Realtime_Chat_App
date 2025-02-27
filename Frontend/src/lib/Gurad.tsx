import Loader from "@/components/ui/Loader";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

const Guard = ({ children }: { children: React.ReactNode }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  // Prevent rendering while checking auth
  if (isCheckingAuth) return <Loader />;

  // Redirect to home if user is authenticated
  return authUser ? <Navigate to="/" replace /> : children;
};

export default Guard;
