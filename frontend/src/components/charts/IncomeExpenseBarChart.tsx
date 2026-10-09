import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlySeriesPoint } from "@/types/dashboard";
import { CHART_INK, INCOME_EXPENSE_COLORS } from "@/constants/chartColors";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatMonth } from "@/utils/formatDate";

export function IncomeExpenseBarChart({ data }: { data: MonthlySeriesPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-slate-400">
        No data in this range yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={{ fontSize: 12, fill: CHART_INK.muted }}
          axisLine={{ stroke: CHART_INK.axis }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: CHART_INK.muted }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCurrency(v)}
          width={90}
        />
        <Tooltip
          labelFormatter={(label) => formatMonth(String(label))}
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
          contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: CHART_INK.grid }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: CHART_INK.secondary }} />
        <Bar dataKey="income" name="Income" fill={INCOME_EXPENSE_COLORS.income} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name="Expense" fill={INCOME_EXPENSE_COLORS.expense} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
