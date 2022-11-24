import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { IUser } from "./user.model";

const userSchema = new mongoose.Schema<IUser>(
  {
    first_name: { type: "string", required: true },
    last_name: { type: "string", required: true },
    email: { type: "string", required: true },
    phone: { type: "number", required: true },
    active: { type: "boolean", default: false },
    secretKey: { type: "string", required: false },
  },
  { timestamps: true }
);

// userSchema.pre("save", function (next) {
//   var salt = bcrypt.genSaltSync(10);

//   if (this.password && this.isModified("password")) {
//     this.password = bcrypt.hashSync(this.password, salt);
//   }
//   next();
// });

// userSchema.methods.toJSON = function () {
//   var obj = this.toObject();
//   delete obj.password;
//   return obj;
// };

export const User = mongoose.model<IUser>("User", userSchema);
