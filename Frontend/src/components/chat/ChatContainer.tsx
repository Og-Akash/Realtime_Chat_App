import { useChatStore } from "@/store/useChatStore";
import { useQuery } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageLoader from "../ui/MessageLoader";

const ChatContainer = () => {
  const { getMessages, selectedUser } = useChatStore();
  const { data, isPending } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessages(selectedUser?._id as string),
  });

  if (isPending) return <MessageLoader />;

  return (
    <div className="flex flex-1 flex-col overflow-auto h-full">
      <ChatHeader />

      <p>Messages....</p>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
