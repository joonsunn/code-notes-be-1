// src/middleware/rbac.middleware.ts

import { Request, Response, NextFunction } from "express";
import { rolePermissions } from "../config/roles";
import User from "@src/models/user.model";
import { HttpError } from "@src/utils/HttpError";

export interface RequestWithUser extends Request {
  user?: User;
}

export const authorize = (requiredPermissions: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userRole = req.user?.role ?? ""; // Assume user's role is added to req.user during authentication

    const userPermissions =
      rolePermissions[userRole as keyof typeof rolePermissions];

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      // return res.status(403).json({ message: "Access denied" });
      throw new HttpError("Access denied", 403);
    }

    next();
  };
};
