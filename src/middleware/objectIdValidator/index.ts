import { Joi, celebrate, Segments } from "celebrate";
import { ObjectIDCustomValidator } from "@utils/objectIdCustomValidator";

export const objectIdValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: ObjectIDCustomValidator,
  }),
});
