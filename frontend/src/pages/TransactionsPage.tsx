import { useState } from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Button } from "@/components/ui/Button";

export function TransactionsPage() {
  const {
    transactions,
    total,
    page,
    pageSize,
    filters,
    loading,
    error,
    updateFilters,
    setPage,
    updateCategory,
    removeTransaction,
    refetch,
  } = useTransactions();
  const [deletingError, setDeletingError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingError(null);
    try {
      await removeTransaction(id);
    } catch {
      setDeletingError("Could not delete that transaction. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Transactions</h1>
        <Link to="/upload">
          <Button>Upload CSV</Button>
        </Link>
      </div>

      <TransactionFilters filters={filters} onApply={updateFilters} />

      {error && <ErrorBanner message={error} onRetry={refetch} />}
      {deletingError && <ErrorBanner message={deletingError} />}

      <TransactionTable
        transactions={transactions}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onCategoryChange={updateCategory}
        onDelete={handleDelete}
      />
    </div>
  );
}
