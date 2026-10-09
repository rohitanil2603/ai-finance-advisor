import { format, parseISO } from "date-fns";

export function formatDate(dateIso: string): string {
  return format(parseISO(dateIso), "d MMM yyyy");
}

export function formatMonth(monthKey: string): string {
  // monthKey like "2025-07"
  return format(parseISO(`${monthKey}-01`), "MMM yyyy");
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function firstOfMonthIso(date = new Date()): string {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
}
