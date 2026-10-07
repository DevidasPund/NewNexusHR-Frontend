import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ROLE_RANK } from '../lib/constants';
import { compactInr } from '../lib/format';
import PageHeader from '../components/PageHeader';
import {
  Card,
  MonoLabel,
  ProgressRing,
  StatTile,
  IconTile,
  Pill,
  Spinner,
  ProgressBar,
} from '../components/ui/Primitives';
import { ScoreTrendChart } from '../components/charts/Charts';
import {
  IconUsers,
  IconClock,
  IconCalendar,
  IconWallet,
  IconTrophy,
  IconChart,
  IconBuilding,
  IconSparkle,
} from '../components/ui/icons';

const WORKSPACE = [
  { to: '/employees', label: 'Employees', desc: 'Directory & profiles', icon: IconUsers, color: 'violet' },
  { to: '/attendance', label: 'Attendance', desc: 'Clock in & history', icon: IconClock, color: 'blue' },
  { to: '/leave', label: 'Leave', desc: 'Requests & balances', icon: IconCalendar, color: 'amber' },
  { to: '/payroll', label: 'Payroll', desc: 'Payslips & runs', icon: IconWallet, color: 'green' },
  { to: '/performance', label: 'Performance', desc: 'Reviews & growth', icon: IconTrophy, color: 'pink' },
  { to: '/analytics', label: 'Analytics', desc: 'Insights & risk', icon: IconChart, color: 'violet' },
];

function todayLabel() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isManager = (ROLE_RANK[user?.role] || 1) >= 2;

  const [dash, setDash] = useState(null);
  const [myAttendance, setMyAttendance] = useState(null);
  const [myPerf, setMyPerf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const reqs = [
          api.get('/attendance/summary/me').then((r) => setMyAttendance(r.data)).catch(() => {}),
          api.get('/performance/overview/me').then((r) => setMyPerf(r.data)).catch(() => {}),
        ];
        if (isManager) {
          reqs.push(api.get('/analytics/dashboard').then((r) => setDash(r.data)).catch(() => {}));
        }
        await Promise.all(reqs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isManager]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const attendanceRate = myAttendance?.attendanceRate ?? 0;

  return (
    <div>
      <PageHeader
        eyebrow={todayLabel()}
        title={`Welcome back, ${user?.firstName || 'there'}`}
        subtitle="Here's what's happening across your workspace today."
        actions={<Pill status={user?.status || 'ACTIVE'} />}
      />

      {/* Hero row: health ring + KPIs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center lg:col-span-1">
          <MonoLabel className="mb-3 self-start">My attendance rate</MonoLabel>
          <ProgressRing value={attendanceRate} size={160} stroke={12} sublabel="this month" />
          <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-ink">{myAttendance?.present ?? 0}</div>
              <MonoLabel>Present</MonoLabel>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: 'var(--warn)' }}>{myAttendance?.late ?? 0}</div>
              <MonoLabel>Late</MonoLabel>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: 'var(--info)' }}>{myAttendance?.wfh ?? 0}</div>
              <MonoLabel>WFH</MonoLabel>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {isManager && dash ? (
            <>
              <StatTile label="Headcount" value={dash.headcount} icon={<IconUsers size={18} />} colorKey="violet"
                        hint={`${dash.activeCount} active`} />
              <StatTile label="Present today" value={dash.presentToday} icon={<IconClock size={18} />} colorKey="blue"
                        hint={`${dash.onLeaveCount} on leave`} />
              <StatTile label="Pending approvals" value={dash.pendingLeaveApprovals} icon={<IconCalendar size={18} />}
                        colorKey="amber" hint="leave requests" />
              <StatTile label="Payroll (net)" value={compactInr(dash.payrollNetThisMonth)} icon={<IconWallet size={18} />}
                        colorKey="green" hint={dash.month} />
            </>
          ) : (
            <>
              <StatTile label="Avg hours / day" value={(myAttendance?.avgHours ?? 0).toFixed(1)}
                        icon={<IconClock size={18} />} colorKey="blue" hint="this month" />
              <StatTile label="Working days" value={myAttendance?.workingDays ?? 0}
                        icon={<IconCalendar size={18} />} colorKey="amber" hint="this month" />
              <StatTile label="Performance" value={myPerf?.hasReviews ? myPerf.latestScore : '—'}
                        icon={<IconTrophy size={18} />} colorKey="pink" hint={myPerf?.grade ? `Grade ${myPerf.grade}` : 'No reviews'} />
              <StatTile label="Absences" value={myAttendance?.absent ?? 0}
                        icon={<IconChart size={18} />} colorKey="violet" hint="this month" />
            </>
          )}
        </div>
      </div>

      {/* Your Workspace grid */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <IconSparkle size={16} className="text-accent" />
          <h2 className="text-lg font-bold text-ink">Your Workspace</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {WORKSPACE.map((w) => {
            const Icon = w.icon;
            return (
              <button
                key={w.to}
                onClick={() => navigate(w.to)}
                className="card card-pad group flex flex-col items-start gap-3 text-left transition hover:-translate-y-0.5 hover:bg-card-hover"
              >
                <IconTile colorKey={w.color} size="lg">
                  <Icon size={22} />
                </IconTile>
                <div>
                  <div className="text-sm font-semibold text-ink">{w.label}</div>
                  <div className="text-xs text-muted">{w.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trend + risk for managers, or growth for employees */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <MonoLabel>Performance overview</MonoLabel>
              <h3 className="mt-1 text-base font-bold text-ink">
                {isManager ? 'Org score trend' : 'My score trend'}
              </h3>
            </div>
            {isManager && dash && (
              <div className="text-right">
                <div className="text-2xl font-bold text-ink">{dash.avgPerformanceScore}</div>
                <MonoLabel>avg score</MonoLabel>
              </div>
            )}
          </div>
          {(() => {
            const trend = isManager ? dash?.scoreTrend : myPerf?.trend;
            return trend && trend.length > 0 ? (
              <ScoreTrendChart data={trend} />
            ) : (
              <div className="py-12 text-center text-sm text-muted">No performance data yet.</div>
            );
          })()}
        </Card>

        <Card>
          <MonoLabel className="mb-4">{isManager ? 'Attrition risk' : 'My competencies'}</MonoLabel>
          {isManager && dash ? (
            <div className="space-y-4">
              <RiskRow label="High risk" value={dash.highRiskCount} total={dash.activeCount} tone="var(--danger)" />
              <RiskRow label="Medium risk" value={dash.mediumRiskCount} total={dash.activeCount} tone="var(--warn)" />
              <RiskRow label="Low risk" value={dash.lowRiskCount} total={dash.activeCount} tone="var(--success)" />
              <button onClick={() => navigate('/analytics')} className="btn btn-ghost mt-2 w-full">
                View analytics
              </button>
            </div>
          ) : myPerf?.hasReviews ? (
            <div className="space-y-4">
              <Competency label="Delivery" value={myPerf.delivery} />
              <Competency label="Quality" value={myPerf.quality} />
              <Competency label="Collaboration" value={myPerf.collaboration} />
              <Competency label="Ownership" value={myPerf.ownership} />
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted">No reviews yet.</div>
          )}
        </Card>
      </div>
    </div>
  );
}

function RiskRow({ label, value, total, tone }) {
  const pct = total ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold text-ink">{value}</span>
      </div>
      <ProgressBar value={pct} tone={tone} />
    </div>
  );
}

function Competency({ label, value }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold text-ink">{value}</span>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}
