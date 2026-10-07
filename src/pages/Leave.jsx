import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { ROLE_RANK } from '../lib/constants';
import { dateShort } from '../lib/format';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';
import DataTable from '../components/ui/DataTable';
import { Card, MonoLabel, Pill, Avatar, ProgressBar, Spinner, EmptyState } from '../components/ui/Primitives';
import { IconPlus, IconCheck, IconX } from '../components/ui/icons';

const LEAVE_TYPES = ['CASUAL', 'SICK', 'EARNED', 'UNPAID'];

export default function Leave() {
  const { user } = useAuth();
  const toast = useToast();
  const isManager = ROLE_RANK[user?.role] >= 2;

  const [tab, setTab] = useState('mine');
  const [balances, setBalances] = useState([]);
  const [mine, setMine] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);

  const load = async () => {
    const reqs = [
      api.get('/leaves/balances/me').then((r) => setBalances(r.data)).catch(() => {}),
      api.get('/leaves/me').then((r) => setMine(r.data)).catch(() => {}),
    ];
    if (isManager) {
      reqs.push(api.get('/leaves/pending').then((r) => setPending(r.data)).catch(() => {}));
    }
    await Promise.all(reqs);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (id, action) => {
    try {
      await api.post(`/leaves/${id}/${action}`);
      toast.push(`Request ${action}d`);
      await load();
    } catch (err) {
      toast.push(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const cancel = async (id) => {
    try {
      await api.post(`/leaves/${id}/cancel`);
      toast.push('Request cancelled');
      await load();
    } catch (err) {
      toast.push(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;

  const tabs = [{ key: 'mine', label: 'My leave' }];
  if (isManager) tabs.push({ key: 'approvals', label: `Approvals${pending.length ? ` (${pending.length})` : ''}` });

  const mineColumns = [
    { key: 'type', header: 'Type', render: (r) => <span className="font-medium text-ink">{r.type}</span> },
    { key: 'startDate', header: 'From', render: (r) => dateShort(r.startDate) },
    { key: 'endDate', header: 'To', render: (r) => dateShort(r.endDate) },
    { key: 'days', header: 'Days', align: 'right' },
    { key: 'status', header: 'Status', render: (r) => <Pill status={r.status} /> },
    {
      key: 'action', header: '', align: 'right',
      render: (r) => r.status === 'PENDING' ? (
        <button onClick={() => cancel(r.id)} className="text-xs font-medium text-muted transition hover:text-ink">Cancel</button>
      ) : null,
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Time off"
        title="Leave"
        subtitle="Request time off and track balances."
        actions={
          <button onClick={() => setShowApply(true)} className="btn btn-primary">
            <IconPlus size={16} /> Request leave
          </button>
        }
      />

      {/* Balances */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {balances.map((b) => (
          <Card key={b.type}>
            <div className="flex items-center justify-between">
              <MonoLabel>{b.type}</MonoLabel>
              <span className="text-xs text-muted">{b.remaining} left</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-ink">
              {b.remaining}<span className="text-sm font-normal text-muted">/{b.allocated}</span>
            </div>
            <ProgressBar className="mt-3" value={b.used} max={b.allocated || 1} tone="var(--accent)" />
          </Card>
        ))}
      </div>

      {isManager && <Tabs tabs={tabs} active={tab} onChange={setTab} />}

      <div className="mt-5">
        {tab === 'mine' ? (
          <Card>
            <DataTable columns={mineColumns} rows={mine} rowKey={(r) => r.id}
              empty={<EmptyState title="No leave requests" message="Your requests will appear here." />} />
          </Card>
        ) : (
          <Card>
            {pending.length === 0 ? (
              <EmptyState title="All caught up" message="No pending approvals." icon="✓" />
            ) : (
              <div className="space-y-3">
                {pending.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl border p-3.5"
                       style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <Avatar name={r.employeeName} colorKey={r.avatarColor} />
                      <div>
                        <div className="text-sm font-semibold text-ink">{r.employeeName}</div>
                        <div className="text-xs text-muted">
                          {r.type} · {dateShort(r.startDate)}–{dateShort(r.endDate)} · {r.days}d
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => decide(r.id, 'approve')}
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition"
                        style={{ background: 'rgba(52,211,153,0.14)', color: 'var(--success)' }}>
                        <IconCheck size={16} />
                      </button>
                      <button onClick={() => decide(r.id, 'reject')}
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition"
                        style={{ background: 'rgba(244,63,110,0.14)', color: 'var(--danger)' }}>
                        <IconX size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {showApply && (
        <ApplyModal
          onClose={() => setShowApply(false)}
          onDone={() => { setShowApply(false); toast.push('Leave requested'); load(); }}
        />
      )}
    </div>
  );
}

function ApplyModal({ onClose, onDone }) {
  const toast = useToast();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ type: 'CASUAL', startDate: today, endDate: today, reason: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/leaves', form);
      onDone();
    } catch (err) {
      toast.push(err.response?.data?.message || 'Could not submit', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Request leave" subtitle="Submit a time-off request for approval."
      footer={
        <>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={submit} disabled={busy} className="btn btn-primary">
            {busy ? <Spinner className="!h-4 !w-4" /> : 'Submit'}
          </button>
        </>
      }>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mono-label mb-1.5 block">Type</label>
          <select className="input" value={form.type} onChange={set('type')}>
            {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mono-label mb-1.5 block">From</label>
            <input type="date" className="input" value={form.startDate} onChange={set('startDate')} required />
          </div>
          <div>
            <label className="mono-label mb-1.5 block">To</label>
            <input type="date" className="input" value={form.endDate} onChange={set('endDate')} required />
          </div>
        </div>
        <div>
          <label className="mono-label mb-1.5 block">Reason</label>
          <textarea className="input" rows={3} value={form.reason} onChange={set('reason')} placeholder="Optional note for your manager" />
        </div>
      </form>
    </Modal>
  );
}
