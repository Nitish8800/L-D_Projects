import { celebrate, Joi, Segments } from "celebrate";
import { emailValidationSchema } from "@middleware/validator/user/signup.validator";

export const validateForgetPassword = celebrate(
  {
    [Segments.BODY]: {
      email: emailValidationSchema.required(),
    },
  },
  { abortEarly: false }
);
