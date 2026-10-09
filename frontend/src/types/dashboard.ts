export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  savingsRate: number; // 0-1
  transactionCount: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface MonthlySeriesPoint {
  month: string; // YYYY-MM
  income: number;
  expense: number;
}

export interface TrendPoint {
  date: string; // YYYY-MM-DD
  amount: number;
}

export interface TopMerchant {
  merchant: string;
  total: number;
  count: number;
}

export interface DashboardCharts {
  byCategory: CategoryTotal[];
  monthly: MonthlySeriesPoint[];
  trend: TrendPoint[];
  topMerchants: TopMerchant[];
}

export interface DateRange {
  from: string;
  to: string;
}
