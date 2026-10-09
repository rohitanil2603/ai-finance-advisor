import { prisma } from "../config/db";

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_GAP_DAYS = 25;
const MAX_GAP_DAYS = 35;

// Groups debit transactions by (cleaned description, rounded amount) and flags a group as
// recurring when every consecutive gap between occurrences falls in a "roughly monthly"
// window. Run after every CSV upload so newly imported rows get picked up.
export async function detectRecurring(userId: string): Promise<number> {
  const transactions = await prisma.transaction.findMany({
    where: { userId, amount: { lt: 0 } },
    orderBy: { date: "asc" },
  });

  const groups = new Map<string, typeof transactions>();
  for (const t of transactions) {
    const key = `${t.description}|${Math.round(Math.abs(t.amount))}`;
    const group = groups.get(key) ?? [];
    group.push(t);
    groups.set(key, group);
  }

  const recurringIds: string[] = [];
  for (const group of groups.values()) {
    if (group.length < 2) continue;

    const gaps: number[] = [];
    for (let i = 1; i < group.length; i++) {
      gaps.push((group[i].date.getTime() - group[i - 1].date.getTime()) / DAY_MS);
    }

    const isMonthly = gaps.every((gap) => gap >= MIN_GAP_DAYS && gap <= MAX_GAP_DAYS);
    if (isMonthly) recurringIds.push(...group.map((t) => t.id));
  }

  if (recurringIds.length > 0) {
    await prisma.transaction.updateMany({
      where: { id: { in: recurringIds } },
      data: { isRecurring: true },
    });
  }

  return recurringIds.length;
}
