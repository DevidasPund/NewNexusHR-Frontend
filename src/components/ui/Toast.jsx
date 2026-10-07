import { createContext, useContext, useCallback, useState } from 'react';
import { IconCheck, IconX } from './icons';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = 'success') => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, tone }]);
      setTimeout(() => dismiss(id), 3800);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
        {toasts.map((t) => {
          const color =
            t.tone === 'error' ? 'var(--danger)' : t.tone === 'info' ? 'var(--info)' : 'var(--success)';
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-xl border bg-elevated px-4 py-3 shadow-card animate-fade-in"
              style={{ borderColor: 'var(--border-strong)' }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ background: color, color: '#fff' }}>
                {t.tone === 'error' ? <IconX size={14} /> : <IconCheck size={14} />}
              </span>
              <span className="text-sm text-ink">{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
