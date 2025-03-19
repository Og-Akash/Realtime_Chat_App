import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { Key, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export interface ChnagePassword {
  oldPassword: string;
  newPassword: string;
}

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChnagePassword>();

  const navigate = useNavigate();
  const { changePassword } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChnagePassword) => changePassword(data),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Your password has been changed");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex justify-center items-center">
      <div className="max-w-4xl w-xl flex flex-col items-center bg-base-300 mx-auto p-1 md:p-4 space-y-4 h-auto rounded-lg">
        <h1 className="text-3xl font-medium">Change Your Current Password</h1>
        <form
          onSubmit={handleSubmit((formData) => mutate(formData))}
          className="w-full p-4 space-y-4"
        >
          <div className="form-control space-y-2">
            <label htmlFor="email" className="fieldset-label font-medium">
              Old Password
            </label>
            {/* Input Container */}
            <div className="relative">
              <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock size={16} className="text-base-content/40" />
              </div>
              <input
                id="newPass"
                type="password"
                placeholder="John doe"
                className="input input-accent w-full pl-10"
                {...register("oldPassword", {
                  required: "Old Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
            </div>
            {/* Error message placed outside the relative container */}
            {errors.oldPassword && (
              <span className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </span>
            )}
          </div>
          <div className="form-control space-y-2">
            <label htmlFor="email" className="fieldset-label font-medium">
              New Password
            </label>
            {/* Input Container */}
            <div className="relative">
              <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none z-10">
                <Key size={16} className="text-base-content/40" />
              </div>
              <input
                id="oldPass"
                type="password"
                placeholder="John doe"
                className="input input-accent w-full pl-10"
                {...register("newPassword", {
                  required: "New Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  validate: (value) =>
                    value !== watch("oldPassword") ||
                    "Both New Password and Old Password must be Different",
                })}
              />
            </div>
            {/* Error message placed outside the relative container */}
            {errors.newPassword && (
              <span className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </span>
            )}
          </div>
          <div className="text-right">
            <button
              disabled={isPending}
              className="btn btn-neutral text-base text-accent"
            >
              {isPending && <span className="loading loading-spinner"></span>}
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
