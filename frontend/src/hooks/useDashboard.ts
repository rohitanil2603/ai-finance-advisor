import { useCallback, useEffect, useRef, useState } from "react";
import * as dashboardApi from "@/api/dashboard.api";
import { apiErrorMessage } from "@/api/client";
import type { DashboardCharts, DashboardSummary, DateRange } from "@/types/dashboard";
import { firstOfMonthIso, todayIso } from "@/utils/formatDate";

// Starts unfiltered so a freshly uploaded or seeded statement (often months/years in the
// past) shows up immediately, instead of defaulting to "this calendar month" and looking
// empty. Once the first unfiltered load reveals the data's actual date span, the picker is
// seeded to [earliest, latest] transaction date so filtering narrows from there.
const UNSET_RANGE: DateRange = { from: "", to: "" };

export function useDashboard() {
  const [range, setRange] = useState<DateRange>(UNSET_RANGE);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasSeededRange = useRef(false);

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

      if (!hasSeededRange.current && range === UNSET_RANGE) {
        hasSeededRange.current = true;
        const dates = chartsData.trend.map((p) => p.date);
        if (dates.length > 0) {
          setRange({ from: dates[0], to: dates[dates.length - 1] });
        } else {
          setRange({ from: firstOfMonthIso(), to: todayIso() });
        }
      }
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load dashboard data."));
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return { range, setRange, summary, charts, loading, error, refetch };
}
