import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../constants/http";
import userModel from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { z } from "zod";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmailByCode,
} from "../services/auth.services";
import {
  emailSchema,
  LoginSchema,
  RegisterSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";
import { verifyToken } from "../utils/jwt";
import Session from "../models/session.model";
import {
  clearAuthCookies,
  getAccessTokenOption,
  getRefreshTokenOption,
} from "../utils/cookies";
import appAssert from "../utils/appAssert";
import cloudinary from "../config/cloudinary";

const register = asyncHandler(async (req, res) => {
  const parsedData = RegisterSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  //? call the auth service
  const { user, accessToken, refreshToken } = await createAccount(parsedData);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/v1/refresh",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  res.status(CREATED).json({ message: "User Registration Success", user });
});

const login = asyncHandler(async (req, res) => {
  const parsedData = LoginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // console.log("parsedData", parsedData);

  const { user, accessToken, refreshToken } = await loginUser(parsedData);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/v1/refresh",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  res.status(OK).json({ message: "User Login Success", user });
});

const logout = asyncHandler(async (req, res) => {
  const accessToken = req.cookies?.accessToken;
  const { payload, error } = verifyToken(accessToken);

  if (payload) {
    await Session.findByIdAndDelete(payload.sessionId);
  }
  clearAuthCookies(res).status(OK).json({
    message: "User Logout Success",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  appAssert(refreshToken, UNAUTHORIZED, "No refresh token found!");

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenOption());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenOption())
    .json({
      message: "Access token Refreshed",
    });
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const verificationCode = req.params.code;

  const codeSchema = z.string().min(1).max(24);
  const parsedCode = codeSchema.parse(verificationCode);

  await verifyEmailByCode(parsedCode);

  res.status(OK).json({ message: "Email verification successful" });
});

const forgetUserPassword = asyncHandler(async (req, res, next) => {
  //* get the user email in params
  //* send the password changing email
  const parsedData = await emailSchema.parse(req.body.email);
  await sendPasswordResetEmail(parsedData);
  //* return the response
  res.status(OK).json({ message: "password reset email send." });
});

const resetUserPassword = asyncHandler(async (req, res, next) => {
  //* get the verification code and the new password
  const parsedData = resetPasswordSchema.parse(req.body);

  await resetPassword(parsedData);
  //* clear all the user cookies
  clearAuthCookies(res).status(OK).json({
    message: "password reset successful",
  });
  //* send the response
});

const updateUserDetails = asyncHandler(async (req, res, next) => {
  //* get the user details from the request
  const file = req.file;
  console.log(file);

  appAssert(file, BAD_REQUEST, "profile image is invalid");

  //* if there is an image then upload it first then grab the url
  const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const response = await cloudinary.uploader.upload(imageBase64, {
    folder: "chat-app",
    transformation: {
      quality: "auto",
    },
  });
  console.log("cloudinary secure url: ", response.secure_url);

  appAssert(response, BAD_REQUEST, "failed to upload profile image");
  //* update the user details
  const updatedUserDetails = await userModel.findByIdAndUpdate(req.userId, {
    image: response.secure_url,
  });
  appAssert(updatedUserDetails, BAD_REQUEST, "failed to update profile");
  //* return the updated user details
  res.status(OK).json({
    user: updatedUserDetails?.omitPassword(),
  });
});

export {
  register,
  login,
  logout,
  refreshAccessToken,
  verifyEmail,
  forgetUserPassword,
  resetUserPassword,
  updateUserDetails,
};
