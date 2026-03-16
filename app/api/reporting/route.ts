import { getReport } from '@/lib/reporting';
import { VALID_METRICS, MetricName } from '@/lib/metrics';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const orgId = Number(searchParams.get('orgId'));
  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';
  const metricsParam = searchParams.get('metrics') ?? '';
  const metrics = metricsParam ? metricsParam.split(',') : [];

  if (!orgId || isNaN(orgId))
    return Response.json({ error: 'orgId requerido' }, { status: 400 });

  if (!startDate || !endDate)
    return Response.json({ error: 'startDate y endDate son requeridos' }, { status: 400 });

  if (startDate > endDate)
    return Response.json({ error: 'startDate debe ser anterior a endDate' }, { status: 400 });

  if (metrics.length === 0)
    return Response.json({ error: 'metrics es requerido' }, { status: 400 });

  if (!metrics.every((m) => VALID_METRICS.includes(m as MetricName)))
    return Response.json({ error: 'Métrica inválida' }, { status: 400 });

  try {
    const result = await getReport({ orgId, startDate, endDate, metrics: metrics as MetricName[] });
    return Response.json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found'))
      return Response.json({ error: error.message }, { status: 404 });

    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
