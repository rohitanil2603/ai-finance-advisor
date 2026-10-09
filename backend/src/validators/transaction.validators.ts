import { z } from "zod";
import { CATEGORIES } from "../constants/categories";

export const transactionQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  category: z.enum(CATEGORIES).optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;

export const transactionUpdateSchema = z.object({
  category: z.enum(CATEGORIES),
});
export type TransactionUpdate = z.infer<typeof transactionUpdateSchema>;

export const dateRangeQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;
