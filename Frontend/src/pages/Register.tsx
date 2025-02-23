import ImageDropzone from "@/components/Dropzone";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Eye,
  EyeClosed,
  Lock,
  Mail,
  MessageCircleCode,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  image: FileList;
}

const Register = () => {
  const { authUser, signUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authUser) {
      <Navigate to="/" />;
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = (data: RegisterFormData) => {
    signUp({...data, image: data.image[0]});
    // console.log({...data, image: data.image[0]});
  };

  return (
    <div className="min-h-screen min-w-screen grid lg:grid-cols-2">
      {/* Left side */}

      <div className="w-full space-y-4 p-6 sm:p-12 flex justify-center">
        {/* Logo */}

        <div className="w-full max-w-xl flex flex-col space-y-2 gap-3 items-center">
          <span className="size-16 bg-accent-content flex items-center justify-center rounded-xl">
            <MessageCircleCode size={32} />
          </span>

          <div className="text-center">
            <h1 className="text-2xl font-bold leading-tight">
              Sign Up Account
            </h1>
            <p className="text-sm leading-relaxed">
              Enter Your Details to Create your Account.
            </p>
          </div>

          {/* Social logins */}
          <div className="w-full grid lg:grid-cols-2 gap-4 max-w-sm">
            <button className="cursor-pointer border border-accent-content p-2 rounded-md flex items-center justify-center gap-4 h-12">
              <img
                src="./assets/images/google.png"
                alt="googleIcon"
                width={20}
                height={20}
              />
              <span className="font-medium">Google</span>
            </button>
            <button className="cursor-pointer border border-accent-content p-2 rounded-md flex items-center justify-center gap-4 h-12">
              <img
                src="./assets/images/github.png"
                alt="googleIcon"
                width={20}
                height={20}
                className="invert"
              />
              <span className="font-medium">Github</span>
            </button>
          </div>

          {/* Credentials login */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-2 w-96 space-y-1">
              <div className="form-control">
                <label htmlFor="" className="fieldset-label font-medium">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-2">
                    <User size={16} className="text-base-content/40" />
                  </div>
                  <input
                    type="Username"
                    placeholder="John Doe"
                    className="input input-success w-full pl-10"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 8,
                        message: "username must be at least 8 characters",
                      },
                    })}
                  />
                </div>
                {errors.username && (
                  <span className="text-red-500 text-sm">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="" className="fieldset-label font-medium">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-2">
                    <Mail size={16} className="text-base-content/40" />
                  </div>
                  <input
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
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="" className="fieldset-label font-medium">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-2">
                    <Lock size={16} className="text-base-content/40" />
                  </div>
                  <input
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

              <div className="form-control">
                <label htmlFor="" className="fieldset-label font-medium">
                  Profile Image
                </label>
                <div className="relative">
                  {/* <ImageDropzone<RegisterFormData>
                    onImageUpload={(file) =>
                      console.log("Uploaded file:", file)
                    }
                    register={register}
                    name="image"
                    error={errors.image?.message}
                  /> */}

                  <input
                    type="file"
                    className="file-input file-input-success w-full"
                    {...register("image", {
                      required: "Image is required",
                    })}
                  />
                </div>
              </div>

              <div>
                <button className="btn btn-accent w-full text-base-100">
                  Create Account
                </button>
              </div>
            </div>
          </form>
          <div className="flex items-center">
            <span>Already have an account? </span>
            <Link to="/login" className="btn btn-link text-amber-50">
              login
            </Link>
          </div>
        </div>
      </div>

      {/* Right side */}
    </div>
  );
};

export default Register;
