import type { Request, Response } from "express";
import * as insightsService from "../services/insights.service";
import { asyncHandler } from "../utils/errors";

export const getLatest = asyncHandler(async (req: Request, res: Response) => {
  res.json(await insightsService.getLatest(req.user!.id));
});

export const generate = asyncHandler(async (req: Request, res: Response) => {
  res.json(await insightsService.generate(req.user!.id));
});
