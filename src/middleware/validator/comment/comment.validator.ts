import { ObjectIDCustomValidator } from "@utils/objectIdCustomValidator";
import { celebrate, Joi, Segments } from "celebrate";
import { stringValidationSchema } from "../user/signup.validator";

export const createCommentsValidation = celebrate(
  {
    [Segments.BODY]: {
      comment: stringValidationSchema.required(),
      videoId: ObjectIDCustomValidator.required(),
    },
  },
  { abortEarly: false }
);

export const commentsUpdateValidation = celebrate(
  {
    [Segments.BODY]: {
      comment: stringValidationSchema,
      videoId: ObjectIDCustomValidator,
    },
  },
  { abortEarly: false }
);
