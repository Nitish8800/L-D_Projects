import Joi from "joi";
import { ObjectID } from "mongodb";

export const ObjectIDCustomValidator = Joi.custom((value, helper) => {
  if (!ObjectID.isValid(value)) {
    return helper.message({
      custom: `No Record with given ID Please Check The Value ${value}`,
    });
  }
  return value;
});
