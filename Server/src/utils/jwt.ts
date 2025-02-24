import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";
export const generateToken = (id: string, userId: string) => {
  // Implement JWT generate token

  const accessToken = jwt.sign(
    { userId: userId, sessionId: id },
    ACCESS_TOKEN_SECRET,
    {
      audience: ["user"],
      expiresIn: "1d",
    }
  );
  const refreshToken = jwt.sign({ sessionId: id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyAccessToken = (token: string) => {
  // Implement JWT verify token
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};
export const verifyRefreshToken = (token: string) => {
  // Implement JWT verify token
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
