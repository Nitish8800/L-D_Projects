import { celebrate, Joi, Segments } from "celebrate";
import { joiPasswordExtendCore } from "joi-password";
const joiPassword = Joi.extend(joiPasswordExtendCore);

export const stringValidationSchema = Joi.string().min(1);

export const passwordValidationSchema = joiPassword
  .string()
  .not(null)
  .minOfSpecialCharacters(1)
  .minOfNumeric(1)
  .minOfLowercase(1)
  .minOfUppercase(1)
  .min(8)
  .max(20)
  .noWhiteSpaces()
  .messages({
    "password.minOfUppercase":
      "{#label} should contain at least {#min} uppercase character",
    "password.minOfSpecialCharacters":
      "{#label} should contain at least {#min} special character",
    "password.minOfLowercase":
      "{#label} should contain at least {#min} lowercase character",
    "password.minOfNumeric":
      "{#label} should contain at least {#min} numeric character",
    "password.noWhiteSpaces": "{#label} should not contain white spaces",
  });

export const emailValidationSchema = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "in"] },
  })
  .trim(true)
  .lowercase();

export const userSignUP = celebrate(
  {
    [Segments.BODY]: {
      first_name: stringValidationSchema.required(),
      last_name: stringValidationSchema.required(),
      email: emailValidationSchema.required(),
      password: passwordValidationSchema.required(),
    },
  },
  { abortEarly: false }
);
