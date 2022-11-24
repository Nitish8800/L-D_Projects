import { celebrate, Joi, Segments } from "celebrate";
import { stringValidationSchema } from "../user/signup.validator";

export const createTagsValidation = celebrate(
  {
    [Segments.BODY]: {
      name: stringValidationSchema.required(),
      description: stringValidationSchema.required(),
    },
  },
  { abortEarly: false }
);

export const tagsUpdateValidation = celebrate(
  {
    [Segments.BODY]: {
      name: stringValidationSchema,
      description: stringValidationSchema,
    },
  },
  { abortEarly: false }
);
