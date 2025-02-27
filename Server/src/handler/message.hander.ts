import cloudinary from "../config/cloudinary";
import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import Message from "../models/message.model";
import userModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { asyncHandler } from "../utils/asyncHandler";

const getUsers = asyncHandler(async (req, res) => {
  //* Fetch all users from the database
  const allUsers = await userModel
    .find({
      _id: { $ne: req.userId },
    })
    .select("-password");
  if (allUsers.length > 0) {
    return res.status(200).json(allUsers);
  }
  appAssert(allUsers.length > 0, NOT_FOUND, "No users found");
});

const getMessages = asyncHandler(async (req, res) => {
  //* get the chat with user id from params
  const { id: chatToUser } = req.params;
  //* get my id
  const myId = req.userId;
  //* check to db for messages
  const messages = await Message.find({
    $or: [
      {
        senderId: myId,
        receiverId: chatToUser,
      },
      {
        senderId: chatToUser,
        receiverId: myId,
      },
    ],
  });
  appAssert(messages, NOT_FOUND, "You both have no messages");
  //* return the messages
  res.status(OK).json(messages);
});

const sendMessageToUser = asyncHandler(async (req, res) => {
  //* get the message body
  const { image, text } = req.body;
  const { id:receiverId } = req.params;
  //* check the body for image or text
  let imageUrl;
  //* if image is there then upload it and store the url.
  if (imageUrl) {
    const responseFromCLoudinary = await cloudinary.uploader.upload(image, {
      folder: "chat-app",
      transformation: [{ quality: "auto" }],
    });

    imageUrl = responseFromCLoudinary.secure_url;
  }
  //* store the message to db
  const storeMessage = await Message.create({
    senderId: req.userId,
    receiverId,
    text,
    imageUrl,
  });

  appAssert(storeMessage,INTERNAL_SERVER_ERROR, "failed to store message")

  //*Todo --> realtime message sending using socket io

  //* return the response
  res.status(CREATED).json(storeMessage)
  //* send the message to the other user
});

export { getUsers, getMessages, sendMessageToUser };
