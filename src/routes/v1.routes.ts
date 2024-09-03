import { Router } from "express";
import { authRouter } from "@routes/auth.routes";
import userRouter from "@src/routes/user.routes";
import { authenticate } from "@src/middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", authenticate, userRouter);

export default router;
