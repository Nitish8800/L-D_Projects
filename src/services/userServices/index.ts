import { IUser } from "@models/user/user.model";
import { User } from "@models/user/user.schema";

export const createOtp = async (userData: IUser) => {
  const { email } = userData;
  const existOrNot = await User.findOne({ email });

  if (existOrNot) {
    await User.findByIdAndDelete(existOrNot._id);
  }

  const tempData = new User({
    ...userData,
    expireAt: Date.now() + 1000 * 60 * 30,
  });
  return tempData.save();
};

export const validateOtp = async (email: string) => {
  const data = await User.findOne({ email });

  return data;
};

export const checkFlag = async (email: string) => {
  const check = await User.findOne({ email });

  return check;
};

export const updateFlag = async (email: string, flag: boolean) => {
  const updateFlag = await User.findOneAndUpdate(
    { email },
    { flag },
    { new: true }
  );
  return updateFlag;
};

export const resendOtp = async (email: string) => {
  const resendOtp = await User.findOne({ email });

  if (!resendOtp) {
    return false;
  }

  const resendSecret = resendOtp?.secretKey;

  return resendSecret;
};
