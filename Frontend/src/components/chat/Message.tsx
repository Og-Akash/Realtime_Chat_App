import { formatDate } from "@/lib/formatDate";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import ContextMenu from "../ui/ContextMenu";

const Message = ({
  message,
  onContextMenu,
  contextMenu,
  setContextMenu,
  clickImageUrl,
}: any) => {
  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  const handleDownloadImage = async () => {
    try {
      if (!clickImageUrl) return;
      console.log(clickImageUrl);

      const res = await fetch(clickImageUrl);
      const blob = await res.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "image.jpg"; // Default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // Clean up memory
    } catch (error) {
      console.log("failed to download image", error);
    }
  };

  return (
    <div
      className={`chat ${
        message.senderId === authUser?._id ? "chat-end" : "chat-start"
      }`}
    >
      {contextMenu && (
        <ContextMenu
          onDownloadImage={handleDownloadImage}
          onCopy={() => console.log("copied")
          }
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          onClose={() => setContextMenu(null)}
        />
      )}

      <div className="chat-image avatar">
        <div className="rounded-full w-10">
          <img
            src={
              message.senderId === authUser?._id
                ? authUser?.image
                : selectedUser?.image
            }
            alt="profile-image"
          />
        </div>
      </div>

      <div className="chat-header mb-1">
        <time className="text-xs opacity-50">
          {formatDate(message.createdAt)}
        </time>
      </div>
      <div
        onContextMenu={onContextMenu}
        className="chat-bubble max-w-96 min-w-72 flex flex-col"
      >
        {message.image && (
          <img
            src={message.image}
            alt="message-image"
            className="w-full h-48 rounded-md mb-2"
          />
        )}
        <span>{message.text && message.text}</span>
      </div>
    </div>
  );
};

export default Message;
