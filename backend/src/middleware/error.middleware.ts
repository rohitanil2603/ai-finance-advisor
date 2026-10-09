import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { MulterError } from "multer";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";

// Mounted last in app.ts. Maps every error shape the app can throw to a consistent
// { message, details? } JSON body so the frontend's apiErrorMessage() always has a
// message to show in an ErrorBanner.
export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message, details: err.details });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ message: "Validation failed.", details: err.flatten() });
    return;
  }

  if (err instanceof MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "File is too large." : err.message;
    res.status(400).json({ message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    res.status(409).json({ message: "This record already exists." });
    return;
  }

  logger.error(err);
  res.status(500).json({ message: "Internal server error." });
};
