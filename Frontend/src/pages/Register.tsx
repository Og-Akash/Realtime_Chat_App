import Loader from "../components/ui/Loader";
import { useAuthStore } from "@/store/useAuthStore";

const Register = () => {
  const { isCheckingAuth, authUser } = useAuthStore();

  if (isCheckingAuth && !authUser) {
    return <Loader />;
  }

  return (
    <div>
      Register
      <button className="btn btn-accent">Register into your Account</button>
    </div>
  );
};

export default Register;
