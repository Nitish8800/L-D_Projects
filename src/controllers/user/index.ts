import bcrypt from "bcryptjs";
import config from "@config/env/config";
import { Request, Response } from "express";
import { sendMail } from "@utils/sendMail.ts";
import jwt, { JwtPayload } from "jsonwebtoken";
import { controller } from "@config/controller";
import { User } from "@models/user/user.schema";
import { getJwtToken } from "@utils/getJwtToken";
import Speakeasy from "speakeasy";
import { OTP } from "@models/otp/otp.schema";

// // // Get User Details
export const getUserDetails = controller(
  async (req: Request, res: Response) => {
    if (req.user === undefined) {
      return res
        .status(404)
        .send({ success: false, message: "User Not Found" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User Not Found" });
    }

    if (!user.verified) {
      return res.send({ success: false, Email_Sent: "Email Not Verified" });
    }

    res
      .status(200)
      .send({ success: true, message: "Get Single User Details", data: user });
  }
);

// // // Register New User
export const createUser = controller(async (req: Request, res: Response) => {
  let { first_name, last_name, email, password } = req.body;

  const findUser = await User.findOne({
    email: email,
  });

  if (findUser) {
    // if (!findUser.verified) {
    //   return res.send({
    //     emailExists:
    //       "Email exists but not verified, please try logging in and verify your account",
    //   });
    // }
    return res.send({
      emailExists: "Email already exists, please try logging in",
    });
  }

  let newUser = await User.create({
    first_name,
    last_name,
    email,
    password,
  });

  let secretObj = Speakeasy.generateSecret({ length: 20 });
  let secretKey = secretObj.base32;
  const token = Speakeasy.totp({
    secret: secretKey,
    encoding: "base32",
  });

  await newUser.save();

  const message = `
    <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
    <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Totp System Project</h2>
    <p>Hello ${first_name}! Thanks for signup but you need to required verification code of 6 digit after that you can enjoy our website</p>
    <h1 style="text-align: center; text-transform: uppercase;color: red;">${token}</h1>
    </div>
  `;
  sendMail({ email: newUser.email, subject: "Verification Code", message });

  res.status(201).send({
    success: true,
    message: `Verification Mail Sent To Email ${newUser.email}`,
    data: { Tokens: token, Secret: secretKey, User: newUser },
  });
});

// // // Login
export const loginUser = controller(async (req: Request, res: Response) => {
  let { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({
      success: false,
      message: "Not Found",
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).send({
      success: false,
      message: "Password is wrong",
    });
  }

  console.log("user", user);

  const token = await getJwtToken(user);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 10923 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  if (!user.verified) {
    return res.send({ success: false, Email_Sent: "Email Not Verified" });
  }

  res.status(200).send({
    success: true,
    message: "Login Successfully",
    data: {
      Tokens: { accessToken: token, expiresIn: config.JWT_EXPIRES },
      User: user,
    },
  });
});

// // // verify email
export const verifyUser = controller(async (req: Request, res: Response) => {
  const verify = {
    valid: Speakeasy.totp.verify({
      secret: req.body.secret,
      encoding: "base32",
      token: req.body.token,
      window: 1,
    }),
  };

  console.log("verify", verify);
  if (verify.valid) {
    let { email } = req.body;
    const user = await User.findOneAndUpdate({ email },{verified:true});

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Not Found",
      });
    }

    const jwtToken = await getJwtToken(user);

    res.cookie("jwt", jwtToken, {
      expires: new Date(Date.now() + 10923 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: "Token is Valid",
      data: user,
    });
  } else {
    return res.status(400).send({
      success: false,
      message: "Token is not valid Please try again",
    });
  }
});

// // // Otp Email Send
export const otpMailSend = controller(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const emailId = await OTP.findOne({ email });

  if (!user) {
    return res.status(400).send({
      success: false,
      message: "Email id not exist",
    });
  }

  const shortMail = "..." + email.substring(email.length - 13);

  if (emailId) {
    return res.status(400).send({
      success: false,
      message: `Already Sent Otp in this ${shortMail}, If it is not working try after a minute`,
    });
  }

  const otpCodeGenerate = Math.floor(Math.random() * (9999 - 1000) + 1000);
  const otpData = new OTP({
    email: req.body.email,
    otpCode: otpCodeGenerate,
    expireIn: 30 - Math.floor((new Date().getTime() / 1000.0) % 30),
  });

  await otpData.save();

  const message = `
  <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
  <h2 style="text-align: center; text-transform: uppercase;color: teal;">Video Management System</h2>
  <h2 style="text-align: center;color: blue;">${otpCodeGenerate}</h2>
  <h3 style="text-align: center;color: red;">This is One Time Password, Please Don't Share This Code To Anyone
  </h3>
  </div>
`;
  sendMail({
    email: user.email,
    subject: "Sending Email for Password Reset",
    message,
  });

  res.status(200).send({
    success: true,
    message: `OTP Sent Successfully, Please Check Your Email Id ${shortMail}`,
  });
});

// // // Change Password
export const changePassword = controller(
  async (req: Request, res: Response) => {
    const { email, otpCode, password } = req.body;

    const data = await OTP.findOne({
      email,
      otpCode,
    });

    if (!data) {
      return res.status(400).send({
        success: false,
        message:
          "OTP is invalid or has been expired. Please enter a valid OTP or request for a new one",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Not Found",
      });
    }

    user.password = password;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password Changed Successfully",
      data: user,
    });
  }
);

// // // Log Out User
export const logOutUser = controller(
  async (req: Request, res: Response): Promise<void> => {
    res.cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).send({ success: true, message: " Log Out Successfully" });
  }
);
