import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { CHART_SERIES } from '../../lib/constants';

// Themed tooltip so it matches surfaces in both light and dark.
function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2 shadow-card"
      style={{ background: 'var(--elevated)', borderColor: 'var(--border-strong)' }}
    >
      <div className="mono-label mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs text-ink">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted">{p.name}:</span>
          <span className="font-semibold">{valueFormatter ? valueFormatter(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

const AXIS = { fontSize: 11, fontFamily: 'JetBrains Mono, monospace' };

// Single-series score trend over time. One axis, direct hover, recessive grid.
export function ScoreTrendChart({ data, dataKey = 'score', xKey = 'period', height = 240, domain = [0, 100] }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 12, bottom: 4, left: -12 }}>
        <defs>
          <linearGradient id="scoreLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-strong)" />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis domain={domain} tick={AXIS} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border-strong)' }} />
        <Line
          type="monotone"
          dataKey={dataKey}
          name="Score"
          stroke="url(#scoreLine)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Horizontal-friendly categorical bars. Color follows the entity via colorKey index.
export function CategoryBarChart({ data, xKey = 'label', dataKey = 'value', height = 260, valueFormatter }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 12, bottom: 4, left: -12 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} allowDecimals={false} />
        <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} cursor={{ fill: 'var(--accent-soft)' }} />
        <Bar dataKey={dataKey} name="Count" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry, i) => (
            <Cell key={i} fill={CHART_SERIES[i % CHART_SERIES.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
