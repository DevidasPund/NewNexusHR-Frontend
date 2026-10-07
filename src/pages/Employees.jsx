import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

import { ROLE_RANK, ROLE_LABEL } from '../lib/constants';

import PageHeader from '../components/PageHeader';
import Modal from '../components/ui/Modal';

import {
  Avatar,
  Pill,
  MonoLabel,
  Spinner,
  EmptyState,
} from '../components/ui/Primitives';

import { IconPlus, IconSearch } from '../components/ui/icons';

const STATUSES = [
  'ALL',
  'ACTIVE',
  'ON_LEAVE',
  'INACTIVE',
];

export default function Employees() {

  const { user } = useAuth();

  const toast = useToast();
  const navigate = useNavigate();

  const isAdmin =
    ROLE_RANK[user?.role] >= 3;

  const isManager =
    user?.role === 'MANAGER';

  const canSeeAll =
    isAdmin || isManager;

  const [employees, setEmployees] =
    useState([]);

  const [departments, setDepartments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [q, setQ] =
    useState('');

  const [status, setStatus] =
    useState('ALL');

  const [showAdd, setShowAdd] =
    useState(false);

  // ==========================
  // LOAD DATA
  // ==========================

  const load = async () => {

    try {

      if (canSeeAll) {

        const [emp, dep] =
          await Promise.all([
            api.get('/employees'),
            api.get('/departments'),
          ]);

        setEmployees(emp.data);
        setDepartments(dep.data);

      } else {

        // Employee sees ONLY himself
        const response =
          await api.get('/auth/me');

        setEmployees([
          response.data
        ]);
      }

    } catch (error) {

      console.error(
        'Employee loading error:',
        error
      );

      toast.push(
        error.response?.data?.message ||
        'Could not load employee data',
        'error'
      );

    } finally {

      setLoading(false);
    }
  };

  // ==========================
  // REAL-TIME REFRESH
  // ==========================

  useEffect(() => {

    load();

    const interval =
      setInterval(() => {
        load();
      }, 5000);

    return () =>
      clearInterval(interval);

  }, [user?.id, user?.role]);

  // ==========================
  // SEARCH
  // ==========================

  const filtered =
    useMemo(() => {

      const needle =
        q.trim().toLowerCase();

      return employees.filter((e) => {

        if (
          canSeeAll &&
          status !== 'ALL' &&
          e.status !== status
        ) {
          return false;
        }

        if (!needle) {
          return true;
        }

        return (

          (e.fullName || '')
            .toLowerCase()
            .includes(needle)

          ||

          (e.email || '')
            .toLowerCase()
            .includes(needle)

          ||

          (e.designation || '')
            .toLowerCase()
            .includes(needle)

          ||

          (e.empCode || '')
            .toLowerCase()
            .includes(needle)
        );
      });

    }, [
      employees,
      q,
      status,
      canSeeAll
    ]);

  // ==========================
  // LOADING
  // ==========================

  if (loading) {

    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (

    <div>

      <PageHeader

        eyebrow={
          canSeeAll
            ? `${employees.length} people`
            : 'My profile'
        }

        title={
          canSeeAll
            ? 'Employees'
            : 'My Profile'
        }

        subtitle={
          canSeeAll
            ? 'Organization employee directory.'
            : 'Your employee information.'
        }

        actions={
          isAdmin && (

            <button
              onClick={() =>
                setShowAdd(true)
              }
              className="btn btn-primary"
            >

              <IconPlus size={16} />

              Add employee

            </button>
          )
        }

      />

      {/* Search only for Admin / Manager */}

      {canSeeAll && (

        <div className="mb-5 flex flex-wrap items-center gap-3">

          <div
            className="relative flex-1"
            style={{ minWidth: 220 }}
          >

            <span className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-muted
            ">

              <IconSearch size={16} />

            </span>

            <input
              className="input pl-9"
              placeholder="Search name, email, role..."
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
            />

          </div>

          <div
            className="flex gap-1 rounded-xl border p-1"
            style={{
              borderColor:
                'var(--border)'
            }}
          >

            {STATUSES.map((s) => (

              <button
                key={s}
                onClick={() =>
                  setStatus(s)
                }

                className="
                  rounded-lg
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                "

                style={
                  status === s
                    ? {
                        background:
                          'var(--accent-soft)',
                        color:
                          'var(--accent)',
                      }
                    : {
                        color:
                          'var(--muted)',
                      }
                }
              >

                {s === 'ALL'
                  ? 'All'
                  : s.replace('_', ' ')}

              </button>
            ))}

          </div>

        </div>
      )}

      {/* EMPLOYEE CARDS */}

      {filtered.length === 0 ? (

        <EmptyState
          title="No employees found"
          message="No employee records available."
        />

      ) : (

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          {filtered.map((e) => (

            <button
              key={e.id}

              onClick={() => {

                if (canSeeAll) {
                  navigate(
                    `/employees/${e.id}`
                  );
                }

              }}

              className="
                card
                card-pad
                text-left
                transition
                hover:-translate-y-0.5
                hover:bg-card-hover
              "
            >

              <div className="
                flex
                items-start
                justify-between
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <Avatar
                    name={e.fullName}
                    colorKey={
                      e.avatarColor
                    }
                    size="lg"
                  />

                  <div>

                    <div className="
                      font-semibold
                      text-ink
                    ">
                      {e.fullName}
                    </div>

                    <div className="
                      text-xs
                      text-muted
                    ">
                      {e.designation ||
                        ROLE_LABEL[e.role]}
                    </div>

                  </div>

                </div>

                <Pill
                  status={e.status}
                />

              </div>

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  border-t
                  pt-3
                "
                style={{
                  borderColor:
                    'var(--border)'
                }}
              >

                <MonoLabel>
                  {e.empCode}
                </MonoLabel>

                <span className="
                  text-xs
                  text-muted
                ">
                  {e.department?.name || '—'}
                </span>

              </div>

            </button>

          ))}

        </div>
      )}

      {/* ADD EMPLOYEE */}

      {showAdd && (

        <AddEmployeeModal

          departments={departments}

          onClose={() =>
            setShowAdd(false)
          }

          onCreated={() => {

            setShowAdd(false);

            toast.push(
              'Employee added'
            );

            load();
          }}

        />
      )}

    </div>
  );
}


// =================================================
// ADD EMPLOYEE MODAL
// =================================================

function AddEmployeeModal({
  departments,
  onClose,
  onCreated,
}) {

  const toast = useToast();

  const [form, setForm] =
    useState({

      firstName: '',
      lastName: '',
      email: '',

      role: 'EMPLOYEE',

      departmentId:
        departments[0]?.id || '',

      designation: '',

      dateOfJoining:
        new Date()
          .toISOString()
          .slice(0, 10),

      baseSalary: '',

      location: 'Bengaluru',

      employmentType:
        'FULL_TIME',

      password:
        'Passw0rd!',
    });

  const [busy, setBusy] =
    useState(false);

  const set =
    (key) =>
    (event) =>
      setForm((old) => ({
        ...old,
        [key]:
          event.target.value,
      }));

  const submit =
    async (event) => {

      event.preventDefault();

      setBusy(true);

      try {

        await api.post(
          '/employees',
          {
            ...form,

            departmentId:
              form.departmentId
                ? Number(
                    form.departmentId
                  )
                : null,

            baseSalary:
              form.baseSalary
                ? Number(
                    form.baseSalary
                  )
                : null,
          }
        );

        onCreated();

      } catch (err) {

        toast.push(
          err.response?.data
            ?.message ||
          'Could not add employee',
          'error'
        );

      } finally {

        setBusy(false);
      }
    };

  return (

    <Modal
      open
      onClose={onClose}
      title="Add employee"
      subtitle="Create employee login."
      footer={

        <>

          <button
            onClick={onClose}
            className="btn btn-ghost"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={busy}
            className="btn btn-primary"
          >

            {busy
              ? <Spinner className="!h-4 !w-4" />
              : 'Create'}

          </button>

        </>
      }
    >

      <form
        onSubmit={submit}
        className="
          grid
          grid-cols-2
          gap-4
        "
      >

        <Field label="First name">
          <input
            className="input"
            value={form.firstName}
            onChange={set('firstName')}
            required
          />
        </Field>

        <Field label="Last name">
          <input
            className="input"
            value={form.lastName}
            onChange={set('lastName')}
            required
          />
        </Field>

        <Field
          label="Email"
          span
        >
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={set('email')}
            required
          />
        </Field>

        <Field label="Role">

          <select
            className="input"
            value={form.role}
            onChange={set('role')}
          >

            <option value="EMPLOYEE">
              Employee
            </option>

            <option value="MANAGER">
              Manager
            </option>

            <option value="ADMIN">
              HR Admin
            </option>

          </select>

        </Field>

        <Field label="Department">

          <select
            className="input"
            value={form.departmentId}
            onChange={set('departmentId')}
          >

            {departments.map((d) => (

              <option
                key={d.id}
                value={d.id}
              >
                {d.name}
              </option>

            ))}

          </select>

        </Field>

        <Field label="Designation">

          <input
            className="input"
            value={form.designation}
            onChange={set('designation')}
          />

        </Field>

        <Field label="Date of joining">

          <input
            type="date"
            className="input"
            value={
              form.dateOfJoining
            }
            onChange={
              set('dateOfJoining')
            }
          />

        </Field>

        <Field label="Annual CTC (₹)">

          <input
            type="number"
            className="input"
            value={form.baseSalary}
            onChange={set('baseSalary')}
          />

        </Field>

        <Field label="Location">

          <input
            className="input"
            value={form.location}
            onChange={set('location')}
          />

        </Field>

        <Field
          label="Temp password"
          span
        >

          <input
            className="input"
            value={form.password}
            onChange={set('password')}
          />

        </Field>

      </form>

    </Modal>
  );
}


function Field({
  label,
  span,
  children,
}) {

  return (

    <div
      className={
        span
          ? 'col-span-2'
          : ''
      }
    >

      <label className="
        mono-label
        mb-1.5
        block
      ">
        {label}
      </label>

      {children}

    </div>
  );
}