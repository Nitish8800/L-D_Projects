import config from "@config/env/config";
import { User } from "@models/user/user.schema";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next("Please Login for access this resource");
  }

  const decodeData = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

  let userDetails;
  const userData = await User.findById(decodeData.id);
  userDetails = userData;
  console.log(userDetails);

  if (!userDetails) {
    return res.status(400).send({
      success: false,
      message: "User Details Not Found",
    });
  }
  req.user = userDetails;
  next();
};

// Admin Roles
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user == undefined) {
      return;
    }

    if (!("isAdmin" in req.user)) {
      return next(`Unauthorized`);
    }

    if (!roles.includes(req.user.isAdmin)) {
      return next(`${req.user.isAdmin} cannot the access this resource`);
    }

    next();
  };
};
