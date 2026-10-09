import type { Category } from "@/constants/categories";

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  rawDescription: string;
  amount: number; // negative = debit, positive = credit
  balance: number | null;
  category: Category | string;
  isRecurring: boolean;
  createdAt: string;
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CsvRowError {
  row: number;
  message: string;
}

export interface UploadResult {
  imported: number;
  skipped: number;
  errors: CsvRowError[];
}
