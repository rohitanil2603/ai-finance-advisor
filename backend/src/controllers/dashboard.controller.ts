import type { Request, Response } from "express";
import * as analyticsService from "../services/analytics.service";
import { asyncHandler } from "../utils/errors";
import type { DateRangeQuery } from "../validators/transaction.validators";

export const summary = asyncHandler(async (req: Request, res: Response) => {
  const range = res.locals.validated as DateRangeQuery;
  res.json(await analyticsService.getSummary(req.user!.id, range));
});

export const charts = asyncHandler(async (req: Request, res: Response) => {
  const range = res.locals.validated as DateRangeQuery;
  res.json(await analyticsService.getCharts(req.user!.id, range));
});
