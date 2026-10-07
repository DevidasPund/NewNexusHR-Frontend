// Gradient logo tile with a sparkle + wordmark, mirroring the reference brand lockup.
export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-black text-white shadow-glow"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-strong))' }}
      >
        ✦
      </span>
      {!compact && (
        <span className="text-lg font-extrabold tracking-tight text-ink">
          Nexus<span style={{ color: 'var(--accent)' }}>HR</span>
        </span>
      )}
    </div>
  );
}
