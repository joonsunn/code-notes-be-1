// src/controllers/admin.controller.ts

import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { roles } from "../config/roles";
import { HttpError } from "@src/utils/HttpError";

export const assignRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = req.body;

    if (!Object.values(roles).includes(role)) {
      // return res.status(400).json({ message: "Invalid role" });
      throw new HttpError("Invalid role", 400);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      // return res.status(404).json({ message: "User not found" });
      throw new HttpError("User not found", 404);
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "Role assigned successfully" });
  } catch (error) {
    // res.status(500).json({ message: "Server error" });
    next(error);
  }
};
