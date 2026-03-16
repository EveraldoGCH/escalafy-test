export const VALID_METRICS = [
  'meta_spend', 'meta_impressions', 'google_spend', 'google_impressions',
  'revenue', 'orders', 'fees',
  'meta_cpm', 'google_cpm', 'average_order_value',
  'total_spend', 'profit', 'roas',
] as const;

export type MetricName = typeof VALID_METRICS[number];

export interface DailyRow {
  date: string;
  [key: string]: number | string | null;
}

export interface ReportResult {
  totals: Partial<Record<MetricName, number | null>>;
  daily: DailyRow[];
}

export interface ReportParams {
  orgId: number;
  startDate: string;
  endDate: string;
  metrics: MetricName[];
}
