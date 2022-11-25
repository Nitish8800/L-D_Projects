import { celebrate, Joi, Segments } from "celebrate";

export const stringValidationSchema = Joi.string().min(1);

export const emailValidationSchema = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "in"] },
  })
  .trim(true)
  .lowercase();

export const userCreate = celebrate(
  {
    [Segments.BODY]: {
      firstName: stringValidationSchema.required(),
      lastName: stringValidationSchema.required(),
      email: emailValidationSchema.required(),
      phone: Joi.number().integer().required(),
    },
  },
  { abortEarly: false }
);
