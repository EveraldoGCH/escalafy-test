'use client';

import { useEffect } from 'react';
import { DashboardProvider } from '@/features/dashboard/context/DashboardContext';
import { useGetReports } from '@/features/dashboard/hooks/useGetReports';
import useDebounce from '@/features/dashboard/hooks/useDebounce';
import { MetricCards } from '@/features/dashboard/components/MetricCards';
import { DailyTable } from '@/features/dashboard/components/DailyTable';
import { DateRangePicker } from '@/features/dashboard/components/DateRangePicker';
import { MetricSelector } from '@/features/dashboard/components/MetricSelector';
import { useDashboardContext } from '@/features/dashboard/context/DashboardContext';
import { useNotifications } from '@/context/NotificationsContext';
import { DashboardClientProps } from '@/features/dashboard/types';
import { ReportResult } from '@/lib/metrics';

function DashboardContent({ initialData }: { initialData: ReportResult }) {
  const { orgId, dateRange, selectedMetrics } = useDashboardContext();
  const debouncedDateRange = useDebounce(dateRange, 600);
  const { notify } = useNotifications();
  const { data, isLoading, isError } = useGetReports(
    { orgId, ...debouncedDateRange, metrics: selectedMetrics },
    initialData,
  );

  useEffect(() => {
    console.log('Fetching data with params:', { orgId, ...debouncedDateRange, metrics: selectedMetrics });
  }, [debouncedDateRange]);

  useEffect(() => {
    if (isError) notify('Error al cargar los datos', 'error');
  }, [isError, notify]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DateRangePicker />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Métricas</h2>
        <MetricSelector />
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Cargando...</p>
      ) : isError ? (
        <p className="text-center text-destructive py-8">Error al cargar los datos</p>
      ) : data ? (
        <>
          <MetricCards totals={data.totals} selectedMetrics={selectedMetrics} />
          <DailyTable daily={data.daily} selectedMetrics={selectedMetrics} />
        </>
      ) : null}
    </div>
  );
}

export function DashboardClient({ initialData, orgId }: DashboardClientProps) {
  return (
    <DashboardProvider orgId={orgId}>
      <DashboardContent initialData={initialData} />
    </DashboardProvider>
  );
}
