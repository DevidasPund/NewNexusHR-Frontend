import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Spinner, MonoLabel } from '../components/ui/Primitives';

const DEMO = [
  { role: 'HR Admin', email: 'admin@nexushr.io' },
  { role: 'Manager', email: 'manager@nexushr.io' },
  { role: 'Employee', email: 'employee@nexushr.io' },
];

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@nexushr.io');
  const [password, setPassword] = useState('Passw0rd!');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) navigate('/', { replace: true });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      if (err.response) {
        // Server answered — 401/400 etc. means bad credentials.
        setError(err.response.data?.message || 'Invalid email or password');
      } else {
        // No response — backend unreachable / not running.
        setError('Cannot reach the server. Is the backend running on :8080?');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to your NexusHR workspace</p>
        </div>

        <div className="card card-pad">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mono-label mb-1.5 block">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nexushr.io"
                required
              />
            </div>
            <div>
              <label className="mono-label mb-1.5 block">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div
                className="rounded-xl border px-3.5 py-2.5 text-sm"
                style={{ borderColor: 'var(--danger)', background: 'rgba(244,63,110,0.1)', color: 'var(--danger)' }}
              >
                {error}
              </div>
            )}

            <button type="submit" disabled={busy} className="btn btn-primary w-full">
              {busy ? <Spinner className="!h-4 !w-4" /> : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="mt-5 card card-pad">
          <MonoLabel className="mb-3">Demo accounts · password Passw0rd!</MonoLabel>
          <div className="space-y-2">
            {DEMO.map((d) => (
              <button
                key={d.email}
                onClick={() => { setEmail(d.email); setPassword('Passw0rd!'); }}
                className="flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition hover:bg-card-hover"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="text-sm font-medium text-ink">{d.role}</span>
                <span className="font-mono text-xs text-muted">{d.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
