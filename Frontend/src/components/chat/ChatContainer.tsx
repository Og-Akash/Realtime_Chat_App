import { useChatStore } from "@/store/useChatStore";
import { useQuery } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageLoader from "../ui/MessageLoader";
import Message from "./Message";
import { useEffect, useRef } from "react";

const ChatContainer = () => {
  const {
    getMessages,
    selectedUser,
    messages,
    subscribeToMessages,
    unSubscribeToMessages,
  } = useChatStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { isPending } = useQuery({
    queryKey: ["messages", selectedUser?._id],
    queryFn: () => getMessages(selectedUser?._id as string),
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    subscribeToMessages();
    return () => unSubscribeToMessages();
  }, [subscribeToMessages, unSubscribeToMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  });

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
