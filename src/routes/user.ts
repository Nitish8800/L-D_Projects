import express from "express";
import { auth, authorizeRoles } from "@middleware/auth";
export const router = express.Router();

import {
  getUserDetails,
  createUser,
  loginUser,
  verifyUser,
  logOutUser,
  otpMailSend,
  changePassword,
} from "@controllers/user";

import { userSignUP } from "../middleware/validator/user/signup.validator";
import { validateUserLogin } from "../middleware/validator/user/login.validator";
import { validateForgetPassword } from "../middleware/validator/user/forget_password.validator";
import { validateChangePassword } from "../middleware/validator/user/change_password.validator";

import bodyParser from "body-parser";
router.use(bodyParser.json());

// User Access Routes
// Register New Use
router.post("/signup", userSignUP, createUser);

// // // Login User
router.post("/login", validateUserLogin, loginUser);

// get User Details
router.get("/me", auth, getUserDetails);

// // // Verify User
router.post("/verify", verifyUser);

// // // Otp Email Send
router.post("/forgot-password", validateForgetPassword, otpMailSend);

// // // Otp Email Send
router.post("/change-password", validateChangePassword, changePassword);

// // // Log out User
router.get("/logout", logOutUser);
 