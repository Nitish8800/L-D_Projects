import mongoose from "mongoose";
import { IOtp } from "./otp.model";

const otpSchema = new mongoose.Schema<IOtp>(
  {
    email: {
      type: "String",
      required: true,
      unique: true,
    },
    otpCode: {
      type: "String",
    },
    expireIn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const OTP = mongoose.model<IOtp>("OTP", otpSchema);
