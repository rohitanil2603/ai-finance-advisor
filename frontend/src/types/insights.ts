export interface UnusualTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  reason: string;
}

export interface InsightResult {
  id: string;
  periodStart: string;
  periodEnd: string;
  summary: string;
  unusual: UnusualTransaction[];
  observations: string[];
  tips: string[];
  createdAt: string;
}
