import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { ROLE_RANK } from '../lib/constants';
import { inr, compactInr } from '../lib/format';
import PageHeader from '../components/PageHeader';
import Modal from '../components/ui/Modal';
import DataTable from '../components/ui/DataTable';
import { Card, MonoLabel, Pill, Avatar, StatTile, ProgressBar, Spinner, EmptyState } from '../components/ui/Primitives';
import { IconWallet, IconUsers, IconCheck, IconDownload } from '../components/ui/icons';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default function Payroll() {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = ROLE_RANK[user?.role] >= 3;
  const isManager = ROLE_RANK[user?.role] >= 2;

  const [month, setMonth] = useState(currentMonth());
  const [slips, setSlips] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [detail, setDetail] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      if (isManager) {
        const [s, sum] = await Promise.all([
          api.get('/payroll', { params: { month } }).then((r) => r.data),
          api.get('/payroll/summary', { params: { month } }).then((r) => r.data).catch(() => null),
        ]);
        setSlips(s);
        setSummary(sum);
      } else {
        const s = await api.get('/payroll/me').then((r) => r.data);
        setSlips(s);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [month, isManager]);

  const generate = async () => {
    setBusy(true);
    try {
      await api.post('/payroll/generate', null, { params: { month } });
      toast.push('Payroll generated');
      await load();
    } catch (err) {
      toast.push(err.response?.data?.message || 'Generation failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const markPaid = async (id) => {
    try {
      await api.post(`/payroll/${id}/pay`);
      toast.push('Marked as paid');
      await load();
    } catch (err) {
      toast.push(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;

  const columns = [
    ...(isManager ? [{
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
    }] : [{ key: 'periodMonth', header: 'Period', render: (r) => r.periodMonth }]),
    { key: 'gross', header: 'Gross', align: 'right', render: (r) => inr(r.gross) },
    { key: 'totalDeductions', header: 'Deductions', align: 'right', render: (r) => inr(r.totalDeductions) },
    { key: 'netPay', header: 'Net pay', align: 'right', render: (r) => <span className="font-semibold text-ink">{inr(r.netPay)}</span> },
    { key: 'status', header: 'Status', render: (r) => <Pill status={r.status} /> },
    {
      key: 'action', header: '', align: 'right',
      render: (r) => (
        <div className="flex justify-end gap-2">
          <button onClick={(e) => { e.stopPropagation(); setDetail(r); }}
            className="text-xs font-medium text-accent transition hover:opacity-80">View</button>
          {isAdmin && r.status !== 'PAID' && (
            <button onClick={(e) => { e.stopPropagation(); markPaid(r.id); }}
              className="text-xs font-medium text-muted transition hover:text-ink">Mark paid</button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Compensation"
        title="Payroll"
        subtitle={isManager ? 'Payslips, runs, and payouts.' : 'Your payslips and earnings.'}
        actions={
          <div className="flex items-center gap-2">
            {isManager && (
              <input type="month" className="input !py-2" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: 'auto' }} />
            )}
            {isAdmin && (
              <button onClick={generate} disabled={busy} className="btn btn-primary">
                {busy ? <Spinner className="!h-4 !w-4" /> : 'Generate payroll'}
              </button>
            )}
          </div>
        }
      />

      {isManager && summary && (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Employees" value={summary.employees} icon={<IconUsers size={18} />} colorKey="violet" />
          <StatTile label="Total gross" value={compactInr(summary.totalGross)} icon={<IconWallet size={18} />} colorKey="blue" />
          <StatTile label="Total net" value={compactInr(summary.totalNet)} icon={<IconWallet size={18} />} colorKey="green" hint={`${summary.paid} paid`} />
          <StatTile label="Pending" value={summary.pending} icon={<IconCheck size={18} />} colorKey="amber" hint="not yet paid" />
        </div>
      )}

      <Card>
        <DataTable columns={columns} rows={slips} rowKey={(r) => r.id} onRowClick={(r) => setDetail(r)}
          empty={<EmptyState title="No payslips" message={isAdmin ? 'Generate payroll to create payslips.' : 'Your payslips will appear here.'} />} />
      </Card>

      {detail && <PayslipModal slip={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function PayslipModal({ slip, onClose }) {
  const earnings = [
    { label: 'Basic', value: slip.basic },
    { label: 'HRA', value: slip.hra },
    { label: 'Allowances', value: slip.allowances },
  ];
  const deductions = [
    { label: 'Provident Fund', value: slip.pf },
    { label: 'Tax (TDS)', value: slip.tax },
    { label: 'Other', value: slip.otherDeductions },
  ];
  const maxEarn = Math.max(...earnings.map((e) => Number(e.value) || 0), 1);
  const maxDed = Math.max(...deductions.map((d) => Number(d.value) || 0), 1);

  return (
    <Modal open onClose={onClose} title={`Payslip · ${slip.periodMonth}`} subtitle={slip.employeeName} size="lg"
      footer={<button onClick={onClose} className="btn btn-ghost">Close</button>}>
      <div className="mb-5 flex items-center justify-between rounded-xl p-4"
           style={{ background: 'var(--accent-soft)' }}>
        <div>
          <MonoLabel>Net pay</MonoLabel>
          <div className="mt-1 text-3xl font-bold text-ink">{inr(slip.netPay)}</div>
        </div>
        <Pill status={slip.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <MonoLabel className="mb-3">Earnings</MonoLabel>
          <div className="space-y-3">
            {earnings.map((e) => (
              <Breakdown key={e.label} label={e.label} value={e.value} max={maxEarn} tone="var(--success)" />
            ))}
            <Total label="Gross" value={slip.gross} />
          </div>
        </div>
        <div>
          <MonoLabel className="mb-3">Deductions</MonoLabel>
          <div className="space-y-3">
            {deductions.map((d) => (
              <Breakdown key={d.label} label={d.label} value={d.value} max={maxDed} tone="var(--danger)" />
            ))}
            <Total label="Total deductions" value={slip.totalDeductions} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Breakdown({ label, value, max, tone }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-ink">{inr(value)}</span>
      </div>
      <ProgressBar value={Number(value) || 0} max={max} tone={tone} />
    </div>
  );
}

function Total({ label, value }) {
  return (
    <div className="flex items-center justify-between border-t pt-3 text-sm" style={{ borderColor: 'var(--border)' }}>
      <span className="font-semibold text-ink">{label}</span>
      <span className="font-bold text-ink">{inr(value)}</span>
    </div>
  );
}
