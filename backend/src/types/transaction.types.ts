export interface CsvRowError {
  row: number;
  message: string;
}

export interface ParsedCsvRow {
  date: Date;
  description: string;
  amount: number;
  balance: number | null;
}
