import ChatContainer from "@/components/chat/ChatContainer";
import NoUserSelected from "@/components/chat/NoUserSelected";
import Sidebar from "@/components/Sidebar";
import SideNavbar from "@/components/SideNavbar";
import { useChatStore } from "@/store/useChatStore";
import { useEffect, useState } from "react";

const Home = () => {
  const { selectedUser } = useChatStore(); // Assuming setSelectedUser exists
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="h-[calc(100vh-4rem)] bg-base-200">
      <div className="max-w-6xl mx-auto p-1 md:p-4 rounded-md space-y-4 h-full">
        <div className="flex justify-center items-center h-full relative">
          {/* Show Sidebar in full width when no user is selected on mobile */}
          {!selectedUser || !isMobile ? (
            <>
              <SideNavbar />
              <Sidebar />
            </>
          ) : null}

          {/* Show ChatContainer only when user is selected */}
          {selectedUser && <ChatContainer />}

          {/* Only show NoUserSelected on larger screens */}
          {!selectedUser && !isMobile && <NoUserSelected />}
        </div>
      </div>
    </main>
  );
};

export default Home;
