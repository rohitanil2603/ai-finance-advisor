import { useDashboard } from "@/hooks/useDashboard";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { IncomeExpenseBarChart } from "@/components/charts/IncomeExpenseBarChart";
import { SpendingTrendLineChart } from "@/components/charts/SpendingTrendLineChart";
import { TopMerchantsList } from "@/components/charts/TopMerchantsList";
import { formatCurrency } from "@/utils/formatCurrency";

export function DashboardPage() {
  const { range, setRange, summary, charts, loading, error, refetch } = useDashboard();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading && !summary ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-brand-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryStat label="Income" value={formatCurrency(summary?.totalIncome ?? 0)} />
            <SummaryStat label="Expense" value={formatCurrency(summary?.totalExpense ?? 0)} />
            <SummaryStat
              label="Savings rate"
              value={`${Math.round((summary?.savingsRate ?? 0) * 100)}%`}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Spending by category">
              <CategoryPieChart data={charts?.byCategory ?? []} />
            </Card>
            <Card title="Income vs. expense">
              <IncomeExpenseBarChart data={charts?.monthly ?? []} />
            </Card>
            <Card title="Spending trend">
              <SpendingTrendLineChart data={charts?.trend ?? []} />
            </Card>
            <Card title="Top merchants">
              <TopMerchantsList data={charts?.topMerchants ?? []} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}
