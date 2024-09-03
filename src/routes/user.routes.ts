// src/routes/user.routes.ts

import { Router } from "express";
import { getUser, updateUser, deleteUser } from "@controllers/user.controller";
import { authorize } from "@middlewares/rbac.middleware";
import { roles } from "@config/roles";
import { assignRole } from "@src/controllers/admin.controller";

export const userRouter = Router();

// Protecting routes with RBAC middleware
userRouter.get("/:id", authorize(["viewUser"]), getUser);
userRouter.put("/:id", authorize(["updateUser"]), updateUser);
userRouter.delete("/:id", authorize(["deleteUser"]), deleteUser);
userRouter.post("/update-role", authorize(["updateUser"]), assignRole);

export default userRouter;
