import config from "@config/env/config";
import cookieParser from "cookie-parser";
import swaggerui from "swagger-ui-express";
import { connectDB } from "@config/database";
import { router as userRouter } from "@routes/user";
import { errors as celebrateErrors } from "celebrate";
import swaggerdoc from "@assets/swagger/swagger.json";
import express, { Request, Response, NextFunction } from "express";

/**
 * All express middleware goes here
 * `express.json()` = parsing request body
 */
const app = express();
app.use(express.json());
app.use(cookieParser());

/**
 * Handaling database connection
 * In this application we are using only MongoDB with helper lib `mongoose`
 */
connectDB();

/**
 * Initilization of API's documentation.
 * We used Swagger 3.
 */
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerdoc));

/**
 * Initializing APIs base routes.
 * APIs base path also depends on server proxy configuration.
 */
app.use("/users", userRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Video Management App Ready ....................... ");
});

/**
 * Handaling All Validations Error with helper lib `celebrate` and "joi"
 */
app.use(celebrateErrors());

/**
 * Connect the PORT
 * Server started at port
 */
app.listen(config.PORT, () => {
  console.log(` Server started at port: http://localhost:${config.PORT}`);
});
