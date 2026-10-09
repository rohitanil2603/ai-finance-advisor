import { apiClient } from "@/api/client";
import type { DashboardCharts, DashboardSummary, DateRange } from "@/types/dashboard";

export async function getSummary(range: DateRange): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>("/dashboard/summary", {
    params: range,
  });
  return data;
}

export async function getCharts(range: DateRange): Promise<DashboardCharts> {
  const { data } = await apiClient.get<DashboardCharts>("/dashboard/charts", {
    params: range,
  });
  return data;
}
