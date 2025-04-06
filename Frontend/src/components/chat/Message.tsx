import { formatDate } from "@/lib/formatDate";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
const Message = ({
  message,
  onContextMenu,
  contextMenu,
  setContextMenu,
  clickImageUrl,
  ...props
}: any) => {
  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  return (
    <div
      {...props}
      className={`chat ${
        message.senderId === authUser?._id ? "chat-end" : "chat-start"
      }`}
      onContextMenu={onContextMenu}
    >

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
        className="chat-bubble max-w-96 min-w-72 flex flex-col"
      >
        {message.image && (
          <img
            src={message.image}
            alt="message-image"
            className="w-full h-48 object-cover rounded-md mb-2"
          />
        )}
        <span>{message.text && message.text}</span>
      </div>
    </div>
  );
};

export default Message;
