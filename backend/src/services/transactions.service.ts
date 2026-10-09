import { prisma } from "../config/db";
import { AppError } from "../utils/errors";
import type { TransactionQuery } from "../validators/transaction.validators";

interface PreparedRow {
  date: Date;
  rawDescription: string;
  description: string;
  amount: number;
  balance: number | null;
  category: string;
}

interface TransactionRow {
  id: string;
  date: Date;
  description: string;
  rawDescription: string;
  amount: number;
  balance: number | null;
  category: string;
  isRecurring: boolean;
  createdAt: Date;
}

function serialize(t: TransactionRow) {
  return {
    id: t.id,
    date: t.date.toISOString().slice(0, 10),
    description: t.description,
    rawDescription: t.rawDescription,
    amount: t.amount,
    balance: t.balance,
    category: t.category,
    isRecurring: t.isRecurring,
    createdAt: t.createdAt.toISOString(),
  };
}

export async function bulkInsert(userId: string, rows: PreparedRow[]): Promise<{ insertedCount: number }> {
  if (rows.length === 0) return { insertedCount: 0 };
  const { count } = await prisma.transaction.createMany({
    data: rows.map((r) => ({ userId, ...r })),
    skipDuplicates: true,
  });
  return { insertedCount: count };
}

export async function list(userId: string, filters: TransactionQuery) {
  const { page, pageSize } = filters;

  const where = {
    userId,
    ...((filters.from || filters.to) && {
      date: {
        ...(filters.from && { gte: new Date(filters.from) }),
        ...(filters.to && { lte: new Date(filters.to) }),
      },
    }),
    ...(filters.category && { category: filters.category }),
    ...((filters.minAmount != null || filters.maxAmount != null) && {
      amount: {
        ...(filters.minAmount != null && { gte: filters.minAmount }),
        ...(filters.maxAmount != null && { lte: filters.maxAmount }),
      },
    }),
    ...(filters.search && {
      OR: [
        { description: { contains: filters.search, mode: "insensitive" as const } },
        { rawDescription: { contains: filters.search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { data: rows.map(serialize), total, page, pageSize };
}

export async function updateCategory(userId: string, id: string, category: string) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError(404, "Transaction not found.");

  const updated = await prisma.transaction.update({ where: { id }, data: { category } });
  return serialize(updated);
}

export async function remove(userId: string, id: string): Promise<void> {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError(404, "Transaction not found.");

  await prisma.transaction.delete({ where: { id } });
}
