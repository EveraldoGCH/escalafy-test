import { api } from '@/lib/api';
import { ReportParams, ReportResult } from '@/lib/metrics';

export function getReportsService({ orgId, startDate, endDate, metrics }: ReportParams): Promise<ReportResult> {
  const params = new URLSearchParams({
    orgId: String(orgId),
    startDate,
    endDate,
    metrics: metrics.join(','),
  });
  return api<ReportResult>(`/api/reporting?${params.toString()}`);
}
