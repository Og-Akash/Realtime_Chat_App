import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Eye,
  EyeClosed,
  Lock,
  Mail,
  MessageCircleCode,
  User,
} from "lucide-react";
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  image: File;
}

const Register = () => {
  const { authUser, signUp, uploadImage,checkAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const navigate = useNavigate()

    useEffect(() => {
      checkAuth();
    }, []);
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { mutate, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      // console.log("image", formData);

      return await uploadImage(formData);
    },
  });

  if (authUser) return <Navigate to="/" />;

  const onSubmit = (data: RegisterFormData) => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    mutate(imageFile, {
      onSuccess: (imageUrl) => {
        signUp({ ...data, image: imageUrl || "" });
        navigate("/")
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log("Selected file:", file);

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`Max image size is 5MB`);
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.onerror = () => toast.error("Error converting image");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="w-full p-6 sm:p-12 flex justify-center">
        <div className="max-w-xl flex flex-col space-y-6 items-center">
          <span className="size-16 bg-accent-content flex items-center justify-center rounded-xl">
            <MessageCircleCode size={32} />
          </span>
          <h1 className="text-2xl font-bold">Sign Up Account</h1>
          <p className="text-sm text-center">
            Enter your details to create an account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-96">
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

            <div className="form-control">
              <label className="fieldset-label font-medium">
                Profile Image
              </label>
              {/* <ImageDropzone<RegisterFormData>
                onImageUpload={(file) => handleFileChange(file)}
                register={register}
                name="image"
                error={errors.image?.message}
              />
              {isPending && <span>Image is uploadng...</span>} */}
              <input
                type="file"
                className="file-input file-input-success w-full"
                {...register("image", { required: "Image is required" })}
                onChange={handleFileChange}
              />

              {isPending && <p>Uploading image...</p>}
            </div>

            {previewImage && (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="mt-2 rounded"
              />
            )}

            <button className="btn btn-accent w-full">Create Account</button>
          </form>

          <div className="text-center">
            <span>Already have an account? </span>
            <Link to="/login" className="btn btn-link text-amber-50">
              Login
            </Link>
          </div>
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
        <div className="absolute inset-y-0 left-3 flex items-center text-base-content/40">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className="input input-success w-full pl-10"
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
