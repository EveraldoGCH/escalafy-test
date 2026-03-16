import { prisma } from './prisma';
import { MetricName, ReportParams, ReportResult, DailyRow } from './metrics';

interface RawDay {
  meta_spend: number;
  meta_impressions: number;
  google_spend: number;
  google_impressions: number;
  revenue: number;
  orders: number;
  fees: number;
}

function computeMetrics(raw: RawDay): Record<MetricName, number | null> {
  const total_spend = raw.meta_spend + raw.google_spend;
  return {
    meta_spend: raw.meta_spend,
    meta_impressions: raw.meta_impressions,
    google_spend: raw.google_spend,
    google_impressions: raw.google_impressions,
    revenue: raw.revenue,
    orders: raw.orders,
    fees: raw.fees,
    meta_cpm: raw.meta_impressions > 0 ? (raw.meta_spend / raw.meta_impressions) * 1000 : null,
    google_cpm: raw.google_impressions > 0 ? (raw.google_spend / raw.google_impressions) * 1000 : null,
    average_order_value: raw.orders > 0 ? raw.revenue / raw.orders : null,
    total_spend,
    profit: raw.revenue - raw.meta_spend - raw.google_spend - raw.fees,
    roas: total_spend > 0 ? raw.revenue / total_spend : null,
  };
}

function pickMetrics(
  computed: Record<MetricName, number | null>,
  metrics: MetricName[],
): Partial<Record<MetricName, number | null>> {
  return Object.fromEntries(metrics.map((m) => [m, computed[m]]));
}

export async function getReport({ orgId, startDate, endDate, metrics }: ReportParams): Promise<ReportResult> {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) throw new Error(`Organization ${orgId} not found`);

  const start = new Date(startDate);
  const end = new Date(endDate);

  const [metaRows, googleRows, storeRows] = await Promise.all([
    prisma.meta_ads_data.findMany({
      where: { account_id: org.meta_account_id, date: { gte: start, lte: end } },
    }),
    prisma.google_ads_data.findMany({
      where: { account_id: org.google_account_id, date: { gte: start, lte: end } },
    }),
    prisma.store_data.findMany({
      where: { store_id: org.store_id, date: { gte: start, lte: end } },
    }),
  ]);

  const dayMap = new Map<string, RawDay>();

  const getOrCreate = (date: string): RawDay => {
    if (!dayMap.has(date)) {
      dayMap.set(date, {
        meta_spend: 0, meta_impressions: 0,
        google_spend: 0, google_impressions: 0,
        revenue: 0, orders: 0, fees: 0,
      });
    }
    return dayMap.get(date)!;
  };

  for (const row of metaRows) {
    const d = getOrCreate(row.date.toISOString().slice(0, 10));
    d.meta_spend = Number(row.spend);
    d.meta_impressions = row.impressions;
  }

  for (const row of googleRows) {
    const d = getOrCreate(row.date.toISOString().slice(0, 10));
    d.google_spend = Number(row.spend);
    d.google_impressions = row.impressions;
  }

  for (const row of storeRows) {
    const d = getOrCreate(row.date.toISOString().slice(0, 10));
    d.revenue = Number(row.revenue);
    d.orders = row.orders;
    d.fees = Number(row.fees);
  }

  const sortedDates = [...dayMap.keys()].sort();

  const daily: DailyRow[] = sortedDates.map((date) => {
    const computed = computeMetrics(dayMap.get(date)!);
    return { date, ...pickMetrics(computed, metrics) };
  });

  const totalsRaw: RawDay = { meta_spend: 0, meta_impressions: 0, google_spend: 0, google_impressions: 0, revenue: 0, orders: 0, fees: 0 };
  for (const raw of dayMap.values()) {
    totalsRaw.meta_spend += raw.meta_spend;
    totalsRaw.meta_impressions += raw.meta_impressions;
    totalsRaw.google_spend += raw.google_spend;
    totalsRaw.google_impressions += raw.google_impressions;
    totalsRaw.revenue += raw.revenue;
    totalsRaw.orders += raw.orders;
    totalsRaw.fees += raw.fees;
  }

  const totals = pickMetrics(computeMetrics(totalsRaw), metrics);

  return { totals, daily };
}
