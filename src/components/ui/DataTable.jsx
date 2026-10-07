import { EmptyState } from './Primitives';

/**
 * Lightweight table.
 * columns: [{ key, header, render?(row), align?, className? }]
 */
export default function DataTable({ columns, rows, rowKey = (r) => r.id, onRowClick, empty }) {
  if (!rows || rows.length === 0) {
    return empty || <EmptyState title="Nothing here yet" message="No records to display." />;
  }
  return (
    <div className="custom-scroll overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: 'var(--border)' }}>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-3 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-faint ${
                  c.align === 'right' ? 'text-right' : ''
                }`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b transition last:border-0 ${
                onRowClick ? 'cursor-pointer hover:bg-card-hover' : ''
              }`}
              style={{ borderColor: 'var(--border)' }}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-3 py-3 text-ink ${c.align === 'right' ? 'text-right' : ''} ${c.className || ''}`}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
