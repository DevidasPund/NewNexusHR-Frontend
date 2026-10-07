import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ROLE_RANK, ROLE_LABEL } from '../lib/constants';
import { dateLong, inr } from '../lib/format';
import PageHeader from '../components/PageHeader';
import { Card, Avatar, Pill, MonoLabel, Badge, Spinner, ProgressRing, ProgressBar } from '../components/ui/Primitives';
import { ScoreTrendChart } from '../components/charts/Charts';
import { IconMail, IconPhone, IconMapPin, IconBuilding, IconChevron } from '../components/ui/icons';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = ROLE_RANK[user?.role] >= 2;

  const [emp, setEmp] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const reqs = [api.get(`/employees/${id}`).then((r) => setEmp(r.data))];
        if (isManager) {
          reqs.push(api.get(`/performance/overview/${id}`).then((r) => setOverview(r.data)).catch(() => {}));
        }
        await Promise.all(reqs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isManager]);

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
  if (!emp) return <div className="py-12 text-center text-muted">Employee not found.</div>;

  return (
    <div>
      <button onClick={() => navigate('/employees')} className="mb-4 flex items-center gap-1 text-sm text-muted transition hover:text-ink">
        <IconChevron size={16} className="rotate-90" /> Back to directory
      </button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar name={emp.fullName} colorKey={emp.avatarColor} size="lg" />
            <h2 className="mt-3 text-xl font-bold text-ink">{emp.fullName}</h2>
            <p className="text-sm text-muted">{emp.designation || ROLE_LABEL[emp.role]}</p>
            <div className="mt-3 flex items-center gap-2">
              <Pill status={emp.status} />
              <Badge>{ROLE_LABEL[emp.role]}</Badge>
            </div>
          </div>
          <div className="mt-6 space-y-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            <InfoRow icon={<IconMail size={15} />} value={emp.email} />
            {emp.phone && <InfoRow icon={<IconPhone size={15} />} value={emp.phone} />}
            {emp.location && <InfoRow icon={<IconMapPin size={15} />} value={emp.location} />}
            <InfoRow icon={<IconBuilding size={15} />} value={emp.department?.name || '—'} />
          </div>
        </Card>

        {/* Numbered sections */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <SectionHead n="01" title="Employment" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Detail label="Employee code" value={emp.empCode} />
              <Detail label="Department" value={emp.department?.name || '—'} />
              <Detail label="Type" value={emp.employmentType} />
              <Detail label="Joined" value={dateLong(emp.dateOfJoining)} />
              {emp.lastPromotionDate && <Detail label="Last promotion" value={dateLong(emp.lastPromotionDate)} />}
              {isManager && emp.baseSalary != null && <Detail label="Annual CTC" value={inr(emp.baseSalary)} />}
            </div>
          </Card>

          {emp.bio && (
            <Card>
              <SectionHead n="02" title="About" />
              <p className="text-sm leading-relaxed text-muted">{emp.bio}</p>
            </Card>
          )}

          {emp.skills?.length > 0 && (
            <Card>
              <SectionHead n="03" title="Skills" />
              <div className="flex flex-wrap gap-2">
                {emp.skills.map((s) => (
                  <span key={s} className="rounded-lg px-2.5 py-1 text-xs font-medium"
                        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {isManager && overview?.hasReviews && (
            <Card>
              <SectionHead n="04" title="Performance" />
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <ProgressRing value={overview.latestScore} label={String(overview.latestScore)} sublabel={`Grade ${overview.grade}`} />
                <div className="flex-1 space-y-3 self-stretch">
                  <Comp label="Delivery" value={overview.delivery} />
                  <Comp label="Quality" value={overview.quality} />
                  <Comp label="Collaboration" value={overview.collaboration} />
                  <Comp label="Ownership" value={overview.ownership} />
                </div>
              </div>
              {overview.trend?.length > 1 && (
                <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <MonoLabel className="mb-2">Score trend</MonoLabel>
                  <ScoreTrendChart data={overview.trend} height={180} />
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHead({ n, title }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="font-mono text-xs font-bold text-accent">{n}</span>
      <h3 className="text-base font-bold text-ink">{title}</h3>
    </div>
  );
}

function InfoRow({ icon, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-ink">
      <span className="text-muted">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <MonoLabel>{label}</MonoLabel>
      <div className="mt-1 text-sm font-medium text-ink">{value}</div>
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
