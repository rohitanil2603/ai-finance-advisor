import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type Source = "body" | "query" | "params";

// Parses req[source] against the schema and stores the typed, coerced result on
// res.locals.validated for the controller to read — avoids mutating req.query/req.body,
// which some Express versions expose as getter-only.
function validate(schema: ZodSchema, source: Source) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(result.error);
    }
    res.locals.validated = result.data;
    next();
  };
}

export const validateBody = (schema: ZodSchema) => validate(schema, "body");
export const validateQuery = (schema: ZodSchema) => validate(schema, "query");
