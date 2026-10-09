import { prisma } from "../config/db";
import type { DateRangeQuery } from "../validators/transaction.validators";

function rangeWhere(userId: string, range: DateRangeQuery) {
  return {
    userId,
    ...((range.from || range.to) && {
      date: {
        ...(range.from && { gte: new Date(range.from) }),
        ...(range.to && { lte: new Date(range.to) }),
      },
    }),
  };
}

export async function getSummary(userId: string, range: DateRangeQuery) {
  const transactions = await prisma.transaction.findMany({ where: rangeWhere(userId, range) });

  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const savingsRate = totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0;

  return { totalIncome, totalExpense, savingsRate, transactionCount: transactions.length };
}

export async function getCharts(userId: string, range: DateRangeQuery) {
  const transactions = await prisma.transaction.findMany({
    where: rangeWhere(userId, range),
    orderBy: { date: "asc" },
  });

  const byCategoryMap = new Map<string, number>();
  const monthlyMap = new Map<string, { income: number; expense: number }>();
  const trendMap = new Map<string, number>();
  const merchantMap = new Map<string, { total: number; count: number }>();

  for (const t of transactions) {
    const monthKey = t.date.toISOString().slice(0, 7);
    const dateKey = t.date.toISOString().slice(0, 10);
    const month = monthlyMap.get(monthKey) ?? { income: 0, expense: 0 };

    if (t.amount > 0) {
      month.income += t.amount;
    } else {
      const expense = Math.abs(t.amount);
      month.expense += expense;

      if (t.category !== "Income") {
        byCategoryMap.set(t.category, (byCategoryMap.get(t.category) ?? 0) + expense);
      }

      trendMap.set(dateKey, (trendMap.get(dateKey) ?? 0) + expense);

      const merchant = merchantMap.get(t.description) ?? { total: 0, count: 0 };
      merchant.total += expense;
      merchant.count += 1;
      merchantMap.set(t.description, merchant);
    }

    monthlyMap.set(monthKey, month);
  }

  const byCategory = [...byCategoryMap.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const monthly = [...monthlyMap.entries()]
    .map(([month, v]) => ({ month, ...v }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const trend = [...trendMap.entries()]
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const topMerchants = [...merchantMap.entries()]
    .map(([merchant, v]) => ({ merchant, ...v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return { byCategory, monthly, trend, topMerchants };
}
