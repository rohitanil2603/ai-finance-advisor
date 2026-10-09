import type { TopMerchant } from "@/types/dashboard";
import { formatCurrency } from "@/utils/formatCurrency";
import { TREND_LINE_COLOR } from "@/constants/chartColors";

export function TopMerchantsList({ data }: { data: TopMerchant[] }) {
  if (data.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">No merchants in this range yet.</p>;
  }

  const max = Math.max(...data.map((m) => m.total));

  return (
    <ul className="flex flex-col gap-3">
      {data.map((merchant) => (
        <li key={merchant.merchant} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{merchant.merchant}</span>
            <span className="tabular-nums text-slate-500">{formatCurrency(merchant.total)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(merchant.total / max) * 100}%`,
                backgroundColor: TREND_LINE_COLOR,
              }}
            />
          </div>
          <span className="text-xs text-slate-400">{merchant.count} transactions</span>
        </li>
      ))}
    </ul>
  );
}
