import type { Transaction } from "@/types/transaction";
import { CategoryEditDropdown } from "@/components/transactions/CategoryEditDropdown";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onCategoryChange: (id: string, category: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export function TransactionTable({
  transactions,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onCategoryChange,
  onDelete,
}: TransactionTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Loading transactions…
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No transactions match these filters.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(t.date)}</td>
                  <td className="px-4 py-3 text-slate-800">{t.description}</td>
                  <td className="px-4 py-3">
                    <CategoryEditDropdown
                      value={t.category}
                      onChange={(category) => onCategoryChange(t.id, category)}
                    />
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-3 text-right tabular-nums font-medium ${
                      t.amount < 0 ? "text-slate-700" : "text-emerald-600"
                    }`}
                  >
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-500">
                    {t.balance != null ? formatCurrency(t.balance) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Button variant="ghost" onClick={() => onDelete(t.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
        <span>
          Page {page} of {totalPages} · {total} transactions
        </span>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </Button>
          <Button
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
