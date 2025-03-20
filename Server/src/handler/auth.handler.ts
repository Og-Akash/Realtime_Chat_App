import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../constants/http";

import { asyncHandler } from "../utils/asyncHandler";
import { z } from "zod";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmailByCode,
  updateUser,
  changePassword,
  getPayloadFromToken,
} from "../services/auth.services";
import {
  changeUserPasswordSchema,
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
import userModel from "../models/user.model";
import { NODE_ENV } from "../constants/env";
import { oneDayFromNow, sevenDaysFromNow } from "../utils/date";
import { OAuth2Client } from "google-auth-library";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BACKEND_URL}/api/auth/v1/google/callback`
);

const register = asyncHandler(async (req, res) => {
  const parsedData = RegisterSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  //? call the auth service
  const { user, accessToken, refreshToken } = await createAccount(parsedData);

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/v1/refresh",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })
    .status(CREATED)
    .json({ message: "User Registration Success", user });
});

const googleAuth = asyncHandler(async (req, res) => {
  //?generate the authURL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent", // Force consent screen to always appear
  });

  res.redirect(authUrl);
});

const googleCallback = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await getPayloadFromToken(
    req,
    oauth2Client
  );

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/v1/refresh",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

  res.redirect(`${process.env.CLIENT_URL}`);
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
    sameSite: NODE_ENV === "development" ? "strict" : "none",
    expires: oneDayFromNow(),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: NODE_ENV === "development" ? "strict" : "none",
    path: "/api/auth/v1/refresh",
    expires: sevenDaysFromNow(),
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

const changeUserPassword = asyncHandler(async (req, res, next) => {
  const parsedData = changeUserPasswordSchema.parse(req.body);

  appAssert(
    parsedData.oldPassword !== parsedData.newPassword,
    BAD_REQUEST,
    "old and new password are same"
  );

  await changePassword(req, parsedData);

  clearAuthCookies(res).json({
    message: "Your password changed Successfully",
  });
});

const updateUserDetails = asyncHandler(async (req, res, next) => {
  //* get the user details from the request
  const file = req.file;
  const { bio } = req.body;

  const updatedUserDetails = await updateUser(file, bio);

  //* Ensure user exists before updating
  const updatedUser = await userModel.findByIdAndUpdate(
    req.userId,
    { ...updatedUserDetails },
    { new: true }
  );
  appAssert(updatedUser, BAD_REQUEST, "User not found or update failed");

  //* Send response
  return res.status(OK).json({
    user: updatedUser?.omitPassword(),
    message: "your details updated",
  });
});

export {
  register,
  googleAuth,
  googleCallback,
  login,
  logout,
  refreshAccessToken,
  verifyEmail,
  forgetUserPassword,
  resetUserPassword,
  changeUserPassword,
  updateUserDetails,
};
