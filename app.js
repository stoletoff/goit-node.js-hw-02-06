import express from "express";
import authRouter from "./routes/api/auth-routers.js";
import contactsRouter from "./routes/api/contacts-router.js";
import logger from "morgan";
import cors from "cors";
const app = express();



const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter)
app.use("/api/contacts", contactsRouter);

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
