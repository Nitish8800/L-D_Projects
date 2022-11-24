import { IUser } from "@models/user/user.model";
import { User } from "@models/user/user.schema";

export const createOtp = async (userData: IUser) => {
  const { email } = userData;
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    await User.findByIdAndDelete(emailExists._id);
  }

  const data = new User({
    ...userData,
  });
  return data.save();
};

export const findMail = async (email: string) => {
  const data = await User.findOne({ email });
  return data;
};

export const updateActive = async (email: string, active: boolean) => {
  const updateFlag = await User.findOneAndUpdate(
    { email },
    { active },
    { new: true }
  );
  return updateFlag;
};

export const resendOtp = async (email: string) => {
  const findMailForResend = await User.findOne({ email });
  if (!findMailForResend) {
    return false;
  }
  const resendSecret = findMailForResend?.secretKey;
  return resendSecret;
};
