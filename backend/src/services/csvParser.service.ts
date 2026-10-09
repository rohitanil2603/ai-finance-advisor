import { parse } from "csv-parse/sync";
import { AppError } from "../utils/errors";
import { parseFlexibleDate } from "../utils/date";
import type { CsvRowError, ParsedCsvRow } from "../types/transaction.types";

function parseAmount(raw: string | undefined): number | null {
  if (!raw) return null;
  let str = raw.trim();
  if (!str) return null;

  let negative = false;
  if (str.startsWith("(") && str.endsWith(")")) {
    negative = true;
    str = str.slice(1, -1);
  }
  str = str.replace(/[,₹$]/g, "").trim();
  if (!/^-?\d+(\.\d+)?$/.test(str)) return null;

  const value = Number(str);
  if (Number.isNaN(value)) return null;
  return negative ? -Math.abs(value) : value;
}

export function parseCsv(buffer: Buffer): { validRows: ParsedCsvRow[]; rowErrors: CsvRowError[] } {
  let records: Record<string, string>[];
  try {
    records = parse(buffer, {
      columns: (header: string[]) => header.map((h) => h.trim().toLowerCase()),
      skip_empty_lines: true,
      trim: true,
    });
  } catch {
    throw new AppError(400, "Could not parse CSV file. Please check the format.");
  }

  if (records.length === 0) {
    throw new AppError(400, "CSV file is empty.");
  }

  const columns = Object.keys(records[0]);
  const hasAmount = columns.includes("amount");
  const hasDebitCredit = columns.includes("debit") && columns.includes("credit");

  if (!columns.includes("date") || !columns.includes("description") || (!hasAmount && !hasDebitCredit)) {
    throw new AppError(
      400,
      "CSV must have date, description, and amount columns (or debit/credit columns).",
    );
  }

  const validRows: ParsedCsvRow[] = [];
  const rowErrors: CsvRowError[] = [];

  records.forEach((record, index) => {
    const row = index + 1;
    const dateStr = record.date?.trim();
    const description = record.description?.trim();

    const date = dateStr ? parseFlexibleDate(dateStr) : null;
    if (!date) {
      rowErrors.push({ row, message: `Invalid or missing date: "${dateStr ?? ""}"` });
      return;
    }
    if (!description) {
      rowErrors.push({ row, message: "Missing description." });
      return;
    }

    let amount: number | null;
    if (hasAmount) {
      amount = parseAmount(record.amount);
    } else {
      const debit = parseAmount(record.debit) ?? 0;
      const credit = parseAmount(record.credit) ?? 0;
      amount = credit - debit;
    }
    if (amount === null || !Number.isFinite(amount)) {
      rowErrors.push({ row, message: `Invalid amount: "${record.amount ?? ""}"` });
      return;
    }

    const balance = record.balance ? parseAmount(record.balance) : null;

    validRows.push({ date, description, amount, balance });
  });

  return { validRows, rowErrors };
}
