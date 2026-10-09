import { useInsights } from "@/hooks/useInsights";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Spinner } from "@/components/ui/Spinner";
import { InsightsSummaryCard } from "@/components/insights/InsightsSummaryCard";
import { UnusualTransactionsList } from "@/components/insights/UnusualTransactionsList";
import { SavingTipsList } from "@/components/insights/SavingTipsList";
import { GenerateInsightsButton } from "@/components/insights/GenerateInsightsButton";

export function InsightsPage() {
  const { insight, loading, generating, error, generate } = useInsights();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">AI Insights</h1>
          <p className="text-sm text-slate-500">
            A plain-language summary of your spending, generated from your own transactions.
          </p>
        </div>
        <GenerateInsightsButton
          loading={generating}
          hasExisting={!!insight}
          onClick={generate}
        />
      </div>

      {error && <ErrorBanner message={error} onRetry={generate} />}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-brand-600" />
        </div>
      ) : !insight ? (
        <Card>
          <p className="text-sm text-slate-500">
            No insights yet. Click "Generate insights" to get a summary, unusual transactions,
            and saving tips based on your uploaded data.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <InsightsSummaryCard
            summary={insight.summary}
            periodStart={insight.periodStart}
            periodEnd={insight.periodEnd}
            generatedAt={insight.createdAt}
          />

          {insight.observations.length > 0 && (
            <Card title="Category observations">
              <ul className="flex flex-col gap-2">
                {insight.observations.map((observation, i) => (
                  <li key={i} className="text-sm text-slate-700">
                    • {observation}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UnusualTransactionsList items={insight.unusual} />
            <SavingTipsList tips={insight.tips} />
          </div>
        </div>
      )}
    </div>
  );
}
