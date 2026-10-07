import { tileColor, statusStyle } from '../../lib/constants';
import { initials as toInitials } from '../../lib/format';

// --- MonoLabel: uppercase monospace micro-label (STAGE 08 / 08 vibe) ---
export function MonoLabel({ children, className = '' }) {
  return <div className={`mono-label ${className}`}>{children}</div>;
}

// --- Card ---
export function Card({ children, className = '', pad = true, ...rest }) {
  return (
    <div className={`card ${pad ? 'card-pad' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}

// --- Pill / Badge ---
export function Pill({ status, children, className = '' }) {
  const s = statusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${className}`}
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.fg }} />
      {children ?? (status || '').replace('_', ' ')}
    </span>
  );
}

export function Badge({ children, tone = 'accent', className = '' }) {
  const styles =
    tone === 'accent'
      ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
      : { background: 'rgba(148,148,180,0.16)', color: 'var(--muted)' };
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${className}`}
      style={styles}
    >
      {children}
    </span>
  );
}

// --- IconTile: pastel rounded square holding an icon/emoji ---
export function IconTile({ colorKey = 'violet', children, size = 'md', className = '' }) {
  const c = tileColor(colorKey);
  const dim = size === 'lg' ? 'h-12 w-12 text-xl' : size === 'sm' ? 'h-8 w-8 text-sm' : 'h-10 w-10 text-base';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl font-semibold ${dim} ${className}`}
      style={{ background: c.bg, color: c.fg }}
    >
      {children}
    </span>
  );
}

// --- Avatar: initials in an accent-tinted circle ---
export function Avatar({ name, colorKey = 'violet', size = 'md' }) {
  const c = tileColor(colorKey);
  const dim = size === 'lg' ? 'h-12 w-12 text-base' : size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ${dim}`}
      style={{ background: c.bg, color: c.fg }}
    >
      {toInitials(name)}
    </span>
  );
}

// --- ProgressBar: gradient fill ---
export function ProgressBar({ value = 0, max = 100, tone, className = '' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = tone
    ? tone
    : 'linear-gradient(90deg, var(--accent), var(--accent-strong))';
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${className}`} style={{ background: 'var(--border)' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: fill }} />
    </div>
  );
}

// --- ProgressRing: SVG circular progress ---
export function ProgressRing({ value = 0, size = 120, stroke = 10, label, sublabel, tone }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = circ - (pct / 100) * circ;
  const color = tone || 'var(--accent)';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-ink">{label ?? `${Math.round(pct)}%`}</span>
        {sublabel && <span className="mono-label mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}

// --- StatTile ---
export function StatTile({ label, value, delta, icon, colorKey = 'violet', hint }) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <MonoLabel>{label}</MonoLabel>
        <div className="mt-2 text-2xl font-bold text-ink">{value}</div>
        {(delta || hint) && (
          <div className="mt-1 text-xs text-muted">
            {delta && (
              <span style={{ color: delta.startsWith('-') ? 'var(--danger)' : 'var(--success)' }}>{delta} </span>
            )}
            {hint}
          </div>
        )}
      </div>
      {icon && <IconTile colorKey={colorKey}>{icon}</IconTile>}
    </Card>
  );
}

// --- EmptyState ---
export function EmptyState({ icon = '✦', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 text-center"
         style={{ borderColor: 'var(--border-strong)' }}>
      <div className="mb-3 text-3xl" style={{ color: 'var(--faint)' }}>{icon}</div>
      <div className="text-sm font-semibold text-ink">{title}</div>
      {message && <div className="mt-1 max-w-sm text-xs text-muted">{message}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// --- Spinner ---
export function Spinner({ className = '' }) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-transparent ${className}`}
      style={{ borderTopColor: 'var(--accent)', borderRightColor: 'var(--accent)' }}
    />
  );
}
