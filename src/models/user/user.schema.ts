import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { IUser } from "./user.model";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    email: { type: "string", required: true },
    phone: { type: "number", required: true },
    isActive: { type: "boolean", default: false },
    secretKey: { type: "string" },
    otpauthUrl: { type: "string" },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
