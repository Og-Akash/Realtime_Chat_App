import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import {
  CameraIcon,
  CircleCheck,
  Lock,
  LogOut,
  Mail,
  Store,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, updateProfile } = useAuthStore();
  const [selectedImage, setSeletedImage] = useState("");
  const [bio, setBio] = useState(authUser?.bio);
  const [isUpdateBio, setIsUpdateBio] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => updateProfile(data),
    onSuccess: (res: any) => {
      toast.success(res.message ?? "Profile updated successfully");
      setIsUpdateBio(false);
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const updateProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    const reader = new FileReader();
    const formData = new FormData();
    formData.append("profileImage", file as File);
    reader.onload = async () => {
      const image = reader.result as string;

      setSeletedImage(image);
      mutate(formData);
    };
    reader.readAsDataURL(file as File);
  };

  const updateBio = async () => {
    if (!bio) {
      toast.error("Bio Must be provided!");
      return;
    }
    if (bio === authUser?.bio) {
      toast.error("Bio must be different from the current one!");
      return;
    }
    const formData = new FormData();
    formData.append("bio", bio);
    mutate(formData);
  };

  useEffect(() => {
    if (bio !== authUser?.bio) {
     return setIsUpdateBio(true);
    }
    if(bio === authUser?.bio){
      return setIsUpdateBio(false);
    }
  }, [bio]);

  return (
    <section className="h-[95%] p-8">
      <main className="max-w-xl mx-auto p-4 rounded-md space-y-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold"> Profile Page</h1>
          <p className="text-base text-accent">
            Update Your profile to meet your satisfaction.
          </p>
        </div>
        {/* Profile Image box */}
        <div className="text-center space-y-2">
          <div className="size-26 relative rounded-full mx-auto">
            <img
              src={selectedImage ? selectedImage : authUser?.image}
              alt="Profile Pic"
              className="rounded-full size-26 object-cover"
              width={100}
              height={100}
            />
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 -right-2 cursor-pointer bg-teal-600 border-teal-400 border-2 size-fit p-1.5 rounded-full"
            >
              <CameraIcon className="text-black" />
            </label>
            <input
              onChange={updateProfileImage}
              type="file"
              name="image"
              hidden
              id="profile-image"
            />
          </div>
          <span>
            {isPending
              ? "Uploadng..."
              : "Click the camera icon to upload the photo"}
          </span>
        </div>
        {/* User Info Fields */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <User className="size-5 text-accent" />
              Username
            </div>
            <p className="bg-base-200 px-4 py-2.5 rounded-lg border">
              {authUser?.username}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Mail className="size-5 text-accent" />
              Email
            </div>
            <p className="bg-base-200 px-4 py-2.5 rounded-lg border">
              {authUser?.email}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Store className="size-5 text-accent" />
              Bio
            </div>
            <div className="flex gap-4">
              <input
                className="bg-base-200 px-4 py-2.5 rounded-lg border w-full"
                type="text"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              {isUpdateBio && (
                <button
                  className="text-green-500 cursor-pointer"
                  onClick={updateBio}
                >
                  <CircleCheck />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Account Additional Info */}
        <div className="mt-6 bg-base-300 rounded-xl p-6">
          <h1 className="text-lg font-medium mb-4">Account Information</h1>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-700 py-2">
              <span>Member Since</span>
              <span>{authUser?.createdAt.split("T")[0]}</span>
            </div>

            <div className="flex justify-between items-center border-b border-zinc-700 py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3 justify-end w-full">
          <button className="btn text-base text-black bg-white rounded-lg inline-flex gap-2">
            <Lock size={16} />
            Change Password
          </button>
          <button className="btn text-base bg-error inline-flex gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </main>
    </section>
  );
};

export default Profile;
