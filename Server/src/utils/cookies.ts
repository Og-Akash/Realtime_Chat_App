import { CookieOptions, Response } from "express";
import { NODE_ENV } from "../constants/env";

interface CookieParams {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

const defaultOptions: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure: NODE_ENV === "production",
};

const getAccessTokenOption = (): CookieOptions => ({
  ...defaultOptions,
  expires: new Date(24 * 60 * 60 * 1000),
});
const getRefreshTokenOption = (): CookieOptions => ({
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
