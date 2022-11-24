import { ObjectIDCustomValidator } from "@utils/objectIdCustomValidator";
import { celebrate, Joi, Segments } from "celebrate";
import { stringValidationSchema } from "../user/signup.validator";

export const createVideoValidation = celebrate(
  {
    [Segments.BODY]: {
      title: stringValidationSchema.required(),
      description: stringValidationSchema.required(),
      tags: ObjectIDCustomValidator.required(),
      categories: ObjectIDCustomValidator.required(),
      video: stringValidationSchema.required(),
    },
  },
  { abortEarly: false }
);

export const videoUpdateValidation = celebrate(
  {
    [Segments.BODY]: {
      title: stringValidationSchema,
      description: stringValidationSchema,
      tags: ObjectIDCustomValidator,
      categories: ObjectIDCustomValidator,
      video: stringValidationSchema,
    },
  },
  { abortEarly: false }
);
