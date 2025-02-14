import * as express from "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      customQuery?: string;
      user?: {
        userId: string;
        role: string;
      };
    }
  }
  interface Error {
    statusCode?: number;
  }
}
