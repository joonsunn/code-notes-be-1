// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { RequestWithUser } from "@src/middlewares/rbac.middleware";
import { HttpError } from "@src/utils/HttpError";

export const authenticate = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  let token = req.cookies?.token || req.headers["authorization"];

  if (!token) {
    // return res.status(401).json({ message: "No token, authorization denied" });
    throw new HttpError("No token, authorization denied", 401);
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      // return res.status(401).json({ message: "Invalid token" });
      throw new HttpError("Invalid token", 401);
    }

    req.user = user; // Attach user to the request object
    next();
  } catch (error) {
    next(error);
    // return res.status(401).json({ message: "Token is not valid" });
  }
};
