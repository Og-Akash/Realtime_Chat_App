import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import Session from "../models/session.model";
import userModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { oneDayInMS, sevenDaysFromNow } from "../utils/date";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";

export interface createAccountParams {
  username: string;
  email: string;
  password: string;
  image: string;
  userAgent?: string;
}
export interface loginParams {
  username: string;
  email: string;
  password: string;
  userAgent?: string;
}

export const createAccount = async (data: createAccountParams) => {
  //? verify the user if exists
  const existingUser = await userModel.exists({
    email: data.email,
  });

  appAssert(!existingUser, CONFLICT, "Email is already in use");

  //? create the account
  const user = await userModel.create({
    email: data.email,
    username: data.username,
    password: data.password,
    image: data.image,
  });

  //? create a session
  const session = await Session.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  //? sign the acces and refresh token
  const sessionInfo = {
    sessionId: session._id,
  };

  //* Access token Generate
  const accessToken = signToken({ userId: user._id, ...sessionInfo });
  //* Refresh token Generate
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  //? return the user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (data: loginParams) => {
  //?* if the user is exists
  const user = await userModel.findOne({
    $or: [
      {
        email: data.email,
        username: data.username,
      },
    ],
  });
  appAssert(user, UNAUTHORIZED, "invlid Email or Password!");
  //* validate the password
  const isPassMatched = await user.comparePassword(data.password);
  appAssert(isPassMatched, UNAUTHORIZED, "Email or Password not matched!");

  const userId = user._id;
  //* create session
  const session = await Session.create({
    userId,
    userAgent: data.userAgent,
  });

  //? sign the acces and refresh token
  const sessionInfo = {
    sessionId: session._id,
  };

  //* Access token Generate
  const accessToken = signToken({ userId: user._id, ...sessionInfo });
  //* Refresh token Generate
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  //* return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");
  const session = await Session.findById(payload.sessionId);
  appAssert(
    session && session.expiresAt.getTime() > Date.now(),
    UNAUTHORIZED,
    "session is not exists or expires."
  );

  //? refresh the session if it's expires within 24 hours

  const sessionNeedsRefresh =
    session.expiresAt.getTime() - Date.now() <= oneDayInMS;
  if (sessionNeedsRefresh) {
    session.expiresAt = sevenDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const accessToken = signToken({
    sessionId: session._id,
    userId: session.userId,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};
