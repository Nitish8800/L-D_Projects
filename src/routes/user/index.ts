import express from "express";
export const router = express.Router();

import { createUserWithOtp, verifyValidateTotp } from "@controllers/user";

import bodyParser from "body-parser";
router.use(bodyParser.json());

/** Create New User With Verification Totp and Sending mail to Exist Email ID */
router.post("/create-otp", createUserWithOtp);

/** VAlidate Totp Code */
router.post("/validate-otp", verifyValidateTotp);

