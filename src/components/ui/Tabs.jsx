// Underline tabs matching the reference's section navigation.
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
      {tabs.map((t) => {
        const key = typeof t === 'string' ? t : t.key;
        const label = typeof t === 'string' ? t : t.label;
        const isActive = key === active;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="relative px-4 py-2.5 text-sm font-medium transition"
            style={{ color: isActive ? 'var(--ink)' : 'var(--muted)' }}
          >
            {label}
            {isActive && (
              <span
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-strong))' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
