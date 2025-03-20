import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Eye,
  EyeClosed,
  LoaderCircle,
  Lock,
  Mail,
  MessageCircleCode,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";

export interface LoginFormData {
  username: string;
  email: string;
  password: string;
}

const Login = () => {
  const { authUser, login, checkAuth, isCheckingAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { isPending, mutate } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("User Logged In");
      navigate(state?.redirectUrl ?? "/", {
        replace: true,
      });
    },
    onError: (error) => {
      toast.error(`${error.message ?? "Failed to login"}`);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    mutate(data);
  };

  if (isCheckingAuth) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="w-full p-6 sm:p-12 flex justify-center items-center bg-base-300">
        <div className="max-w-xl flex flex-col space-y-4 items-center">
          <span className="size-16 bg-accent-content flex items-center justify-center rounded-xl">
            <MessageCircleCode size={32} />
          </span>
          <div className="text-center flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-accent">
              Welcome Back To LumeChat 👋
            </h1>
            <p className="text-sm text-center w-[70%] font-medium">
              We are very happey that you are back, Now just login and Enjoy
            </p>
          </div>

          {/* Social logins */}
          <div className="w-full grid lg:grid-cols-2 gap-4 max-w-sm">
            <button className="cursor-pointer border border-accent-content p-2 rounded-md flex items-center justify-center gap-4 h-12">
              <img
                src="./assets/images/google.png"
                alt="Google Icon"
                width={20}
                height={20}
              />
              <span className="font-medium">Google</span>
            </button>
            <button className="cursor-pointer border border-accent-content p-2 rounded-md flex items-center justify-center gap-4 h-12">
              <img
                src="./assets/images/github.png"
                alt="Github Icon"
                width={20}
                height={20}
                className="invert"
              />
              <span className="font-medium">Github</span>
            </button>
          </div>

          <div className="divider">Or</div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <InputField
              label="Username"
              type="text"
              icon={<User size={16} />}
              placeholder="John Doe"
              register={register("username", {
                required: "Username is required",
                minLength: {
                  value: 8,
                  message: "Username must be at least 8 characters",
                },
              })}
              error={errors.username?.message}
            />

            <InputField
              label="Email"
              type="email"
              icon={<Mail size={16} />}
              placeholder="example@email.com"
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Invalid email",
                },
              })}
              error={errors.email?.message}
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              icon={<Lock size={16} />}
              placeholder="password123"
              register={register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.password?.message}
              toggleIcon={
                showPassword ? <EyeClosed size={16} /> : <Eye size={16} />
              }
              onToggle={() => setShowPassword((prev) => !prev)}
            />

            <button
              disabled={isPending}
              className="btn btn-accent w-full rounded-lg"
            >
              {isPending ? (
                <div className="inline-flex gap-3 items-center">
                  <LoaderCircle className="animate-spin" size={16} />
                  Login Into Your Account...
                </div>
              ) : (
                "Login Into Your Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <span>Don't have an account? </span>
            <Link to="/register" className="btn btn-link text-amber-50">
              Register
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full h-full hidden lg:block">
        <img
          src="/assets/images/authImage.svg"
          alt="authImage"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

const InputField = ({
  label,
  type,
  icon,
  placeholder,
  register,
  error,
  toggleIcon,
  onToggle,
}: any) => (
  <div className="form-control">
    <label className="fieldset-label font-medium">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-10">
          <span className="text-base-content/40">{icon}</span>
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className="input input-success w-full pl-10 rounded-lg"
        {...register}
      />
      {toggleIcon && (
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center"
          onClick={onToggle}
        >
          {toggleIcon}
        </button>
      )}
    </div>
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

export default Login;
