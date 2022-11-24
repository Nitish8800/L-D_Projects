import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import config from "@config/env/config";
import { IUser } from "@models/user/user.model";

interface IUserData extends IUser {
  _id: Types.ObjectId;
}

export const getJwtToken = async function (user: IUserData) {
  let params: {
    id: typeof user._id;
    email: typeof user.email;
    isAdmin: typeof user.isAdmin;
  } = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  var tokenValue = jwt.sign(params, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES,
  });

  return tokenValue;
};
