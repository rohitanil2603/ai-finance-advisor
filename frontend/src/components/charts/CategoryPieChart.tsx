import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryTotal } from "@/types/dashboard";
import { categoryColor } from "@/constants/categories";
import { CHART_INK } from "@/constants/chartColors";
import { formatCurrency } from "@/utils/formatCurrency";

export function CategoryPieChart({ data }: { data: CategoryTotal[] }) {
  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          stroke={CHART_INK.surface}
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.category} fill={categoryColor(entry.category)} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
          contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: CHART_INK.grid }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: CHART_INK.secondary }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-slate-400">
      No spending in this range yet.
    </div>
  );
}
