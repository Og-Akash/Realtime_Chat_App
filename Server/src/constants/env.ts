function getKey(key: string, defaultValue?: string): string {
  const value = process.env[key]! || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const MONGO_URI = getKey("MONGO_URI")
export const PORT = getKey("PORT")
export const NODE_ENV = getKey("NODE_ENV", "development")
export const CLIENT_URL = getKey("CLIENT_URL")
export const ACCESS_TOKEN_SECRET = getKey("ACCESS_TOKEN_SECRET", "accessToken")
export const REFRESH_TOKEN_SECRET = getKey("REFRESH_TOKEN_SECRET","refreshToken")
export const CLOUDINARY_NAME = getKey("CLOUDINARY_NAME")
export const CLOUDINARY_API_KEY = getKey("CLOUDINARY_API_KEY",)
export const CLOUDINARY_API_SECRET = getKey("CLOUDINARY_API_SECRET",)
export const RESEND_API_KEY = getKey("RESEND_API_KEY",)
export const EMAIL_SENDER = getKey("EMAIL_SENDER",)