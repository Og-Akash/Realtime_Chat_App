import { CookieOptions, Response } from "express";
import { NODE_ENV } from "../constants/env";

export const refreshTokenPath = "/api/auth/v1/refresh"

interface CookieParams {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

const defaultOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

export const getAccessTokenOption = (): CookieOptions => ({
  ...defaultOptions,
  expires: new Date(24 * 60 * 60 * 1000),
});
export const getRefreshTokenOption = (): CookieOptions => ({
  ...defaultOptions,
  expires: new Date(7 * 24 * 60 * 60 * 1000),
  path: "/api/auth/v1/refresh",
});

export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: CookieParams) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenOption())
    .cookie("refreshToken", refreshToken, getRefreshTokenOption());

export const clearAuthCookies = (res:Response) => {
  return res
  .clearCookie("accessToken")
  .clearCookie("refreshToken", {
    path: refreshTokenPath
  })
}
