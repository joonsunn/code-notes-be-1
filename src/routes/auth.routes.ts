import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller";
import { validate } from "@src/middlewares/validate.middleware";
import { registerSchema, loginSchema } from "@src/validations/auth.validation";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.post("/refresh-token", refreshToken);

export default { authRouter };
