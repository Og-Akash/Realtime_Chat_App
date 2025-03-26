import { fileToBase64 } from "@/lib/base64Image";
import { useChatStore } from "@/store/useChatStore";
import { useMutation } from "@tanstack/react-query";
import { File, Image, Paperclip, Send, Smile, Video, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import { useThemeStore } from "@/store/useThemeStore";
import { NavigationType, useSidebarStore } from "@/store/useSidebarStore";

const MessageInput = () => {
  const { navigation } = useSidebarStore();
  const [message, setMessage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = useState(false);

  const { sendMessage } = useChatStore();
  const { theme } = useThemeStore();

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
    setImageFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const addEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("text", message);

      if (imageFile) {
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

  useEffect(() => {
    function handleCloseEmojiContainer(e: PointerEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }

    document.addEventListener("pointerdown", handleCloseEmojiContainer);
    return () =>
      document.removeEventListener("pointerdown", handleCloseEmojiContainer);
  }, []);

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {isPending && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loading loading-spinner loading-sm"></span>
            )}
            <img
              src={imagePreview}
              alt="Preview"
              className={`w-20 h-20 object-cover rounded-lg border border-zinc-700 ${
                isPending && "opacity-30"
              }`}
            />
            <button
              disabled={isPending}
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
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 relative"
      >
        {/* file dropdown */}
        {navigation !== NavigationType.Assiestant && (
          <div className="dropdown dropdown-top">
            <button
              tabIndex={0}
              type="button"
              className={`rounded-full hover:bg-base-200/10 cursor-pointer ${
                imagePreview && "text-accent"
              }`}
            >
              <Paperclip size={24} />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex gap-2 items-center cursor-pointer h-10 hover:bg-base-300 p-1"
              >
                <Image className="text-accent" />
                Image File
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex gap-2 items-center cursor-pointer h-10 hover:bg-base-300 p-1"
              >
                <Video className="text-secondary" />
                Video File
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex gap-2 items-center cursor-pointer h-10 hover:bg-base-300 p-1"
              >
                <File className="text-primary" />
                Normal File
              </button>
            </ul>
          </div>
        )}

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type some messages..."
          className="input focus:input-accent flex-1 placeholder:text-base"
        />
        {/* Emoji Picker */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevents event from reaching document
            setShowPicker((prev) => !prev);
          }}
          className="p-2 text-xl cursor-pointer"
        >
          <Smile size={22} />
        </button>

        {/* Emoji Picker */}
        {showPicker && (
          <div ref={emojiRef} className="absolute bottom-12 right-20">
            <EmojiPicker
              onEmojiClick={addEmoji}
              theme={theme === "light" ? Theme.LIGHT : Theme.DARK}
              emojiStyle={EmojiStyle.GOOGLE}
            />
          </div>
        )}

        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          hidden
          ref={inputRef}
        />
        <button
          className="rounded-full hover:bg-base-200/10 cursor-pointer disabled:opacity-40"
          disabled={(!imageFile && !message.trim()) || isPending}
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
