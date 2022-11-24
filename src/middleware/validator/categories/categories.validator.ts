import { celebrate, Joi, Segments } from "celebrate";
import { stringValidationSchema } from "../user/signup.validator";

export const createCategoriesValidation = celebrate(
  {
    [Segments.BODY]: {
      name: stringValidationSchema.required(),
    },
  },
  { abortEarly: false }
);

export const categoriesUpdateValidation = celebrate(
  {
    [Segments.BODY]: {
      name: stringValidationSchema,
    },
  },
  { abortEarly: false }
);
