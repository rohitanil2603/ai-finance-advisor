import { prisma } from "../config/db";
import { AppError } from "../utils/errors";

// Bonus: CSV export of one calendar month's transactions (chose CSV over PDF — no extra
// rendering dependency, and it round-trips with the upload format).
export async function exportMonthlyCsv(userId: string, month: string): Promise<string> {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new AppError(400, "month must be in YYYY-MM format.");
  }

  const start = new Date(`${month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lt: end } },
    orderBy: { date: "asc" },
  });

  const header = "date,description,category,amount,balance";
  const rows = transactions.map((t) =>
    [
      t.date.toISOString().slice(0, 10),
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      t.amount.toFixed(2),
      t.balance != null ? t.balance.toFixed(2) : "",
    ].join(","),
  );

  return [header, ...rows].join("\n");
}
