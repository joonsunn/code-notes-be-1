// src/routes/admin.routes.ts

import express from "express";
import { assignRole } from "@src/controllers/admin.controller";
import { authorize } from "@src/middlewares/rbac.middleware";

const adminRouter = express.Router();

// Only admins can update user roles
adminRouter.post("/update-role", authorize(["updateUser"]), assignRole);

export default adminRouter;
