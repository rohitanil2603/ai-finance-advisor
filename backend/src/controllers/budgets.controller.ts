import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/db";
import { CATEGORIES } from "../constants/categories";
import { AppError, asyncHandler } from "../utils/errors";

const upsertSchema = z.object({
  category: z.enum(CATEGORIES),
  monthlyLimit: z.number().positive(),
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const budgets = await prisma.budget.findMany({ where: { userId: req.user!.id } });
  res.json(budgets.map((b) => ({ id: b.id, category: b.category, monthlyLimit: b.monthlyLimit })));
});

export const upsert = asyncHandler(async (req: Request, res: Response) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "Invalid budget payload.", parsed.error.flatten());
  const { category, monthlyLimit } = parsed.data;

  const budget = await prisma.budget.upsert({
    where: { userId_category: { userId: req.user!.id, category } },
    update: { monthlyLimit },
    create: { userId: req.user!.id, category, monthlyLimit },
  });
  res.json({ id: budget.id, category: budget.category, monthlyLimit: budget.monthlyLimit });
});

export const status = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const budgets = await prisma.budget.findMany({ where: { userId } });
  if (budgets.length === 0) {
    res.json([]);
    return;
  }

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const spentRows = await prisma.transaction.groupBy({
    by: ["category"],
    where: { userId, amount: { lt: 0 }, date: { gte: monthStart } },
    _sum: { amount: true },
  });
  const spentMap = new Map(spentRows.map((r) => [r.category, Math.abs(r._sum.amount ?? 0)]));

  res.json(
    budgets.map((b) => {
      const spent = spentMap.get(b.category) ?? 0;
      const ratio = b.monthlyLimit > 0 ? spent / b.monthlyLimit : 0;
      return {
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        spent,
        ratio,
        status: ratio >= 1 ? "over" : ratio >= 0.8 ? "near" : "ok",
      };
    }),
  );
});
