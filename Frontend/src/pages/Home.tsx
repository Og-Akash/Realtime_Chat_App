import ChatContainer from "@/components/chat/ChatContainer";
import NoUserSelected from "@/components/chat/NoUserSelected";
import Sidebar from "@/components/Sidebar";
import { useChatStore } from "@/store/useChatStore";

const Home = () => {
  const { getUser, selectedUser } = useChatStore();
  return (
    <main className="h-[calc(100vh-4rem)] bg-base-200">
      <div className="max-w-6xl mx-auto p-4 rounded-md space-y-4 h-full">
        <div className="flex justify-center items-center h-full">
          <Sidebar />
          {selectedUser ? <ChatContainer /> : <NoUserSelected />}
        </div>
      </div>
    </main>
  );
};

export default Home;
