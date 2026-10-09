import { apiClient } from "@/api/client";
import type { InsightResult } from "@/types/insights";

export async function getInsights(): Promise<InsightResult | null> {
  const { data } = await apiClient.get<InsightResult | null>("/insights");
  return data;
}

export async function generateInsights(): Promise<InsightResult> {
  const { data } = await apiClient.post<InsightResult>("/insights/generate");
  return data;
}
