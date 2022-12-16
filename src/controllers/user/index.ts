import { Request, Response } from "express";
import { sendMail } from "@utils/sendMail.ts";
import { controller } from "@config/controller";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import {
  createOtp,
  emailExists,
  findMail,
  updateActive,
} from "@services/userServices";

/** Create New User With Verification Totp and Sending mail to Exist Email ID */
export const createUserWithOtp = controller(
  async (req: Request, res: Response) => {
    let { firstName, lastName, email, phone } = req.body;

    const existEmail = await emailExists(email);

    if (!existEmail) {
      /** Generate Secret Key */
      const secretObj = speakeasy.generateSecret({ length: 20 });
      const secretKey = secretObj.base32;
      const otpauthUrl = secretObj.otpauth_url;

      const token = speakeasy.totp({
        secret: secretKey,
        encoding: "base32",
        step: 60,
      });

      const user = await createOtp({
        firstName,
        lastName,
        email,
        phone,
        secretKey,
        otpauthUrl,
      });

      /** method to  Create QR code URL and send response */
      const url = secretObj.otpauth_url || "";

      qrcode.toDataURL(url, function (err, urlData) {
        if (err) {
          res.status(422).send({
            success: false,
            statusCode: 422,
            traceID: Date.now(),
            message: "Unable to generate QR code URL and sending mail ",
            path: "http://localhost:8800/api/v1/users/create-otp",
          });
          return;
        }

        /** Sending Mail for Verification OTP */
        const message = `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Totp System Project</h2>
      <p>Hello ${firstName}! Thanks for signup but you need to required verification code of 6 digit after that you can enjoy our website</p>
      <h1 style="text-align: center; text-transform: uppercase;color: red;">${token}</h1>
      </div>
    `
        sendMail({
          email: email,
          subject: `Otp for email verification ${email}`,
          message,
        });

        res.status(201).send({
          otp: token,
          secretKey: secretKey,
          success: true,
          traceID: Date.now(),
          message: `OTP is successfully Sent to this ${email} or QR Code Generated`,
          qrCodeUrl: urlData,
          data: user,
        });
        return;
      });
      return;
    }

    const userData = await findMail(email);
    const userSecretKey = userData?.secretKey || "";

    if (userData?.isActive == true) {
      return res.status(422).send({
        success: false,
        statusCode: 422,
        traceID: Date.now(),
        message: "Email is already Verified",
        path: "http://localhost:8800/api/v1/users/create-otp",
      });
    }

    const token = speakeasy.totp({
      secret: userSecretKey,
      encoding: "base32",
      step: 30,
    });

    /** method to  Create QR code URL and send response */
    const url = userData?.otpauthUrl || "";
    qrcode.toDataURL(url, function (err, urlData) {
      if (err) {
        res.status(422).send({
          success: false,
          statusCode: 422,
          traceID: Date.now(),
          message: "Unable to generate QR code URL and sending mail ",
          path: "http://localhost:8800/api/v1/users/create-otp",
        });
        return;
      }

      /** Sending Mail for Verification OTP */
      const message = `
         <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
         <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Totp System Project</h2>
         <p>Hello ${firstName}! Thanks for signup but you need to required verification code of 6 digit after that you can enjoy our website</p>
         <h1 style="text-align: center; text-transform: uppercase;color: red;">${token}</h1>
         </div>
       `;
      sendMail({
        email: email,
        subject: `Otp for email verification ${email}`,
        message,
      });

      res.status(200).send({
        otp: token,
        secretKey: userSecretKey,
        success: true,
        traceID: Date.now(),
        message: `User email already exist OTP is successfully Sent to this ${email} or QR Code Generated`,
        qrCodeUrl: urlData,
        data: userData,
      });
    });
  }
);

/** controller to validate OTP from User Data*/
export const verifyValidateTotp = controller(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const userData = await findMail(email);

    if (!userData) {
      return res.status(404).send({
        success: false,
        message: "Email Not Found",
        path: "http://localhost:8800/api/v1/users/validate-otp",
      });
    }

    const secretKey = userData?.secretKey || "";

    const valid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: req.body.otp,
      window: 0,
    });

    if (!valid) {
      res.status(403).send({
        success: false,
        statusCode: 403,
        traceID: Date.now(),
        message: "Invalid OTP Entered",
        path: "http://localhost:8800/api/v1/users/validate-otp",
      });
      return;
    }

    if (valid) {
      const check = await findMail(email);

      if (!check) {
        return res.status(404).send({
          success: false,
          message: "Email Not Found",
        });
      }
      

      if (check?.isActive === true) {
        res.status(409).send({
          success: false,
          statusCode: 409,
          traceID: Date.now(),
          message: "OTP already verified , can't be use this OTP agian",
          path: "http://localhost:8800/api/v1/users/validate-otp",
        });
        return;
      }

      const isActive = true;
      await updateActive(email, isActive);

      res.status(200).send({
        success: true,
        TraceID: Date.now(),
        Message: " Verified OTP Successfully ",
        data: userData,
      });
    }
  }
);
