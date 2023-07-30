import express from "express";
import { validateBody } from "../../decorators/index.js";
import usersSchema from "../../SchemaValidation/usersSchema.js";
import authController from "../../controllers/auth-controller.js";
const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(usersSchema.userSignUpSchema),
  authController.signup
);

authRouter.post(
  "/signin",
  validateBody(usersSchema.userSignInSchema),
  authController.singin
);

export default authRouter;
//
