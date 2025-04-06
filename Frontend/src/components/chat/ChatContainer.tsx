import { useChatStore } from "@/store/useChatStore";
import { useQuery } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageLoader from "../ui/MessageLoader";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "../ui/ContextMenu";
import { ErrorToast } from "../shared/Toast";

const ChatContainer = () => {
  const {
    getMessages,
    selectedUser,
    messages,
    subscribeToMessages,
    unSubscribeToMessages,
  } = useChatStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: string;
  } | null>(null);

  const [clickImageUrl, setClickedImageUrl] = useState("");
  const [clickedText, setClickedText] = useState("");

  const { isPending } = useQuery({
    queryKey: ["messages", selectedUser?._id],
    queryFn: () => getMessages(selectedUser?._id as string),
    enabled: Boolean(selectedUser?._id),
  });

  useEffect(() => {
    subscribeToMessages();
    return () => unSubscribeToMessages();
  }, [subscribeToMessages, unSubscribeToMessages]);

  useEffect(() => {
    const scrollToBottom = () => {
      const chatContainer = chatContainerRef.current;
      if (chatContainer) {
        // Force this to run after DOM updates
        setTimeout(() => {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
      }
    };

    scrollToBottom();
  }, [messages]);

  const handlePositionContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    let type = "text";

    if (!chatContainerRef.current) return;

    const { left, top } = chatContainerRef.current.getBoundingClientRect();

    if (e.target instanceof HTMLSpanElement) {
      type = "text";
      setClickedText(e.target.innerHTML);
    }
    if (e.target instanceof HTMLImageElement) {
      type = "image";
      setClickedImageUrl(e.target.src);
    }

    setContextMenu({
      x: e.clientX - left,
      y: e.clientY - top,
      type,
    });
  };

  const handleDownloadImage = async () => {
    try {
      if (!clickImageUrl) return;
      const res = await fetch(clickImageUrl);
      const blob = await res.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = Math.floor(Math.random() * 100000000) + ".jpg"; // Default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // Clean up memory
    } catch (error) {
      console.log("failed to download image", error);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(clickedText);
    } catch (error) {
      ErrorToast("failed to Copy text");
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto h-full">
      <ChatHeader />

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar h-full scroll-smooth"
      >
        {isPending ? (
          <MessageLoader />
        ) : (
          messages?.map((message: any) => (
            <Message
              clickImageUrl={clickImageUrl}
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
              onContextMenu={handlePositionContextMenu}
              key={message._id}
              message={message}
            />
          ))
        )}

        {contextMenu && (
          <ContextMenu
            handleDownloadImage={handleDownloadImage}
            onCopy={onCopy}
            x={contextMenu.x}
            y={contextMenu.y}
            type={contextMenu.type}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
