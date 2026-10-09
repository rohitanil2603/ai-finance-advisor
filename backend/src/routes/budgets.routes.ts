import { Router } from "express";
import * as budgetsController from "../controllers/budgets.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const budgetsRouter = Router();
budgetsRouter.use(requireAuth);

budgetsRouter.get("/status", budgetsController.status);
budgetsRouter.get("/", budgetsController.list);
budgetsRouter.post("/", budgetsController.upsert);
