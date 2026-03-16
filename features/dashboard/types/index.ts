import { MetricName, ReportResult } from '@/lib/metrics';

export interface DashboardClientProps {
  initialData: ReportResult;
  orgId: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardContextValue {
  orgId: number;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  selectedMetrics: MetricName[];
  setSelectedMetrics: (metrics: MetricName[]) => void;
}

export interface MetricCardProps {
  name: string;
  value: number | null;
  format: 'currency' | 'integer' | 'decimal';
}
