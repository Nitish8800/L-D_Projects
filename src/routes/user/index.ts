import express from "express";
export const router = express.Router();
import { createUserWithOtp, verifyValidateTotp } from "@controllers/user";
import { userCreate } from "@middleware/validator/user/user.create.validator";
import { verifyUser } from "@middleware/validator/user/user.verify.validator";
import bodyParser from "body-parser";
router.use(bodyParser.json());

/** Create New User With Verification Totp and Sending mail to Exist Email ID */
router.post("/createOtp", userCreate, createUserWithOtp);

/** VAlidate Totp Code */
router.post("/validateOtp", verifyUser, verifyValidateTotp);
