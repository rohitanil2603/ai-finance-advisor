import { apiClient } from "@/api/client";
import type {
  PaginatedTransactions,
  Transaction,
  TransactionFilters,
  UploadResult,
} from "@/types/transaction";

export async function uploadCsv(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<UploadResult>("/transactions/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function listTransactions(
  filters: TransactionFilters,
): Promise<PaginatedTransactions> {
  const { data } = await apiClient.get<PaginatedTransactions>("/transactions", {
    params: filters,
  });
  return data;
}

export async function updateCategory(id: string, category: string): Promise<Transaction> {
  const { data } = await apiClient.patch<Transaction>(`/transactions/${id}`, { category });
  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await apiClient.delete(`/transactions/${id}`);
}
