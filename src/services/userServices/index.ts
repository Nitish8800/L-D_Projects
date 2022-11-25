import { IUser } from "@models/user/user.model";
import { User } from "@models/user/user.schema";

export const createOtp = async (userData: IUser) => {
  const data = new User({
    ...userData,
  });
  return data.save();
};

export const emailExists = async (email: string) => {
  const emailExist = await User.findOne({ email });
  const userEmail = emailExist?.email || "";

  if (userEmail === email) {
    return true;
  }
  return false;
};

export const findMail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

export const updateActive = async (email: string, active: boolean) => {
  const data = await User.findOneAndUpdate(
    { email },
    { active },
    { new: true }
  );
  return data;
};
