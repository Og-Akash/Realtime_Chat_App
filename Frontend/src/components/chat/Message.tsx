import { formatDate } from "@/lib/formatDate";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import React from "react";

const Message = ({ message }: any) => {
  const {  selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  return (
    <div
      key={message._id}
      className={`chat ${
        message.senderId === authUser?._id ? "chat-end" : "chat-start"
      }`}
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
      <div className="chat-bubble max-w-96 min-w-72 flex flex-col">
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
