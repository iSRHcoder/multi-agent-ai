import express from "express";
import { login, logtout } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.get("/logout", logtout);

export default authRouter;
