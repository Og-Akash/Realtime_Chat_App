import { NextFunction, Request, Response } from "express";
import appAssert from "./appAssert";
import { INTERNAL_SERVER_ERROR, OK } from "../constants/http";
import { getBase64FileSize, isValidBase64Image } from "./file";
import cloudinary from "../config/cloudinary";

export const uploadImageToCloudinary = async (req: Request, res: Response) => {
  const image = req.file;
  console.log(image);

  appAssert(image, INTERNAL_SERVER_ERROR, "No image provided!");

  const imageBase64 = `data:${
    req.file.mimetype
  };base64,${req.file.buffer.toString("base64")}`;

  //* upload to cloudinary
  const uploadedResponse = await cloudinary.uploader.upload(imageBase64, {
    folder: "chat-app",
    transformation: [{ quality: "auto" }],
  });
  appAssert(
    uploadedResponse.secure_url,
    INTERNAL_SERVER_ERROR,
    "Failed to upload the image"
  );

  //* return the url of the uploaded image
  res.status(OK).json(uploadedResponse.secure_url);
};
