import { Card } from "@/components/ui/Card";
import type { UnusualTransaction } from "@/types/insights";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

export function UnusualTransactionsList({ items }: { items: UnusualTransaction[] }) {
  return (
    <Card title="Unusual or high transactions">
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">Nothing unusual stood out this period.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-800">{item.description}</span>
                <span className="tabular-nums font-medium text-slate-700">
                  {formatCurrency(item.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{item.reason}</span>
                <span>{formatDate(item.date)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
