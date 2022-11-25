import { celebrate, Joi, Segments } from "celebrate";
import {
  emailValidationSchema,
  stringValidationSchema,
} from "@middleware/validator/user/user.create.validator";

export const verifyUser = celebrate(
  {
    [Segments.BODY]: {
      email: emailValidationSchema.required(),
      otp: stringValidationSchema.required(),
    },
  },
  { abortEarly: false }
);
