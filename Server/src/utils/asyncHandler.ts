import { NextFunction, Request, Response } from "express";

export type AsyncProps = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

//? write the asynchandler

const asyncHandler =
  (controller: AsyncProps): AsyncProps =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export {asyncHandler}