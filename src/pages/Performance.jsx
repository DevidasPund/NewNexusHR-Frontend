import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ROLE_RANK } from '../lib/constants';
import { dateShort } from '../lib/format';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/ui/Tabs';
import DataTable from '../components/ui/DataTable';
import { Card, MonoLabel, ProgressRing, ProgressBar, StatTile, Avatar, Badge, Spinner, EmptyState } from '../components/ui/Primitives';
import { ScoreTrendChart } from '../components/charts/Charts';
import { IconTrophy, IconChart, IconPulse } from '../components/ui/icons';

export default function Performance() {
  const { user } = useAuth();
  const isManager = ROLE_RANK[user?.role] >= 2;

  const [tab, setTab] = useState('me');
  const [overview, setOverview] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const reqs = [
        api.get('/performance/overview/me').then((r) => setOverview(r.data)).catch(() => {}),
        api.get('/performance/me').then((r) => setMyReviews(r.data)).catch(() => {}),
      ];
      if (isManager) {
        reqs.push(api.get('/performance').then((r) => setAllReviews(r.data)).catch(() => {}));
      }
      await Promise.all(reqs);
      setLoading(false);
    };
    load();
  }, [isManager]);

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;

  const tabs = [{ key: 'me', label: 'My performance' }];
  if (isManager) tabs.push({ key: 'team', label: 'Team reviews' });

  const teamColumns = [
    {
      key: 'employee', header: 'Employee',
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={r.employeeName} colorKey={r.avatarColor} size="sm" />
          <div>
            <div className="font-medium text-ink">{r.employeeName}</div>
            <div className="text-xs text-muted">{r.designation}</div>
          </div>
        </div>
      ),
    },
    { key: 'period', header: 'Period' },
    { key: 'overallScore', header: 'Score', align: 'right', render: (r) => <span className="font-semibold text-ink">{r.overallScore}</span> },
    { key: 'grade', header: 'Grade', render: (r) => <Badge>{r.grade}</Badge> },
    { key: 'reviewDate', header: 'Reviewed', align: 'right', render: (r) => dateShort(r.reviewDate) },
  ];

  return (
    <div>
      <PageHeader eyebrow="Growth" title="Performance" subtitle="Reviews, scores, and competency tracking." />

      {isManager && <Tabs tabs={tabs} active={tab} onChange={setTab} />}

      <div className="mt-5">
        {tab === 'me' ? (
          overview?.hasReviews ? (
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="flex flex-col items-center justify-center">
                  <MonoLabel className="mb-3 self-start">Performance overview</MonoLabel>
                  <ProgressRing value={overview.latestScore} label={String(overview.latestScore)} sublabel={`Grade ${overview.grade}`} size={160} stroke={12} />
                  <div className="mt-3 text-xs text-muted">Latest review score</div>
                </Card>

                <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                  <StatTile label="Average" value={overview.average} icon={<IconChart size={18} />} colorKey="violet" hint={`${overview.reviewsCount} reviews`} />
                  <StatTile label="Best" value={overview.best} icon={<IconTrophy size={18} />} colorKey="green" hint="all time" />
                  <Card className="col-span-2">
                    <MonoLabel className="mb-3">Competencies</MonoLabel>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <Comp label="Delivery" value={overview.delivery} />
                      <Comp label="Quality" value={overview.quality} />
                      <Comp label="Collaboration" value={overview.collaboration} />
                      <Comp label="Ownership" value={overview.ownership} />
                    </div>
                  </Card>
                </div>
              </div>

              <Card className="mt-4">
                <div className="mb-4 flex items-center gap-2">
                  <IconPulse size={16} className="text-accent" />
                  <MonoLabel>Score trend</MonoLabel>
                </div>
                {overview.trend?.length > 0 ? (
                  <ScoreTrendChart data={overview.trend} />
                ) : (
                  <div className="py-8 text-center text-sm text-muted">Not enough history yet.</div>
                )}
              </Card>
            </>
          ) : (
            <EmptyState title="No reviews yet" message="Your performance reviews will appear here once completed." icon="✦" />
          )
        ) : (
          <Card>
            <DataTable columns={teamColumns} rows={allReviews} rowKey={(r) => r.id}
              empty={<EmptyState title="No reviews" message="Team reviews will appear here." />} />
          </Card>
        )}
      </div>
    </div>
  );
}

function Comp({ label, value }) {
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
