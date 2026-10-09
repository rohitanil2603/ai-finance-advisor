import { Card } from "@/components/ui/Card";

export function SavingTipsList({ tips }: { tips: string[] }) {
  return (
    <Card title="Saving tips">
      {tips.length === 0 ? (
        <p className="text-sm text-slate-400">No tips generated.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {tips.map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                {i + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
