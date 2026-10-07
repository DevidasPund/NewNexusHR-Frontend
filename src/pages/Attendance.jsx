import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { dateShort, timeShort } from '../lib/format';

import PageHeader from '../components/PageHeader';
import DataTable from '../components/ui/DataTable';

import {
  Card,
  MonoLabel,
  Pill,
  ProgressRing,
  StatTile,
  Spinner,
  Avatar,
  EmptyState,
} from '../components/ui/Primitives';

import {
  IconClock,
  IconCheck,
  IconCalendar,
} from '../components/ui/icons';

export default function Attendance() {

  const { user } = useAuth();
  const toast = useToast();

  const isManager =
    user?.role === 'MANAGER' ||
    user?.role === 'ADMIN';

  const [today, setToday] = useState(null);
  const [month, setMonth] = useState([]);
  const [summary, setSummary] = useState(null);

  const [allAttendance, setAllAttendance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadEmployeeAttendance = async () => {

    try {

      const [todayRes, monthRes, summaryRes] =
        await Promise.all([

          api.get('/attendance/today/me'),

          api.get('/attendance/me'),

          api.get('/attendance/summary/me'),
        ]);

      setToday(todayRes.data);
      setMonth(monthRes.data || []);
      setSummary(summaryRes.data);

    } catch (err) {

      console.error(err);

      toast.push(
        err.response?.data?.message ||
        'Could not load attendance',
        'error'
      );

    }
  };

  const loadManagerAttendance = async () => {

    try {

      const res = await api.get('/attendance/by-date');

      setAllAttendance(res.data || []);

    } catch (err) {

      console.error(err);

      toast.push(
        err.response?.data?.message ||
        'Could not load employee attendance',
        'error'
      );
    }
  };

  const load = async () => {

    setLoading(true);

    if (isManager) {
      await loadManagerAttendance();
    } else {
      await loadEmployeeAttendance();
    }

    setLoading(false);
  };

  useEffect(() => {

    load();

    // Refresh every 10 seconds
    const interval = setInterval(() => {

      if (isManager) {
        loadManagerAttendance();
      } else {
        loadEmployeeAttendance();
      }

    }, 10000);

    return () => clearInterval(interval);

  }, [isManager]);

  const clockIn = async () => {

    setBusy(true);

    try {

      const response =
        await api.post('/attendance/clock-in');

      setToday(response.data);

      toast.push('Clocked in successfully');

      await loadEmployeeAttendance();

    } catch (err) {

      toast.push(
        err.response?.data?.message ||
        'Unable to clock in',
        'error'
      );

    } finally {

      setBusy(false);
    }
  };

  const clockOut = async () => {

    setBusy(true);

    try {

      const response =
        await api.post('/attendance/clock-out');

      setToday(response.data);

      toast.push('Clocked out successfully');

      await loadEmployeeAttendance();

    } catch (err) {

      toast.push(
        err.response?.data?.message ||
        'Unable to clock out',
        'error'
      );

    } finally {

      setBusy(false);
    }
  };

  if (loading) {

    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // =====================================================
  // MANAGER / ADMIN PAGE
  // =====================================================

  if (isManager) {

    return (
      <ManagerAttendance
        attendance={allAttendance}
        onRefresh={loadManagerAttendance}
      />
    );
  }

  // =====================================================
  // EMPLOYEE PAGE
  // =====================================================

  const clockedIn =
    today?.clockIn && !today?.clockOut;

  const done =
    today?.clockIn && today?.clockOut;

  const columns = [

    {
      key: 'date',
      header: 'Date',
      render: (r) => dateShort(r.date),
    },

    {
      key: 'clockIn',
      header: 'In',
      render: (r) => timeShort(r.clockIn),
    },

    {
      key: 'clockOut',
      header: 'Out',
      render: (r) => timeShort(r.clockOut),
    },

    {
      key: 'workedHours',
      header: 'Hours',
      align: 'right',
      render: (r) =>
        r.workedHours != null
          ? Number(r.workedHours).toFixed(2)
          : '—',
    },

    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Pill status={r.status} />
      ),
    },
  ];

  return (

    <div>

      <PageHeader
        eyebrow="This month"
        title="My Attendance"
        subtitle="Clock in, clock out, and review your attendance."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* TODAY */}

        <Card className="flex flex-col items-center justify-center text-center">

          <MonoLabel className="mb-2 self-start">
            Today
          </MonoLabel>

          <div
            className="my-3 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
            }}
          >
            <IconClock size={30} />
          </div>

          {today?.status && (
            <Pill status={today.status} />
          )}

          <div className="mt-3 flex gap-8 text-sm">

            <div>
              <MonoLabel>In</MonoLabel>

              <div className="mt-1 font-semibold text-ink">
                {timeShort(today?.clockIn)}
              </div>
            </div>

            <div>
              <MonoLabel>Out</MonoLabel>

              <div className="mt-1 font-semibold text-ink">
                {timeShort(today?.clockOut)}
              </div>
            </div>

          </div>

          <div className="mt-5 w-full">

            {done ? (

              <div
                className="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm text-muted"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <IconCheck size={16} />

                Attendance complete
              </div>

            ) : clockedIn ? (

              <button
                onClick={clockOut}
                disabled={busy}
                className="btn btn-primary w-full"
              >

                {busy ? (
                  <Spinner className="!h-4 !w-4" />
                ) : (
                  'Clock out'
                )}

              </button>

            ) : (

              <button
                onClick={clockIn}
                disabled={busy}
                className="btn btn-primary w-full"
              >

                {busy ? (
                  <Spinner className="!h-4 !w-4" />
                ) : (
                  'Clock in'
                )}

              </button>

            )}

          </div>

        </Card>

        {/* ATTENDANCE RATE */}

        <Card className="flex flex-col items-center justify-center">

          <MonoLabel className="mb-3 self-start">
            Attendance rate
          </MonoLabel>

          <ProgressRing
            value={summary?.attendanceRate ?? 0}
            size={150}
            stroke={12}
            sublabel="present"
          />

          <div className="mt-3 text-xs text-muted">

            {summary?.workingDays ?? 0}
            {' '}working days this month

          </div>

        </Card>

        {/* STATS */}

        <div className="grid grid-cols-2 gap-4">

          <StatTile
            label="Present"
            value={summary?.present ?? 0}
            icon={<IconCheck size={18} />}
            colorKey="green"
          />

          <StatTile
            label="Late"
            value={summary?.late ?? 0}
            icon={<IconClock size={18} />}
            colorKey="amber"
          />

          <StatTile
            label="WFH"
            value={summary?.wfh ?? 0}
            icon={<IconCalendar size={18} />}
            colorKey="blue"
          />

          <StatTile
            label="Absent"
            value={summary?.absent ?? 0}
            icon={<IconCalendar size={18} />}
            colorKey="pink"
          />

        </div>

      </div>

      {/* HISTORY */}

      <Card className="mt-6">

        <MonoLabel className="mb-4">
          My Attendance History
        </MonoLabel>

        <DataTable
          columns={columns}
          rows={month}
          rowKey={(r) => r.id}
        />

      </Card>

    </div>
  );
}


// =====================================================
// MANAGER ATTENDANCE
// =====================================================

function ManagerAttendance({
  attendance,
  onRefresh,
}) {

  const columns = [

    {
      key: 'employee',
      header: 'Employee',

      render: (r) => (

        <div className="flex items-center gap-3">

          <Avatar
            name={r.employeeName}
            colorKey={r.avatarColor}
            size="sm"
          />

          <div>

            <div className="font-semibold text-ink">
              {r.employeeName}
            </div>

            <div className="text-xs text-muted">
              {r.empCode}
            </div>

          </div>

        </div>
      ),
    },

    {
      key: 'date',
      header: 'Date',

      render: (r) =>
        dateShort(r.date),
    },

    {
      key: 'clockIn',
      header: 'Clock In',

      render: (r) =>
        timeShort(r.clockIn),
    },

    {
      key: 'clockOut',
      header: 'Clock Out',

      render: (r) =>
        timeShort(r.clockOut),
    },

    {
      key: 'workedHours',
      header: 'Hours',
      align: 'right',

      render: (r) =>
        r.workedHours != null
          ? Number(r.workedHours).toFixed(2)
          : '—',
    },

    {
      key: 'status',
      header: 'Status',

      render: (r) => (
        <Pill status={r.status} />
      ),
    },

  ];

  const present = attendance.filter(
    (a) =>
      a.status === 'PRESENT' ||
      a.status === 'LATE'
  ).length;

  const late = attendance.filter(
    (a) => a.status === 'LATE'
  ).length;

  const clockedIn = attendance.filter(
    (a) =>
      a.clockIn &&
      !a.clockOut
  ).length;

  return (

    <div>

      <PageHeader
        eyebrow="Today"
        title="Employee Attendance"
        subtitle="Monitor today's employee attendance in real time."
        actions={

          <button
            onClick={onRefresh}
            className="btn btn-primary"
          >
            Refresh
          </button>

        }
      />

      {/* SUMMARY */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <StatTile
          label="Present"
          value={present}
          icon={<IconCheck size={18} />}
          colorKey="green"
        />

        <StatTile
          label="Late"
          value={late}
          icon={<IconClock size={18} />}
          colorKey="amber"
        />

        <StatTile
          label="Currently Working"
          value={clockedIn}
          icon={<IconClock size={18} />}
          colorKey="blue"
        />

      </div>

      {/* TABLE */}

      <Card>

        <MonoLabel className="mb-4">
          Today's Attendance
        </MonoLabel>

        {attendance.length === 0 ? (

          <EmptyState
            title="No attendance records"
            message="No employee has marked attendance today."
          />

        ) : (

          <DataTable
            columns={columns}
            rows={attendance}
            rowKey={(r) => r.id}
          />

        )}

      </Card>

    </div>
  );
}