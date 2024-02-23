import express from "express";
import UsersRouter from "./routes/user.router.js";
import AuthRouter from "./routes/auth.router.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// import logMiddleware from "./middlewares/log.middleware.js";
// import errorHandlingMiddleware from "./middlewares/error-handling.middleware.js";
// import { swaggerUi, specs } from "./routes/swagger.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter, AuthRouter]);
// app.use(logMiddleware);
// app.use(express.urlencoded({ extended: true }));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
