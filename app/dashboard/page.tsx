import { getReport } from '@/lib/reporting';
import { DashboardClient } from '@/features/dashboard/components/DashboardClient';

export default async function DashboardPage() {
  const initialData = await getReport({
    orgId: 1,
    startDate: '2026-02-14',
    endDate: '2026-03-15',
    metrics: ['revenue', 'total_spend', 'profit', 'roas'],
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Reporting Dashboard</h1>
      <DashboardClient initialData={initialData} orgId={1} />
    </main>
  );
}
