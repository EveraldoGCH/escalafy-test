'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { VALID_METRICS, MetricName } from '@/lib/metrics';
import { useDashboardContext } from '@/features/dashboard/context/DashboardContext';

const METRIC_LABELS: Record<MetricName, string> = {
  revenue: 'Revenue',
  meta_spend: 'Meta Spend',
  google_spend: 'Google Spend',
  total_spend: 'Total Spend',
  profit: 'Profit',
  fees: 'Fees',
  meta_impressions: 'Meta Impressions',
  google_impressions: 'Google Impressions',
  orders: 'Orders',
  meta_cpm: 'Meta CPM',
  google_cpm: 'Google CPM',
  average_order_value: 'Avg Order Value',
  roas: 'ROAS',
};

export function MetricSelector() {
  const { selectedMetrics, setSelectedMetrics } = useDashboardContext();

  const toggle = (metric: MetricName) => {
    if (selectedMetrics.includes(metric)) {
      if (selectedMetrics.length === 1) return;
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {VALID_METRICS.map((metric) => (
        <label key={metric} className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={selectedMetrics.includes(metric)}
            onCheckedChange={() => toggle(metric)}
          />
          {METRIC_LABELS[metric]}
        </label>
      ))}
    </div>
  );
}
