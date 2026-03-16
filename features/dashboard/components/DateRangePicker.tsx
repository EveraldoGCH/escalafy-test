'use client';

import { Input } from '@/components/ui/input';
import { useDashboardContext } from '@/features/dashboard/context/DashboardContext';

export function DateRangePicker() {
  const { dateRange, setDateRange } = useDashboardContext();

  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={dateRange.startDate}
        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
      />
      <span className="text-muted-foreground">—</span>
      <Input
        type="date"
        value={dateRange.endDate}
        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
      />
    </div>
  );
}
