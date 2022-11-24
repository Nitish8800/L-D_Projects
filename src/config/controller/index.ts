import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/ban-type
export const controller = (handler: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
      next();
    } catch (err) {
      next(err);
    }
  };
};
