import { useEffect, useState } from 'react';
import api from '../lib/api';
import { compactInr } from '../lib/format';
import PageHeader from '../components/PageHeader';
import { Card, MonoLabel, Avatar, Pill, StatTile, ProgressBar, Spinner, EmptyState } from '../components/ui/Primitives';
import { ScoreTrendChart, CategoryBarChart } from '../components/charts/Charts';
import { IconUsers, IconClock, IconWallet, IconTrophy } from '../components/ui/icons';

export default function Analytics() {
  const [dash, setDash] = useState(null);
  const [risk, setRisk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [d, r] = await Promise.all([
        api.get('/analytics/dashboard').then((res) => res.data).catch(() => null),
        api.get('/analytics/attrition').then((res) => res.data).catch(() => []),
      ]);
      setDash(d);
      setRisk(r);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
  if (!dash) return <EmptyState title="No analytics available" message="Data could not be loaded." />;

  const deptData = (dash.headcountByDept || []).map((d) => ({ label: d.department, value: d.count }));

  return (
    <div>
      <PageHeader eyebrow={dash.month} title="Analytics" subtitle="Organization insights, trends, and attrition risk." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Headcount" value={dash.headcount} icon={<IconUsers size={18} />} colorKey="violet" hint={`${dash.activeCount} active`} />
        <StatTile label="Present today" value={dash.presentToday} icon={<IconClock size={18} />} colorKey="blue" hint={`${dash.onLeaveCount} on leave`} />
        <StatTile label="Payroll (net)" value={compactInr(dash.payrollNetThisMonth)} icon={<IconWallet size={18} />} colorKey="green" hint={dash.month} />
        <StatTile label="Avg score" value={dash.avgPerformanceScore} icon={<IconTrophy size={18} />} colorKey="pink" hint="performance" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <MonoLabel className="mb-4">Headcount by department</MonoLabel>
          <CategoryBarChart data={deptData} />
        </Card>
        <Card>
          <MonoLabel className="mb-4">Org score trend</MonoLabel>
          {dash.scoreTrend?.length > 0 ? (
            <ScoreTrendChart data={dash.scoreTrend} />
          ) : (
            <div className="py-12 text-center text-sm text-muted">No trend data yet.</div>
          )}
        </Card>
      </div>

      {/* Attrition risk board */}
      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <MonoLabel>Attrition risk board</MonoLabel>
          <div className="flex items-center gap-3 text-xs">
            <Legend tone="var(--danger)" label={`High ${dash.highRiskCount}`} />
            <Legend tone="var(--warn)" label={`Medium ${dash.mediumRiskCount}`} />
            <Legend tone="var(--success)" label={`Low ${dash.lowRiskCount}`} />
          </div>
        </div>
        {risk.length === 0 ? (
          <EmptyState title="No risk data" message="Attrition scores will appear here." />
        ) : (
          <div className="space-y-2.5">
            {risk.map((r) => {
              const tone = r.band === 'HIGH' ? 'var(--danger)' : r.band === 'MEDIUM' ? 'var(--warn)' : 'var(--success)';
              return (
                <div key={r.employeeId} className="flex items-center gap-4 rounded-xl border p-3"
                     style={{ borderColor: 'var(--border)' }}>
                  <Avatar name={r.employeeName} colorKey={r.avatarColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-ink">{r.employeeName}</span>
                      <span className="truncate text-xs text-muted">· {r.designation}</span>
                    </div>
                    {r.factors?.length > 0 && (
                      <div className="mt-0.5 truncate text-xs text-muted">{r.factors.join(' · ')}</div>
                    )}
                  </div>
                  <div className="hidden w-40 sm:block">
                    <ProgressBar value={r.score} tone={tone} />
                  </div>
                  <div className="w-10 text-right text-sm font-bold text-ink">{r.score}</div>
                  <Pill status={r.band} />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function Legend({ tone, label }) {
  return (
    <span className="flex items-center gap-1.5 text-muted">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: tone }} />
      {label}
    </span>
  );
}
