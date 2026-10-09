import { useCallback, useEffect, useState } from "react";
import * as dashboardApi from "@/api/dashboard.api";
import { apiErrorMessage } from "@/api/client";
import type { DashboardCharts, DashboardSummary, DateRange } from "@/types/dashboard";
import { firstOfMonthIso, todayIso } from "@/utils/formatDate";

export function useDashboard() {
  const [range, setRange] = useState<DateRange>({ from: firstOfMonthIso(), to: todayIso() });
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, chartsData] = await Promise.all([
        dashboardApi.getSummary(range),
        dashboardApi.getCharts(range),
      ]);
      setSummary(summaryData);
      setCharts(chartsData);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load dashboard data."));
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { range, setRange, summary, charts, loading, error, refetch };
}
