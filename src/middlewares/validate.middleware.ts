import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { HttpError } from "@src/utils/HttpError";

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        //   return res.status(400).json({ errors: errorMessages });
        throw new HttpError(errorMessages.join(", "), 400);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
