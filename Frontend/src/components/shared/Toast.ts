import toast from "react-hot-toast";

export function SuccessToast(message: string) {
  toast.success(message, {
    className: "text-white border border-accent p-4",
  });
}
export function ErrorToast(message: string) {
  toast.error(message, {
    className: "text-white border border-accent p-4"
  });
}
