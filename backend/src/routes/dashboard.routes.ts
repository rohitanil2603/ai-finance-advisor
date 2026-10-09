import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateQuery } from "../middleware/validate.middleware";
import { dateRangeQuerySchema } from "../validators/transaction.validators";

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

dashboardRouter.get("/summary", validateQuery(dateRangeQuerySchema), dashboardController.summary);
dashboardRouter.get("/charts", validateQuery(dateRangeQuerySchema), dashboardController.charts);
