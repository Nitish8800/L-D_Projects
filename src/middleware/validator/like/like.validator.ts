import { ObjectIDCustomValidator } from "@utils/objectIdCustomValidator";
import { celebrate, Joi, Segments } from "celebrate";
import { stringValidationSchema } from "../user/signup.validator";

export const createlikeValidation = celebrate(
  {
    [Segments.BODY]: {
      type: stringValidationSchema.required(),
      videoId: ObjectIDCustomValidator.required(),
    },
  },
  { abortEarly: false }
);

