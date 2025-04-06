import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { Eye, EyeClosed, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/components/ui/Loader";
import MessageIcon from "@/components/icons/Message";
import { ErrorToast, SuccessToast } from "@/components/shared/Toast";

export interface LoginFormData {
  username: string;
  email: string;
  password: string;
}

const Login = () => {
  const { login, isCheckingAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { isPending, mutate } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      SuccessToast("User Logged In");
      navigate(state?.redirectUrl ?? "/", {
        replace: true,
      });
    },
    onError: (error) => {
      ErrorToast(`${error.message ?? "Failed to login"}`);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    mutate(data);
  };

  if (isCheckingAuth) {
    return <Loader />;
  }

  const handleGoogleLogin = () => {
    try {
      window.location.href = `${
        import.meta.env.VITE_BACKEND_URL
      }/auth/v1/google`;
    } catch (error) {
      console.log("Error in google authentication", error);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="w-full p-6 sm:p-12 flex justify-center items-center bg-base-300">
        <div className="max-w-xl flex flex-col space-y-4 items-center">
          <span className="size-16 flex items-center justify-center rounded-xl">
            <MessageIcon />
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
          <div className="w-full grid grid-cols-1 gap-4 max-w-sm">
            <button
              onClick={handleGoogleLogin}
              className="cursor-pointer border border-accent/40 p-2 rounded-md flex items-center justify-center gap-4 h-12"
            >
              <img
                src="./assets/images/google.png"
                alt="Google Icon"
                width={24}
                height={24}
              />
              <span className="font-medium">Continue With Google</span>
            </button>
            {/* <button className="cursor-pointer border border-accent-content p-2 rounded-md flex items-center justify-center gap-4 h-12">
              <img
                src="./assets/images/github.png"
                alt="Github Icon"
                width={20}
                height={20}
                className="invert"
              />
              <span className="font-medium">Github</span>
            </button> */}
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
            <Link to="/register" className="btn btn-link text-accent">
              Register
            </Link>
          </div>
        </div>
      </div>
      <div className="relative w-full h-full hidden lg:block">
        <img
          src="/assets/images/background.jpg"
          alt="authImage"
          className="w-full h-full object-cover"
        />
        <div className="space-y-3 w-full flex justify-center flex-col flex-wrap items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-1/2">
          <h1 className="text-6xl text-accent font-bold">LumeChat</h1>
          <p>
            Lumechat the Powerful Realtime Chat app. Have modern features with
            asesome UI.
          </p>
        </div>
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
        className="input input-accent w-full pl-10 rounded-lg"
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
