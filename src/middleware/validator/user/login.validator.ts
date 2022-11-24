import { celebrate, Joi, Segments } from "celebrate";
import { emailValidationSchema } from "@middleware/validator/user/signup.validator";

export const validateUserLogin = celebrate(
  {
    [Segments.BODY]: {
      email: emailValidationSchema.required(),
      password: Joi.string().required(),
    },
  },
  { abortEarly: false }
);
