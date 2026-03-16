'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricName, ReportResult } from '@/lib/metrics';
import { MetricCardProps } from '@/features/dashboard/types';
import { formatNumber, formatInteger } from '@/lib/formatter';

const METRIC_CONFIG: Record<MetricName, { label: string; format: MetricCardProps['format'] }> = {
  revenue: { label: 'Revenue', format: 'currency' },
  meta_spend: { label: 'Meta Spend', format: 'currency' },
  google_spend: { label: 'Google Spend', format: 'currency' },
  total_spend: { label: 'Total Spend', format: 'currency' },
  profit: { label: 'Profit', format: 'currency' },
  fees: { label: 'Fees', format: 'currency' },
  meta_impressions: { label: 'Meta Impressions', format: 'integer' },
  google_impressions: { label: 'Google Impressions', format: 'integer' },
  orders: { label: 'Orders', format: 'integer' },
  meta_cpm: { label: 'Meta CPM', format: 'decimal' },
  google_cpm: { label: 'Google CPM', format: 'decimal' },
  average_order_value: { label: 'Avg Order Value', format: 'currency' },
  roas: { label: 'ROAS', format: 'decimal' },
};

function formatValue(value: number | null | undefined, format: MetricCardProps['format']): string {
  if (format === 'integer') return formatInteger(value);
  return formatNumber(value);
}

export function MetricCards({ totals, selectedMetrics }: { totals: ReportResult['totals']; selectedMetrics: MetricName[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {selectedMetrics.map((metric) => {
        const config = METRIC_CONFIG[metric];
        return (
          <Card key={metric}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{config.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatValue(totals[metric], config.format)}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
