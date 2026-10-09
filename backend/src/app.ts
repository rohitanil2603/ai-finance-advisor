import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { allowedOrigins } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { router } from "./routes";
import { AppError } from "./utils/errors";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api", router);

  app.use((_req, _res, next) => next(new AppError(404, "Not found.")));
  app.use(errorMiddleware);

  return app;
}
