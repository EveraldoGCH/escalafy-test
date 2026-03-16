import { useQuery } from '@tanstack/react-query';
import { ReportParams, ReportResult } from '@/lib/metrics';
import { getReportsService } from '@/features/dashboard/services/getReportsService';

export function useGetReports(params: ReportParams, initialData?: ReportResult) {
  return useQuery({
    queryKey: ['report', params.orgId, params.startDate, params.endDate, params.metrics],
    queryFn: () => getReportsService(params),
    placeholderData: initialData,
    staleTime: 1000 * 60 * 5,
  });
}
