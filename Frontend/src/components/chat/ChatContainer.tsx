import { useChatStore } from "@/store/useChatStore";
import { useQuery } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageLoader from "../ui/MessageLoader";
import Message from "./Message";
import { useEffect, useRef } from "react";

const ChatContainer = () => {
  const { getMessages, selectedUser } = useChatStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { data: messages, isPending } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessages(selectedUser?._id as string),
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
            <Message key={message._id} message={message} />
          ))
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
