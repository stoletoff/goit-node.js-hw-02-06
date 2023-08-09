import express from "express";
import { validateBody } from "../../decorators/index.js";
import usersSchema from "../../SchemaValidation/usersSchema.js";
import authController from "../../controllers/auth-controller.js";
import { authenticate } from "../../middlewars/index.js";
const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(usersSchema.registerationSchema),
  authController.register
);

authRouter.post(
  "/login",
  validateBody(usersSchema.loginSchema),
  authController.login
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;
