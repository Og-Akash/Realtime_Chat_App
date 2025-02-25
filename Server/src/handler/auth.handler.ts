import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../constants/http";
import userModel from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { z } from "zod";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
} from "../services/auth.services";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema";
import { verifyToken } from "../utils/jwt";
import Session from "../models/session.model";
import { clearAuthCookies, getAccessTokenOption, getRefreshTokenOption } from "../utils/cookies";
import appAssert from "../utils/appAssert";

const getAllUser = asyncHandler(async (req, res) => {
  //* Fetch all users from the database
  const allUsers = await userModel.find();
  if (allUsers.length > 0) {
    return res.status(200).json(allUsers);
  }
  return res.status(404).json({ message: "No users found" });
});

const register = asyncHandler(async (req, res) => {
  const parsedData = RegisterSchema.safeParse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  if (!parsedData.success) {
    throw parsedData.error;
  }

  //? call the auth service
  const { user, accessToken, refreshToken } = await createAccount(
    parsedData.data
  );

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
  const parsedData = LoginSchema.safeParse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  if (!parsedData.success) {
    throw parsedData.error;
  }
  const { user, accessToken, refreshToken } = await loginUser(parsedData.data);

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

  if(newRefreshToken){
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenOption());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenOption())
    .json({
      message: "Access token Refreshed",
    });
});

const authAuth = asyncHandler(async (req, res, next) => {});

export { getAllUser, register, login, logout, authAuth, refreshAccessToken };
