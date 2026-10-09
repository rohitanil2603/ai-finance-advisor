import type { Request, Response } from "express";
import { categorizeAndClean } from "../services/categorization.service";
import { parseCsv } from "../services/csvParser.service";
import { detectRecurring } from "../services/recurring.service";
import * as transactionsService from "../services/transactions.service";
import { exportMonthlyCsv } from "../services/export.service";
import { AppError, asyncHandler } from "../utils/errors";
import type { TransactionQuery, TransactionUpdate } from "../validators/transaction.validators";

export const upload = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(400, "Please upload a .csv file.");

  const { validRows, rowErrors } = parseCsv(req.file.buffer);

  const prepared = validRows.map((row) => {
    const { cleanDescription, category } = categorizeAndClean(row.description);
    return {
      date: row.date,
      rawDescription: row.description,
      description: cleanDescription,
      amount: row.amount,
      balance: row.balance,
      category,
    };
  });

  const { insertedCount } = await transactionsService.bulkInsert(req.user!.id, prepared);
  await detectRecurring(req.user!.id);

  res.json({
    imported: insertedCount,
    skipped: prepared.length - insertedCount,
    errors: rowErrors,
  });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const filters = res.locals.validated as TransactionQuery;
  res.json(await transactionsService.list(req.user!.id, filters));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = res.locals.validated as TransactionUpdate;
  res.json(await transactionsService.updateCategory(req.user!.id, req.params.id, category));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await transactionsService.remove(req.user!.id, req.params.id);
  res.sendStatus(204);
});

export const exportMonth = asyncHandler(async (req: Request, res: Response) => {
  const month = String(req.query.month ?? "");
  const csv = await exportMonthlyCsv(req.user!.id, month);
  res.type("text/csv").attachment(`statement-${month}.csv`).send(csv);
});
