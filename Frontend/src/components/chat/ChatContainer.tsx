import { useChatStore } from "@/store/useChatStore";
import { useQuery } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageLoader from "../ui/MessageLoader";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "../ui/ContextMenu";

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

  const { isPending } = useQuery({
    queryKey: ["messages", selectedUser?._id],
    queryFn: () => getMessages(selectedUser?._id as string),
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(selectedUser?._id),
  });

  useEffect(() => {
    subscribeToMessages();
    return () => unSubscribeToMessages();
  }, [subscribeToMessages, unSubscribeToMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  const handlePositionContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    let type = "text";

    if (!chatContainerRef.current) return;

    const { left, top } = chatContainerRef.current.getBoundingClientRect();

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

  useEffect(() => {
    console.log(clickImageUrl)
  },[clickImageUrl])

  return (
    <div className="flex flex-1 flex-col overflow-auto h-full">
      <ChatHeader />

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
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
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
