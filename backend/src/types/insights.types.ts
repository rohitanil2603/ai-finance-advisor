export interface InsightPromptSummary {
  periodStart: string;
  periodEnd: string;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
  byCategory: { category: string; total: number }[];
  topMerchants: { merchant: string; total: number; count: number }[];
  largestTransactions: { description: string; amount: number; date: string; category: string }[];
}

export interface LlmInsightResponse {
  summary: string;
  unusual: { description: string; amount: number; date: string; reason: string }[];
  observations: string[];
  tips: string[];
}
