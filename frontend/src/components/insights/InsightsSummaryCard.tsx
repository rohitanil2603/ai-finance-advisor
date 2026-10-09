import { Card } from "@/components/ui/Card";
import { formatDate } from "@/utils/formatDate";

interface InsightsSummaryCardProps {
  summary: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
}

export function InsightsSummaryCard({
  summary,
  periodStart,
  periodEnd,
  generatedAt,
}: InsightsSummaryCardProps) {
  return (
    <Card title={`Spending summary — ${formatDate(periodStart)} to ${formatDate(periodEnd)}`}>
      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{summary}</p>
      <p className="mt-3 text-xs text-slate-400">Generated {formatDate(generatedAt)}</p>
    </Card>
  );
}
