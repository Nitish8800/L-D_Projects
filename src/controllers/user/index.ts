import { Request, Response } from "express";
import { sendMail } from "@utils/sendMail.ts";
import { controller } from "@config/controller";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import {
  createOtp,
  findMail,
  updateActive,
  resendOtp,
} from "@services/userServices";

/** Create New User With Verification Totp and Sending mail to Exist Email ID */
export const createUserWithOtp = controller(
  async (req: Request, res: Response) => {
    let { first_name, last_name, email, phone } = req.body;

    const secretObj = speakeasy.generateSecret({ length: 20 });
    const secretKey = secretObj.base32;
    const token = speakeasy.totp({
      secret: secretKey,
      encoding: "base32",
      step: 30,
    });

    /** method to  Create QR code URL and send response */
    const url = secretObj.otpauth_url || "";

    qrcode.toDataURL(url, function (err, urlData) {
      if (err) {
        return res.status(422).send({
          success: false,
          statusCode: 422,
          traceID: Date.now(),
          message: "Unable to generate QR code URL and sending mail ",
          path: "http://localhost:8800/api/v1/users/create-otp",
        });
      }

      /** Sending Mail for Verification OTP */
      const message = `
       <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
       <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Totp System Project</h2>
       <p>Hello ${first_name}! Thanks for signup but you need to required verification code of 6 digit after that you can enjoy our website</p>
       <h1 style="text-align: center; text-transform: uppercase;color: red;">${token}</h1>
       </div>
     `;
      sendMail({
        email: email,
        subject: `Otp for email verification ${email}`,
        message,
      });

      res.status(201).send({
        success: true,
        traceID: Date.now(),
        message: `OTP is succesfully Sent to this ${email} or QR Code Generated`,
        qrCodeUrl: urlData,
      });
    });

    await createOtp({
      first_name,
      last_name,
      email,
      phone,
      secretKey,
    });
  }
);

/** controller to validate OTP */
export const verifyValidateTotp = controller(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const userData = await findMail(email);

    if (!userData) {
      return res.status(400).send({
        success: false,
        message: "Email Not Found",
      });
    }

    const secretKey = userData?.secretKey || "";

    const valid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: req.body.otp,
      window: 0,
    });

    if (valid) {
      const email = userData?.email || "";
      const check = await findMail(email);

      if (!check) {
        return res.status(400).send({
          success: false,
          message: "Email Not Found",
        });
      }

      if (check?.active === true) {
        return res.status(409).send({
          success: false,
          statusCode: 409,
          traceID: Date.now(),
          message: "OTP already verified , can't be use this OTP agian",
          path: "http://localhost:8800/api/v1/users/validate-otp",
        });
      }

      const active = true;
      await updateActive(email, active);

      res.status(200).send({
        success: true,
        StatusCode: 200,
        TraceID: Date.now(),
        Message: " Verified OTP Successfully ",
      });
    } else {
      return res.status(401).send({
        success: false,
        statusCode: 401,
        traceID: Date.now(),
        message: "Invalid OTP Entered, Its Not Verified",
        path: "http://localhost:8800/api/v1/users/validate-otp",
      });
    }
  }
);

/** Resend Otp */
export const resendOtpToMail = controller(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const secretFinder = (await resendOtp(email)) || "";

    const token = speakeasy.totp({
      secret: secretFinder,
      encoding: "base32",
      step: 30,
    });

    if (!secretFinder) {
      return res.status(404).send({
        success: false,
        statusCode: 404,
        TraceID: Date.now(),
        message: "User not exist in datbase can not Resend OTP",
        path: "http://localhost:8800/api/v1/users/resend-otp",
      });
    }

    /** Sending Mail for Verification OTP */
    const message = `
       <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
       <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Totp System Project</h2>
       <p>Thanks for signup but you need to required verification code of 6 digit after that you can enjoy our website</p>
       <h1 style="text-align: center; text-transform: uppercase;color: red;">${token}</h1>
       </div>
     `;
    sendMail({
      email: email,
      subject: `Otp for email verification ${email}`,
      message,
    });

    res.status(200).send({
      success: true,
      statusCode: 200,
      TraceID: Date.now(),
      message: `OTP Re-Send Successfully to your ${email} address`,
    });
  }
);
