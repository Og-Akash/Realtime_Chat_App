import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
import Loader from "@/components/ui/Loader";

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const { authUser, signUp, checkAuth, isCheckingAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  // const { mutateAsync: uploadImageMutation, isPending: isUploading } =
  //   useMutation({
  //     mutationFn: async (file: File) => {
  //       const formData = new FormData();
  //       formData.append("image", file);
  //       return await uploadImage(formData);
  //     },
  //     onError: (error: Error) => {
  //       toast.error(error.message || "Image upload failed!");
  //     },
  //   });

  const { mutateAsync: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationFn: async (userData: RegisterFormData) => {
      return await signUp(userData);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed!");
    },
    onSuccess: () => {
      toast.success("Registration Successful! You can now login.");
      navigate("/");
    },
  });

  if (authUser) return <Navigate to="/" />;

  const onSubmit = async (data: RegisterFormData) => {
    await signUpMutation(data);
  };

  // const handleFileChange = async (
  //   imageFile?: File,
  //   e?: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   let file = null;

  //   if (imageFile) {
  //     file = imageFile;
  //   } else {
  //     file = e?.target.files?.[0] as File;
  //   }

  //   if (!file) return;

  //   console.log("Selected file:", file);

  //   const maxSize = 5 * 1024 * 1024;
  //   if (file.size > maxSize) {
  //     toast.error(`Max image size is 5MB`);
  //     return;
  //   }

  //   setImageFile(file);

  //   const image = await fileToBase64(file);
  //   setPreviewImage(image);
  // };

  if (isCheckingAuth) {
    return <Loader />;
  }

  const handleGoogleRegister= () => {
    try {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/v1/google`;

    } catch (error) {
      console.log('Error in google authentication', error)
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="w-full p-6 sm:p-12 flex justify-center items-center bg-base-300">
        <div className="max-w-xl flex flex-col space-y-4 items-center">
          <span className="size-16 bg-accent-content flex items-center justify-center rounded-xl">
            <MessageCircleCode size={32} />
          </span>
          <div className="text-center flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-accent">
              Create Your Account On LumeChat
            </h1>
            <p className="text-sm text-center w-[70%] font-medium">
              Enter your details to create your first account and Talk with
              Peoples ❤️‍🔥.
            </p>
          </div>

          {/* Social logins */}
          <div className="w-full grid grid-cols-1 gap-4 max-w-sm">
          <button onClick={handleGoogleRegister} className="cursor-pointer border border-accent/40 p-2 rounded-md flex items-center justify-center gap-4 h-12">
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
              disabled={isSigningUp}
              className="btn btn-accent w-full rounded-lg"
            >
              {isSigningUp ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : (
                " Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <span>Already have an account? </span>
            <Link to="/login" className="btn btn-link text-amber-50">
              Login
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

export default Register;
