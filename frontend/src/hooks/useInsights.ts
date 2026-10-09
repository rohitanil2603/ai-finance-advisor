import { useCallback, useEffect, useState } from "react";
import * as insightsApi from "@/api/insights.api";
import { apiErrorMessage } from "@/api/client";
import type { InsightResult } from "@/types/insights";

export function useInsights() {
  const [insight, setInsight] = useState<InsightResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    insightsApi
      .getInsights()
      .then(setInsight)
      .catch((err) => setError(apiErrorMessage(err, "Could not load insights.")))
      .finally(() => setLoading(false));
  }, []);

  const generate = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const result = await insightsApi.generateInsights();
      setInsight(result);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not generate insights. Please try again."));
    } finally {
      setGenerating(false);
    }
  }, []);

  return { insight, loading, generating, error, generate };
}
