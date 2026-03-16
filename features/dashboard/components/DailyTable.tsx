'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MetricName, ReportResult } from '@/lib/metrics';
import { formatNumber } from '@/lib/formatter';

const METRIC_LABELS: Record<MetricName, string> = {
  revenue: 'Revenue',
  meta_spend: 'Meta Spend',
  google_spend: 'Google Spend',
  total_spend: 'Total Spend',
  profit: 'Profit',
  fees: 'Fees',
  meta_impressions: 'Meta Impr.',
  google_impressions: 'Google Impr.',
  orders: 'Orders',
  meta_cpm: 'Meta CPM',
  google_cpm: 'Google CPM',
  average_order_value: 'AOV',
  roas: 'ROAS',
};

function formatCell(value: number | string | null | undefined): string {
  if (typeof value === 'string') return value;
  return formatNumber(value as number | null | undefined);
}

export function DailyTable({ daily, selectedMetrics }: { daily: ReportResult['daily']; selectedMetrics: MetricName[] }) {
  if (daily.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Sin datos para este período</p>;
  }

  return (
    <div className="overflow-x-auto rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {selectedMetrics.map((m) => (
              <TableHead key={m} className="text-right">{METRIC_LABELS[m]}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {daily.map((row) => (
            <TableRow key={row.date}>
              <TableCell>{row.date}</TableCell>
              {selectedMetrics.map((m) => (
                <TableCell key={m} className="text-right">{formatCell(row[m])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
