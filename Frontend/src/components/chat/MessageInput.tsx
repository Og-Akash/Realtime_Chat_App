import { fileToBase64 } from "@/lib/base64Image";
import { useChatStore } from "@/store/useChatStore";
import { useMutation } from "@tanstack/react-query";
import { Image, Send, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [message, setMessage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { sendMessage } = useChatStore();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target?.files?.[0] as File;
    if (!image) return;

    if (!image.type.startsWith("image/")) {
      toast.error(`Image ${image.type} not supported`);
      return;
    }

    const imageBase64 = await fileToBase64(image);
    setImageFile(image);
    setImagePreview(imageBase64);
  };

  const removeSelectedImage = () => {
    setImagePreview("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const { mutate } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("text", message);

      if(imageFile){
        formData.append("image", imageFile);
      }

      await sendMessage(formData);
    },
    onSuccess: () => {
      setMessage("");
      setImageFile(null);
      setImagePreview("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "something went wrong");
    },
  });

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeSelectedImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center cursor-pointer"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type some messages..."
          className="input focus:input-accent flex-1 placeholder:text-base"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`rounded-full hover:bg-base-200/10 cursor-pointer ${
            imagePreview && "text-accent"
          }`}
        >
          <Image size={24} />
        </button>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          hidden
          ref={inputRef}
        />
        <button
          className="rounded-full hover:bg-base-200/10 cursor-pointer disabled:opacity-40"
          disabled={message.length === 0}
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
