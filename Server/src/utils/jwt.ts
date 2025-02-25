import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";
import { ISession } from "../models/session.model";
import { IUser } from "../models/user.model";
import { SignOptions, VerifyOptions } from "jsonwebtoken";

export type RefreshTokenPayload = {
  sessionId: ISession["_id"];
};

export type AccessTokenPayload = {
  userId: IUser["_id"];
  sessionId: ISession["_id"];
};

export type signOptionAndSecret = SignOptions & {
  secret: string;
};

const defaultOpts: SignOptions = {
  audience: ["user"],
};

export const accessTokenSignOptions: signOptionAndSecret = {
  expiresIn: "1d",
  secret: ACCESS_TOKEN_SECRET,
};
export const refreshTokenSignOptions: signOptionAndSecret = {
  expiresIn: "7d",
  secret: REFRESH_TOKEN_SECRET,
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: signOptionAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaultOpts,
    ...opts,
  });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  const { secret = ACCESS_TOKEN_SECRET, ...verifyOpt } = options || {};

  try {
    const payload = jwt.verify(token, secret, {
      ...defaultOpts,
      ...verifyOpt,
    }) as TPayload;

    return {
      payload,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
