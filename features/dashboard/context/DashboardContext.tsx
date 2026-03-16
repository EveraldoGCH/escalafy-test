'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { MetricName } from '@/lib/metrics';
import { DashboardContextValue, DateRange } from '@/features/dashboard/types';

const DashboardContext = createContext<DashboardContextValue | null>(null);

const DEFAULT_METRICS: MetricName[] = ['revenue', 'total_spend', 'profit', 'roas'];

const DEFAULT_DATE_RANGE: DateRange = {
  startDate: '2026-02-14',
  endDate: '2026-03-15',
};

export function DashboardProvider({
  children,
  orgId,
}: {
  children: ReactNode;
  orgId: number;
}) {
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [selectedMetrics, setSelectedMetrics] = useState<MetricName[]>(DEFAULT_METRICS);

  return (
    <DashboardContext.Provider value={{ orgId, dateRange, setDateRange, selectedMetrics, setSelectedMetrics }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider');
  return ctx;
}
