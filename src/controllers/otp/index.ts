import speakeasy, { time } from "speakeasy";
import { Request, Response } from "express";
import * as otpServices from "../services/otp.services";
import { mailSenderFunction } from "../config/mail";
import qrcode from "qrcode";
import { json } from "body-parser";

//controller to create secret key for otp services and send an OTP to provided email address
export const createOtp = async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.body;
    const secretKeyObj = speakeasy.generateSecret({ length: 20 });

    const secretKey = secretKeyObj.base32;
    console.info("secretKey is generated:", Date.now());

    // otp Generater
    const otp = speakeasy.totp({
      secret: secretKey,
      encoding: "base32",
      step: 30,
    });
    console.info("OTP is generated:", Date.now());

    // Email sending otptions
    const mailOptionsSender = {
      to: email,
      subject: `OTP for email verification ${email}`,
      otp: `your OTP is: ${otp} and valid for 60 seconds only`,
    };

    // method to  Create QR code URL and send response
    const url = secretKeyObj.otpauth_url || "";

    qrcode.toDataURL(url, function (err, data_url) {
      if (err) {
        res.status(422).send({
          success: false,
          statusCode: 422,
          TraceID: Date.now(),
          Message: "Unable to generate QR code URL and sending mail ",
          path: "http://localhost:2000/v1/otp/createOtp",
        });
        return;
      }

      // mailSenderFunction(mailOptionsSender); //email sending function
      console.info("OTP sent to Email:", Date.now());

      res.status(200).send({
        success: true,
        statusCode: 200,
        TraceID: Date.now(),
        Message:
          "OTP is successfully sent to provided Email/phone and QR code generated",
        qrCodeUrl: data_url,
      });
      console.info("statusCode 200 and QR code url send:", Date.now());
    });

    await otpServices.createOtp({
      email,
      phone,
      secretKey,
    });
  } catch {
    res.status(400).send({
      success: false,
      statusCode: 400,
      TraceID: Date.now(),
      Message: "bad request somethisng went wrong. Please try again",
      path: "http://localhost:2000/v1/otp/createOtp",
    });
  }
};

// controller to validate OTP
export const validateOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    const tempUserData = await otpServices.validateOtp(email);

    const secretKey = tempUserData?.secretKey || "";

    const valid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: req.body.otp,
      window: 0,
    });

    if (!valid) {
      res.status(401).send({
        success: false,
        statusCode:401,
        TraceID: Date.now(),
        Message:"Invalid OTP Entered, not verified",
        path:"http://localhost:2000/v1/otp/validateOtp"});
      return;
    }

    if (valid) {
      const email = tempUserData?.email || "";
      const check = await otpServices.checkFlag(email);
      if (check?.flag === true) {
        res.status(409).send({
          success:false,
          statusCode:409,
          TraceID:Date.now(),
          Message:"OTP already verified , can't be use this OTP agian",
          path:"http://localhost:2000/v1/otp/validateOtp"
        });
        return;
      }

      const flag = true;
        await otpServices.updateFlag(email, flag);

      res.status(200).send({
        success: true,
        StatusCode:200,
        TraceID:Date.now(),
        Message:"OTP verified successfully"
        
      });
      
    } 
  } catch {
    res.status(400).send({
      success: false,
      statusCode: 400,
      TraceID: Date.now(),
      Message: "bad request, Error at validation of OTP",
      path: "http://localhost:2000/v1/otp/createOtp",
      });
  }
};

// controller to resend OTP
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    const secretFinder = (await otpServices.resendOtp(email)) || "";

    const otp = speakeasy.totp({
      secret: secretFinder,
      encoding: "base32",
      step: 30,
    });

    if (!secretFinder) {
      res.status(404).send({
        success:false,
        statusCode:404,
        TraceID: Date.now(),
        message:"User not exist in DB can not Resend OTP",
        path: "http://localhost:2000/v1/otp/createOtp"});
      return;
    }

    // Email sending otptions
    const mailOptionsSender = {
      to: email,
      subject: `OTP for email verification ${email}`,
      otp: `your OTP is: ${otp} and valid for 30 seconds only`,
    };
    mailSenderFunction(mailOptionsSender);

    res.status(200).send({
      success: true,
      statusCode: 200,
      TraceID: Date.now(),
      message:"otp is successfully Re-Sent to your email address"});
  } catch {
    res.status(400).send({
      success: false,
      statusCode: 400,
      TraceID: Date.now(),
      message:"bad request, error in resending OTP",
      path: "http://localhost:2000/v1/otp/createOtp"});
  }
};
