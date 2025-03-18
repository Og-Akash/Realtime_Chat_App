import { useEffect, useRef } from "react";
import MessageInput from "../chat/MessageInput";
import { ArrowLeft } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { NavigationType, useSidebarStore } from "@/store/useSidebarStore";

const Assiestant = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
    const {setNavigation} = useSidebarStore()
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  });

  return (
    <div className="flex flex-1 flex-col overflow-auto h-full">
      <div className="flex justify-between items-center bg-accent-content rounded-md">
        <div className="relative flex items-center gap-3 border-b p-2 border-base-300">
          <button
            onClick={() => setNavigation(NavigationType.Contacts)}
            className="cursor-pointer  text-primary"
          >
            <ArrowLeft size={24} />
          </button>
          <img
            className="rounded-full size-12 object-cover"
            src="/assets/images/assiestant.jpg"
            alt="ai-assiestant-avatar"
          />
          {/* User info */}
          <div className="text-left min-w-0">
            <span className="truncate text-accent font-medium">
                AI Assistent
            </span>
            <div className="text-sm text-zinc-300">
                Online
            </div>
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >


      </div>

      <MessageInput />
    </div>
  );
};

export default Assiestant;
