import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ACCENTS, ROLE_LABEL } from '../lib/constants';
import { COLOR_TILE } from '../lib/constants';
import PageHeader from '../components/PageHeader';
import { Card, MonoLabel, Avatar, Pill } from '../components/ui/Primitives';
import { IconSun, IconMoon, IconCheck } from '../components/ui/icons';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme, accent, setAccent } = useTheme();

  return (
    <div>
      <PageHeader eyebrow="Preferences" title="Settings" subtitle="Personalize your workspace." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Appearance */}
        <Card>
          <MonoLabel className="mb-4">Appearance</MonoLabel>

          <div className="mb-6">
            <div className="mb-2 text-sm font-medium text-ink">Theme</div>
            <div className="grid grid-cols-2 gap-3">
              <ThemeOption active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<IconMoon size={18} />} label="Dark" />
              <ThemeOption active={theme === 'light'} onClick={() => setTheme('light')} icon={<IconSun size={18} />} label="Light" />
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-ink">Accent color</div>
            <div className="flex gap-3">
              {ACCENTS.map((a) => {
                const c = COLOR_TILE[a];
                const isActive = accent === a;
                return (
                  <button
                    key={a}
                    onClick={() => setAccent(a)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-2 transition"
                    style={{
                      background: c.bg,
                      borderColor: isActive ? c.fg : 'transparent',
                    }}
                    aria-label={a}
                  >
                    {isActive && <span style={{ color: c.fg }}><IconCheck size={16} /></span>}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted">Saved to this browser.</p>
          </div>
        </Card>

        {/* Account */}
        <Card>
          <MonoLabel className="mb-4">Account</MonoLabel>
          <div className="flex items-center gap-3">
            <Avatar name={user?.fullName} colorKey={user?.avatarColor} size="lg" />
            <div>
              <div className="font-semibold text-ink">{user?.fullName}</div>
              <div className="text-sm text-muted">{user?.email}</div>
            </div>
          </div>
          <div className="mt-5 space-y-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            <Row label="Employee code" value={user?.empCode} />
            <Row label="Role" value={ROLE_LABEL[user?.role]} />
            <Row label="Department" value={user?.department?.name || '—'} />
            <Row label="Status" value={<Pill status={user?.status} />} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ThemeOption({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 transition"
      style={{
        borderColor: active ? 'var(--accent)' : 'var(--border)',
        background: active ? 'var(--accent-soft)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--muted)',
      }}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
