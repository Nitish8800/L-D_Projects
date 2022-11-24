import { celebrate, Joi, Segments } from "celebrate";
import {
  emailValidationSchema,
  passwordValidationSchema,
  stringValidationSchema,
} from "./signup.validator";

export const validateChangePassword = celebrate(
  {
    [Segments.BODY]: {
      email: emailValidationSchema.required(),
      otpCode: stringValidationSchema.required(),
      password: passwordValidationSchema.required(),
    },
  },
  { abortEarly: false }
);

