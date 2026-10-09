import { useCallback, useEffect, useState } from "react";
import * as transactionsApi from "@/api/transactions.api";
import { apiErrorMessage } from "@/api/client";
import type { PaginatedTransactions, Transaction, TransactionFilters } from "@/types/transaction";

const DEFAULT_PAGE_SIZE = 20;

export function useTransactions(initialFilters: TransactionFilters = {}) {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    ...initialFilters,
  });
  const [result, setResult] = useState<PaginatedTransactions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionsApi.listTransactions(filters);
      setResult(data);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load transactions."));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const updateFilters = useCallback((patch: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const updateCategory = useCallback(async (id: string, category: string) => {
    const updated = await transactionsApi.updateCategory(id, category);
    setResult((prev) =>
      prev
        ? { ...prev, data: prev.data.map((t) => (t.id === id ? updated : t)) }
        : prev,
    );
  }, []);

  const removeTransaction = useCallback(async (id: string) => {
    await transactionsApi.deleteTransaction(id);
    setResult((prev) =>
      prev
        ? { ...prev, data: prev.data.filter((t: Transaction) => t.id !== id), total: prev.total - 1 }
        : prev,
    );
  }, []);

  return {
    transactions: result?.data ?? [],
    total: result?.total ?? 0,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? DEFAULT_PAGE_SIZE,
    filters,
    loading,
    error,
    updateFilters,
    setPage,
    updateCategory,
    removeTransaction,
    refetch,
  };
}
