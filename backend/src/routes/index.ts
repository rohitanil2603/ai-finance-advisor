import { Router } from "express";
import { authRouter } from "./auth.routes";
import { budgetsRouter } from "./budgets.routes";
import { dashboardRouter } from "./dashboard.routes";
import { insightsRouter } from "./insights.routes";
import { transactionsRouter } from "./transactions.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/transactions", transactionsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/insights", insightsRouter);
router.use("/budgets", budgetsRouter);
