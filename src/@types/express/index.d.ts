import { Types } from "mongoose";
import { IUser } from "src/models/user/user.model";
export {};

declare global {
  namespace Express {
    export interface Request {
      user?: IUser & {
        _id: Types.ObjectId;
      };
    }
  }
}
