import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { Eye, EyeClosed, Lock, Mail, MessageCircleCode } from "lucide-react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

export interface LoginFormData {
  username: string;
  email: string;
  password: string;
}

const Login = () => {
  const { authUser, login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  // If user is authenticated, redirect to home
  if (authUser) {
    return <Navigate to="/" />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <div className="min-h-screen min-w-screen grid lg:grid-cols-2">
      {/* Left side */}
      <div className="w-full space-y-4 p-6 sm:p-12 flex mt-20 justify-center">
        <div className="w-full max-w-xl flex flex-col space-y-2 gap-3 items-center">
          <span className="size-16 bg-accent-content flex items-center justify-center rounded-xl">
            <MessageCircleCode size={32} />
          </span>

          <div className="text-center">
            <h1 className="text-2xl font-bold leading-tight">
              Login Into Account
            </h1>
            <p className="text-sm leading-relaxed">
              Enter Your Details to login into your Account.
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

          {/* Credentials login */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-2 w-96 space-y-4">
              {/* Username */}
              <div className="form-control">
                <label htmlFor="email" className="fieldset-label font-medium">
                  Username
                </label>
                {/* Input Container */}
                <div className="relative">
                  <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail size={16} className="text-base-content/40" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    placeholder="John doe"
                    className="input input-success w-full pl-10"
                    {...register("username", {
                      required: "username is required",          
                    })}
                  />
                </div>
                {/* Error message placed outside the relative container */}
                {errors.username && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </span>
                )}
              </div>
              {/* Email */}
              <div className="form-control">
                <label htmlFor="email" className="fieldset-label font-medium">
                  Email
                </label>
                {/* Input Container */}
                <div className="relative">
                  <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail size={16} className="text-base-content/40" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className="input input-success w-full pl-10"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Email is not valid",
                      },
                    })}
                  />
                </div>
                {/* Error message placed outside the relative container */}
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-control">
                <label
                  htmlFor="password"
                  className="fieldset-label font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-2">
                    <Lock size={16} className="text-base-content/40" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password123"
                    className="input input-success w-full px-10"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    type="button"
                    className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeClosed size={16} className="text-base-content/40" />
                    ) : (
                      <Eye size={16} className="text-base-content/40" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div>
                <button
                  disabled={isLoggingIn}
                  type="submit"
                  className="btn btn-accent w-full text-base-100"
                >
                  {isLoggingIn ? "Login...." : "Login Account"}
                </button>
              </div>
            </div>
          </form>
          <div className="flex items-center">
            <span>Don't have an account? </span>
            <Link to="/register" className="btn btn-link text-amber-50">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Right side */}
      {/* You can add your right side content or image here */}
    </div>
  );
};

export default Login;
