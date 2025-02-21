import { ObjectId } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: ObjectId | undefined;
        role: string | undefined;
      };
      file: Multer.File;
    }
  }
  interface Error {
    statusCode?: number;
  }
}
