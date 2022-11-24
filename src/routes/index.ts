import { Router } from "express";
import { router as userRouter } from "./user";
const v1Router = Router();

v1Router.use("/users", userRouter);

export { v1Router };
