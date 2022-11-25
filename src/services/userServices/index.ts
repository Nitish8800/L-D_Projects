import { IUser } from "@models/user/user.model";
import { User } from "@models/user/user.schema";

/** It will Create New User Data */
export const createOtp = async (userData: IUser) => {
  const data = new User({
    ...userData,
  });
  return data.save();
};

/** first it will find user email then it will validate the email and check user is exists or not */
export const emailExists = async (email: string) => {
  const emailExist = await User.findOne({ email });
  const userEmail = emailExist?.email || "";

  if (userEmail === email) {
    return true;
  }
  return false;
};

/** It will find mail from User Data */
export const findMail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

/** It will update the active in user data */
export const updateActive = async (email: string, isActive: boolean) => {
  const data = await User.findOneAndUpdate(
    { email },
    { isActive },
    { new: true }
  );
  return data;
};
