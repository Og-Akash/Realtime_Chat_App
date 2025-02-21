import { Request, Response } from "express";
import Message from "../models/message.model";
import upload from "../utils/multar.config";
import cloudinary from "../utils/cloudinary";

const getMessageOfUser = async (req: Request, res: Response) => {
  const { id: userToChat } = req.params;
  const myId = req.user?.userId;

  //? Fetch message from database based on the user ID
  const messages = await Message.find({
    $or: [
      { sender: userToChat, recipient: myId },
      { sender: myId, recipient: userToChat },
    ],
  });

  res.status(200).json(messages);
};

const sendMessageToUser = async (req: Request, res: Response) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user?.userId;

  let imageUrl;

  if (image) {
    const uploadResult = cloudinary.uploader.upload(image)
    imageUrl = (await uploadResult).secure_url
  }

 const newMessage =  new Message({
    text,
    image: imageUrl,
    senderId,
    receiverId,
  });

  await newMessage.save()


  //* Will add realtime futionality 

  res.status(201).json(newMessage);
};

export { getMessageOfUser, sendMessageToUser };
